let brushSize = 5;
let brushColor = "#000000";
const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");
const centerBox = document.querySelector(".center-box");

// History arrays for undo and redo functionality
let history = [];
let redoStack = [];

// Function to resize the canvas to match the center box size
function resizeCanvasToCenterBox() {
    // Get the dimensions of the center box
    const boxWidth = centerBox.clientWidth;
    const boxHeight = centerBox.clientHeight;

    // Set the canvas width and height to match the center box
    canvas.width = boxWidth;
    canvas.height = boxHeight;

    // Redraw or adjust canvas contents here if needed
}

// Call resize function initially and on window resize
resizeCanvasToCenterBox();
window.addEventListener("resize", resizeCanvasToCenterBox);

// Redraw existing drawings (optional - for when resizing dynamically with saved history)
function redrawCanvas() {
    if (history.length > 0) {
        restoreState(history[history.length - 1]);
    }
}

// Re-run resizeCanvasToCenterBox() whenever the center box dimensions change dynamically
new ResizeObserver(resizeCanvasToCenterBox).observe(centerBox);

// Start drawing
function startDrawing(e) {
    isDrawing = true;
    const { offsetX, offsetY } = getEventPosition(e);
    [lastX, lastY] = [offsetX, offsetY];
    saveState(); // Save state on new action
}

// Stop drawing
function stopDrawing() {
    isDrawing = false;
    ctx.beginPath();
}

// Draw continuous line
function draw(e) {
    if (!isDrawing) return;
    const { offsetX, offsetY } = getEventPosition(e);

    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.strokeStyle = brushColor;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();

    [lastX, lastY] = [offsetX, offsetY];
}

// Undo last action
function undoAction() {
    if (history.length > 0) {
        redoStack.push(history.pop()); // Move last state to redo stack
        if (history.length > 0) {
            restoreState(history[history.length - 1]);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas if no more history
        }
    }
}

// Redo last undone action
function redoAction() {
    if (redoStack.length > 0) {
        const redoState = redoStack.pop();
        history.push(redoState); // Add back to history
        restoreState(redoState);
    }
}

// Helper function for getting event position for both mouse and touch
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
