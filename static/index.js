document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('send-button').addEventListener('click', sendMessage);
    document.getElementById('clear-button').addEventListener('click', clearConversation);
  });
  
  function sendMessage() {
    console.log('haha');
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value.trim();
    if (!message) return;
    appendMessage('user', message);
    messageInput.value = '';
  
    // Show the loading indicator
    document.getElementById('loading-indicator').style.display = 'block';
  
    console.log('Sending message to server:', message);
  
    fetch('/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: message })
    })
    .then(response => response.json())
    .then(data => {
        // Hide the loading indicator
        document.getElementById('loading-indicator').style.display = 'none';
  
        if (data.response) {
            appendMessage('assistant', data.response);
            console.log('Received response from server:', data.response);
        } else if (data.error) {
            appendMessage('assistant', 'Error: ' + data.error);
            console.error('Server Error:', data.error);
        }
    })
    .catch(error => {
        // Hide the loading indicator
        document.getElementById('loading-indicator').style.display = 'none';
  
        console.error('Fetch Error:', error);
        appendMessage('assistant', 'An error occurred while processing your request.');
    });
  }
  
  function appendMessage(role, content) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', role);

    // Detect code blocks delimited by ```
    const parts = content.split('```');
    let formattedContent = '';

    parts.forEach((part, index) => {
        if (index % 2 === 1) {
            // Code block
            formattedContent += `<pre><code>${escapeHtml(part)}</code></pre>`;
        } else {
            // Regular text
            formattedContent += `<p>${escapeHtml(part)}</p>`;
        }
    });

    messageDiv.innerHTML = formattedContent;

    const chatWindow = document.getElementById('chat-window');
    chatWindow.appendChild(messageDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

  
  function clearConversation() {
    if (confirm('Are you sure you want to clear the conversation?')) {
        // Clear chat window
        const chatWindow = document.getElementById('chat-window');
        chatWindow.innerHTML = '';
        // Clear local storage or any stored history if implemented
    }
  }
  
  // Function to escape HTML characters to prevent XSS
  function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
    };
    return text.replace(/[&<>]/g, function(m) { return map[m]; });
  }
  