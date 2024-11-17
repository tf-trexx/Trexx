            // Firebase configuration
            import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
            import { getDatabase, ref, set, push, onValue, get, child } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
            
// Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyCmoTmMNGUUM1n2BOggo05Xw0K0i88MOcs",
    authDomain: "mahinw-838ea.firebaseapp.com",
    databaseURL: "https://mahinw-838ea-default-rtdb.firebaseio.com",
    projectId: "mahinw-838ea",
    storageBucket: "mahinw-838ea.firebasestorage.app",
    messagingSenderId: "721102079638",
    appId: "1:721102079638:web:aa046794df1ac8873d64b7",
    measurementId: "G-NSYP8Y3DYN"
  };
            // Initialize Firebase
            const app = initializeApp(firebaseConfig);
            const database = getDatabase(app);
        
            // DOM elements
            const user1Input = document.getElementById('user');
            const submitUserBtn = document.getElementById('submitUser');
            const diaryInput = document.getElementById('diary');
            const submitDiaryBtn = document.getElementById('submitDiary');
            const diaryNotesContainer = document.getElementById('diaryNotes');

            let isSubmitting = false; // Track submission state to prevent duplication
        
            // Check if a username is already stored
            document.addEventListener('DOMContentLoaded', () => {
                const storedUsername = localStorage.getItem('username');
                if (storedUsername) {
                    showWelcomeMessage(storedUsername);
                } else {
                    showLoginFields();
                }
                loadNotesFromFirebase(); // Load notes from Firebase
            });
        
            // Show login fields initially if no user is logged in
            function showLoginFields() {
                user1Input.style.display = 'block';
                submitUserBtn.style.display = 'block';
                diaryInput.style.display = 'none';
                submitDiaryBtn.style.display = 'none';
            }
        
            // Submit and store username
            submitUserBtn.addEventListener('click', () => {
                const username = user1Input.value.trim();
                if (username) {
                    localStorage.setItem('username', username);
                    showWelcomeMessage(username);
                } else {
                    showLoginFields();
                }
            });
        
            function showWelcomeMessage(username) {
                user1Input.style.display = 'none';
                submitUserBtn.style.display = 'none';
                diaryInput.style.display = 'block';
                submitDiaryBtn.style.display = 'block';
            }
        
            // Submit and store diary notes
            submitDiaryBtn.addEventListener('click', () => {
                const noteContent = diaryInput.value.trim();
                const username = localStorage.getItem('username');
                if (noteContent && username) {
                    const note = {
                        content: noteContent,
                        time: new Date().toLocaleTimeString(),
                        date: new Date().toLocaleDateString(),
                        username: username
                    };
                    isSubmitting = true; // Disable real-time listener temporarily
                    saveNoteToFirebase(note);
                    displayNote(note);
                    diaryInput.value = ''; // Clear input
                }
            });
        
            // Display a new note with animation
            function displayNote(note) {
                const noteElement = document.createElement('div');
                noteElement.className = 'diary-note';
                noteElement.innerHTML = `
                    <div class="note-content">${note.content}</div>
                    <div class="note-info">by @${note.username} at ${note.time}</div>
                `;
                diaryNotesContainer.prepend(noteElement); // Add new notes at the top
                requestAnimationFrame(() => {
                    noteElement.style.opacity = '1';
                    noteElement.style.transform = 'translateY(0)';
                });
            }
        
            // Save a new note to Firebase
            function saveNoteToFirebase(note) {
                const notesRef = ref(database, 'notes');
                const newNoteRef = push(notesRef);
                set(newNoteRef, note).catch((error) => {
                    isSubmitting = false; // Re-enable real-time listener
                    console.error("Error saving note:", error);
                });
            }
        
            function loadNotesFromFirebase() {
                const notesRef = ref(database, 'notes');
                const displayedNotes = new Set();
        
                onValue(notesRef, (snapshot) => {
                    if (isSubmitting) return; // Skip updates if currently submitting a new note
        
                    snapshot.forEach((childSnapshot) => {
                        const note = childSnapshot.val();
                        const noteId = childSnapshot.key;
        
                        // Only display notes that haven't been displayed yet (prevent duplicates)
                        if (!displayedNotes.has(noteId)) {
                            displayNote(note);
                            displayedNotes.add(noteId);
                        }
                    });
                });
            }
