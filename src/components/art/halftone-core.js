/**
 * Halftone sphere renderer shared by the live site and the media generator
 * (scripts/render-media.mjs). Plain JavaScript with no imports, so the
 * generator can inject it into a page as-is.
 *
 * The sphere is sampled on a hex grid. Each dot's size follows how much light
 * reaches that point of the surface: ink stands for light, as in print
 * halftones, which gives the lit edge its dense crescent and leaves the night
 * side as a field of fine dots.
 */

function hash3(x, y, z) {
  let h = x * 374761393 + y * 668265263 + z * 2147483647;
  h = (h ^ (h >>> 13)) * 1274126177;
  h = h ^ (h >>> 16);
  return (h >>> 0) / 4294967295;
}

function smooth(t) {
  return t * t * (3 - 2 * t);
}

/** Smooth 3D value noise in [0, 1]. */
export function valueNoise3(x, y, z) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const zi = Math.floor(z);
  const xf = smooth(x - xi);
  const yf = smooth(y - yi);
  const zf = smooth(z - zi);
  const lerp = (a, b, t) => a + (b - a) * t;
  const c000 = hash3(xi, yi, zi);
  const c100 = hash3(xi + 1, yi, zi);
  const c010 = hash3(xi, yi + 1, zi);
  const c110 = hash3(xi + 1, yi + 1, zi);
  const c001 = hash3(xi, yi, zi + 1);
  const c101 = hash3(xi + 1, yi, zi + 1);
  const c011 = hash3(xi, yi + 1, zi + 1);
  const c111 = hash3(xi + 1, yi + 1, zi + 1);
  return lerp(
    lerp(lerp(c000, c100, xf), lerp(c010, c110, xf), yf),
    lerp(lerp(c001, c101, xf), lerp(c011, c111, xf), yf),
    zf,
  );
}

/**
 * Draws one frame.
 *
 * @param {CanvasRenderingContext2D} ctx  Context already scaled to CSS pixels.
 * @param {object} o
 * @param {number} o.width   Canvas width in CSS pixels.
 * @param {number} o.height  Canvas height in CSS pixels.
 * @param {number} o.cx      Sphere centre x (CSS px).
 * @param {number} o.cy      Sphere centre y (CSS px).
 * @param {number} o.radius  Sphere radius (CSS px).
 * @param {number} [o.spacing=8]   Distance between dot centres.
 * @param {number} [o.theta=1.7]   Light angle around the vertical axis: 0 lights the
 *                                 face fully, ±π/2 lights one edge, beyond that a crescent.
 * @param {number} [o.tilt=0.18]   Light elevation.
 * @param {number} [o.spin=0]      Surface rotation in radians (animates the texture).
 * @param {number} [o.texture=0.42] How strongly the surface texture modulates light.
 * @param {number} [o.halo=1.3]    Extent of the halo, as a multiple of the radius.
 * @param {number} [o.ambient=0.07] Faint dots on the night side.
 * @param {number} [o.opacity=1]
 * @param {string} [o.ink='#0d0d0d']
 * @param {boolean} [o.clear=true]
 */
export function drawHalftoneSphere(ctx, o) {
  const {
    width,
    height,
    cx,
    cy,
    radius,
    spacing = 8,
    theta = 1.7,
    tilt = 0.18,
    spin = 0,
    texture = 0.42,
    halo = 1.3,
    ambient = 0.07,
    opacity = 1,
    ink = '#0d0d0d',
    clear = true,
  } = o;

  if (clear) ctx.clearRect(0, 0, width, height);
  if (opacity <= 0.002 || radius <= 4) return;

  // Light direction (x right, y up, z towards the viewer).
  const cosT = Math.cos(tilt);
  const lx = Math.sin(theta) * cosT;
  const ly = Math.sin(tilt);
  const lz = Math.cos(theta) * cosT;

  const cosS = Math.cos(spin);
  const sinS = Math.sin(spin);
  const maxDot = spacing * 0.47;
  const rowH = spacing * 0.8660254;
  const extent = radius * halo;
  const top = Math.max(-spacing, cy - extent);
  const bottom = Math.min(height + spacing, cy + extent);
  const left = Math.max(-spacing, cx - extent);
  const right = Math.min(width + spacing, cx + extent);

  ctx.globalAlpha = opacity;
  ctx.fillStyle = ink;
  ctx.beginPath();

  // The lattice is anchored to the sphere's centre, so the pattern travels
  // with the sphere and changes of spacing open out from the middle.
  const firstRow = Math.floor((top - cy) / rowH);
  const lastRow = Math.ceil((bottom - cy) / rowH);
  for (let row = firstRow; row <= lastRow; row++) {
    const y = cy + row * rowH;
    const offset = (row & 1) === 0 ? 0 : spacing / 2;
    const firstCol = Math.floor((left - cx - offset) / spacing);
    const lastCol = Math.ceil((right - cx - offset) / spacing);
    for (let col = firstCol; col <= lastCol; col++) {
      const x = cx + col * spacing + offset;
      const dx = (x - cx) / radius;
      const dy = (cy - y) / radius;
      const d2 = dx * dx + dy * dy;
      let v = 0;

      if (d2 <= 1) {
        const nz = Math.sqrt(1 - d2);
        const lambert = dx * lx + dy * ly + nz * lz;
        // Surface texture, sampled on the rotated sphere so it turns with spin.
        const rx = dx * cosS + nz * sinS;
        const rz = -dx * sinS + nz * cosS;
        const n =
          valueNoise3(rx * 2.1 + 11, dy * 2.1 + 3, rz * 2.1 + 7) * 0.65 +
          valueNoise3(rx * 5.3 + 2, dy * 5.3 + 19, rz * 5.3 + 5) * 0.35;
        // Wrapped lighting softens the terminator into a gradual falloff.
        const lit = Math.max(0, (lambert + 0.22) / 1.22);
        v = lit * lit * (1 - texture + texture * n * 1.25);
        // The lit limb reads as a dense, slightly brighter rim.
        const edge = 1 - nz;
        const facing = Math.max(0, dx * lx + dy * ly) / Math.max(0.0001, Math.sqrt(dx * dx + dy * dy));
        v += edge * edge * edge * facing * 0.6;
        // Night side: a faint, even field so the whole disc is still felt.
        v = Math.max(v, ambient * (0.7 + 0.6 * n));
      } else {
        const d = Math.sqrt(d2);
        if (d < halo) {
          const t = (d - 1) / (halo - 1);
          const facing = Math.max(0, (dx * lx + dy * ly) / d);
          v = Math.pow(1 - t, 1.7) * (0.02 + 0.62 * facing * facing);
        }
      }

      if (v > 0.03) {
        const r = maxDot * Math.min(1, Math.pow(v, 0.8));
        if (r > 0.35) {
          ctx.moveTo(x + r, y);
          ctx.arc(x, y, r, 0, Math.PI * 2);
        }
      }
    }
  }

  ctx.fill();
  ctx.globalAlpha = 1;
}
