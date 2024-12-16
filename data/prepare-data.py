import json
import random
import os
import glob
from transformers import AutoTokenizer

# Set random seed for reproducibility
random.seed(42)

# Instructions for the model
instructions_string = (
    "CodeGPT, functioning as a coding support assistant, communicates in clear, accessible language "
    "and can provide deeper technical details upon request. It responds to feedback appropriately and "
    "concludes responses with its signature '–CodeGPT'. CodeGPT also specializes in generating unit tests "
    "for JavaScript and React Native code using Jest and React Testing Library, ensuring tests cover various "
    "scenarios and follow best practices. It tailors the length of its responses according to the user's prompts, "
    "keeping interactions both helpful and natural."
)

# Root directory containing your JavaScript projects
ROOT_DIR = './training_data'  # Ensure this path is correct

# Initialize the tokenizer
tokenizer = AutoTokenizer.from_pretrained('mlx-community/Mistral-7B-Instruct-v0.2-4bit')  # or another suitable model
MAX_SEQUENCE_LENGTH = 2048  # Maximum tokens per 'text' entry

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
    code_files = glob.glob(os.path.join(ROOT_DIR, '**', '*.js'), recursive=True)
    code_files = [f for f in code_files if not f.endswith(('.test.js', '.spec.js')) and '__tests__' not in f]

    test_files = glob.glob(os.path.join(ROOT_DIR, '**', '*.test.js'), recursive=True)
    test_files += glob.glob(os.path.join(ROOT_DIR, '**', '*.spec.js'), recursive=True)
    test_files += glob.glob(os.path.join(ROOT_DIR, '**', '__tests__', '*.js'), recursive=True)

    code_files_dict = {}
    for f in code_files:
        base_name = get_basename(f)
        code_files_dict[base_name] = f

    test_files_dict = {}
    for f in test_files:
        # Remove test suffixes from base names
        base_name = get_basename(f).replace('.test', '').replace('.spec', '')
        test_files_dict[base_name] = f

    common_base_names = set(code_files_dict.keys()) & set(test_files_dict.keys())
    sorted_base_names = sorted(common_base_names)

    code_snippets = []
    unit_test_snippets = []
    component_names = []

    for base_name in sorted_base_names:
        code_file_path = code_files_dict[base_name]
        test_file_path = test_files_dict[base_name]

        with open(code_file_path, 'r', encoding='utf-8') as code_file:
            code_content = code_file.read()

        with open(test_file_path, 'r', encoding='utf-8') as test_file:
            test_content = test_file.read()

        code_snippets.append(code_content)
        unit_test_snippets.append(test_content)
        component_names.append(base_name)

    return code_snippets, unit_test_snippets, component_names

def generate_examples(code_snippets, unit_test_snippets, component_names):
    """
    Generates examples in the specified CodeGPT structure.
    """
    examples = []
    for code_snippet, unit_test_snippet, component_name in zip(code_snippets, unit_test_snippets, component_names):
        # Construct the combined text
        # The instructions and user request go inside [INST]...[/INST]
        # After [/INST], we provide the unit test snippet and end with "–CodeGPT"
        combined_text = (
            f"<s>[INST] {instructions_string}\n\n"
            f"Generate a unit test for the following React Native component (`{component_name}`):\n"
            f"<code-start>{code_snippet}<code-end>[/INST]\n"
            f"<test-start>{unit_test_snippet}<test-end>\n–CodeGPT</s>"
        )

        # Calculate token count
        combined_tokens = len(tokenizer.encode(combined_text))
        if combined_tokens > MAX_SEQUENCE_LENGTH:
            print(f"Skipping `{component_name}` as it exceeds token limit ({combined_tokens} tokens).")
            continue

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
    code_snippets, unit_test_snippets, component_names = load_code_and_tests()
    examples = generate_examples(code_snippets, unit_test_snippets, component_names)

    test_ratio = 0.1
    val_ratio = 0.1

    try:
        train_examples, val_examples, test_examples = split_dataset_dynamic(
            examples, test_ratio=test_ratio, val_ratio=val_ratio
        )
        save_dataset('train', train_examples)
        save_dataset('valid', val_examples)
        save_dataset('test', test_examples)
    except ValueError as ve:
        print(f"ValueError: {ve}")