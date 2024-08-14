import csv
import random
import json

# Set the number of test and validation examples
num_test = 2
num_val = 2

# Extend your list of coding prompts and answers to ensure enough examples
coding_prompts = [
    "How do I create a function in Python?",
    "What is the difference between a list and a tuple?",
    "How can I optimize a nested loop in JavaScript?",
    "What are the best practices for error handling in Java?",
    "Explain the use of 'useEffect' hook in React.",
    "How can I merge two dictionaries in Python?",
    "What is a closure in JavaScript?",
    "How can I write a unit test in Python?",
    "Explain the difference between '==' and '===' in JavaScript.",
    "How do I handle asynchronous operations in Python?",
    # Additional prompts
    "What is a decorator in Python, and how do you use it?",
    "How can I prevent SQL injection in a web application?",
    "What are the benefits of using TypeScript over JavaScript?",
    "How do you handle memory leaks in Java?",
    "What is the purpose of 'this' keyword in JavaScript?",
    "How can I implement pagination in a REST API?",
    "What are the common performance pitfalls in React applications?",
    "How do you handle file uploads in Node.js?",
    "Explain the MVC architecture in web development.",
    "How do I set up a virtual environment in Python?"
]

coding_answers = [
    "To create a function in Python, use the 'def' keyword followed by the function name and parentheses. Example:\n```python\ndef my_function():\n    print('Hello, World!')\n``` -ShawGPT",
    "The main difference between a list and a tuple in Python is that a list is mutable, meaning you can change its content, while a tuple is immutable. -ShawGPT",
    "To optimize a nested loop in JavaScript, you can try reducing the number of iterations or breaking out of the loop early when a condition is met. Consider using array methods like 'map', 'filter', or 'reduce' if applicable. -ShawGPT",
    "Best practices for error handling in Java include using try-catch blocks, logging errors, and handling exceptions at the appropriate level. You should also provide meaningful error messages and avoid catching generic exceptions. -ShawGPT",
    "The 'useEffect' hook in React is used to perform side effects in function components, such as fetching data, updating the DOM, or setting up subscriptions. It runs after the first render and after every update unless specified otherwise. -ShawGPT",
    "To merge two dictionaries in Python, you can use the `{**dict1, **dict2}` syntax or the `update()` method. Example:\n```python\ndict1 = {'a': 1}\ndict2 = {'b': 2}\nmerged_dict = {**dict1, **dict2}\n``` -ShawGPT",
    "A closure in JavaScript is a function that has access to its own scope, the scope of the outer function, and the global scope. Closures are often used to create private variables or functions. -ShawGPT",
    "To write a unit test in Python, you can use the `unittest` module. Here's an example of a simple test:\n```python\nimport unittest\nclass TestSum(unittest.TestCase):\n    def test_sum(self):\n        self.assertEqual(sum([1, 2, 3]), 6)\n``` -ShawGPT",
    "In JavaScript, '==' compares two values for equality after converting them to a common type, while '===' compares them without type conversion, so both the value and type must be the same. -ShawGPT",
    "To handle asynchronous operations in Python, you can use `async` and `await` keywords with asynchronous functions, or use the `concurrent.futures` module for running tasks concurrently. -ShawGPT",
    # Additional answers
    "A decorator in Python is a function that takes another function and extends its behavior without explicitly modifying it. Example:\n```python\ndef my_decorator(func):\n    def wrapper():\n        print('Something is happening before the function is called.')\n        func()\n        print('Something is happening after the function is called.')\n    return wrapper\n``` -ShawGPT",
    "To prevent SQL injection, use parameterized queries or prepared statements, which ensure that SQL code is not directly concatenated with user input. Example in Python:\n```python\ncursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))\n``` -ShawGPT",
    "TypeScript provides static typing, which can help catch errors at compile-time rather than at runtime, among other features such as interfaces and type checking. -ShawGPT",
    "To handle memory leaks in Java, use tools like Java VisualVM or JConsole to monitor memory usage. Also, make sure to properly close resources such as file streams and database connections. -ShawGPT",
    "The 'this' keyword in JavaScript refers to the object from which it was called. Its value can change depending on the context of the function call. -ShawGPT",
    "To implement pagination in a REST API, return a subset of the data with metadata like the total number of pages or items. Example:\n```json\n{\n  \"data\": [ ... ],\n  \"meta\": {\n    \"total_pages\": 10,\n    \"current_page\": 1\n  }\n}\n``` -ShawGPT",
    "Common performance pitfalls in React applications include unnecessary re-renders, not memoizing expensive calculations, and improper handling of large lists. -ShawGPT",
    "In Node.js, you can handle file uploads using middleware like `multer`, which makes it easy to handle `multipart/form-data` when uploading files. -ShawGPT",
    "MVC stands for Model-View-Controller. It is a design pattern used in web development to separate concerns, making code easier to maintain and test. -ShawGPT",
    "To set up a virtual environment in Python, use the following commands:\n```bash\npython3 -m venv myenv\nsource myenv/bin/activate\n``` -ShawGPT",
]

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
