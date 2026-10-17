// Retro Pixel Click Sparkles (Micro-Interaction)

export function initClickSparkles() {
  const COLORS = ['#ffd166', '#ff7a18', '#5eead4', '#c084fc', '#ffffff'];

  window.addEventListener('pointerdown', (e) => {
    // Avoid creating particles if clicked inside input or textarea
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    const count = 7;
    for (let i = 0; i < count; i++) {
      createSparkle(e.clientX, e.clientY, COLORS[Math.floor(Math.random() * COLORS.length)]);
    }
  }, { passive: true });

  function createSparkle(originX, originY, color) {
    const sparkle = document.createElement('div');
    sparkle.className = 'pixel-sparkle-dot';
    
    const size = Math.floor(Math.random() * 3) + 3; // 3px to 5px pixel square
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 38 + 18;
    const destX = Math.cos(angle) * distance;
    const destY = Math.sin(angle) * distance - 8;

    sparkle.style.width = `${size}px`;
    sparkle.style.height = `${size}px`;
    sparkle.style.backgroundColor = color;
    sparkle.style.boxShadow = `0 0 6px ${color}`;
    sparkle.style.left = `${originX}px`;
    sparkle.style.top = `${originY}px`;
    sparkle.style.setProperty('--dx', `${destX}px`);
    sparkle.style.setProperty('--dy', `${destY}px`);

    document.body.appendChild(sparkle);

    setTimeout(() => {
      sparkle.remove();
    }, 550);
  }
}
