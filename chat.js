import { app, auth, database } from './firebaseConfig.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';
import { ref, push, onChildAdded, serverTimestamp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';

const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const signOutButton = document.getElementById('signOut');
const messageInput = document.getElementById('messageInput');
const sendMessageButton = document.getElementById('sendMessage');
const messagesDiv = document.getElementById('messages');
const emojiButton = document.getElementById('emojiButton');

// Initialize the Emoji Button
const picker = new emojiButton();
emojiButton.addEventListener('click', () => {
    picker.togglePicker(emojiButton);
});

picker.on('emoji', emoji => {
    messageInput.value += emoji;
});

signUpButton.addEventListener('click', () => {
    createUserWithEmailAndPassword(auth, emailInput.value, passwordInput.value)
        .catch(error => console.error('Error signing up:', error));
});

signInButton.addEventListener('click', () => {
    signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value)
        .catch(error => console.error('Error signing in:', error));
});

signOutButton.addEventListener('click', () => {
    signOut(auth)
        .catch(error => console.error('Error signing out:', error));
});

sendMessageButton.addEventListener('click', () => {
    const userId = auth.currentUser.uid;
    const messageRef = ref(database, 'messages');
    push(messageRef, {
        text: messageInput.value,
        userId,
        timestamp: serverTimestamp()
    }).then(() => {
        messageInput.value = '';
    }).catch(error => console.error('Error sending message:', error));
});

onChildAdded(ref(database, 'messages'), snapshot => {
    const msg = snapshot.val();
    const msgDiv = document.createElement('div');
    msgDiv.textContent = `${msg.userId}: ${msg.text}`;
    messagesDiv.appendChild(msgDiv);
});

// Check auth state and redirect if not authenticated
onAuthStateChanged(auth, user => {
    if (!user) {
        window.location.href = 'index.html'; // Redirect to sign-in page
    }
});
