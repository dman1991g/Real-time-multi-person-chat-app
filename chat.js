// Import Firebase functions
import { auth, database } from './firebaseConfig.js';
import { signOut } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';
import { ref, push, onChildAdded, serverTimestamp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';

// Get DOM elements
const messageInput = document.getElementById('messageInput');
const sendMessageButton = document.getElementById('sendMessage');
const messagesDiv = document.getElementById('messages');
const signOutButton = document.getElementById('signOut');

// Send a message
sendMessageButton.addEventListener('click', () => {
    if (messageInput.value.trim() !== '') {
        const userId = auth.currentUser ? auth.currentUser.uid : 'anonymous';
        const messageRef = ref(database, 'messages');
        push(messageRef, {
            text: messageInput.value,
            userId,
            timestamp: serverTimestamp()
        }).then(() => {
            messageInput.value = ''; // Clear input field
        }).catch(error => console.error('Error sending message:', error));
    }
});

// Display messages
onChildAdded(ref(database, 'messages'), snapshot => {
    const msg = snapshot.val();
    const msgDiv = document.createElement('div');
    msgDiv.textContent = `${msg.userId}: ${msg.text}`;
    messagesDiv.appendChild(msgDiv);
});

// Sign out user
signOutButton.addEventListener('click', () => {
    signOut(auth)
        .then(() => {
            window.location.href = 'index.html'; // Redirect to sign-in page
        })
        .catch(error => console.error('Error signing out:', error));
});