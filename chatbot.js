const chatLog = document.querySelector('.chat-log');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

sendBtn.addEventListener('click', () => {
  const message = userInput.value.trim();
  if (message) {
    chatLog.innerHTML += `<p>User: ${message}</p>`;
    // Add chatbot response logic here
    const response = 'Hello, I received your message!';
    chatLog.innerHTML += `<p>Bot: ${response}</p>`;
    userInput.value = '';
  }
});