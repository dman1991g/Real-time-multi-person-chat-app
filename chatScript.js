import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getDatabase, ref, onValue, push, set } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { firebaseConfig } from './firebaseConfig.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

document.getElementById('sendMessage').addEventListener('click', () => {
    const message = document.getElementById('messageInput').value;
    if (message) {
        const messagesRef = ref(db, 'messages');
        const newMessageRef = push(messagesRef);
        set(newMessageRef, {
            text: message,
            timestamp: Date.now()
        });
    }
});

document.getElementById('signOut').addEventListener('click', () => {
    signOut(auth).then(() => {
        window.location.href = 'index.html';
    }).catch((error) => {
        // An error happened.
    });
});

const messagesRef = ref(db, 'messages');
onValue(messagesRef, (snapshot) => {
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML = ''; // Clear previous messages
    snapshot.forEach((childSnapshot) => {
        const childData = childSnapshot.val();
        const messageDiv = document.createElement('div');
        messageDiv.textContent = `${new Date(childData.timestamp).toLocaleTimeString()}: ${childData.text}`;
        messagesDiv.appendChild(messageDiv);
    });
});