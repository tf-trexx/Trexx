const buttons = document.querySelectorAll('.grid-item');
const tooltip = document.getElementById('tooltip');
let isMobile = window.matchMedia("(max-width: 768px)").matches; // Simple check for mobile

buttons.forEach(button => {
    // For Desktop - Mouse Hover (mouseenter and mouseleave)
    if (!isMobile) {
        button.addEventListener('mouseenter', (e) => {
            showTooltip(e, button);
            activateBlur(); // Activate blur on hover
        });

        button.addEventListener('mouseleave', () => {
            // Check if the tooltip is visible
            if (!tooltip.matches(':hover')) {
                hideTooltip();
                deactivateBlur(); // Deactivate blur only if not hovering over tooltip
            }
        });
    }

    // For Mobile - Long press (touchstart and touchend)
    if (isMobile) {
        let pressTimer;

        button.addEventListener('touchstart', (e) => {
            pressTimer = setTimeout(() => {
                showTooltip(e, button);
                activateBlur(); // Activate blur on press
            }, 1000);
        });

        button.addEventListener('touchend', () => {
            clearTimeout(pressTimer);
            // Hide tooltip but keep blur if the tooltip is hovered
            if (!tooltip.matches(':hover')) {
                hideTooltip();
                deactivateBlur(); // Deactivate blur when touch ends
            }
        });
    }
});

// Hide tooltip if mouse enters tooltip area
tooltip.addEventListener('mouseenter', () => {
    tooltip.style.transform = 'scale(1)'; // Keep it visible
});

// Hide tooltip and deactivate blur if mouse leaves tooltip area
tooltip.addEventListener('mouseleave', () => {
    hideTooltip();
    deactivateBlur(); // Deactivate blur when mouse leaves
});

// Function to show tooltip
function showTooltip(e, button) {
    tooltip.innerHTML = button.getAttribute('data-info'); // Set tooltip content using innerHTML
    tooltip.style.display = 'flex'; // Show tooltip

     // For mobile, center the tooltip
     if (isMobile) {
        tooltip.style.left = '50%';
        tooltip.style.top = '50%';
        tooltip.style.transform = 'translate(-50%, -50%) scale(1)'; // Center the tooltip and scale up
        tooltip.style.opacity = '1'; // Fade in
    } else {

    // For mouse/cursor events, use clientX and clientY
    let x = e.clientX || e.touches[0].clientX; // Handle both mouse and touch
    let y = e.clientY || e.touches[0].clientY;

    tooltip.style.left = `${Math.min(x + 10, window.innerWidth - 410)}px`; // Adjust position
    tooltip.style.top = `${Math.min(y + 10, window.innerHeight - 410)}px`;
    tooltip.style.transform = 'scale(1)'; // Scale up to show
    }
}

// Function to hide tooltip
function hideTooltip() {
    if (isMobile) {
        tooltip.style.transform = 'translate(-50%, -50%) scale(0)'; // Scale down smoothly
        tooltip.style.opacity = '0'; // Fade out
        setTimeout(() => {
            tooltip.style.display = 'none'; // After the animation ends, hide it completely
        }, 500); // Match this time with the transition duration (0.5s)
    } else {
    tooltip.style.transform = 'scale(0)'; // Scale down to hide
}
}
// Activate blur function
function activateBlur() {
    document.body.classList.add('blur-active'); // Add blur-active class
}

// Deactivate blur function
function deactivateBlur() {
    document.body.classList.remove('blur-active'); // Remove blur-active class
}
