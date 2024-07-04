// auth.js
import { auth, database } from './firebaseConfig.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';
import { ref, set } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';

const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const usernameInput = document.getElementById('username'); // Added username field
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const signOutButton = document.getElementById('signOut');

// Sign Up
signUpButton.addEventListener('click', () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    const username = usernameInput.value; // Get username input

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            // Store the username in the database under the user's UID
            set(ref(database, 'users/' + user.uid), {
                username: username
            });
            window.location.href = 'chat.html';
        })
        .catch(error => console.error('Error signing up:', error));
});

// Sign In
signInButton.addEventListener('click', () => {
    signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value)
        .then(() => window.location.href = 'chat.html')
        .catch(error => console.error('Error signing in:', error));
});

// Sign Out
signOutButton.addEventListener('click', () => {
    signOut(auth)
        .then(() => window.location.href = 'index.html')
        .catch(error => console.error('Error signing out:', error));
});