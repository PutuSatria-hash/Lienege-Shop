// Dual-Buffer Ambient Scenery Manager (Seamless 60fps A/B Crossfade)

let activeLayerId = 'a';
let currentImage = '';

export function initScenery() {
  const layerA = document.getElementById('scenery-layer-a');
  const layerB = document.getElementById('scenery-layer-b');
  if (!layerA || !layerB) return;

  // Initialize with the first lush landscape
  setScenery('/banner-forest-canopy.png');

  // Listen for scenery change events triggered by carousel or user interactions
  window.addEventListener('pl_scenery_sync', (e) => {
    if (e.detail && e.detail.image) {
      setScenery(e.detail.image);
    }
  });
}

export function setScenery(imageUrl) {
  if (currentImage === imageUrl) return;
  currentImage = imageUrl;

  const layerA = document.getElementById('scenery-layer-a');
  const layerB = document.getElementById('scenery-layer-b');
  if (!layerA || !layerB) return;

  const targetLayer = activeLayerId === 'a' ? layerB : layerA;
  const currentActive = activeLayerId === 'a' ? layerA : layerB;

  // Set new scenery on the incoming layer and crossfade smoothly
  targetLayer.style.backgroundImage = `url("${imageUrl}")`;
  targetLayer.classList.add('active');
  currentActive.classList.remove('active');

  // Toggle active layer pointer
  activeLayerId = activeLayerId === 'a' ? 'b' : 'a';
}
