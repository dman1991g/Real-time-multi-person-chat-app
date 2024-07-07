// Import Firebase functions
import { auth, database } from './firebaseConfig.js';
import { signOut } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';
import { ref, push, onChildAdded, serverTimestamp, set } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';

// Get DOM elements
const messageInput = document.getElementById('messageInput');
const sendMessageButton = document.getElementById('sendMessage');
const messagesDiv = document.getElementById('messages');
const signOutButton = document.getElementById('signOut');
const chatRoomInput = document.getElementById('chatRoomInput');
const createChatRoomButton = document.getElementById('createChatRoom');
const joinChatRoomButton = document.getElementById('joinChatRoom');

let currentRoomId = null; // Track the current chat room ID

// Function to send a message to a specific chat room
function sendMessage(roomId) {
    if (messageInput.value.trim() !== '') {
        const userId = auth.currentUser ? auth.currentUser.uid : 'anonymous';
        const messageRef = ref(database, `chatrooms/${roomId}/messages`);
        push(messageRef, {
            text: messageInput.value,
            userId,
            timestamp: serverTimestamp()
        }).then(() => {
            messageInput.value = ''; // Clear input field
        }).catch(error => console.error('Error sending message:', error));
    }
}

// Function to listen for messages in a specific chat room
function listenForMessages(roomId) {
    messagesDiv.innerHTML = ''; // Clear previous messages
    onChildAdded(ref(database, `chatrooms/${roomId}/messages`), snapshot => {
        const msg = snapshot.val();
        const msgDiv = document.createElement('div');
        msgDiv.textContent = `${msg.userId}: ${msg.text}`;
        messagesDiv.appendChild(msgDiv);
    });
}

// Function to create a new chat room
function createChatRoom(roomId) {
    set(ref(database, `chatrooms/${roomId}`), {
        messages: {},
        users: {}
    }).then(() => {
        console.log(`Chat room ${roomId} created.`);
    }).catch(error => console.error('Error creating chat room:', error));
}

// Function to join a chat room
function joinChatRoom(roomId) {
    const userId = auth.currentUser ? auth.currentUser.uid : 'anonymous';
    const userRef = ref(database, `chatrooms/${roomId}/users/${userId}`);
    set(userRef, true).then(() => {
        console.log(`User ${userId} joined chat room ${roomId}.`);
        currentRoomId = roomId;
        listenForMessages(roomId); // Start listening for messages in the chat room
    }).catch(error => console.error('Error joining chat room:', error));
}

// Event listener for sending message
sendMessageButton.addEventListener('click', () => {
    if (currentRoomId) {
        sendMessage(currentRoomId);
    } else {
        console.error('No chat room selected.');
    }
});

// Event listener for creating a chat room
createChatRoomButton.addEventListener('click', () => {
    const roomId = chatRoomInput.value.trim();
    if (roomId !== '') {
        createChatRoom(roomId);
    }
});

// Event listener for joining a chat room
joinChatRoomButton.addEventListener('click', () => {
    const roomId = chatRoomInput.value.trim();
    if (roomId !== '') {
        joinChatRoom(roomId);
    }
});

// Sign out user
signOutButton.addEventListener('click', () => {
    signOut(auth)
        .then(() => {
            window.location.href = 'index.html'; // Redirect to sign-in page
        })
        .catch(error => console.error('Error signing out:', error));
});