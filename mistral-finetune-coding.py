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

# Coding assistant prompt format
instructions_string = f"""CodeGPT, your role is to assist with coding problems by providing clear and accurate solutions. Your responses should be concise, technical, and helpful. Sign off each response with '-CodeGPT'."""

prompt_builder = lambda prompt: f'''<s>[INST] {instructions_string} \n{prompt} \n[/INST]\n'''

model_path = "mlx-community/Mistral-7B-Instruct-v0.2-4bit"
prompt = prompt_builder("Generate the unit test for listView with import { renderScreen } from '@Mock/mockApp'")
max_tokens = 1000

# # Load the model and generate a response
model, tokenizer = load("mlx-community/Mistral-7B-Instruct-v0.2-4bit")
response = generate(model, tokenizer, prompt=prompt, max_tokens=max_tokens, verbose=True)

# Fine-tune with LoRA
num_iters = "100"
steps_per_eval = "10"
val_batches = "-1"  # Use all validation batches
learning_rate = "1e-5"  # Default learning rate
num_layers = 16  # Default number of layers to fine-tune

command = ['python', 'scripts/lora-coding.py', '--model', model_path, '--train', '--iters', num_iters, '--steps-per-eval', steps_per_eval, '--val-batches', val_batches, '--learning-rate', learning_rate, '--lora-layers', num_layers, '--test']

# Print the command to run in the command line directly
print(construct_shell_command(command))

# Run inference with the fine-tuned model
adapter_path = "adapters.npz"  # Default adapter path
max_tokens_str = str(max_tokens)

# Define the command for running inference
command = ['python', 'scripts/lora-coding.py', '--model', model_path, '--adapter-file', adapter_path, '--max-tokens', max_tokens_str, '--prompt', prompt]
run_command_with_live_output(command)

# A more complex coding prompt
complex_prompt = "Generate the unit test for listView with import { renderScreen } from '@Mock/mockApp'"
prompt = prompt_builder(complex_prompt)
command = ['python', 'scripts/lora-coding.py', '--model', model_path, '--adapter-file', adapter_path, '--max-tokens', max_tokens_str, '--prompt', prompt]

# Run the command and print results continuously
run_command_with_live_output(command)
