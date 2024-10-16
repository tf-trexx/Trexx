const slidingBox = document.getElementById('slidingBox');
let isSwiped = false; // To track if the box is swiped in

// Variables to handle dragging
let isDragging = false;
let startX = 0;
let currentX = 0;
let boxX = 0;

function handleSwipe() {
    if (!isSwiped) {
        slidingBox.classList.add('show-box'); // Slide in
        isSwiped = true;
    } else {
        slidingBox.classList.remove('show-box'); // Slide out
        isSwiped = false;
    }
}
// Mouse swipe handling
slidingBox.addEventListener('mousedown', (e) => {
    startX = e.clientX;
    isDragging = true;
});

document.addEventListener('mouseup', (e) => {
    if (!isDragging) return;

    endX = e.clientX;
    if (startX - endX > 50) { // Swiping left
        handleSwipe();
    } else if (endX - startX > 50) { // Swiping right
        handleSwipe();
    }
    isDragging = false;
});

// Detect mouse position near the left edge
document.addEventListener('mousemove', (e) => {
    if (isSwiped && e.clientX < 50) { // Check if mouse is near the left edge
        resetBox(); // Slide out to initial position
    }
});

// Touch swipe handling for mobile
slidingBox.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
});

slidingBox.addEventListener('touchend', (e) => {
    endX = e.changedTouches[0].clientX;
    if (startX - endX > 50) { // Swiping left
        handleSwipe();
    } else if (endX - startX > 50) { // Swiping right
        handleSwipe();
    }
});
