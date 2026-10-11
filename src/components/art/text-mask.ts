/**
 * Where the page's text sits on screen, as a coarse coverage grid for the
 * halftone renderer. Each line of text in <main> (and in any element marked
 * `data-text-mask`, such as the section index) marks the cells under it,
 * fading out over a short margin, and the planet's dots shrink there so the
 * words stay readable without cutting a hard shape into the pattern.
 */

const CELL = 8;
const FEATHER = 18;

export type TextMask = { data: Float32Array; cols: number; rows: number; cell: number };

export function createTextMask() {
  const range = document.createRange();
  let nodes: Text[] = [];
  let stale = true;
  let mask: TextMask = { data: new Float32Array(0), cols: 0, rows: 0, cell: CELL };

  // Pages swap and sections reveal by changing the DOM; collect text again then.
  const observer = new MutationObserver(() => {
    stale = true;
  });
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });

  const collect = () => {
    nodes = [];
    stale = false;
    for (const root of document.querySelectorAll('main, [data-text-mask]')) {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode: (node) => (node.nodeValue?.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT),
      });
      while (walker.nextNode()) nodes.push(walker.currentNode as Text);
    }
  };

  const stamp = (left: number, top: number, right: number, bottom: number) => {
    const { data, cols, rows } = mask;
    const c0 = Math.max(0, Math.floor((left - FEATHER) / CELL));
    const c1 = Math.min(cols - 1, Math.floor((right + FEATHER) / CELL));
    const r0 = Math.max(0, Math.floor((top - FEATHER) / CELL));
    const r1 = Math.min(rows - 1, Math.floor((bottom + FEATHER) / CELL));
    for (let r = r0; r <= r1; r++) {
      const y = (r + 0.5) * CELL;
      const dy = Math.max(top - y, 0, y - bottom);
      for (let c = c0; c <= c1; c++) {
        const x = (c + 0.5) * CELL;
        const dx = Math.max(left - x, 0, x - right);
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d >= FEATHER) continue;
        const t = d / FEATHER;
        const v = 1 - t * t * (3 - 2 * t);
        const i = r * cols + c;
        if (v > data[i]) data[i] = v;
      }
    }
  };

  /** Measures the text currently on screen and returns the grid. */
  const update = (width: number, height: number): TextMask => {
    if (stale) collect();
    const cols = Math.ceil(width / CELL);
    const rows = Math.ceil(height / CELL);
    if (cols !== mask.cols || rows !== mask.rows) mask = { data: new Float32Array(cols * rows), cols, rows, cell: CELL };
    else mask.data.fill(0);

    for (const node of nodes) {
      if (!node.isConnected) continue;
      range.selectNodeContents(node);
      const rects = range.getClientRects();
      for (let i = 0; i < rects.length; i++) {
        const rect = rects[i];
        if (rect.width === 0 || rect.bottom < -FEATHER || rect.top > height + FEATHER) continue;
        stamp(rect.left, rect.top, rect.right, rect.bottom);
      }
    }
    return mask;
  };

  return { update, dispose: () => observer.disconnect() };
}
