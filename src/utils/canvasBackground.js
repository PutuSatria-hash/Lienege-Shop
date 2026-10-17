// Animated Pixelated Halloween Atmosphere (Canvas 60 FPS)

export function initPixelCanvas(canvasElement) {
  if (!canvasElement) return () => {};

  const ctx = canvasElement.getContext('2d');
  let animationFrameId;
  let width = (canvasElement.width = window.innerWidth);
  let height = (canvasElement.height = window.innerHeight);

  const resize = () => {
    width = canvasElement.width = window.innerWidth;
    height = canvasElement.height = window.innerHeight;
  };
  window.addEventListener('resize', resize);

  // --- PARTICLES: Floating Halloween Embers & Enchanted Forest Fireflies ---
  const EMBER_COLORS = ['#ff7a18', '#ffa200', '#ffd166', '#a7f3d0', '#c77dff', '#70e000'];
  const embers = Array.from({ length: 55 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.floor(Math.random() * 3) + 2, // 2-4px square pixel
    speedY: -(Math.random() * 0.6 + 0.25),
    speedX: (Math.random() - 0.5) * 0.35,
    color: EMBER_COLORS[Math.floor(Math.random() * EMBER_COLORS.length)],
    alpha: Math.random() * 0.7 + 0.3,
    alphaStep: (Math.random() * 0.02 + 0.01) * (Math.random() > 0.5 ? 1 : -1)
  }));

  // --- ENCHANTED GOLDEN FIREFLIES ---
  const fireflies = Array.from({ length: 22 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    rad: Math.random() * 2 + 1.5,
    angle: Math.random() * Math.PI * 2,
    speedAngle: Math.random() * 0.02 + 0.01,
    glow: Math.random() * Math.PI * 2,
    glowSpeed: Math.random() * 0.04 + 0.02,
    color: Math.random() > 0.5 ? '#ffd166' : '#5eead4'
  }));

  // --- SHOOTING STARS ---
  let shootingStar = null;
  let nextStarTimer = Date.now() + 4000;

  // --- FLOATING PIXEL GHOSTS ---
  const ghosts = [
    { x: -50, y: height * 0.25, speedX: 0.5, bob: 0, bobSpeed: 0.028, scale: 2 },
    { x: -120, y: height * 0.65, speedX: 0.35, bob: Math.PI, bobSpeed: 0.02, scale: 1.5 }
  ];

  function drawPixelGhost(ctx, x, y, scale = 2) {
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.shadowColor = 'rgba(167, 243, 208, 0.6)';
    ctx.shadowBlur = 10;

    // Body 8x9 pixel pattern
    const pixels = [
      '..XXXX..',
      '.XXXXXX.',
      'XXXXXXXX',
      'XX.XX.XX', // eyes
      'XXXXXXXX',
      'XXXXXXXX',
      'XXXXXXXX',
      'X.X..X.X',
      'X......X'
    ];

    for (let r = 0; r < pixels.length; r++) {
      for (let c = 0; c < pixels[r].length; c++) {
        const char = pixels[r][c];
        if (char === 'X') {
          ctx.fillStyle = 'rgba(240, 245, 255, 0.85)';
          ctx.fillRect(Math.floor(x + c * scale), Math.floor(y + r * scale), scale, scale);
        } else if (char === '.') {
          if (r === 3 && (c === 2 || c === 5)) {
            ctx.fillStyle = '#11081f';
            ctx.fillRect(Math.floor(x + c * scale), Math.floor(y + r * scale), scale, scale);
          }
        }
      }
    }
    ctx.restore();
  }

  // --- RENDER LOOP ---
  function render() {
    ctx.clearRect(0, 0, width, height);

    // 1. Draw Embers
    for (const p of embers) {
      p.y += p.speedY;
      p.x += p.speedX;
      p.alpha += p.alphaStep;

      if (p.alpha > 0.95 || p.alpha < 0.2) {
        p.alphaStep = -p.alphaStep;
      }

      if (p.y < -10) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      ctx.save();
      ctx.globalAlpha = Math.max(0.1, Math.min(1, p.alpha));
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 6;
      ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
      ctx.restore();
    }

    // 2. Draw Enchanted Fireflies
    for (const f of fireflies) {
      f.angle += f.speedAngle;
      f.glow += f.glowSpeed;
      f.x += Math.cos(f.angle) * 0.8;
      f.y += Math.sin(f.angle) * 0.5 - 0.2;

      if (f.x < -20) f.x = width + 20;
      if (f.x > width + 20) f.x = -20;
      if (f.y < -20) f.y = height + 20;
      if (f.y > height + 20) f.y = -20;

      const alpha = Math.abs(Math.sin(f.glow)) * 0.75 + 0.25;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = f.color;
      ctx.shadowColor = f.color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.rad, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 3. Draw Shooting Star
    const now = Date.now();
    if (!shootingStar && now > nextStarTimer) {
      shootingStar = {
        x: Math.random() * (width * 0.7),
        y: Math.random() * (height * 0.3),
        length: Math.random() * 80 + 60,
        speedX: Math.random() * 12 + 10,
        speedY: Math.random() * 5 + 4,
        alpha: 1
      };
      nextStarTimer = now + Math.random() * 10000 + 7000;
    }

    if (shootingStar) {
      ctx.save();
      ctx.globalAlpha = shootingStar.alpha;
      ctx.strokeStyle = '#ffd166';
      ctx.shadowColor = '#ffd166';
      ctx.shadowBlur = 8;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(shootingStar.x, shootingStar.y);
      ctx.lineTo(shootingStar.x - shootingStar.length, shootingStar.y - shootingStar.length * 0.4);
      ctx.stroke();
      ctx.restore();

      shootingStar.x += shootingStar.speedX;
      shootingStar.y += shootingStar.speedY;
      shootingStar.alpha -= 0.035;

      if (shootingStar.alpha <= 0 || shootingStar.x > width + 100) {
        shootingStar = null;
      }
    }

    // 4. Draw Pixel Ghosts
    for (const g of ghosts) {
      g.x += g.speedX;
      g.bob += g.bobSpeed;
      const currentY = g.y + Math.sin(g.bob) * 12;

      drawPixelGhost(ctx, g.x, currentY, g.scale);

      if (g.x > width + 60) {
        g.x = -60;
        g.y = Math.random() * (height * 0.7) + 50;
      }
    }

    animationFrameId = requestAnimationFrame(render);
  }

  render();

  return () => {
    cancelAnimationFrame(animationFrameId);
    window.removeEventListener('resize', resize);
  };
}
