import json
import random
import os
import glob
from transformers import AutoTokenizer

# Set random seed for reproducibility
random.seed(42)

# Instructions and signature
instructions_string = (
    "You are CodeGPT, an AI assistant specializing in generating unit tests for JavaScript and React Native code. "
    "Provide clear, concise, and correct unit tests using Jest and React Testing Library. "
    "Ensure the tests cover various cases and follow best practices."
)
signature = '-CodeGPT'


# Root directory containing your JavaScript projects
ROOT_DIR = './trainning_data'  # <-- Update this path

tokenizer = AutoTokenizer.from_pretrained('mlx-community/Mistral-7B-Instruct-v0.2-4bit') #ensure the tokens not exceed the limitation of model
MAX_SEQUENCE_LENGTH = 1024

def get_basename(file_path):
    # Extract the base name without extension
    return os.path.basename(file_path).split('.')[0]

def load_code_and_tests():
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
    examples = []
    for code_snippet, unit_test_snippet, component_name in zip(code_snippets, unit_test_snippets, component_names):
        code_chunks = split_text_into_chunks(code_snippet, MAX_SEQUENCE_LENGTH // 2)
        unit_test_chunks = split_text_into_chunks(unit_test_snippet, MAX_SEQUENCE_LENGTH // 2)
        
        num_parts = max(len(code_chunks), len(unit_test_chunks))
        
        for i in range(num_parts):
            # Handle Code Chunks
            code_chunk = code_chunks[i] if i < len(code_chunks) else ''
            if code_chunk:
                prompt_code = (
                    f"<s>[INST] {instructions_string}\n"
                    f"Generate a unit test for the following React Native component ("
                    f"{component_name} - Part {i + 1} - Code):\n"
                    f"```javascript\n{code_chunk}\n```\n[/INST]"
                )
                answer_code = f"{signature}"
                examples.append({"prompt": prompt_code, "answer": answer_code})
            
            # Handle Unit Test Chunks
            unit_test_chunk = unit_test_chunks[i] if i < len(unit_test_chunks) else ''
            if unit_test_chunk:
                prompt_test = (
                    f"<s>[INST] {instructions_string}\n"
                    f"Review and improve the following unit test for React Native component ("
                    f"{component_name} - Part {i + 1} - Unit Test):\n"
                    f"```javascript\n{unit_test_chunk}\n```\n[/INST]"
                )
                answer_test = f"{signature}"
                examples.append({"prompt": prompt_test, "answer": answer_test})
    return examples

def split_text_into_chunks(text, max_length, overlap=50):
    tokens = tokenizer.encode(text)
    chunks = []
    for i in range(0, len(tokens), max_length - overlap):
        chunk_tokens = tokens[i:i + max_length]
        chunk_text = tokenizer.decode(chunk_tokens, skip_special_tokens=True)
        chunks.append(chunk_text)
    return chunks

def split_dataset(examples, num_test=1, num_val=1):
    # Shuffle the examples
    random.shuffle(examples)

    total_examples = len(examples)
    if num_test + num_val > total_examples:
        raise ValueError("The sum of num_test and num_val exceeds the total number of examples.")

    # Randomly select indices for test and validation sets
    test_val_indices = random.sample(range(total_examples), num_test + num_val)
    test_indices = test_val_indices[:num_test]
    val_indices = test_val_indices[num_test:]

    # Create test and validation sets
    test_examples = [examples[i] for i in test_indices]
    val_examples = [examples[i] for i in val_indices]

    # Remove test and validation examples from the main list to create the training set
    train_examples = [example for idx, example in enumerate(examples) if idx not in test_val_indices]

    return train_examples, val_examples, test_examples

def save_dataset(split_name, data):
    os.makedirs('data', exist_ok=True)
    file_path = f'./{split_name}-coding.jsonl'
    try:
        with open(file_path, 'w', encoding='utf-8') as outfile:
            for example in data:
                json.dump(example, outfile)
                outfile.write('\n')
        print(f"Saved {split_name} dataset with {len(data)} examples.")
    except IOError as e:
        print(f"Error writing to file {file_path}: {e}")

if __name__ == "__main__":
    # Initialize tokenizer and max sequence length
    tokenizer = AutoTokenizer.from_pretrained('mlx-community/Mistral-7B-Instruct-v0.2-4bit')
    MAX_SEQUENCE_LENGTH = 1024  # Halved to manage memory

    # Load code and test snippets along with component names
    code_snippets, unit_test_snippets, component_names = load_code_and_tests()
    examples = generate_examples(code_snippets, unit_test_snippets, component_names)
    
    # Set the number of test and validation examples
    num_test = 10
    num_val = 10

    try:
        train_examples, val_examples, test_examples = split_dataset(examples, num_test=num_test, num_val=num_val)
        save_dataset('train', train_examples)
        save_dataset('valid', val_examples)
        save_dataset('test', test_examples)
    except ValueError as ve:
        print(f"ValueError: {ve}")
