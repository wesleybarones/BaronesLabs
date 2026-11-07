// Renderizador do globo de pontos (canvas 2D). Carregado sob demanda pelo componente Globe.
import dots from '../data/globe-dots.json';

const RAD = Math.PI / 180;

export function mountGlobe(canvas, marker) {
    const ctx = canvas.getContext('2d');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pts = dots.map(([lon, lat]) => {
      const la = lat * RAD, lo = lon * RAD;
      return [Math.cos(la) * Math.sin(lo), Math.sin(la), Math.cos(la) * Math.cos(lo)];
    });

    // Começa com o Brasil virado para a câmera
    let rotY = marker.lon * RAD; // longitude
    let rotX = -18 * RAD;
    let vel = 0;
    let dragging = false, lastX = 0, lastY = 0;
    let size = 0, dpr = 1, raf = 0, visible = false, t0 = performance.now();

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      size = r.width;
      canvas.width = r.width * dpr;
      canvas.height = r.width * dpr;
    };

    const project = (x, y, z) => {
      // rotação em Y (longitude) e X (inclinação)
      const cy = Math.cos(-rotY), sy = Math.sin(-rotY);
      let x1 = x * cy + z * sy;
      let z1 = -x * sy + z * cy;
      const cx = Math.cos(rotX), sx = Math.sin(rotX);
      const y1 = y * cx - z1 * sx;
      z1 = y * sx + z1 * cx;
      return [x1, y1, z1];
    };

    const draw = () => {
      const R = size * 0.44, c = size / 2;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);

      // halo
      const g = ctx.createRadialGradient(c, c, R * 0.7, c, c, R * 1.25);
      g.addColorStop(0, 'rgba(0,240,255,0.10)');
      g.addColorStop(1, 'rgba(0,240,255,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, size, size);
      ctx.strokeStyle = 'rgba(0,240,255,0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(c, c, R, 0, Math.PI * 2); ctx.stroke();

      const ds = Math.max(1.1, size / 260);
      for (let i = 0; i < pts.length; i++) {
        const [x, y, z] = project(pts[i][0], pts[i][1], pts[i][2]);
        if (z < -0.05) continue;
        const a = 0.25 + z * 0.75;
        ctx.fillStyle = `rgba(138,182,247,${a})`;
        ctx.fillRect(c + x * R - ds / 2, c - y * R - ds / 2, ds, ds);
      }

      // marcador Niterói
      const la = marker.lat * RAD, lo = marker.lon * RAD;
      const [mx, my, mz] = project(Math.cos(la) * Math.sin(lo), Math.sin(la), Math.cos(la) * Math.cos(lo));
      if (mz > 0) {
        const px = c + mx * R, py = c - my * R;
        const pulse = reduce ? 0.5 : ((performance.now() - t0) / 1600) % 1;
        ctx.strokeStyle = `rgba(212,255,36,${1 - pulse})`;
        ctx.beginPath(); ctx.arc(px, py, 4 + pulse * 16, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = '#D4FF24';
        ctx.shadowColor = 'rgba(212,255,36,0.8)'; ctx.shadowBlur = 10;
        ctx.beginPath(); ctx.arc(px, py, 3.5, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
        ctx.font = `600 ${Math.max(10, size / 42)}px "JetBrains Mono", monospace`;
        ctx.fillStyle = '#EAF6FF';
        ctx.fillText(marker.label, px + 10, py - 8);
      }
    };

    const loop = () => {
      if (!dragging && !reduce) { rotY += 0.0018 + vel; vel *= 0.94; }
      draw();
      raf = visible ? requestAnimationFrame(loop) : 0;
    };

    const onDown = (e) => { dragging = true; lastX = e.clientX; lastY = e.clientY; canvas.setPointerCapture(e.pointerId); };
    const onMove = (e) => {
      if (!dragging) return;
      const dx = e.clientX - lastX, dy = e.clientY - lastY;
      lastX = e.clientX; lastY = e.clientY;
      rotY -= dx * 0.008; vel = -dx * 0.0008;
      rotX = Math.max(-1.1, Math.min(1.1, rotX + dy * 0.006));
      if (reduce) draw();
    };
    const onUp = () => { dragging = false; };

    resize(); draw();
    const ro = new ResizeObserver(() => { resize(); draw(); });
    ro.observe(canvas);
    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(loop);
    });
    io.observe(canvas);
    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onUp);

    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
    };
}
