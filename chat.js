// chat.js

import { app, auth, database } from './firebaseConfig.js';
import { signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';
import { ref, push, onChildAdded, serverTimestamp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';

document.addEventListener('DOMContentLoaded', () => {
    const messageInput = document.getElementById('messageInput');
    const sendMessageButton = document.getElementById('sendMessage');
    const signOutButton = document.getElementById('signOut');
    const messagesDiv = document.getElementById('messages');

    // Send Message
    sendMessageButton.addEventListener('click', () => {
        const userId = auth.currentUser.uid;
        const messageRef = ref(database, 'messages');
        push(messageRef, {
            text: messageInput.value,
            userId,
            timestamp: serverTimestamp()
        }).then(() => {
            messageInput.value = '';
        }).catch(error => {
            console.error('Error sending message:', error);
        });
    });

    // Display Messages
    onChildAdded(ref(database, 'messages'), snapshot => {
        const msg = snapshot.val();
        const msgDiv = document.createElement('div');
        msgDiv.textContent = `${msg.userId}: ${msg.text}`;
        messagesDiv.appendChild(msgDiv);
    });

    // Sign Out
    signOutButton.addEventListener('click', () => {
        signOut(auth)
            .then(() => {
                console.log('User signed out');
                window.location.href = 'index.html';
            })
            .catch(error => {
                console.error('Error signing out:', error);
            });
    });

    // Auth State Listener
    onAuthStateChanged(auth, user => {
        if (!user) {
            // Redirect to sign in page if not signed in
            window.location.href = 'index.html';
        }
    });
});