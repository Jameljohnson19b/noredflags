/**
 * Recent boost: weight = base * 1.3
 * Signals captured recently carry more weight dynamically.
 */
export function applyRecentBoost(baseWeight: number): number {
  return baseWeight * 1.3;
}
