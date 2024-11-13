let brushSize = 5;
let brushColor = "#000000";
let brushOpacity = 1;
let brushHardness = 1;
let brushTexture = 0;
let brushType = "smooth";
const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");
const centerBox = document.querySelector(".center-box");

let isDrawing = false;
let lastX = 0;
let lastY = 0;


// History arrays for undo and redo functionality
let history = [];
let redoStack = [];

// Function to resize the canvas to match the center box size
function resizeCanvasToCenterBox() {
    canvas.width = centerBox.clientWidth;
    canvas.height = centerBox.clientHeight;
    redrawCanvas(); // Redraw the canvas when resized
}

// Call resize function initially and on window resize
resizeCanvasToCenterBox();
window.addEventListener("resize", resizeCanvasToCenterBox);

// Redraw existing drawings
function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (history.length > 0) {
        restoreState(history[history.length - 1]);
    }
}

// Save current canvas state to history
function saveState() {
    history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    if (history.length > 20) history.shift(); // Limit history stack to 20 states
    redoStack = []; // Clear redo stack on new action
}

// Restore a specific state from history or redo stack
function restoreState(state) {
    ctx.putImageData(state, 0, 0);
}

// Start drawing
function startDrawing(e) {
    isDrawing = true;
    const { offsetX, offsetY } = getEventPosition(e);
    [lastX, lastY] = [offsetX, offsetY];
    saveState(); // Save initial state at the start of drawing
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
    ctx.globalAlpha = brushOpacity;

// Apply different brush styles
if (brushType === "smooth") {
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
} else if (brushType === "hard") {
    ctx.lineCap = "butt";
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
} else if (brushType === "pastel") {
    ctx.globalAlpha = brushOpacity * 0.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
} else if (brushType === "acrylic") {
    ctx.lineCap = "round";
    ctx.lineJoin = "bevel";
    ctx.setLineDash([1, brushTexture * 5]);
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
    ctx.setLineDash([]); // Reset line dash after drawing
}
    [lastX, lastY] = [offsetX, offsetY];
}

// Undo last action
function undoAction() {
    if (history.length > 1) {
        redoStack.push(history.pop());
        restoreState(history[history.length - 1]);
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

// Redo last undone action
function redoAction() {
    if (redoStack.length > 0) {
        const redoState = redoStack.pop();
        history.push(redoState);
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

        // Event listeners for brush settings
        document.getElementById("brushSize").addEventListener("input", (e) => {
            brushSize = e.target.value;
        });
        document.getElementById("brushOpacity").addEventListener("input", (e) => {
            brushOpacity = e.target.value;
        });
        document.getElementById("brushHardness").addEventListener("input", (e) => {
            brushHardness = e.target.value;
            ctx.filter = `blur(${(1 - brushHardness) * 5}px)`;
        });
        document.getElementById("brushTexture").addEventListener("input", (e) => {
            brushTexture = e.target.value;
        });
        document.getElementById("brushColor").addEventListener("input", (e) => {
            brushColor = e.target.value;
        });
        document.getElementById("brushType").addEventListener("change", (e) => {
            brushType = e.target.value;
        });

// Toggle brush settings visibility
function toggleBrushSettings() {
    const brushSettings = document.getElementById("brushSettings");
    brushSettings.style.display = brushSettings.style.display === "none" ? "block" : "none";
}
