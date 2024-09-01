import csv
import random
import json
from data import coding_prompts, coding_answers

# Set the number of test and validation examples
num_test = 5
num_val = 5


# New prompt format for coding helper
instructions_string = f"""You are a coding assistant, helping with programming problems in clear and concise language. Provide the best possible solution or explanation. End your responses with your signature '-CodeGPT'."""

example_template = lambda prompt, answer: f'''<s>[INST] {instructions_string} \n{prompt} \n[/INST]\n''' + answer + "</s>"

# Generate examples
example_list = []
for i in range(len(coding_prompts)):
    example = {"text": example_template(coding_prompts[i], coding_answers[i])}
    example_list.append(example)

# Now you have enough examples, you can create test and val data
test_val_index_list = random.sample(range(0, len(example_list)), num_test + num_val)

test_list = [example_list[index] for index in test_val_index_list[:num_test]]
val_list = [example_list[index] for index in test_val_index_list[num_test:]]

for example in test_list + val_list:
    example_list.remove(example)

# Write the train, test, and validation data to files
with open('train-coding.jsonl', 'w') as outfile:
    for example in example_list:
        json.dump(example, outfile)
        outfile.write('\n')

with open('test-coding.jsonl', 'w') as outfile:
    for example in test_list:
        json.dump(example, outfile)
        outfile.write('\n')

with open('valid-coding.jsonl', 'w') as outfile:
    for example in val_list:
        json.dump(example, outfile)
        outfile.write('\n')
