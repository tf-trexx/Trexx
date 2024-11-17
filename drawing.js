let brushSize = 5;
let brushColor = "#000000";
let brushOpacity = 1;
let brushHardness = 1;
let brushTexture = 0;
let brushType = "smooth";
let isDrawing = false;

const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");
const centerBox = document.querySelector(".center-box");

let history = [];
let redoStack = [];
let drawingModeActive = false;  // Toggle drawing mode

// Function to initialize and resize the canvas
function initializeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = centerBox.clientWidth * dpr;
    canvas.height = centerBox.clientHeight * dpr;
    ctx.scale(dpr, dpr);
    ctx.lineCap = "round";
    ctx.lineWidth = brushSize;
    redrawCanvas();
}

// Redraw existing drawings
function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (history.length > 0) {
        restoreState(history[history.length - 1]);
    }
}

// Save current canvas state
function saveState() {
    history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    if (history.length > 20) history.shift();
    redoStack = [];
}

// Restore a specific state from history or redo stack
function restoreState(state) {
    ctx.putImageData(state, 0, 0);
}

// Function to start drawing
function startDrawing(e) {
    if (!drawingModeActive) return;
    e.preventDefault();
    isDrawing = true;
    const { offsetX, offsetY } = getEventPosition(e);
    [lastX, lastY] = [offsetX, offsetY];
    saveState();
}

// Function to draw continuous line
function draw(e) {
    if (!isDrawing || !drawingModeActive) return;
    e.preventDefault();
    const { offsetX, offsetY } = getEventPosition(e);

    ctx.lineWidth = brushSize;
    ctx.strokeStyle = brushColor;
    ctx.globalAlpha = brushOpacity;
    ctx.lineCap = brushType === "smooth" ? "round" : "butt";

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();

    [lastX, lastY] = [offsetX, offsetY];
}

// Function to stop drawing
function stopDrawing(e) {
    if (!isDrawing) return;
    e.preventDefault();
    isDrawing = false;
    ctx.beginPath();
}

// Undo the last action
function undoAction() {
    if (history.length > 1) {
        redoStack.push(history.pop());
        restoreState(history[history.length - 1]);
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

// Redo the last undone action
function redoAction() {
    if (redoStack.length > 0) {
        const redoState = redoStack.pop();
        history.push(redoState);
        restoreState(redoState);
    }
}

// Get event position for both mouse and touch
function getEventPosition(e) {
    const rect = canvas.getBoundingClientRect();
    return e.touches ? 
        { offsetX: e.touches[0].clientX - rect.left, offsetY: e.touches[0].clientY - rect.top } : 
        { offsetX: e.clientX - rect.left, offsetY: e.clientY - rect.top };
}

// Toggle the drawing mode
function toggleDrawingMode() {
    drawingModeActive = !drawingModeActive;
    canvas.style.display = drawingModeActive ? "block" : "none";
    if (drawingModeActive) initializeCanvas();
}

// Toggle brush settings panel
function toggleBrushSettings() {
    const brushSettings = document.getElementById("brushSettings");
    brushSettings.style.display = brushSettings.style.display === "none" ? "block" : "none";
}

// Event listeners
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing);
canvas.addEventListener("mousemove", draw);

canvas.addEventListener("touchstart", startDrawing);
canvas.addEventListener("touchend", stopDrawing);
canvas.addEventListener("touchmove", draw);

// Brush settings event listeners
document.getElementById("brushSize").addEventListener("input", (e) => { brushSize = e.target.value; });
document.getElementById("brushOpacity").addEventListener("input", (e) => { brushOpacity = e.target.value; });
document.getElementById("brushHardness").addEventListener("input", (e) => {
    brushHardness = e.target.value;
    ctx.filter = `blur(${(1 - brushHardness) * 5}px)`;
});
document.getElementById("brushTexture").addEventListener("input", (e) => { brushTexture = e.target.value; });
document.getElementById("brushColor").addEventListener("input", (e) => { brushColor = e.target.value; });

// Attach event to open drawing mode on `img2.png` click
document.querySelector('.icon-tray .icon:nth-child(2)').addEventListener("click", () => {
    toggleDrawingMode();
});
