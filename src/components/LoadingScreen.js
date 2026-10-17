// 8-bit Loading Screen Component (100% English)

export function initLoadingScreen(onComplete) {
  const loadingEl = document.createElement('div');
  loadingEl.className = 'loading-screen';
  loadingEl.id = 'loading-screen';

  loadingEl.innerHTML = `
    <div class="loading-pumpkin">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="64" height="64" shape-rendering="crispEdges">
        <rect width="32" height="32" fill="none"/>
        <rect x="14" y="2" width="4" height="4" fill="#388e3c"/>
        <rect x="6" y="6" width="20" height="20" fill="#ff7a18"/>
        <rect x="8" y="8" width="16" height="16" fill="#ff9e00"/>
        <rect x="10" y="11" width="4" height="4" fill="#140924"/>
        <rect x="18" y="11" width="4" height="4" fill="#140924"/>
        <rect x="12" y="17" width="8" height="4" fill="#140924"/>
        <rect x="14" y="19" width="4" height="2" fill="#ff3d00"/>
      </svg>
    </div>
    <div class="loading-title font-pixel">PIXEL LINEAGE • WISEMAN SHOP</div>
    <div class="loading-sub font-silkscreen">LOADING INVENTORY ASSETS... <span id="loading-pct">0%</span></div>
    <div class="loading-bar-wrap">
      <div class="loading-bar-fill" id="loading-fill"></div>
    </div>
  `;

  document.body.appendChild(loadingEl);

  const fill = document.getElementById('loading-fill');
  const pct = document.getElementById('loading-pct');
  let progress = 0;

  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 22) + 14;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      fill.style.width = '100%';
      pct.textContent = '100%';

      setTimeout(() => {
        loadingEl.classList.add('fade-out');
        setTimeout(() => {
          loadingEl.remove();
          if (onComplete) onComplete();
        }, 500);
      }, 400);
    } else {
      fill.style.width = `${progress}%`;
      pct.textContent = `${progress}%`;
    }
  }, 90);
}
