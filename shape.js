let isPlacingShape = false;
let selectedShape = "circle";  // Default shape
const shapeOverlay = document.getElementById("shapeOverlay");
const shapeSelection = document.getElementById("shapeSelection");
const shapeTypeSelect = document.getElementById("shapeType");

let isTransforming = false;
let isLockedRatio = true;
let rotationAngle = 0;

// Function to show shape selection tray
function startShapePlacement() {
    isPlacingShape = true;
    shapeOverlay.classList.remove("hidden");
    shapeSelection.classList.remove("hidden");
    initializeShapeOverlay();
}

// Initialize shape overlay with default settings
function initializeShapeOverlay() {
    selectedShape = shapeTypeSelect.value;
    shapeOverlay.style.width = "100px"; // Default width
    shapeOverlay.style.height = "100px"; // Default height
    shapeOverlay.style.left = "50%";
    shapeOverlay.style.top = "50%";
    shapeOverlay.style.transform = "translate(-50%, -50%) rotate(0deg)";
    shapeOverlay.style.borderRadius = selectedShape === "circle" ? "50%" : "0";
    shapeOverlay.setAttribute("data-shape", selectedShape);
    rotationAngle = 0;
}

// Update shape overlay appearance on shape type change
shapeTypeSelect.addEventListener("change", () => {
    selectedShape = shapeTypeSelect.value;
    shapeOverlay.style.borderRadius = selectedShape === "circle" ? "50%" : "0";
});

// Finalize the shape placement and draw it on canvas
function finalizeShape() {
    const rect = shapeOverlay.getBoundingClientRect();
    const canvasRect = drawingCanvas.getBoundingClientRect();
    const x = rect.left - canvasRect.left;
    const y = rect.top - canvasRect.top;
    const width = rect.width;
    const height = rect.height;

    drawShape(x, y, width, height, selectedShape, rotationAngle);
    shapeOverlay.classList.add("hidden");
    shapeSelection.classList.add("hidden");
    isPlacingShape = false;
    isTransforming = false;
}

// Draw the selected shape on the canvas
function drawShape(x, y, width, height, shape, angle) {
    const ctx = drawingCanvas.getContext("2d");
    ctx.save();
    ctx.translate(x + width / 2, y + height / 2);
    ctx.rotate(angle * (Math.PI / 180));
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#000";

    switch (shape) {
        case "circle":
            ctx.arc(0, 0, width / 2, 0, Math.PI * 2);
            break;
        case "square":
            ctx.rect(-width / 2, -height / 2, width, height);
            break;
        case "triangle":
            ctx.moveTo(0, -height / 2);
            ctx.lineTo(-width / 2, height / 2);
            ctx.lineTo(width / 2, height / 2);
            ctx.closePath();
            break;
        case "star":
            drawStar(ctx, 0, 0, width / 2, width / 4, 5);
            break;
    }

    ctx.stroke();
    ctx.restore();
}

// Helper function to draw a star shape
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

// Toggle between locked and free transform mode
shapeOverlay.addEventListener("dblclick", () => {
    isLockedRatio = !isLockedRatio;
});

// Event listeners for shape overlay drag, resize, and rotate
shapeOverlay.addEventListener("mousedown", (e) => {
    let startX = e.clientX;
    let startY = e.clientY;
    let initialWidth = shapeOverlay.offsetWidth;
    let initialHeight = shapeOverlay.offsetHeight;

    function onMouseMove(event) {
        const dx = event.clientX - startX;
        const dy = event.clientY - startY;

        if (e.shiftKey) {
            // Rotate shape when Shift key is held
            const angle = Math.atan2(event.clientY - startY, event.clientX - startX) * (180 / Math.PI);
            rotationAngle += angle / 20;  // Adjust rotation sensitivity if needed
            shapeOverlay.style.transform = `rotate(${rotationAngle}deg) translate(-50%, -50%)`;
        } else if (isLockedRatio) {
            // Resize with locked ratio
            const newSize = Math.max(initialWidth + dx, initialHeight + dy);
            shapeOverlay.style.width = `${newSize}px`;
            shapeOverlay.style.height = `${newSize}px`;
        } else {
            // Free resizing
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

// Handle shape transformations with keys
window.addEventListener("keydown", (e) => {
    if (!isTransforming) return;

    if (e.key === "a") {
        rotationAngle -= 5;  // Rotate counterclockwise
    } else if (e.key === "d") {
        rotationAngle += 5;  // Rotate clockwise
    }
    shapeOverlay.style.transform = `rotate(${rotationAngle}deg) translate(-50%, -50%)`;
});

// Activate transformation on long press (mobile) and show resize handles
shapeOverlay.addEventListener("touchstart", (e) => {
    e.preventDefault();
    let touchTimeout = setTimeout(() => {
        isTransforming = true;
        shapeOverlay.classList.add("transform-active");  // CSS class for showing resize/rotate handles
    }, 500);  // 500ms to detect long press

    shapeOverlay.addEventListener("touchend", () => {
        clearTimeout(touchTimeout);
    });
});

// Exit transformation mode when clicking outside the shape
document.addEventListener("click", (e) => {
    if (e.target !== shapeOverlay && !shapeOverlay.contains(e.target)) {
        isTransforming = false;
        shapeOverlay.classList.remove("transform-active");
    }
});

// Display shape selection tray with mobile and desktop support
function displayShapeSelectionTray() {
    shapeSelection.style.display = "flex";
    shapeSelection.classList.toggle("open", !shapeSelection.classList.contains("open"));
}

// Attach the shape selection toggle to an icon or button
document.querySelector('.icon-draw .draw:nth-child(2)').addEventListener("click", () => {
    displayShapeSelectionTray();
});
