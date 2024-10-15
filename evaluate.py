import subprocess
from typing import List, Tuple
from mlx_lm import load, generate
import nltk
from nltk.translate.bleu_score import sentence_bleu, SmoothingFunction, corpus_bleu

# Ensure NLTK's Punkt tokenizer is downloaded
# nltk.download('punkt')
# nltk.download('punkt_tab')
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
    return ' '.join(command)

def compute_bleu_score(reference: str, hypothesis: str) -> float:
    """
    Computes the BLEU score between a single reference and hypothesis.

    Args:
        reference (str): The reference text.
        hypothesis (str): The generated hypothesis text.

    Returns:
        float: The BLEU score.
    """
    reference_tokens = nltk.word_tokenize(reference)
    hypothesis_tokens = nltk.word_tokenize(hypothesis)
    
    # Smoothing to handle cases with no matching n-grams
    smoothie = SmoothingFunction().method4
    
    bleu_score = sentence_bleu([reference_tokens], hypothesis_tokens, smoothing_function=smoothie)
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
    tokenized_references = [nltk.word_tokenize(ref) for ref in references]
    tokenized_hypotheses = [nltk.word_tokenize(hyp) for hyp in hypotheses]
    
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
        '--lora-layers', str(num_layers), '--test'
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
    
    # Assuming the generated response is the last line of stdout
    generated_response = stdout.strip().split('\n')[-1] if stdout else ""
    print("Generated response after fine-tuning:", generated_response)
    return generated_response

# Define reference responses (Replace these with your actual references)
reference_responses = [
    """import React from 'react';
import { render } from '@testing-library/react-native';
import EmptyList from '../../../Inspection/AttachImageScreen/EmptyList';
import { ImageResource } from '../../../../../Themes';

describe('EmptyList Component', () => {
  it('renders correctly', () => {
    render(<EmptyList />);
  });

  it('renders image correctly', () => {
    const { getByTestId } = render(<EmptyList />);
    const image = getByTestId('image');
    expect(image.props.source).toBe(ImageResource.IMG_LIBRARY_EMPTY);
  });

  it('renders text correctly', () => {
    const { getByTestId } = render(<EmptyList />);
    const text = getByTestId('text');
    expect(text.props.children).toBe('AD_EFORM_NO_IMAGES_AVAILABLE');
  });
});
""",
    # Add more reference responses as needed
]

def main():
    # Example usage:
    code = """import React from 'react';
import { Image, Text } from '@Elements';
import { ImageResource } from '@Themes';
import styled from 'styled-components/native';

const Wrapper = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
  margin-top: 80px;
`;

const Content = styled(Text)`
  color: #505e75;
  font-weight: bold;
  font-size: 13px;
`;

const EmptyList = () => (
  <Wrapper>
    <Image testID="image" source={ImageResource.IMG_LIBRARY_EMPTY} />
    <Content testID="text" text="AD_EFORM_NO_IMAGES_AVAILABLE" />
  </Wrapper>
);

export default EmptyList;
"""

    # Parameters
    model_path = "mlx-community/Mistral-7B-Instruct-v0.2-4bit"
    instructions_string = f"""CodeGPT, your role is to assist with coding problems by providing clear and accurate solutions. Your responses should be concise, technical, and helpful. Sign off each response with '-CodeGPT'."""
    prompt_builder = lambda prompt: f'''<s>[INST] {instructions_string} \n{prompt} \n[/INST]\n'''
    prompt = prompt_builder("Generate a unit test for the following React Native - EmptyList component <code-start>" + code + "<code-end>'")
    max_tokens = 2000
    adapter_path = "adapters.npz"  # Path to the LoRA adapter
    
    # Run model without fine-tuning
    # print("=== Running Model Without Fine-Tuning ===")
    # generated_response_before = run_model_without_fine_tuning(prompt, max_tokens, model_path)
    
    # Fine-tune the model
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
    
    # Run model after fine-tuning
    print("\n=== Running Model After Fine-Tuning ===")
    generated_response_after = run_model_after_fine_tuning(prompt, max_tokens, model_path, adapter_path)
    
    # Define reference response (for this example, using the first reference)
    reference_response = reference_responses[0]
    
    # # Compute BLEU score for pre-fine-tuning
    # print("\n=== Computing BLEU Score Before Fine-Tuning ===")
    # bleu_before = compute_bleu_score(reference_response, generated_response_before)
    # print(f"BLEU Score Before Fine-Tuning: {bleu_before:.4f}")
    
    # Compute BLEU score for post-fine-tuning
    print("\n=== Computing BLEU Score After Fine-Tuning ===")
    bleu_after = compute_bleu_score(reference_response, generated_response_after)
    print(f"BLEU Score After Fine-Tuning: {bleu_after:.4f}")
    
    # Optionally, compute Corpus BLEU if multiple responses are available
    # For demonstration, we'll use the two generated responses
    # references = [reference_response, reference_response]  # Assuming two hypotheses
    # hypotheses = [generated_response_before, generated_response_after]
    # corpus_bleu = compute_corpus_bleu(references, hypotheses)
    # print(f"\nCorpus BLEU Score: {corpus_bleu:.4f}")

if __name__ == "__main__":
    main()
