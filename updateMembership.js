import { auth, database } from './firebaseConfig.js';
import { ref, get, child, set } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';

// Function to update memberships in chat rooms
async function updateMemberships() {
    const dbRef = ref(database);
    try {
        const usernamesSnapshot = await get(child(dbRef, 'usernames'));
        if (usernamesSnapshot.exists()) {
            const usernames = usernamesSnapshot.val();
            const chatroomsSnapshot = await get(child(dbRef, 'chatrooms'));
            if (chatroomsSnapshot.exists()) {
                const chatrooms = chatroomsSnapshot.val();
                for (const roomId in chatrooms) {
                    const roomUsersRef = ref(database, `chatrooms/${roomId}/users`);
                    for (const uid in usernames) {
                        await set(child(roomUsersRef, uid), usernames[uid]);
                    }
                }
            }
        }
        console.log('Memberships updated successfully.');

        // Redirect to index.html after completion
        window.location.href = 'index.html';

    } catch (error) {
        console.error('Error updating memberships:', error);
    }
}

// Check if the user is authenticated before running the update
onAuthStateChanged(auth, user => {
    if (user) {
        updateMemberships();
    } else {
        console.log('No user is signed in.');
        window.location.href = 'index.html'; // Redirect to index.html if no user is signed in
    }
});