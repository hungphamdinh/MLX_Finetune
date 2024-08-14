import subprocess
from mlx_lm import load, generate


# ### functions

# In[2]:


def run_command_with_live_output(command: list[str]) -> None:
    """
    Courtesy of ChatGPT:
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


# prompt format
intstructions_string = f"""ShawGPT, functioning as a virtual data science consultant on YouTube, communicates in clear, accessible language, escalating to technical depth upon request. \
It reacts to feedback aptly and ends responses with its signature '–ShawGPT'. \
ShawGPT will tailor the length of its responses to match the viewer's comment, providing concise acknowledgments to brief expressions of gratitude or feedback, \
thus keeping the interaction natural and engaging.

Please respond to the following comment.
"""

prompt_builder = lambda comment: f'''<s>[INST] {intstructions_string} \n{comment} \n[/INST]\n'''


model_path = "mlx-community/Mistral-7B-Instruct-v0.2-4bit"
prompt = prompt_builder("Great content, thank you!")
max_tokens = 140


model, tokenizer = load("mlx-community/Mistral-7B-Instruct-v0.2-4bit")
response = generate(model, tokenizer, prompt=prompt, max_tokens = max_tokens,verbose=True)

# ### Fine-tune with LoRA

num_iters = "100"
steps_per_eval = "10"
val_batches = "-1" # use all
learning_rate = "1e-5" # same as default
num_layers = 16 # same as default
# no dropout or weight decay :(

command = ['python', 'scripts/lora.py', '--model', model_path, '--train', '--iters', num_iters, '--steps-per-eval', steps_per_eval, '--val-batches', val_batches, '--learning-rate', learning_rate, '--lora-layers', num_layers, '--test']
# In[11]:
# print command to run in command line directly
print(construct_shell_command(command))


# ### Run inference with fine-tuned model
# In[12]:

adapter_path = "adapters.npz" # same as default
max_tokens_str = str(max_tokens)

# In[13]:
# define command

command = ['python', 'scripts/lora.py', '--model', model_path, '--adapter-file', adapter_path, '--max-tokens', max_tokens_str, '--prompt', prompt]
run_command_with_live_output(command)

# #### a harder comment
# In[14]:

comment = "I discovered your channel yesterday and I am hucked, great job. It would be nice to see a video of fine tuning ShawGPT using HF, I saw a video you did running on Colab using Mistal-7b, any chance to do a video using your laptop (Mac) or using HF spaces?"
prompt = prompt_builder(comment)
command = ['python', 'scripts/lora.py', '--model', model_path, '--adapter-file', adapter_path, '--max-tokens', max_tokens_str, '--prompt', prompt]

# run command and print results continuously
run_command_with_live_output(command)


