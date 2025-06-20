const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
let loadingMessageElement = null; // Variable to hold the loading message DOM element

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const userMessage = input.value.trim(); // Get user input
  if (!userMessage) return;

  appendMessage('user', userMessage); // Display user message
  input.value = ''; // Clear input field

  // Show loading indicator
  showLoadingIndicator();

  // Send message to backend API
  fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: userMessage }), // Send message as JSON
  })
  .then(response => {
    if (!response.ok) { // Check for HTTP errors
        // Attempt to read error message from body if available, otherwise use status text
        return response.text().then(text => {
            throw new Error(`HTTP error! status: ${response.status}, message: ${text || response.statusText}`);
        });
    }
    return response.json(); // Parse JSON response
  })
  .then(data => {
    appendMessage('bot', data.reply); // Display bot's reply
  })
  .catch(error => {
    console.error('Error:', error);
    appendMessage('bot', `Error: ${error.message || 'Could not get a response from the chatbot.'}`); // Display error message
  })
  .finally(() => {
    // Always remove loading indicator after fetch completes
    removeLoadingIndicator();
  });
});

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function showLoadingIndicator() {
    // Prevent multiple loading indicators if one is already created and not yet removed
    if (loadingMessageElement) {
        return;
    }
    loadingMessageElement = document.createElement('div');
    loadingMessageElement.classList.add('message', 'bot', 'loading'); // Use 'bot' class for styling, add 'loading' class

    const textElement = document.createElement('span');
    textElement.classList.add('loading-text');
    textElement.textContent = 'Gemini is thinking';
    loadingMessageElement.appendChild(textElement);

    // Add three animated dots
    for (let i = 0; i < 3; i++) {
        const dotSpan = document.createElement('span');
        dotSpan.classList.add('dot');
        dotSpan.textContent = '.';
        loadingMessageElement.appendChild(dotSpan);
    }

    chatBox.appendChild(loadingMessageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to show the loading message
}

function removeLoadingIndicator() {
    if (loadingMessageElement && chatBox.contains(loadingMessageElement)) {
        chatBox.removeChild(loadingMessageElement);
        loadingMessageElement = null; // Reset the reference
    }
}
