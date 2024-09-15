import subprocess
from mlx_lm import load, generate


# Function to run a shell command with live output
def run_command_with_live_output(command: list[str]) -> None:
    """
    Runs a command and prints its output line by line as it executes.

    Args:
        command (List[str]): The command and its arguments to be executed.

    Returns:
        None
    """
    process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

    # Print the output line by line
    while True:
        output = process.stdout.readline()
        if output == '' and process.poll() is not None:
            break
        if output:
            print(output.strip())
        
    # Print the error output, if any
    err_output = process.stderr.read()
    if err_output:
        print(err_output)

def construct_shell_command(command: list[str]) -> str:
    return str(command).replace("'","").replace("[","").replace("]","").replace(",","")

def run_model_without_fine_tuning(prompt: str, max_tokens: int, model_path: str) -> None:
    """
    Load and run the model without fine-tuning.

    Args:
        prompt (str): The prompt to generate the response.
        max_tokens (int): Maximum number of tokens for the generated response.
        model_path (str): Path to the pre-trained model.

    Returns:
        None
    """
    model, tokenizer = load(model_path)
    response = generate(model, tokenizer, prompt=prompt, max_tokens=max_tokens, verbose=True)
    print("Generated response:", response)

def fine_tune_model(model_path: str, num_iters: str, steps_per_eval: str, val_batches: str, learning_rate: str, num_layers: int) -> None:
    """
    Fine-tune the model using LoRA.

    Args:
        model_path (str): Path to the pre-trained model.
        num_iters (str): Number of iterations for fine-tuning.
        steps_per_eval (str): Steps per evaluation.
        val_batches (str): Number of validation batches.
        learning_rate (str): Learning rate for fine-tuning.
        num_layers (int): Number of layers to fine-tune.

    Returns:
        None
    """
    command = [
        'python', 'scripts/lora-coding.py', '--model', model_path, '--train', 
        '--iters', num_iters, '--steps-per-eval', steps_per_eval, 
        '--val-batches', val_batches, '--learning-rate', learning_rate, 
        '--lora-layers', str(num_layers), '--test'
    ]
    print(construct_shell_command(command))
    run_command_with_live_output(command)

def run_model_after_fine_tuning(prompt: str, max_tokens: int, model_path: str, adapter_path: str) -> None:
    """
    Run the model after fine-tuning using the LoRA adapter.

    Args:
        prompt (str): The prompt to generate the response.
        max_tokens (int): Maximum number of tokens for the generated response.
        model_path (str): Path to the pre-trained model.
        adapter_path (str): Path to the fine-tuned adapter.

    Returns:
        None
    """
    command = [
        'python', 'scripts/lora-coding.py', '--model', model_path, 
        '--adapter-file', adapter_path, '--max-tokens', str(max_tokens), '--prompt', prompt
    ]
    run_command_with_live_output(command)

# Example usage:

# Parameters
model_path = "mlx-community/Meta-Llama-3.1-8B-Instruct-4bit"
instructions_string = f"""CodeGPT, your role is to assist with coding problems by providing clear and accurate solutions. Your responses should be concise, technical, and helpful. Sign off each response with '-CodeGPT'."""
prompt_builder = lambda prompt: f'''<s>[INST] {instructions_string} \n{prompt} \n[/INST]\n'''
prompt = prompt_builder("Generate the unit test for listView with import { renderScreen } from '@Mock/mockApp'")
max_tokens = 1000
adapter_path = "adapters.npz"  # Path to the LoRA adapter

# Run model without fine-tuning
run_model_without_fine_tuning(prompt, max_tokens, model_path)

# Fine-tune the model // run script inside
# fine_tune_model(model_path, num_iters="100", steps_per_eval="10", val_batches="-1", learning_rate="1e-5", num_layers=16)

# Run model after fine-tuning
run_model_after_fine_tuning(prompt, max_tokens, model_path, adapter_path)



