from flask import Flask, request, jsonify, render_template
from threading import Lock
import subprocess
import shlex
import os
from mlx_lm import load, generate
import numpy as np
import logging

app = Flask(__name__, template_folder='templates', static_folder='static')

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s %(levelname)s %(name)s %(threadName)s : %(message)s',
    handlers=[
        logging.FileHandler("app.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Global variables
model = None
tokenizer = None
model_lock = Lock()

# Paths
MODEL_PATH = "mlx-community/Mistral-7B-Instruct-v0.2-4bit"
ADAPTER_PATH = "./adapters.npz"
SCRIPT_PATH = "./scripts/lora-coding.py"

# Load the model and tokenizer
def load_model():
    global model, tokenizer
    try:
        logger.info("Loading base model and tokenizer...")
        model, tokenizer = load(MODEL_PATH)
        logger.info("Base model and tokenizer loaded successfully.")
    except Exception as e:
        logger.critical(f"Failed to load model and tokenizer: {e}")
        exit(1)

# Function to load the adapter
def load_adapter():
    global model, tokenizer
    logger.info(f"Loading adapter from {ADAPTER_PATH}...")
    try:
        adapter_weights = np.load(ADAPTER_PATH, allow_pickle=True)
        logger.info("Adapter weights loaded from .npz file.")
        
        # Use the correct method to load the adapter
        if hasattr(model, 'apply_adapter'):
            model.apply_adapter(adapter_weights)
            logger.info("Adapter loaded successfully using 'apply_adapter'.")
        elif hasattr(model, 'load_weights'):
            model.load_weights(adapter_weights)
            logger.info("Adapter loaded successfully using 'load_weights'.")
        else:
            logger.error("Error: The model does not have a method to load adapters.")
    except AttributeError as e:
        logger.error(f"AttributeError during adapter loading: {e}")
    except Exception as e:
        logger.error(f"An unexpected error occurred while loading the adapter: {e}")

# Initialize model and adapter on startup
load_model()
load_adapter()

# Route to render the chat interface
@app.route('/')
def index():
    return render_template('index.html')

# Route to handle chat messages
@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_message = data.get('message', '')

    if not user_message:
        logger.warning("No message provided in the request.")
        return jsonify({'error': 'No message provided'}), 400

    # Build the prompt
    instructions = (
        "You are CodeGPT, an AI assistant specializing in generating unit tests for JavaScript "
        "and React Native code. Provide clear, concise, and correct unit tests using Jest and React Testing Library. "
        "Ensure the tests cover various cases and follow best practices."
    )
    prompt = f"{instructions}\nUser: {user_message}\nAssistant:"

    logger.info(f"Received user message: {user_message}")
    logger.debug(f"Built prompt: {prompt}")

    # Define parameters for fine-tuning
    model_path = MODEL_PATH
    adapter_path = ADAPTER_PATH
    max_tokens = 2048  # Adjust as needed

    # Generate a response using the subprocess method
    try:
        response_text = run_model_after_fine_tuning(prompt, max_tokens, model_path, adapter_path)
    except Exception as e:
        logger.error(f"Error during model generation: {e}")
        return jsonify({'error': 'Error generating response'}), 500

    # Check if the response contains an error
    if response_text.startswith("Error:") or response_text.startswith("Exception:"):
        return jsonify({'error': response_text}), 500

    return jsonify({'response': response_text})


# Function to run shell commands and capture output
def run_command_with_live_output(command: list[str]) -> str:
    """
    Runs a command and captures its stdout output.

    Args:
        command (List[str]): The command and its arguments to be executed.

    Returns:
        str: The stdout output from the command.
    """
    logger.info(f"Executing command: {' '.join(command)}")
    response = ""
    try:
        process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

        # Capture stdout only
        while True:
            out = process.stdout.readline()
            if out == '' and process.poll() is not None:
                break
            if out:
                response += out

        # Optionally, log stderr separately
        stderr = process.stderr.read()
        if stderr:
            logger.error(stderr.strip())

        return_code = process.poll()
        if return_code:
            logger.error(f"Command exited with return code {return_code}")
            return f"Error: Command exited with return code {return_code}"
        else:
            logger.info("Command executed successfully.")
            return response.strip()
    except Exception as e:
        logger.error(f"An error occurred while executing the command: {e}")
        return f"Exception: {e}"


# Function to generate a response by running the subprocess
def run_model_after_fine_tuning(prompt: str, max_tokens: int, model_path: str, adapter_path: str) -> str:
    """
    Run the model after fine-tuning using the LoRA adapter.

    Args:
        prompt (str): The prompt to generate the response.
        max_tokens (int): Maximum number of tokens for the generated response.
        model_path (str): Path to the pre-trained model.
        adapter_path (str): Path to the fine-tuned adapter.

    Returns:
        str: Generated response from the model.
    """
    command = [
        'python', SCRIPT_PATH, '--model', model_path, 
        '--adapter-file', adapter_path, '--max-tokens', str(max_tokens), '--prompt', prompt
    ]
    response = run_command_with_live_output(command)
    return response

if __name__ == '__main__':
    try:
        app.run(debug=True)
    except Exception as e:
        logger.critical(f"Failed to start the Flask server: {e}")
