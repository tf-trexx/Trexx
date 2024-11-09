// Function to open the modal for Feature 1
function openFeature() {
    const modal = document.getElementById("featureBox");
    modal.style.display = "flex";
    
    // Close the modal when clicking outside of the modal content
    modal.addEventListener("click", function(event) {
        if (event.target === modal) {
            closeFeature();
        }
    });
}

// Function to close the modal
function closeFeature() {
    document.getElementById("featureBox").style.display = "none";
}