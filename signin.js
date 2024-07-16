// signin.js

import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from './firebaseConfig.js';

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const usernameInput = document.getElementById('username');
    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');

    // Sign Up
    signUpButton.addEventListener('click', () => {
        const email = emailInput.value;
        const password = passwordInput.value;
        const username = usernameInput.value;

        createUserWithEmailAndPassword(auth, email, password)
            .then(userCredential => {
                // Signed up successfully
                const user = userCredential.user;
                console.log('User signed up:', user);

                // Update user profile with username
                return user.updateProfile({
                    displayName: username
                });
            })
            .then(() => {
                console.log('Username updated successfully');
            })
            .catch(error => {
                console.error('Error signing up:', error.message);
            });
    });

    // Sign In
    signInButton.addEventListener('click', () => {
        const email = emailInput.value;
        const password = passwordInput.value;

        signInWithEmailAndPassword(auth, email, password)
            .then(userCredential => {
                // Signed in successfully
                const user = userCredential.user;
                console.log('User signed in:', user);
                // Redirect to chat page after successful sign in
                window.location.href = 'chat.html';
            })
            .catch(error => {
                console.error('Error signing in:', error.message);
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
