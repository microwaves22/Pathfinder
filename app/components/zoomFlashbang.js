// Wait 2 seconds, then trigger zoom + flashbang
function zoomFlashbang() {
  // Step 1: Zoom camera to level 4
  if (typeof camera !== "undefined" && camera.zoom !== undefined) {
    camera.zoom = 4; // Adjust depending on your 3D/2D camera API
    if (camera.updateProjectionMatrix) camera.updateProjectionMatrix();
  }

  // Step 2: Flashbang effect
  const flash = document.createElement("div");
  flash.style.position = "fixed";
  flash.style.top = 0;
  flash.style.left = 0;
  flash.style.width = "100%";
  flash.style.height = "100%";
  flash.style.backgroundColor = "white";
  flash.style.opacity = "0";
  flash.style.pointerEvents = "none";
  flash.style.transition = "opacity 0.1s ease-out";
  document.body.appendChild(flash);

  // Trigger flash
  setTimeout(() => {
    flash.style.opacity = "1";
    // Fade out quickly
    setTimeout(() => {
      flash.style.opacity = "0";
      // Remove from DOM
      setTimeout(() => document.body.removeChild(flash), 100);
    }, 100); // flash duration
  }, 50);
}

// Wait 2 seconds before triggering
setTimeout(zoomFlashbang, 2000);
