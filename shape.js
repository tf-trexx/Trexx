let isPlacingShape = false;
let selectedShape = "circle"; // Default shape
const shapeOverlay = document.getElementById("shapeOverlay");
const shapeSelection = document.getElementById("shapeSelection");
const shapeTypeSelect = document.getElementById("shapeType");

// Function to start shape placement
function startShapePlacement() {
    isPlacingShape = true;
    shapeOverlay.classList.remove("hidden");
    shapeSelection.classList.remove("hidden");
    initializeShapeOverlay();
}

// Initialize the shape overlay with a default size, shape, and position
function initializeShapeOverlay() {
    selectedShape = shapeTypeSelect.value;
    shapeOverlay.style.width = "100px"; // Default width
    shapeOverlay.style.height = "100px"; // Default height
    shapeOverlay.style.left = "50%";
    shapeOverlay.style.top = "50%";
    shapeOverlay.style.transform = "translate(-50%, -50%)";
    shapeOverlay.style.borderRadius = selectedShape === "circle" ? "50%" : "0";
    shapeOverlay.setAttribute("data-shape", selectedShape);
}

// Update shape overlay when the shape type is changed
shapeTypeSelect.addEventListener("change", () => {
    selectedShape = shapeTypeSelect.value;
    shapeOverlay.style.borderRadius = selectedShape === "circle" ? "50%" : "0";
});

// Finalize the shape and draw it on the canvas
function finalizeShape() {
    const rect = shapeOverlay.getBoundingClientRect();
    const canvasRect = drawingCanvas.getBoundingClientRect();
    const x = rect.left - canvasRect.left;
    const y = rect.top - canvasRect.top;
    const width = rect.width;
    const height = rect.height;

    drawShape(x, y, width, height, selectedShape);
    shapeOverlay.classList.add("hidden");
    shapeSelection.classList.add("hidden");
    isPlacingShape = false;
}

// Draw the shape on the canvas
function drawShape(x, y, width, height, shape) {
    const ctx = drawingCanvas.getContext("2d");
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#000"; // Shape outline color

    switch (shape) {
        case "circle":
            ctx.arc(x + width / 2, y + height / 2, width / 2, 0, Math.PI * 2);
            break;
        case "square":
            ctx.rect(x, y, width, height);
            break;
        case "triangle":
            ctx.moveTo(x + width / 2, y);
            ctx.lineTo(x, y + height);
            ctx.lineTo(x + width, y + height);
            ctx.closePath();
            break;
        case "star":
            drawStar(ctx, x + width / 2, y + height / 2, width / 2, width / 4, 5); // Star shape
            break;
    }

    ctx.stroke();
}

// Draw star helper function
function drawStar(ctx, cx, cy, outerRadius, innerRadius, points) {
    const step = Math.PI / points;
    ctx.beginPath();
    for (let i = 0; i < 2 * points; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const x = cx + radius * Math.cos(i * step);
        const y = cy - radius * Math.sin(i * step);
        ctx.lineTo(x, y);
    }
    ctx.closePath();
}

// Event listener to make shape overlay draggable, resizable, and rotatable
shapeOverlay.addEventListener("mousedown", (e) => {
    let startX = e.clientX;
    let startY = e.clientY;
    let initialWidth = shapeOverlay.offsetWidth;
    let initialHeight = shapeOverlay.offsetHeight;

    function onMouseMove(event) {
        if (e.shiftKey) {
            // Rotate the shape if Shift key is held
            const angle = Math.atan2(event.clientY - startY, event.clientX - startX) * (180 / Math.PI);
            shapeOverlay.style.transform = `rotate(${angle}deg) translate(-50%, -50%)`;
        } else {
            // Resize the shape
            const dx = event.clientX - startX;
            const dy = event.clientY - startY;
            shapeOverlay.style.width = `${initialWidth + dx}px`;
            shapeOverlay.style.height = `${initialHeight + dy}px`;
        }
    }

    function onMouseUp() {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
});

// Click event on the overlay to finalize the shape placement
shapeOverlay.addEventListener("dblclick", finalizeShape);