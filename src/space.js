import { Vector3, PerspectiveCamera, CatmullRomCurve3, MathUtils } from "three";
// Perspective projection keeps the same 3D camera journey on GPUs and software-only browsers.
export function createSpace(canvas, projects, state) {
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) return;
  let width = innerWidth,
    height = innerHeight,
    pixelRatio = Math.min(devicePixelRatio, 1.75),
    lastTime = 0,
    elapsed = 0,
    flight = state.getProgress();
  const camera = new PerspectiveCamera(54, width / height, 0.2, 1000);
  const origin = new Vector3(4, 0, 4),
    positions = [origin, ...projects.map((p) => new Vector3(...p.point))];
  const cameraPositions = positions.map((p, i) =>
    p.clone().add(new Vector3(i === 0 ? -8 : -9, 1, i === 0 ? 28 : 24)),
  );
  const looks = positions.map((p) => p.clone().add(new Vector3(-5, 0, -7)));
  const travelCurve = new CatmullRomCurve3(cameraPositions),
    lookCurve = new CatmullRomCurve3(looks),
    route = new CatmullRomCurve3(positions);
  const stopValues = [0, 0.22, 0.46, 0.7, 0.94];
  function parameter(p) {
    for (let i = 1; i < stopValues.length; i++)
      if (p <= stopValues[i])
        return (
          (i -
            1 +
            (p - stopValues[i - 1]) / (stopValues[i] - stopValues[i - 1])) /
          4
        );
    return 1;
  }
  let seed = 2026;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const stars = Array.from({ length: 1150 }, () => ({
    point: new Vector3(
      (random() - 0.5) * 300,
      (random() - 0.5) * 175,
      random() * -480 + 50,
    ),
    size: 0.07 + random() * 0.17,
    brightness: 0.18 + random() * 0.65,
    phase: random() * 6.28,
  }));
  const satellites = positions.map((p, i) =>
    Array.from({ length: 14 }, (_, j) => ({
      point: p
        .clone()
        .add(
          new Vector3(
            (random() - 0.5) * 22,
            (random() - 0.5) * 15,
            (random() - 0.5) * 12,
          ),
        ),
      size: j % 3 === 0 ? 0.055 : 0.028,
    })),
  );
  const pathPoints = route.getPoints(500),
    scratch = new Vector3();
  const color = ["#accbc4", ...projects.map((p) => p.color)];
  function resize() {
    width = innerWidth;
    height = innerHeight;
    pixelRatio = Math.min(devicePixelRatio, 1.75);
    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize);
  resize();
  function project(v) {
    scratch.copy(v).applyMatrix4(camera.matrixWorldInverse);
    if (scratch.z > -0.4) return null;
    const depth = -scratch.z;
    scratch.copy(v).project(camera);
    if (Math.abs(scratch.x) > 3 || Math.abs(scratch.y) > 3) return null;
    return {
      x: (scratch.x * 0.5 + 0.5) * width,
      y: (-0.5 * scratch.y + 0.5) * height,
      depth,
      scale: height / depth,
    };
  }
  function strokePath(points, c, alpha, lineWidth = 1) {
    ctx.beginPath();
    let pen = false;
    for (const v of points) {
      const p = project(v);
      if (!p) {
        pen = false;
        continue;
      }
      if (!pen) {
        ctx.moveTo(p.x, p.y);
        pen = true;
      } else ctx.lineTo(p.x, p.y);
    }
    ctx.strokeStyle = c;
    ctx.globalAlpha = alpha;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
  function glow(x, y, r, c, alpha) {
    if (!Number.isFinite(r) || r < 0.1) return;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, c + "85");
    grad.addColorStop(0.12, c + "28");
    grad.addColorStop(1, c + "00");
    ctx.fillStyle = grad;
    ctx.globalAlpha = alpha;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
  function orbit(center, radius, tilt, rotation) {
    const pts = [];
    for (let i = 0; i <= 100; i++) {
      const a = (i / 100) * Math.PI * 2;
      const x = Math.cos(a) * radius,
        y = Math.sin(a) * radius * Math.sin(tilt),
        z = Math.sin(a) * radius * Math.cos(tilt);
      pts.push(
        center
          .clone()
          .add(
            new Vector3(
              x * Math.cos(rotation) - y * Math.sin(rotation),
              x * Math.sin(rotation) + y * Math.cos(rotation),
              z,
            ),
          ),
      );
    }
    return pts;
  }
  function frame(time) {
    requestAnimationFrame(frame);
    const dt = Math.min((time - lastTime) / 1000, 0.05) || 0.016;
    lastTime = time;
    if (document.hidden) return;
    if (!state.isPaused()) elapsed += dt;
    const target = state.isAbout() ? 0 : state.getProgress();
    flight =
      state.isPaused() || state.isDirect()
        ? target
        : MathUtils.lerp(flight, target, 1 - Math.exp(-dt * 4));
    const t = parameter(flight);
    camera.position.copy(travelCurve.getPoint(t));
    const look = lookCurve.getPoint(t);
    if (!state.isPaused()) {
      camera.position.x += Math.sin(elapsed * 0.13) * 0.12;
      camera.position.y += Math.cos(elapsed * 0.17) * 0.09;
    }
    camera.lookAt(look);
    camera.updateMatrixWorld();
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.fillStyle = "#070c15";
    ctx.globalAlpha = 1;
    ctx.fillRect(0, 0, width, height);
    const nebula = ctx.createRadialGradient(
      width * 0.68,
      height * 0.45,
      0,
      width * 0.68,
      height * 0.45,
      width * 0.65,
    );
    nebula.addColorStop(0, "#15333a");
    nebula.addColorStop(0.34, "#0c1b26");
    nebula.addColorStop(0.7, "#0a121e");
    nebula.addColorStop(1, "#070c15");
    ctx.fillStyle = nebula;
    ctx.globalAlpha = 0.76;
    ctx.fillRect(0, 0, width, height);
    for (const star of stars) {
      const p = project(star.point);
      if (!p || p.x < 0 || p.x > width || p.y < 0 || p.y > height) continue;
      const size = Math.min(2.1, Math.max(0.45, star.size * p.scale));
      ctx.globalAlpha =
        star.brightness * (0.87 + Math.sin(elapsed * 0.65 + star.phase) * 0.13);
      ctx.fillStyle = "#c7dce5";
      ctx.beginPath();
      ctx.arc(p.x, p.y, size * 0.55, 0, Math.PI * 2);
      ctx.fill();
      if (size > 1.8) glow(p.x, p.y, 9, "#bce5e2", 0.28);
    }
    strokePath(pathPoints, "#8bb8b9", 0.3, 0.8);
    strokePath(pathPoints.slice(0, Math.ceil(t * 500)), "#bcdace", 0.7, 1);
    positions.forEach((center, i) => {
      const c = color[i],
        main = project(center);
      if (!main || main.depth > 155) return;
      const alpha = MathUtils.clamp(1 - (main.depth - 55) / 120, 0, 1);
      glow(main.x, main.y, Math.min(340, 10 * main.scale), c, alpha * 0.19);
      for (let j = 0; j < satellites[i].length; j++) {
        const sat = satellites[i][j],
          s = project(sat.point);
        if (!s) continue;
        const previous = j === 0 ? center : satellites[i][j - 1].point;
        strokePath([previous, sat.point], c, alpha * 0.22, 0.7);
        if (j % 4 === 0) strokePath([center, sat.point], c, alpha * 0.2, 0.7);
        ctx.globalAlpha = alpha * 0.85;
        ctx.fillStyle = c;
        ctx.beginPath();
        ctx.arc(s.x, s.y, Math.max(0.65, sat.size * s.scale), 0, Math.PI * 2);
        ctx.fill();
      }
      const orbitRadius = i === 0 ? 7.5 : 6.2;
      strokePath(
        orbit(center, orbitRadius, 0.25, i * 0.6 + 0.1),
        c,
        alpha * 0.23,
        0.8,
      );
      strokePath(
        orbit(center, orbitRadius * 1.25, 0.45, i * 0.45 + 1.2),
        c,
        alpha * 0.11,
        0.7,
      );
      // Wireframe globe marks each station; orbit orientations reveal depth during travel.
      for (let j = -2; j <= 2; j++) {
        const lat = j * 0.4,
          r = 3.7 * Math.cos(lat),
          y = 3.7 * Math.sin(lat);
        strokePath(
          orbit(
            center.clone().add(new Vector3(0, y, 0)),
            r,
            0.18,
            0.15 + i * 0.3,
          ),
          c,
          alpha * 0.045,
          0.5,
        );
      }
      glow(main.x, main.y, 22, c, alpha * 0.9);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(main.x, main.y, 2.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = c;
      ctx.lineWidth = 0.8;
      ctx.globalAlpha = alpha * 0.4;
      ctx.beginPath();
      ctx.arc(main.x, main.y, 9, 0, Math.PI * 2);
      ctx.stroke();
      if (i > 0)
        state.onNodePosition(
          i - 1,
          main.x,
          main.y,
          main.x > 20 &&
            main.x < width - 20 &&
            main.y > 90 &&
            main.y < height - 130,
        );
    });
    // A subtle light travels along the connection, rather than moving the page automatically.
    if (!state.isPaused()) {
      const light = project(route.getPoint((elapsed * 0.018) % 1));
      if (light) glow(light.x, light.y, 12, "#d2e9cf", 0.7);
    }
    ctx.globalAlpha = 1;
  }
  requestAnimationFrame(frame);
  return () => window.removeEventListener("resize", resize);
}
