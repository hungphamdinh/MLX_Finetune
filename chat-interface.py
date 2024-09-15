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
    return ' '.join(command)

# Coding assistant prompt format
instructions_string = """CodeGPT, your role is to assist with coding problems by providing clear and accurate solutions. Your responses should be concise, technical, and helpful. Sign off each response with '-CodeGPT'."""

prompt_builder = lambda prompt: f"<s>[INST] {instructions_string}\n{prompt}\n[/INST]\n"

model_path = "mlx-community/Mistral-7B-Instruct-v0.2-4bit"
max_tokens = 1000

# Load the model and tokenizer once at the beginning
print("Loading the model, please wait...")
model, tokenizer = load(model_path)
print("Model loaded successfully.")

while True:
    user_input = input("Enter your coding prompt (or type 'exit' to quit): ")

    if user_input.lower() == 'exit':
        print("Exiting...")
        break

    prompt = prompt_builder(user_input)

    # Generate a response from the model
    response = generate(model, tokenizer, prompt=prompt, max_tokens=max_tokens, verbose=True)

    print(f"CodeGPT response:\n{response}\n")

    # Ask if the user wants to fine-tune or run inference with the generated response
    action = input("Do you want to fine-tune the model or run inference? (fine-tune/inference/skip): ")

    if action.lower() == 'fine-tune':
        num_iters = "100"
        steps_per_eval = "10"
        val_batches = "-1"
        learning_rate = "1e-5"
        num_layers = 16

        command = [
            'python', 'scripts/lora-coding.py', '--model', model_path, '--train', '--iters', num_iters, 
            '--steps-per-eval', steps_per_eval, '--val-batches', val_batches, '--learning-rate', learning_rate, 
            '--lora-layers', str(num_layers), '--test'
        ]

        # Print the command
        print(f"Running command: {construct_shell_command(command)}")
        run_command_with_live_output(command)

    elif action.lower() == 'inference':
        adapter_path = "adapters.npz"
        max_tokens_str = str(max_tokens)

        command = [
            'python', 'scripts/lora-coding.py', '--model', model_path, '--adapter-file', adapter_path, 
            '--max-tokens', max_tokens_str, '--prompt', prompt
        ]

        # Run the command and print results continuously
        print(f"Running command: {construct_shell_command(command)}")
        run_command_with_live_output(command)

    elif action.lower() == 'skip':
        continue
    else:
        print("Invalid option, skipping this step.")
