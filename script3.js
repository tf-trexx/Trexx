const dynamicIsland = document.querySelector('.dynamic-island');
const swipebox = document.querySelector('.swipebox');
const userInput = document.getElementById('userGuess');
const submitButton = document.getElementById('submitGuess');
const resultMessage = document.getElementById('resultMessage'); // Element to show the result message
const usernameInput = document.getElementById('username');
const usernameSubmitButton = document.getElementById('submitUsername');
let isSwipeboxVisible = false; // To track if the Swipebox is visible
emailjs.init("snp_KBNFtDuyaue8S"); // Replace with your public key


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

// EmailJS configuration
const emailConfig = {
    serviceID: 'service_c5d3cvv',
    templateID: 'template_3yh1pmi',
    userID: 'snp_KBNFtDuyaue8S'
};

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

// Handle Swipebox functionality
dynamicIsland.addEventListener('mousedown', (e) => {
    if (![userInput, submitButton, usernameInput, usernameSubmitButton].includes(e.target)) {
        toggleSwipebox();
    }
});

// Prevent Swipebox from closing on input fields and buttons
[userInput, submitButton, usernameInput, usernameSubmitButton].forEach((element) => {
    element.addEventListener('click', (e) => e.stopPropagation());
    element.addEventListener('touchstart', (e) => e.stopPropagation());
});

// Store username in local storage
usernameSubmitButton.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent closing the swipebox
    const username = usernameInput.value.trim();
    if (username) {
        localStorage.setItem('username', username); // Store username
        usernameInput.value = ""; // Clear username input
        alert(`Welcome, ${username}!`);
    }
});


submitButton.addEventListener('click', (e) => {
    e.stopPropagation();
    checkGuess(); // Call the guessing function when the button is clicked
});

// Handle Swipebox functionality
dynamicIsland.addEventListener('touchstart', (e) => {
    if (![userInput, submitButton, usernameInput, usernameSubmitButton].includes(e.target)) {
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
    const username = localStorage.getItem('username') || "Guest"; // Retrieve stored username
    if (correctWords.includes(userGuess)) {
        resultMessage.textContent = "Hurrayyyyy!!!!!!"; // Success message
        resultMessage.classList.add('correct-message');
        resultMessage.classList.remove('wrong-message');
        // Send Email Notification via EmailJS
        sendEmail(username, userGuess);
    } else {
        resultMessage.textContent = "Guess more!! There are many."; // Encourage more guesses
        resultMessage.classList.add('wrong-message');
        resultMessage.classList.remove('correct-message');
    }
    userInput.value = ""; // Clear the input field after submission
}

// Email sending function using EmailJS
function sendEmail(username, guess) {
    emailjs.send(emailConfig.serviceID, emailConfig.templateID, {
        user_name: username,
        guessed_word: guess,
    }, emailConfig.userID)
    .then(response => {
        console.log('Email sent successfully:', response);
    })
    .catch(error => {
        console.error('Error sending email:', error);
    });
}

// Optionally: Detect a click outside to hide the swipebox
document.addEventListener('click', (e) => {
    if (!dynamicIsland.contains(e.target) && !swipebox.contains(e.target) && isSwipeboxVisible) {
        toggleSwipebox();
    }
});
