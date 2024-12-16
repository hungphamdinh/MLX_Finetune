import os
import subprocess
from typing import List, Tuple
from mlx_lm import load, generate
import nltk
import re
from nltk.translate.bleu_score import sentence_bleu, SmoothingFunction, corpus_bleu
from colorama import init, Fore, Style  # Importing colorama components
from codebleu import calc_codebleu

# Initialize colorama
init(autoreset=True)

# Define color constants
PRE_FINE_TUNE_COLOR = Fore.RED + Style.BRIGHT  # Red for pre-fine-tuning
POST_FINE_TUNE_COLOR = Fore.GREEN + Style.BRIGHT  # Green for post-fine-tuning
REFERENCE_COLOR = Fore.CYAN + Style.BRIGHT  # Cyan for reference
RESET_COLOR = Style.RESET_ALL  # Reset to default

# Function to run a shell command with live output and capture it
def run_command_with_live_output(command: List[str]) -> Tuple[str, str]:
    """
    Runs a command, prints its output line by line as it executes, and captures stdout and stderr.

    Args:
        command (List[str]): The command and its arguments to be executed.

    Returns:
        Tuple[str, str]: Captured stdout and stderr.
    """
    process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    
    captured_stdout = []
    captured_stderr = []

    # Print and capture the output line by line
    while True:
        output = process.stdout.readline()
        if output == '' and process.poll() is not None:
            break
        if output:
            print(output.strip())
            captured_stdout.append(output.strip())
    
    # Capture any remaining stderr
    err_output = process.stderr.read()
    if err_output:
        print(err_output)
        captured_stderr.append(err_output.strip())

    return '\n'.join(captured_stdout), '\n'.join(captured_stderr)

def construct_shell_command(command: List[str]) -> str:
    """
    Constructs a shell command string from a list of command arguments.

    Args:
        command (List[str]): The command and its arguments.

    Returns:
        str: The constructed shell command.
    """
    return ' '.join(command)

def tokenize_code(code: str) -> List[str]:
    """
    Tokenizes code by splitting on whitespace and retaining punctuation.

    Args:
        code (str): The code snippet to tokenize.

    Returns:
        List[str]: A list of tokens.
    """
    tokens = re.findall(r'\w+|[^\s\w]', code)
    return tokens

def remove_line_breaks(code: str) -> str:
    """
    Removes all line breaks from the given code string.

    Args:
        code (str): The code snippet from which to remove line breaks.

    Returns:
        str: The code string without any line breaks.
    """
    return code.replace('\n', ' ').replace('\r', ' ')

def extract_code(response: str) -> str:
    """
    Extracts code between <code-start> and <code-end> markers.
    
    Args:
        response (str): The raw response from the model.
    
    Returns:
        str: The extracted code, or an empty string if markers not found.
    """
    match = re.search(r'<code-end>(.*)', response, re.DOTALL)
    if match:
        return match.group(1).strip()
    else:
        return ""

def compute_bleu_score(reference: str, hypothesis: str) -> float:
    """
    Computes the BLEU score between a single reference and hypothesis.
    Removes line breaks before tokenizing to improve BLEU scores.

    Args:
        reference (str): The reference code.
        hypothesis (str): The generated code.

    Returns:
        float: The BLEU score.
    """
    # Remove line breaks from reference and hypothesis
    reference = remove_line_breaks(reference)
    hypothesis = remove_line_breaks(hypothesis)
    
    reference_tokens = tokenize_code(reference)
    hypothesis_tokens = tokenize_code(hypothesis)
    
    # print("\n=== Tokenized Reference ===")
    # print(reference_tokens)
    
    # print("\n=== Tokenized Hypothesis ===")
    # print(hypothesis_tokens)
    
    # Smoothing to handle cases with no matching n-grams
    smoothie = SmoothingFunction().method4
    
    bleu_score = sentence_bleu(
        [reference_tokens], 
        hypothesis_tokens, 
        weights=(0.25, 0.25, 0.25, 0.25),  # BLEU-4
        smoothing_function=smoothie
    )
    return bleu_score

def compute_corpus_bleu(references: List[str], hypotheses: List[str]) -> float:
    """
    Computes the corpus-level BLEU score.

    Args:
        references (List[str]): A list of reference sentences.
        hypotheses (List[str]): A list of hypothesis sentences.

    Returns:
        float: The corpus BLEU score.
    """
    # Tokenize references and hypotheses
    tokenized_references = [tokenize_code(ref) for ref in references]
    tokenized_hypotheses = [tokenize_code(hyp) for hyp in hypotheses]
    
    # Prepare references in the required format
    list_of_references = [[ref] for ref in tokenized_references]  # Each hypothesis can have multiple references
    
    # Compute corpus BLEU
    corpus_bleu_score = corpus_bleu(list_of_references, tokenized_hypotheses)
    return corpus_bleu_score

def run_model_without_fine_tuning(prompt: str, max_tokens: int, model_path: str) -> str:
    """
    Load and run the model without fine-tuning.

    Args:
        prompt (str): The prompt to generate the response.
        max_tokens (int): Maximum number of tokens for the generated response.
        model_path (str): Path to the pre-trained model.

    Returns:
        str: The generated response.
    """
    model, tokenizer = load(model_path)
    response = generate(model, tokenizer, prompt=prompt, max_tokens=max_tokens, verbose=True)
    print("Generated response:", response)
    return response

def fine_tune_model(model_path: str, num_iters: str, steps_per_eval: str, val_batches: str, learning_rate: str, num_layers: int, resume_adapter_file: str = None) -> None:
    """
    Fine-tune the model using LoRA.

    Args:
        model_path (str): Path to the pre-trained model.
        num_iters (str): Number of iterations for fine-tuning.
        steps_per_eval (str): Steps per evaluation.
        val_batches (str): Number of validation batches.
        learning_rate (str): Learning rate for fine-tuning.
        num_layers (int): Number of layers to fine-tune.
        resume_adapter_file (str, optional): Path to resume adapter training.

    Returns:
        None
    """
    command = [
        'python', 'scripts/lora-coding.py', '--model', model_path, '--train', 
        '--iters', num_iters, '--steps-per-eval', steps_per_eval, 
        '--val-batches', val_batches, '--learning-rate', learning_rate, 
        '--lora-layers', str(num_layers), '--test',
    ]

    if resume_adapter_file:
        command.extend(['--resume-adapter-file', resume_adapter_file])
        
    print("Running command:", construct_shell_command(command))
    stdout, stderr = run_command_with_live_output(command)


    # Optionally, you can save stdout and stderr to log files
    with open('logs/fine_tune.log', 'w') as log_file:
        log_file.write("STDOUT:\n")
        log_file.write(stdout)
        log_file.write("\nSTDERR:\n")
        log_file.write(stderr)


def run_model_after_fine_tuning(prompt: str, max_tokens: int, model_path: str, adapter_path: str) -> str:
    """
    Run the model after fine-tuning using the LoRA adapter.

    Args:
        prompt (str): The prompt to generate the response.
        max_tokens (int): Maximum number of tokens for the generated response.
        model_path (str): Path to the pre-trained model.
        adapter_path (str): Path to the fine-tuned adapter.

    Returns:
        str: The generated response.
    """
    command = [
        'python', 'scripts/lora-coding.py', '--model', model_path, 
        '--adapter-file', adapter_path, '--max-tokens', str(max_tokens), '--prompt', prompt
    ]
    print("Running command:", construct_shell_command(command))
    stdout, stderr = run_command_with_live_output(command)
    
    # Optionally, save stdout and stderr to log files
    with open('logs/generate_after_finetune.log', 'w') as log_file:
        log_file.write("STDOUT:\n")
        log_file.write(stdout)
        log_file.write("\nSTDERR:\n")
        log_file.write(stderr)
    
    # Extract the generated code between <code-start> and <code-end>
    generated_response = extract_code(stdout)
    print("Generated response after fine-tuning:", generated_response)
    return generated_response

# Define reference responses (Replace these with your actual references)
reference_responses = [
    """import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import CredentialsModal from '../CredentialsModal';

describe('BiometricScreen', () => {
  test('render', () => {
    const { getByText } = render(<CredentialsModal />);

    expect(getByText('LOGIN_PASSWORD')).toBeTruthy();
    expect(getByText('LOGIN_USERNAME')).toBeTruthy();
    expect(getByText('ENABLE_BIOMETRIC')).toBeTruthy();
  });
  test('submit button triggers onSubmit function with correct values', () => {
    const onClosePress = jest.fn();
    const { getByText } = render(<CredentialsModal onClosePress={onClosePress} />);

    const passwordInput = getByText('LOGIN_PASSWORD');
    const submitButton = getByText('ENABLE_BIOMETRIC');
    act(() => {
      fireEvent.changeText(passwordInput, 'password123');
    });

    fireEvent.press(submitButton);
    expect(onClosePress).toBeTruthy();
  });
});
""",
    # Add more reference responses as needed
]

def check_syntax(code: str) -> bool:
    """
    Checks the syntax of JavaScript code using ESLint.
    Returns True if no syntax errors are found.

    Args:
        code (str): The code to check.

    Returns:
        bool: True if syntax is valid, False otherwise.
    """
    try:
        # Write code to a temporary file
        with open('temp_code.js', 'w') as f:
            f.write(code)
        
        # Run ESLint
        result = subprocess.run(['eslint', 'temp_code.js'], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        
        # ESLint returns 0 if no errors
        if result.returncode == 0:
            print("No syntax errors found.")
            return True
        else:
            print("Syntax errors detected:")
            print(result.stdout)
            return False
    except Exception as e:
        print(f"Error during syntax check: {e}")
        return False

def main():
    # Example usage:
    code = """import React from 'react';
    import { FormProvider } from 'react-hook-form';
    import I18n from '@I18n';
    import * as Yup from 'yup';
    import styled from 'styled-components/native';
    import { Button } from '../../../Elements';
    import { FormInput } from '../../Forms';
    import { withModal } from '../../../HOC';
    import { useCompatibleForm, useYupValidationResolver } from '../../../Utils/hook';
    import { icons } from '../../../Resources/icon';
    import useUser from '../../../Context/User/Hooks/UseUser';
    import { BIOMETRIC_STATUS } from '../../../Config/Constants';

    const ButtonWrapper = styled.View`
    align-items: center;
    margin-top: 10px;
    `;

    const Wrapper = styled.View`
    padding-horizontal: 10px;
    `;

    const InputIcon = styled.Image`
    margin-right: 10px;
    `;

    const CredentialsModal = ({ onSuccess }) => {
    const {
        user: { user },
        checkAuthenticate,
        updateUserBiometric,
    } = useUser();

    const requiredQuestion = I18n.t('AUTH_REQUIRED_FIELD');
    const validationSchema = Yup.object().shape({
        password: Yup.string().required(requiredQuestion),
    });
    const formMethods = useCompatibleForm({
        resolver: useYupValidationResolver(validationSchema),
        defaultValues: {
        username: user.emailAddress,
        password: '',
        },
    });

    const onSubmit = async (values) => {
        const response = await checkAuthenticate(values);
        if (response) {
        updateUserBiometric(BIOMETRIC_STATUS.ON);
        onSuccess();
        }
    };

    return (
        <Wrapper>
        <FormProvider {...formMethods}>
            <FormInput
            name="username"
            mode="small"
            keyboardType="email-address"
            label="LOGIN_USERNAME"
            editable={false}
            placeholder="LOGIN_USERNAME"
            />
            <FormInput
            name="password"
            secureTextEntry
            mode="small"
            label="LOGIN_PASSWORD"
            placeholder="LOGIN_PASSWORD"
            leftIcon={<InputIcon source={icons.password} />}
            />
            <ButtonWrapper center>
            <Button
                block
                primary
                rounded
                title={I18n.t('ENABLE_BIOMETRIC')}
                onPress={formMethods.handleSubmit(onSubmit)}
            />
            </ButtonWrapper>
        </FormProvider>
        </Wrapper>
    );
    };

    export default withModal(CredentialsModal, 'CREDENTIALS_TITLE');
    """

    model_path = "mlx-community/Mistral-7B-Instruct-v0.2-4bit"
    instructions_string = (
        "CodeGPT, functioning as a coding support assistant, communicates in clear, accessible language "
        "and can provide deeper technical details upon request. It responds to feedback appropriately and "
        "concludes responses with its signature '–CodeGPT'. CodeGPT also specializes in generating unit tests "
        "for JavaScript and React Native code using Jest and React Testing Library, ensuring tests cover various "
        "scenarios and follow best practices. It tailors the length of its responses according to the user's prompts, "
        "keeping interactions both helpful and natural."
    )

    def prompt_builder(prompt_content):
        return f"<s>[INST] {instructions_string}\n{prompt_content}\n[/INST]\n–CodeGPT</s>"

    # Example usage:
    prompt = prompt_builder(
        "Generate a unit test for the following React Native component (`CredentialsModal`)\n"
        "<code-start>" + code + "<code-end>"
    )
    max_tokens = 2000
    adapter_path = "adapters.npz"  # Path to the LoRA adapter

    # Run model without fine-tuning
    print("=== Running Model Without Fine-Tuning ===")
    generated_response_before = run_model_without_fine_tuning(prompt, max_tokens, model_path)

    # Fine-tune the model
    # Uncomment the following lines if you intend to perform fine-tuning
    # print("\n=== Fine-Tuning the Model ===")
    # fine_tune_model(
    #     model_path=model_path, 
    #     num_iters="100", 
    #     steps_per_eval="10", 
    #     val_batches="-1", 
    #     learning_rate="1e-5", 
    #     num_layers=16, 
    #     resume_adapter_file="./adapters.npz"  # Provide path if resuming
    # )

    # # Run model after fine-tuning
    print("\n=== Running Model After Fine-Tuning ===")
    generated_response_after = run_model_after_fine_tuning(prompt, max_tokens, model_path, adapter_path)

    # Define reference response (for this example, using the first reference)
    reference_response = reference_responses[0]

    # Print generated responses with colors
    print("\n=== Generated Response Before Fine-Tuning ===")
    print(f"{PRE_FINE_TUNE_COLOR}{generated_response_before}{RESET_COLOR}")

    print("\n=== Generated Response After Fine-Tuning ===")
    print(f"{POST_FINE_TUNE_COLOR}{generated_response_after}{RESET_COLOR}")

    # Compute BLEU score for pre-fine-tuning
    print("\n=== Computing BLEU Score Before Fine-Tuning ===")
    bleu_before = compute_bleu_score(reference_response, generated_response_before)
    print(f"BLEU Score Before Fine-Tuning: {bleu_before:.4f}")

    # Compute BLEU score for post-fine-tuning
    print("\n=== Computing BLEU Score After Fine-Tuning ===")
    bleu_after = compute_bleu_score(reference_response, generated_response_after)
    print(f"BLEU Score After Fine-Tuning: {bleu_after:.4f}")
    
    code_bleu_before = calc_codebleu([reference_response], [generated_response_before], lang="python", weights=(0.25, 0.25, 0.25, 0.25), tokenizer=None)
    print(f"CODE_BLEU Score before Fine-Tuning")
    print(code_bleu_before)

    code_bleu_after = calc_codebleu([reference_response], [generated_response_after], lang="python", weights=(0.25, 0.25, 0.25, 0.25), tokenizer=None)
    print(f"CODE_BLEU Score After Fine-Tuning")
    print(code_bleu_after)


if __name__ == "__main__":
    main()