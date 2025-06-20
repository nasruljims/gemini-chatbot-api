const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const userMessage = input.value.trim(); // Get user input
  if (!userMessage) return;

  appendMessage('user', userMessage); // Display user message
  input.value = ''; // Clear input field

  // Send message to backend API
  fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: userMessage }), // Send message as JSON
  })
  .then(response => response.json()) // Parse JSON response
  .then(data => {
    appendMessage('bot', data.reply); // Display bot's reply
  })
  .catch(error => {
    console.error('Error:', error);
    appendMessage('bot', 'Error: Could not get a response from the chatbot.'); // Display error message
  });
});

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}
