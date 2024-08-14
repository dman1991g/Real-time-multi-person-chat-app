// Import Firebase functions and modules
import { auth, database, storage } from './firebaseConfig.js';
import { signOut } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';
import { ref, push, onChildAdded, serverTimestamp, set, onValue } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';
import { uploadBytes, getDownloadURL, ref as storageRef } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js';

// Get DOM elements
const messageInput = document.getElementById('messageInput');
const sendMessageButton = document.getElementById('sendMessage');
const messagesDiv = document.getElementById('messages');
const chatRoomInput = document.getElementById('chatRoomInput');
const createChatRoomButton = document.getElementById('createChatRoom');
const joinChatRoomButton = document.getElementById('joinChatRoom');
const signOutButton = document.getElementById('signOut');
const toggleSidebarButton = document.getElementById('toggleSidebar');
const sidebar = document.getElementById('sidebar');
const content = document.getElementById('content');
const chatRoomList = document.getElementById('chatRoomList');
const imageInput = document.getElementById('imageInput');
const uploadImageButton = document.getElementById('sendImage');
const toggleImageUploadButton = document.getElementById('toggleImageUpload');
const emojiButton = document.getElementById('emojiButton');
const emojiPickerDiv = document.getElementById('emojiPicker'); // Added for the emoji picker

let currentRoomId = null;
const usernames = {};

// Function to fetch usernames from the database
function fetchUsernames() {
    onValue(ref(database, 'usernames'), snapshot => {
        snapshot.forEach(childSnapshot => {
            const username = childSnapshot.key;
            const uid = childSnapshot.val();
            usernames[uid] = username;
        });
        console.log('Usernames fetched:', usernames);
    }, error => console.error('Error fetching usernames:', error));
}

fetchUsernames();

// Function to send a message to a specific chat room
function sendMessage(roomId, content, isImage = false) {
    const user = auth.currentUser;
    if (user && content.trim() !== '') {
        const messageRef = ref(database, `chatrooms/${roomId}/messages`);
        push(messageRef, {
            text: isImage ? null : content,
            imageUrl: isImage ? content : null,
            sender: user.uid,
            timestamp: serverTimestamp()
        }).then(() => {
            if (!isImage) {
                messageInput.value = '';
            }
        }).catch(error => console.error('Error sending message:', error));
    } else {
        console.error('User is not authenticated or message input is empty.');
    }
}

// Function to listen for messages in a specific chat room
function listenForMessages(roomId) {
    messagesDiv.innerHTML = '';
    onChildAdded(ref(database, `chatrooms/${roomId}/messages`), snapshot => {
        const msg = snapshot.val();
        const msgDiv = document.createElement('div');
        const senderUsername = usernames[msg.sender] || msg.sender;
        if (msg.imageUrl) {
            const img = document.createElement('img');
            img.src = msg.imageUrl;
            img.style.maxWidth = '100%';
            msgDiv.appendChild(img);
        } else {
            msgDiv.textContent = `${senderUsername}: ${msg.text}`;
        }
        messagesDiv.appendChild(msgDiv);
        console.log('Message received:', msg);
        console.log('Sender username:', senderUsername);
    });
}

// Function to create a new chat room
function createChatRoom() {
    const roomId = chatRoomInput.value.trim();
    if (roomId !== '') {
        set(ref(database, `chatrooms/${roomId}`), {
            messages: {},
            users: {}
        }).then(() => {
            console.log(`Chat room ${roomId} created.`);
        }).catch(error => console.error('Error creating chat room:', error));
    } else {
        console.error('Please enter a chat room ID.');
    }
}

// Function to join a chat room
function joinChatRoom(roomId) {
    const user = auth.currentUser;
    if (user) {
        const userId = user.uid;
        const userRef = ref(database, `chatrooms/${roomId}/users/${userId}`);
        set(userRef, true).then(() => {
            console.log(`User ${userId} joined chat room ${roomId}.`);
            currentRoomId = roomId;
            listenForMessages(roomId);
        }).catch(error => console.error('Error joining chat room:', error));
    } else {
        console.error('No authenticated user.');
    }
}

// Function to fetch and display chat room list
function displayChatRooms() {
    onValue(ref(database, 'chatrooms'), snapshot => {
        chatRoomList.innerHTML = '';
        snapshot.forEach(childSnapshot => {
            const roomId = childSnapshot.key;
            const roomDiv = document.createElement('div');
            roomDiv.classList.add('room');
            roomDiv.textContent = roomId;
            roomDiv.addEventListener('click', () => joinChatRoom(roomId));
            chatRoomList.appendChild(roomDiv);
        });
    });
}

// Function to upload an image
function uploadImage(roomId, file) {
    const storageReference = storageRef(storage, `images/${Date.now()}_${file.name}`);
    uploadBytes(storageReference, file).then(snapshot => {
        return getDownloadURL(snapshot.ref);
    }).then(downloadURL => {
        sendMessage(roomId, downloadURL, true);
    }).catch(error => console.error('Error uploading image:', error));
}

// Event listener for sending message (button click)
sendMessageButton.addEventListener('click', () => {
    if (currentRoomId) {
        sendMessage(currentRoomId, messageInput.value);
    } else {
        console.error('No chat room selected.');
    }
});

// Event listener for creating a chat room
createChatRoomButton.addEventListener('click', createChatRoom);

// Event listener for joining a chat room
joinChatRoomButton.addEventListener('click', () => {
    const roomId = chatRoomInput.value.trim();
    if (roomId !== '') {
        joinChatRoom(roomId);
    } else {
        console.error('Please enter a chat room ID.');
    }
});

// Event listener for signing out
signOutButton.addEventListener('click', () => {
    signOut(auth)
        .then(() => {
            window.location.href = 'index.html'; // Redirect to sign-in page
        })
        .catch(error => console.error('Error signing out:', error));
});

// Event listener for toggling sidebar visibility
toggleSidebarButton.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    content.classList.toggle('expanded');
});

// Event listener for sending message (Enter key)
messageInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
        event.preventDefault();
        if (currentRoomId) {
            sendMessage(currentRoomId, messageInput.value);
        } else {
            console.error('No chat room selected.');
        }
    }
});

// Event listener for toggling image upload visibility
toggleImageUploadButton.addEventListener('click', () => {
    const isHidden = imageInput.style.display === 'none' || imageInput.style.display === '';
    imageInput.style.display = isHidden ? 'block' : 'none';
    uploadImageButton.style.display = isHidden ? 'block' : 'none';
});

// Event listener for uploading an image
uploadImageButton.addEventListener('click', () => {
    if (currentRoomId && imageInput.files.length > 0) {
        console.log('Uploading image:', imageInput.files[0]);
        uploadImage(currentRoomId, imageInput.files[0]);
    } else {
        console.error('No chat room selected or no image selected.');
    }
});

// Display initial list of chat rooms
displayChatRooms();

// Initialize Emoji Picker
const pickerOptions = { 
    onEmojiSelect: emoji => messageInput.value += emoji.native 
};
const picker = new window.EmojiMart.Picker(pickerOptions);
emojiPickerDiv.appendChild(picker); // Append picker to the emoji picker div

// Event listener for showing the emoji picker
emojiButton.addEventListener('click', () => {
    emojiPickerDiv.classList.toggle('hidden'); // Toggle the hidden class
});

// Click event to hide emoji picker when clicking outside
document.addEventListener('click', (event) => {
    if (!emojiPickerDiv.contains(event.target) && event.target !== emojiButton) {
        emojiPickerDiv.classList.add('hidden'); // Hide if clicked outside
    }
});