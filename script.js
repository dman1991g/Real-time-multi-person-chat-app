// script.js

import { app, auth, database } from './firebaseConfig.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';
import { ref, push, onChildAdded, serverTimestamp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';

document.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');
    const signOutButton = document.getElementById('signOut');
    const messageInput = document.getElementById('messageInput');
    const sendMessageButton = document.getElementById('sendMessage');
    const messagesDiv = document.getElementById('messages');

    // Sign Up
    signUpButton.addEventListener('click', () => {
        const email = emailInput.value;
        const password = passwordInput.value;
        createUserWithEmailAndPassword(auth, email, password)
            .then(userCredential => {
                console.log('User signed up:', userCredential.user);
            })
            .catch(error => {
                console.error('Error signing up:', error);
            });
    });

    // Sign In
    signInButton.addEventListener('click', () => {
        const email = emailInput.value;
        const password = passwordInput.value;
        signInWithEmailAndPassword(auth, email, password)
            .then(userCredential => {
                console.log('User signed in:', userCredential.user);
            })
            .catch(error => {
                console.error('Error signing in:', error);
            });
    });

    // Sign Out
    signOutButton.addEventListener('click', () => {
        signOut(auth)
            .then(() => {
                console.log('User signed out');
            })
            .catch(error => {
                console.error('Error signing out:', error);
            });
    });

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

    // Auth State Listener
    onAuthStateChanged(auth, user => {
        if (user) {
            console.log('User is signed in:', user);
        } else {
            console.log('User is signed out');
        }
    });
});