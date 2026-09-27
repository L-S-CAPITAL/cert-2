/** WCAG 2.x contrast helpers, used by the theme contrast tests. */

export function parseHex(hex: string): [number, number, number] {
  const value = hex.trim().replace('#', '');
  const full = value.length === 3 ? [...value].map((c) => c + c).join('') : value;
  if (!/^[0-9a-f]{6}$/i.test(full)) throw new Error(`Not a hex colour: ${hex}`);
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16)) as [number, number, number];
}

export function relativeLuminance(hex: string): number {
  const [r, g, b] = parseHex(hex).map((channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Custom properties (`--name: #hex;`) declared in the first block matching `selector`. */
export function cssVariables(css: string, selector: string): Record<string, string> {
  const start = css.indexOf(`${selector} {`);
  if (start < 0) throw new Error(`No ${selector} block`);
  const block = css.slice(start, css.indexOf('}', start));
  const vars: Record<string, string> = {};
  for (const match of block.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{3,6})\s*;/g)) {
    vars[match[1]] = match[2];
  }
  return vars;
}
