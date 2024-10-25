const dynamicIsland = document.querySelector('.dynamic-island');
const swipebox = document.querySelector('.swipebox');
const userInput = document.getElementById('userGuess');
const submitButton = document.getElementById('submitGuess');
const resultMessage = document.getElementById('resultMessage'); // Element to show the result message
let isSwipeboxVisible = false; // To track if the Swipebox is visible

// List of correct words for guessing
const correctWords = [
    "cherry", "date", 
    "i love you", "mahin", "orange", "i like you", 
    "dear", "ily", "kiss me", "proposal", 
    "marry", "marry me", "moon", "buttomon", 
    "strawberries", "kiss", "relationship", "death", 
    "love you", "dear", "darling", "baby", 
    "trexx", "trex", "dino", "roar", 
    "us", "videogames"
];
function toggleSwipebox() {
    if (!isSwipeboxVisible) {
        swipebox.classList.add('show-swipebox'); // Slide down into view
        dynamicIsland.classList.add('show-swipebox'); // Keep island at the same level
        document.body.classList.add('slideblur'); // Apply blur
        isSwipeboxVisible = true;
        resultMessage.textContent = ""; // Clear previous messages when opening
    } else {
        swipebox.classList.remove('show-swipebox'); // Slide back to the top
        dynamicIsland.classList.remove('show-swipebox');
        document.body.classList.remove('slideblur'); // Remove blur
        isSwipeboxVisible = false;
    }
}

// Handle mouse and touch events for swipe functionality
dynamicIsland.addEventListener('mousedown', (e) => {
    if (e.target !== userInput && e.target !== submitButton) {
        toggleSwipebox();
    }
});

// Prevent the swipebox from closing when clicking inside the input field or submit button
userInput.addEventListener('click', (e) => {
    e.stopPropagation();
});

submitButton.addEventListener('click', (e) => {
    e.stopPropagation();
    checkGuess(); // Call the guessing function when the button is clicked
});

// Handle touch events for mobile devices
dynamicIsland.addEventListener('touchstart', (e) => {
    if (e.target !== userInput && e.target !== submitButton) {
        toggleSwipebox();
    }
});

// Prevent the swipebox from closing on touch events for input field and submit button
userInput.addEventListener('touchstart', (e) => {
    e.stopPropagation();
});

submitButton.addEventListener('touchstart', (e) => {
    e.stopPropagation();
});

// Function to check the user's guess
function checkGuess() {
    const userGuess = userInput.value.trim().toLowerCase(); // Get and normalize the user's guess
    if (correctWords.includes(userGuess)) {
        resultMessage.textContent = "Hurrayyyyy!!!!!!"; // Success message
        resultMessage.classList.add('correct-message');
        resultMessage.classList.remove('wrong-message');
    } else {
        resultMessage.textContent = "Guess more!! There are many."; // Encourage more guesses
        resultMessage.classList.add('wrong-message');
        resultMessage.classList.remove('correct-message');
    }
    userInput.value = ""; // Clear the input field after submission
}

// Optionally: Detect a click outside to hide the swipebox
document.addEventListener('click', (e) => {
    if (!dynamicIsland.contains(e.target) && !swipebox.contains(e.target) && isSwipeboxVisible) {
        toggleSwipebox();
    }
});
