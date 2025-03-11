export function ParseActiveFilters(
  segments: string[]
): Record<string, string[]> {
  const active: Record<string, string[]> = {};
  for (const seg of segments) {
    // Split on the first dash
    const idx = seg.indexOf("-");
    if (idx === -1) {
      continue; // or handle error
    }
    const type = seg.slice(0, idx);
    const label = seg.slice(idx + 1);

    if (!active[type]) {
      active[type] = [];
    }
    active[type].push(label);
  }
  return active;
}
