const leftSlidingBox = document.getElementById('leftSlidingBox');
const usernameInput = document.getElementById('user');
const submitUserBtn = document.getElementById('submitUser');
const diaryInput = document.getElementById('diary');
const submitDiaryBtn = document.getElementById('submitDiary');
const diaryNotesContainer = document.getElementById('diaryNotes');
let isLeftSwiped = false; // To track if the left box is swiped in



// Variables to handle dragging for the left box
let isLeftDragging = false;
let leftStartX = 0;
let leftEndX = 0;

function handleLeftSwipe() {
    if (!isLeftSwiped) {
        leftSlidingBox.classList.add('show-left-box'); // Slide in
        document.body.classList.add('slideblur'); // Apply blur
        isLeftSwiped = true;
    } else {
        leftSlidingBox.classList.remove('show-left-box'); // Slide out
        document.body.classList.remove('slideblur'); // Remove blur
        isLeftSwiped = false;
    }
}



// Mouse swipe handling for the left box
leftSlidingBox.addEventListener('mousedown', (e) => {
    leftStartX = e.clientX;
    isLeftDragging = true;
});

document.addEventListener('mouseup', (e) => {
    if (!isLeftDragging) return;

    leftEndX = e.clientX;
    if (leftEndX - leftStartX > 50) { // Swiping right
        handleLeftSwipe();
    } else if (leftStartX - leftEndX > 50) { // Swiping left
        handleLeftSwipe();
    }
    isLeftDragging = false;
});

// Detect mouse position near the right edge for the left box
document.addEventListener('mousemove', (e) => {
    if (isLeftSwiped && e.clientX > window.innerWidth - 50) { // Check if mouse is near the right edge
        handleLeftSwipe(); // Slide out to initial position
    }
});

// Touch swipe handling for mobile for the left box
leftSlidingBox.addEventListener('touchstart', (e) => {
    leftStartX = e.touches[0].clientX;
});

leftSlidingBox.addEventListener('touchend', (e) => {
    leftEndX = e.changedTouches[0].clientX;
    if (leftEndX - leftStartX > 50) { // Swiping right
        handleLeftSwipe();
    } else if (leftStartX - leftEndX > 50) { // Swiping left
        handleLeftSwipe();
    }
});

// Check if a username is already stored
document.addEventListener('DOMContentLoaded', () => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
        showWelcomeMessage(storedUsername);
    } else {
        showLoginFields();
    }
    loadNotes();
});

// Show login fields initially if no user is logged in
function showLoginFields() {
    usernameInput.style.display = 'block';
    submitUserBtn.style.display = 'block';
    diaryInput.style.display = 'none';
    submitDiaryBtn.style.display = 'none';
}

// Submit and store username
submitUserBtn.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    if (username) {
        localStorage.setItem('username', username);
        showWelcomeMessage(username);
    } else {
        showLoginFields(); // This should show the input and button
    }
});

function showWelcomeMessage(username) {
    // Hide login fields and show diary inputs
    usernameInput.style.display = 'none';
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
        saveNoteToStorage(note);
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

    // Prepend to the diary notes container for top alignment
    diaryNotesContainer.prepend(noteElement); // Add new notes at the top

    // Trigger animation
    requestAnimationFrame(() => {
        noteElement.style.opacity = '1'; // Fade in
        noteElement.style.transform = 'translateY(0)'; // Move to final position
    });

    // Auto-remove note after 24 hours
    setTimeout(() => {
        diaryNotesContainer.removeChild(noteElement);
        removeNoteFromStorage(note);
    }, 86400000); // 24 hours in milliseconds
}
function animateNoteSend(noteElement) {
    noteElement.style.transform = 'translateY(50px) scale(0.9)';
    setTimeout(() => {
        noteElement.style.transform = 'translateY(0) scale(1)';
    }, 100);
}

// Save note to local storage
function saveNoteToStorage(note) {
    let notes = JSON.parse(localStorage.getItem('dailyNotes')) || [];
    notes.push(note);
    localStorage.setItem('dailyNotes', JSON.stringify(notes));
}

// Load all saved notes
function loadNotes() {
    const notes = JSON.parse(localStorage.getItem('dailyNotes')) || [];
    notes.forEach(displayNote);
}

// Remove a note from storage
function removeNoteFromStorage(noteToRemove) {
    let notes = JSON.parse(localStorage.getItem('dailyNotes')) || [];
    notes = notes.filter(note => note.content !== noteToRemove.content);
    localStorage.setItem('dailyNotes', JSON.stringify(notes));
}