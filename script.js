// signin.js

import { app, auth } from './firebaseConfig.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';

document.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');

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
                // Redirect to chat page after successful sign in
                window.location.href = 'chat.html';
            })
            .catch(error => {
                console.error('Error signing in:', error);
            });
    });

    // Auth State Listener
    onAuthStateChanged(auth, user => {
        if (user) {
            console.log('User is signed in:', user);
            // Redirect to chat page if already signed in
            window.location.href = 'chat.html';
        } else {
            console.log('User is signed out');
        }
    });
});