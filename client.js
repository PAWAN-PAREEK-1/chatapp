const socket = io();
let messageArea = document.querySelector(".messages");
let userName;

// Prompt user to enter their username
do {
    userName = prompt('Please enter your username');
} while (!userName);

let textarea = document.querySelector("#textarea");
let sendButton = document.querySelector("button[type='submit']");
let userCount = document.querySelector(".user-count"); // New

// Function to send message
let sendMessage = () => {
    let msg = textarea.value.trim();
    if (msg !== '') {
        let message = {
            user: userName,
            message: msg
        };
        appendMessage(message, 'sent');
        scrollToBottom();
        textarea.value = '';
        socket.emit('message', message);
    }
};

// Listen for clicks on the "Send" button
sendButton.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent form submission
    sendMessage();
});

// Listen for "Enter" key press in textarea
textarea.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault(); // Prevent newline in textarea
        sendMessage();
    }
});

// Append a message to the message area
let appendMessage = (msg, type) => {
    let mainDiv = document.createElement('div');
    let className = type;
    mainDiv.classList.add(className);

    let markup = `
        <h4>${msg.user}</h4>
        <p>${msg.message}</p>
    `;
    mainDiv.innerHTML = markup;
    messageArea.appendChild(mainDiv);

    // Scroll to bottom after a short delay to allow DOM update
    setTimeout(scrollToBottom, 100);
};

// Scroll to the bottom of the message area
let scrollToBottom = () => {
    messageArea.scrollTop = messageArea.scrollHeight;
};

// Listen for incoming messages from the server
socket.on('message', (message) => {
    appendMessage(message, 'received');
    scrollToBottom();
});

// Listen for user count update from the server
// Listen for user count update from the server
socket.on('user-count', (count) => {
    if (count === 1) {
        userCount.textContent = 'You are the only one here.';
    } else {
        userCount.textContent = `Users connected: ${count}`;
        console.log("Received user count:", count);
    }
   // Add this line
});


