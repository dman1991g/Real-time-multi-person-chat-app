import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { EmojiButton } from "https://cdn.jsdelivr.net/npm/@joeattardi/emoji-button@4.6.2/dist/emoji-button.esm.js";

import firebaseConfig from './firebaseConfig.js'; // Ensure this path is correct

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

const messageInput = document.getElementById('messageInput');
const sendMessageButton = document.getElementById('sendMessage');
const messagesDiv = document.getElementById('messages');
const signOutButton = document.getElementById('signOut');
const emojiButton = document.getElementById('emojiButton');

// Initialize Emoji Button
const picker = new EmojiButton();

emojiButton.addEventListener('click', () => {
    picker.togglePicker(emojiButton);
});

picker.on('emoji', emoji => {
    messageInput.value += emoji;
});

sendMessageButton.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message !== '') {
        push(ref(database, 'messages'), {
            text: message,
            timestamp: Date.now(),
            uid: auth.currentUser.uid
        });
        messageInput.value = '';
    }
});

onChildAdded(ref(database, 'messages'), (data) => {
    const messageData = data.val();
    const messageElement = document.createElement('div');
    messageElement.textContent = messageData.text;
    messagesDiv.appendChild(messageElement);
});

signOutButton.addEventListener('click', () => {
    signOut(auth).then(() => {
        window.location.href = 'index.html'; // Redirect to sign-in page
    }).catch((error) => {
        console.error('Sign Out Error', error);
    });
});

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = 'index.html'; // Redirect to sign-in page
    }
});