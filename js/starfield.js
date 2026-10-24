/* ------------------------------------------------------------------
   Background: a revolving 3D star field, on every page.

   A few thousand stars are scattered uniformly through a unit sphere
   and drawn with a real perspective projection from a camera sitting
   just outside it. The sphere turns on its own — slowly — and the
   pointer steers it: how far the cursor sits from the centre of the
   window sets the field's angular velocity, so drifting the mouse to
   an edge sends the whole sky wheeling that way and returning to the
   middle settles it back to its idle drift.

   The cursor's own effect is a gravitational lens rather than the old
   blurred glow: stars falling inside its radius are swept around the
   pointer and pushed outward, brightening as they go, with the closest
   ones throwing diffraction spikes. It reads as a lens of warped
   space-time gliding over the sky — the same physics the rest of the
   backdrop is pretending to obey.

   Purely decorative: fixed behind all content, pointer-events off,
   and it degrades to a still sky under prefers-reduced-motion.
------------------------------------------------------------------- */

(function () {
  const canvas = document.getElementById("space-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------------- palette: mostly starlight, a minority tinted to the site's purple ---------------- */
  const COLORS = [
    [237, 233, 247], // starlight white
    [208, 163, 255], // purple-light
    [168, 85, 247],  // purple
    [232, 121, 249], // hot magenta
  ];
  const COLOR_CUTS = [0.56, 0.80, 0.93]; // weights: 56% / 24% / 13% / 7%

  function pickColor() {
    const r = Math.random();
    for (let i = 0; i < COLOR_CUTS.length; i++) if (r < COLOR_CUTS[i]) return i;
    return COLORS.length - 1;
  }

  // one pre-rendered glow sprite per colour — a crisp core with a short
  // halo, so a star is a single drawImage instead of a gradient per frame
  const sprites = COLORS.map((rgb) => {
    const S = 32;
    const c = document.createElement("canvas");
    c.width = c.height = S;
    const g = c.getContext("2d");
    const key = rgb.join(",");
    const grad = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
    grad.addColorStop(0, `rgba(${key},1)`);
    grad.addColorStop(0.12, `rgba(${key},0.82)`);
    grad.addColorStop(0.28, `rgba(${key},0.14)`);
    grad.addColorStop(1, `rgba(${key},0)`);
    g.fillStyle = grad;
    g.fillRect(0, 0, S, S);
    return c;
  });

  /* ---------------- the sky ---------------- */
  // camera distance from the centre of the unit sphere: everything lands
  // between z = 0.42 and z = 2.42, so nothing ever crosses the lens plane
  const CAM = 1.42;
  const NEAR = CAM - 1;
  const DEPTH = 2;

  let stars = [];
  function buildStars() {
    const area = window.innerWidth * window.innerHeight;
    const count = Math.round(Math.max(600, Math.min(2200, area / 800)));
    stars = new Array(count);
    for (let i = 0; i < count; i++) {
      // rejection-sample the cube down to a sphere: uniform by volume, so
      // the sky has no denser corners to give the shape away
      let x, y, z, l;
      do {
        x = Math.random() * 2 - 1;
        y = Math.random() * 2 - 1;
        z = Math.random() * 2 - 1;
        l = x * x + y * y + z * z;
      } while (l > 1 || l < 1e-4);
      stars[i] = {
        x, y, z,
        c: pickColor(),
        size: 0.0011 + Math.random() * 0.0017,
        bright: 0.5 + Math.random() * 0.5,
        twPhase: Math.random() * Math.PI * 2,
        twSpeed: 0.5 + Math.random() * 1.7,
      };
    }
  }

  /* ---------------- canvas sizing ---------------- */
  let dpr = 1, vw = 0, vh = 0, halfW = 0, halfH = 0, focal = 0;
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    vw = window.innerWidth;
    vh = window.innerHeight;
    canvas.width = Math.round(vw * dpr);
    canvas.height = Math.round(vh * dpr);
    halfW = vw / 2;
    halfH = vh / 2;
    focal = Math.max(vw, vh) * 0.45;
  }
  resize();
  buildStars();

  let resizeTimer = 0;
  window.addEventListener("resize", () => {
    resize();
    clearTimeout(resizeTimer);
    // restock only once the drag has settled — rebuilding mid-resize would
    // reshuffle the whole sky on every frame of a window drag
    resizeTimer = setTimeout(() => {
      buildStars();
      if (reduceMotion) drawFrame(0, 0);
    }, 240);
    if (reduceMotion) drawFrame(0, 0);
  });

  /* ---------------- rotation: idle drift + pointer-steered angular velocity ---------------- */
  const DRIFT_YAW = 0.020;   // rad/s
  const DRIFT_PITCH = 0.008;
  const STEER_YAW = 0.34;    // rad/s at the very edge of the window
  const STEER_PITCH = 0.20;

  let yaw = 0.4, pitch = -0.1;
  let yawVel = 0, pitchVel = 0;
  let targetYawVel = 0, targetPitchVel = 0;

  /* ---------------- the lens ---------------- */
  const LENS_R = 250;
  let pointerX = 0, pointerY = 0;       // raw
  let lensX = 0, lensY = 0;             // eased, this is what's drawn
  let lensAmt = 0, lensTarget = 0;      // 0 = no lens at all

  if (!reduceMotion && finePointer) {
    lensX = pointerX = window.innerWidth / 2;
    lensY = pointerY = window.innerHeight / 2;

    window.addEventListener("mousemove", (e) => {
      pointerX = e.clientX;
      pointerY = e.clientY;
      lensTarget = 1;
      const nx = (e.clientX / vw) * 2 - 1;
      const ny = (e.clientY / vh) * 2 - 1;
      targetYawVel = nx * STEER_YAW;
      targetPitchVel = -ny * STEER_PITCH;
    }, { passive: true });

    // pointer gone: the lens closes and the sky eases back to its idle drift
    document.addEventListener("mouseleave", () => {
      lensTarget = 0;
      targetYawVel = 0;
      targetPitchVel = 0;
    });
    window.addEventListener("blur", () => {
      lensTarget = 0;
      targetYawVel = 0;
      targetPitchVel = 0;
    });
  }

  /* ---------------- scroll: the sky keeps turning as the page moves ---------------- */
  let scrollYaw = 0;
  if (!reduceMotion) {
    window.addEventListener("scroll", () => {
      scrollYaw = window.scrollY * 0.00016;
    }, { passive: true });
  }

  /* ---------------- draw ---------------- */
  function drawFrame(t, dt) {
    if (!reduceMotion) {
      yawVel += (targetYawVel - yawVel) * Math.min(1, dt * 3.2);
      pitchVel += (targetPitchVel - pitchVel) * Math.min(1, dt * 3.2);
      yaw += (DRIFT_YAW + yawVel) * dt;
      pitch += (DRIFT_PITCH + pitchVel) * dt;
      pitch = Math.max(-0.55, Math.min(0.55, pitch)); // never tip past the poles

      lensAmt += (lensTarget - lensAmt) * Math.min(1, dt * 3.5);
      lensX += (pointerX - lensX) * Math.min(1, dt * 9);
      lensY += (pointerY - lensY) * Math.min(1, dt * 9);
    }

    const cosY = Math.cos(yaw + scrollYaw), sinY = Math.sin(yaw + scrollYaw);
    const cosP = Math.cos(pitch), sinP = Math.sin(pitch);
    const lensOn = lensAmt > 0.01;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, vw, vh);
    ctx.globalCompositeOperation = "lighter";

    // the lens itself: a faint bowl of light with a brighter rim, drawn
    // under the stars so the warped ones sit on top of it
    if (lensOn) {
      const g = ctx.createRadialGradient(lensX, lensY, LENS_R * 0.1, lensX, lensY, LENS_R);
      g.addColorStop(0, "rgba(124,58,237,0.045)");
      g.addColorStop(0.55, "rgba(124,58,237,0.018)");
      g.addColorStop(0.88, "rgba(232,121,249,0.075)");
      g.addColorStop(1, "rgba(168,85,247,0)");
      ctx.globalAlpha = lensAmt;
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(lensX, lensY, LENS_R, 0, Math.PI * 2);
      ctx.fill();
    }

    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];

      // pitch about X, then yaw about Y
      const y1 = s.y * cosP - s.z * sinP;
      const z1 = s.y * sinP + s.z * cosP;
      const x2 = s.x * cosY + z1 * sinY;
      const z2 = -s.x * sinY + z1 * cosY;

      const zc = z2 + CAM;
      const k = focal / zc;
      let px = halfW + x2 * k;
      let py = halfH - y1 * k;
      if (px < -80 || px > vw + 80 || py < -80 || py > vh + 80) continue;

      // far stars sink into the haze; that depth ramp is most of what sells
      // the sphere as a volume rather than a flat sprinkle
      const depth = (zc - NEAR) / DEPTH;
      let a = s.bright * (1 - depth * 0.7);
      a *= reduceMotion ? 1 : 0.82 + 0.18 * Math.sin(t * s.twSpeed + s.twPhase);
      let r = s.size * k;

      let spike = 0;
      if (lensOn) {
        const dx = px - lensX, dy = py - lensY;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < LENS_R) {
          const f = (1 - d / LENS_R) * lensAmt;
          const ang = Math.atan2(dy, dx) + f * f * 1.05;      // swirl
          const nd = d + f * f * LENS_R * 0.26;               // magnification
          px = lensX + Math.cos(ang) * nd;
          py = lensY + Math.sin(ang) * nd;
          a *= 1 + f * 1.5;
          r *= 1 + f * 1.2;
          if (f > 0.78) spike = (f - 0.78) / 0.22;
        }
      }

      if (a <= 0.012) continue;
      const rad = Math.max(0.45, r) * 2.6;
      ctx.globalAlpha = Math.min(1, a);
      ctx.drawImage(sprites[s.c], px - rad, py - rad, rad * 2, rad * 2);

      // the handful of stars nearest the lens centre flare into spikes
      if (spike > 0) {
        const len = rad * (2.2 + spike * 4);
        const rgb = COLORS[s.c].join(",");
        ctx.globalAlpha = Math.min(1, a) * spike * 0.55;
        ctx.strokeStyle = `rgba(${rgb},1)`;
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(px - len, py); ctx.lineTo(px + len, py);
        ctx.moveTo(px, py - len); ctx.lineTo(px, py + len);
        ctx.stroke();
      }
    }

    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  }

  /* ---------------- start / stop (js/theme.js runs this in dark mode only) ---------------- */
  let running = false;
  let rafId = 0;
  let last = 0;

  function loop(ms) {
    if (!running) return;
    const dt = Math.min(0.05, (ms - last) / 1000);
    last = ms;
    drawFrame(ms / 1000, dt);
    rafId = requestAnimationFrame(loop);
  }

  function start() {
    if (running) return;
    if (reduceMotion) { drawFrame(0, 0); return; }  // one still sky, no loop
    running = true;
    last = performance.now();
    rafId = requestAnimationFrame(loop);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(rafId);
    lensAmt = 0;
    lensTarget = 0;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  window.Starfield = { start, stop, isRunning: () => running };
})();
