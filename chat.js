import { app, auth, database } from './firebaseConfig.js';
import { signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';
import { ref, push, onChildAdded, serverTimestamp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';

// Element references
const messageInput = document.getElementById('messageInput');
const sendMessageButton = document.getElementById('sendMessage');
const messagesDiv = document.getElementById('messages');
const emojiButton = document.getElementById('emojiButton');
const signOutButton = document.getElementById('signOut');

// Initialize the Emoji Button
const picker = new EmojiButton();
emojiButton.addEventListener('click', () => {
    picker.togglePicker(emojiButton);
});

picker.on('emoji', emoji => {
    messageInput.value += emoji;
});

// Send message
sendMessageButton.addEventListener('click', () => {
    const user = auth.currentUser;
    if (user) {
        const userId = user.uid;
        const userRef = ref(database, 'users/' + userId);
        userRef.get().then(snapshot => {
            if (snapshot.exists()) {
                const username = snapshot.val().username;
                const messageRef = ref(database, 'messages');
                push(messageRef, {
                    text: messageInput.value,
                    userId,
                    username,
                    timestamp: serverTimestamp()
                }).then(() => {
                    messageInput.value = '';
                }).catch(error => console.error('Error sending message:', error));
            }
        }).catch(error => console.error('Error fetching username:', error));
    }
});

// Display new messages
onChildAdded(ref(database, 'messages'), snapshot => {
    const msg = snapshot.val();
    const msgDiv = document.createElement('div');
    msgDiv.textContent = `${msg.username}: ${msg.text}`;
    messagesDiv.appendChild(msgDiv);
});

// Sign out
signOutButton.addEventListener('click', () => {
    signOut(auth).then(() => {
        window.location.href = 'index.html'; // Redirect to sign-in page
    }).catch(error => console.error('Error signing out:', error));
});

// Check auth state and redirect if not authenticated
onAuthStateChanged(auth, user => {
    if (!user) {
        window.location.href = 'index.html'; // Redirect to sign-in page
    }
});