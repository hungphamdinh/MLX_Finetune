#!/usr/bin/env python
# coding: utf-8

# ### MLX Fine-tuning
# 
# Code authored by: Shaw Talebi <br>
# Video link: https://youtu.be/3PIqhdRzhxE <br>
# Blog link: https://towardsdatascience.com/local-llm-fine-tuning-on-mac-m1-16gb-f59f4f598be7 <br>
# <br>
# Source: https://github.com/ml-explore/mlx-examples/tree/main/lora

# ### imports

# In[1]:


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


# In[3]:


def construct_shell_command(command: list[str]) -> str:
    
    return str(command).replace("'","").replace("[","").replace("]","").replace(",","")


# In[4]:


# prompt format
intstructions_string = f"""ShawGPT, functioning as a virtual data science consultant on YouTube, communicates in clear, accessible language, escalating to technical depth upon request. \
It reacts to feedback aptly and ends responses with its signature '–ShawGPT'. \
ShawGPT will tailor the length of its responses to match the viewer's comment, providing concise acknowledgments to brief expressions of gratitude or feedback, \
thus keeping the interaction natural and engaging.

Please respond to the following comment.
"""

prompt_builder = lambda comment: f'''<s>[INST] {intstructions_string} \n{comment} \n[/INST]\n'''


# ### Quantize Model (optional)

# In[5]:


hf_model_path = "meta-llama/Meta-Llama-3.1-8B-Instruct"


# In[6]:


# define command to convert hf model to mlx format and save locally (-q flag quantizes model)
command = ['python', 'scripts/convert.py', '--hf-path', hf_model_path, '-q']

# print runable version of command (copy and paste into command line to run)
print(construct_shell_command(command))


# ### Run inference with quantized model

# In[7]:


model_path = "mlx-community/Meta-Llama-3.1-8B-Instruct-bf16"
prompt = prompt_builder("Great content, thank you!")
max_tokens = 140


# In[8]:


model, tokenizer = load("mlx-community/Meta-Llama-3.1-8B-Instruct-bf16")
response = generate(model, tokenizer, prompt=prompt, max_tokens = max_tokens,verbose=True)


# ### Fine-tune with LoRA

# In[9]:


num_iters = "100"
steps_per_eval = "10"
val_batches = "-1" # use all
learning_rate = "1e-5" # same as default
num_layers = 16 # same as default
# no dropout or weight decay :(


# In[10]:


# define command
command = ['python', 'scripts/lora.py', '--model', model_path, '--train', '--iters', num_iters, '--steps-per-eval', steps_per_eval, '--val-batches', val_batches, '--learning-rate', learning_rate, '--lora-layers', num_layers, '--test']

# run command and print results continuously (doesn't print loss during training)
# run_command_with_live_output(command)


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

# run command and print results continuously
run_command_with_live_output(command)


# #### a harder comment

# In[14]:


comment = "I discovered your channel yesterday and I am hucked, great job. It would be nice to see a video of fine tuning ShawGPT using HF, I saw a video you did running on Colab using Mistal-7b, any chance to do a video using your laptop (Mac) or using HF spaces?"
prompt = prompt_builder(comment)


# In[15]:


# define command
command = ['python', 'scripts/lora.py', '--model', model_path, '--adapter-file', adapter_path, '--max-tokens', max_tokens_str, '--prompt', prompt]

# run command and print results continuously
run_command_with_live_output(command)


# In[ ]:




