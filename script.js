const buttons = document.querySelectorAll('.grid-item');
const tooltip = document.getElementById('tooltip');
let isMobile = window.matchMedia("(max-width: 768px)").matches; // Simple check for mobile

buttons.forEach(button => {
    // For Desktop - Mouse Hover (mouseenter and mouseleave)
    if (!isMobile) {
        button.addEventListener('mouseenter', (e) => {
            showTooltip(e, button);
        });

        button.addEventListener('mouseleave', () => {
            hideTooltip();
        });
    }

    // For Mobile - Long press (touchstart and touchend)
    if (isMobile) {
        let pressTimer;

        button.addEventListener('touchstart', (e) => {
            // Set a timer for long press (1 second)
            pressTimer = setTimeout(() => showTooltip(e, button), 1000);
        });

        button.addEventListener('touchend', () => {
            clearTimeout(pressTimer); // Clear the timer if touch ends early
            hideTooltip();
        });
    }
});

// Hide tooltip if mouse leaves tooltip area
tooltip.addEventListener('mouseenter', () => {
    tooltip.style.transform = 'scale(1)'; // Keep it visible
});

tooltip.addEventListener('mouseleave', () => {
    tooltip.style.transform = 'scale(0)'; // Hide when mouse leaves
}); 

// Function to show tooltip
function showTooltip(e, button) {
    tooltip.innerHTML = button.getAttribute('data-info'); // Set tooltip content using innerHTML
    tooltip.style.display = 'flex'; // Show tooltip

    // For mouse/cursor events, use clientX and clientY
    let x = e.clientX || e.touches[0].clientX; // Handle both mouse and touch
    let y = e.clientY || e.touches[0].clientY;

    tooltip.style.left = `${Math.min(x + 10, window.innerWidth - 410)}px`; // Adjust position
    tooltip.style.top = `${Math.min(y + 10, window.innerHeight - 410)}px`;
    tooltip.style.transform = 'scale(1)'; // Scale up to show
}

// Function to hide tooltip
function hideTooltip() {
    tooltip.style.transform = 'scale(0)'; // Scale down to hide
}
