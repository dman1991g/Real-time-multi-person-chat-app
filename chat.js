// chat.js
import { auth, database } from './firebaseConfig.js';  // Import Firebase configuration
import { ref, push, onChildAdded, serverTimestamp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';

// Elements from the chat page
const messageInput = document.getElementById('messageInput');
const sendMessageButton = document.getElementById('sendMessage');
const messagesDiv = document.getElementById('messages');

// Send Message Function
sendMessageButton.addEventListener('click', () => {
    const userId = auth.currentUser.uid;  // Get current user's ID
    const messageText = messageInput.value;

    if (messageText.trim() !== '') {  // Check if message input is not empty
        const messageRef = ref(database, 'messages');
        push(messageRef, {
            text: messageText,
            userId,
            timestamp: serverTimestamp()
        }).then(() => {
            messageInput.value = '';  // Clear input field after sending
        }).catch(error => {
            console.error('Error sending message:', error);
        });
    }
});

// Display Messages Function
onChildAdded(ref(database, 'messages'), snapshot => {
    const msg = snapshot.val();
    const msgDiv = document.createElement('div');
    msgDiv.textContent = `${msg.userId}: ${msg.text}`;
    messagesDiv.appendChild(msgDiv);
});
