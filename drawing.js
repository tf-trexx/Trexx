// Brush settings
let brushSize = 5;
let brushColor = "#000000";

// Canvas setup
const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");

// Adjust canvas size to match center box size
function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}
resizeCanvas();

// Redraw canvas on resize to fit center box
window.addEventListener("resize", resizeCanvas);

// Drawing state
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Start drawing (for both mouse and touch)
function startDrawing(e) {
    isDrawing = true;
    const { offsetX, offsetY } = getEventPosition(e);
    [lastX, lastY] = [offsetX, offsetY];
}

// Stop drawing
function stopDrawing() {
    isDrawing = false;
    ctx.beginPath(); // Reset path for smoother lines
}

// Draw continuous line (for both mouse and touch)
function draw(e) {
    if (!isDrawing) return;
    const { offsetX, offsetY } = getEventPosition(e);

    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.strokeStyle = brushColor;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY); // Start from the last position
    ctx.lineTo(offsetX, offsetY); // Draw to the current position
    ctx.stroke();

    [lastX, lastY] = [offsetX, offsetY]; // Update last position
}

// Helper function to get the position for both mouse and touch events
function getEventPosition(e) {
    if (e.touches) {
        const rect = canvas.getBoundingClientRect();
        return {
            offsetX: e.touches[0].clientX - rect.left,
            offsetY: e.touches[0].clientY - rect.top
        };
    }
    return { offsetX: e.offsetX, offsetY: e.offsetY };
}

// Mouse events for drawing
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing);
canvas.addEventListener("mousemove", draw);

// Touch events for drawing
canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    startDrawing(e);
});
canvas.addEventListener("touchend", (e) => {
    e.preventDefault();
    stopDrawing(e);
});
canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    draw(e);
});

// Brush settings event listeners
document.getElementById("brushSize").addEventListener("input", (e) => {
    brushSize = e.target.value;
});
document.getElementById("brushColor").addEventListener("input", (e) => {
    brushColor = e.target.value;
});

// Toggle brush settings visibility
function toggleBrushSettings() {
    const brushSettings = document.getElementById("brushSettings");
    brushSettings.style.display = brushSettings.style.display === "none" ? "block" : "none";
}
