import json
import random
import os
import glob
from transformers import AutoTokenizer

# Set random seed for reproducibility
random.seed(42)

# Instructions for the model
instructions_string = (
    "You are CodeGPT, an AI assistant specializing in generating unit tests for JavaScript and React Native code. "
    "Provide clear, concise, and correct unit tests using Jest and React Testing Library. "
    "Ensure the tests cover various cases and follow best practices."
)

# Root directory containing your JavaScript projects
ROOT_DIR = './training_data_2'  # Corrected path spelling from 'trainning_data' to 'training_data'

# Initialize the tokenizer
tokenizer = AutoTokenizer.from_pretrained('mlx-community/Mistral-7B-Instruct-v0.2-4bit')  # Ensure tokens do not exceed model limitations

MAX_SEQUENCE_LENGTH = 1400  # Maximum tokens per 'text' entry

def get_basename(file_path):
    """
    Extracts the base name of a file without its extension.
    """
    return os.path.basename(file_path).split('.')[0]

def load_code_and_tests():
    """
    Loads code and corresponding test files from the ROOT_DIR.
    Returns lists of code snippets, unit test snippets, and component names.
    """
    # Collect code files (excluding test files)
    code_files = glob.glob(os.path.join(ROOT_DIR, '**', '*.js'), recursive=True)
    code_files = [f for f in code_files if not f.endswith(('.test.js', '.spec.js')) and '__tests__' not in f]

    # Collect test files
    test_files = glob.glob(os.path.join(ROOT_DIR, '**', '*.test.js'), recursive=True)
    test_files += glob.glob(os.path.join(ROOT_DIR, '**', '*.spec.js'), recursive=True)
    test_files += glob.glob(os.path.join(ROOT_DIR, '**', '__tests__', '*.js'), recursive=True)

    # Create mappings from base names to file paths
    code_files_dict = {}
    for f in code_files:
        base_name = get_basename(f)
        code_files_dict[base_name] = f

    test_files_dict = {}
    for f in test_files:
        # Remove test suffixes from base names
        base_name = get_basename(f).replace('.test', '').replace('.spec', '')
        test_files_dict[base_name] = f

    # Find common base names to ensure matching files
    common_base_names = set(code_files_dict.keys()) & set(test_files_dict.keys())

    # Sort the base names to have consistent order
    sorted_base_names = sorted(common_base_names)

    code_snippets = []
    unit_test_snippets = []
    component_names = []

    for base_name in sorted_base_names:
        code_file_path = code_files_dict[base_name]
        test_file_path = test_files_dict[base_name]

        # Read code file content
        with open(code_file_path, 'r', encoding='utf-8') as code_file:
            code_content = code_file.read()

        # Read test file content
        with open(test_file_path, 'r', encoding='utf-8') as test_file:
            test_content = test_file.read()

        # Add to the lists in the same order
        code_snippets.append(code_content)
        unit_test_snippets.append(test_content)
        component_names.append(base_name)  # Store the component name

    return code_snippets, unit_test_snippets, component_names

def generate_examples(code_snippets, unit_test_snippets, component_names):
    """
    Generates a single 'text' field by combining the prompt and answer.
    Each 'text' consists of the instructions, the code snippet, and the unit test, clearly separated.
    If the combined token count exceeds MAX_SEQUENCE_LENGTH, the example is skipped.
    """
    examples = []
    for code_snippet, unit_test_snippet, component_name in zip(code_snippets, unit_test_snippets, component_names):
        # Construct the combined text with clear separators
        combined_text = (
            f"{instructions_string}\n\n"
            f"Generate a unit test for the following React Native component (`{component_name}`):\n"
            f"```javascript\n{code_snippet}\n```\n\n"
            f"Unit Test:\n"
            f"```javascript\n{unit_test_snippet}\n```"
        )

        # Calculate token counts
        combined_tokens = len(tokenizer.encode(combined_text))
        if combined_tokens > MAX_SEQUENCE_LENGTH:
            print(f"Skipping `{component_name}` as it exceeds the maximum token limit ({combined_tokens} tokens).")
            continue  # Skip examples that exceed the token limit

        examples.append({"text": combined_text})

    return examples

def split_dataset_dynamic(examples, test_ratio=0.1, val_ratio=0.1):
    """
    Dynamically splits the dataset into training, validation, and test sets based on ratios.
    """
    random.shuffle(examples)
    total_examples = len(examples)

    test_size = int(total_examples * test_ratio)
    val_size = int(total_examples * val_ratio)

    test_examples = examples[:test_size]
    val_examples = examples[test_size:test_size + val_size]
    train_examples = examples[test_size + val_size:]

    return train_examples, val_examples, test_examples

def save_dataset(split_name, data):
    """
    Saves the dataset split to a JSON Lines file.
    """
    os.makedirs('data', exist_ok=True)
    file_path = f'./{split_name}-coding.jsonl'
    try:
        with open(file_path, 'w', encoding='utf-8') as outfile:
            for example in data:
                json.dump(example, outfile)
                outfile.write('\n')
        print(f"Saved `{split_name}` dataset with {len(data)} examples.")
    except IOError as e:
        print(f"Error writing to file {file_path}: {e}")

if __name__ == "__main__":
    # Load code and test snippets along with component names
    code_snippets, unit_test_snippets, component_names = load_code_and_tests()

    # Generate examples with combined 'text' field
    examples = generate_examples(code_snippets, unit_test_snippets, component_names)

    # Dynamically set the number of test and validation examples based on ratios
    test_ratio = 0.1  # 10% for testing
    val_ratio = 0.1   # 10% for validation

    try:
        train_examples, val_examples, test_examples = split_dataset_dynamic(
            examples, test_ratio=test_ratio, val_ratio=val_ratio
        )
        save_dataset('train', train_examples)
        save_dataset('valid', val_examples)
        save_dataset('test', test_examples)
    except ValueError as ve:
        print(f"ValueError: {ve}")
