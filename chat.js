// chat.js
import { auth, database } from './firebaseConfig.js';
import { ref, push, onChildAdded, serverTimestamp, get } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';
import { signOut } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';

const messageInput = document.getElementById('messageInput');
const sendMessageButton = document.getElementById('sendMessage');
const messagesDiv = document.getElementById('messages');
const signOutButton = document.getElementById('signOut');
const emojiButton = document.getElementById('emojiButton');

// Initialize Emoji Picker
const emojiPicker = new EmojiButton();

emojiButton.addEventListener('click', () => {
    emojiPicker.togglePicker();
});

emojiPicker.on('emoji', (emoji) => {
    messageInput.value += emoji;
});

// Send Message
sendMessageButton.addEventListener('click', () => {
    if (messageInput.value.trim() !== '') {
        const userId = auth.currentUser ? auth.currentUser.uid : 'anonymous';
        const messageRef = ref(database, 'messages');
        push(messageRef, {
            text: messageInput.value,
            userId,
            timestamp: serverTimestamp()
        }).then(() => {
            messageInput.value = '';
        }).catch(error => console.error('Error sending message:', error));
    }
});

// Display Messages
onChildAdded(ref(database, 'messages'), snapshot => {
    const msg = snapshot.val();
    const msgDiv = document.createElement('div');
    get(ref(database, 'users/' + msg.userId)).then(userSnapshot => {
        const username = userSnapshot.val() ? userSnapshot.val().username : 'Unknown';
        msgDiv.textContent = `${username}: ${msg.text}`;
        messagesDiv.appendChild(msgDiv);
    });
});

// Sign Out
signOutButton.addEventListener('click', () => {
    signOut(auth)
        .then(() => window.location.href = 'index.html')
        .catch(error => console.error('Error signing out:', error));
});