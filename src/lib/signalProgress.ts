/**
 * Scroll position inside the "how it works" section, 0 to 1.
 *
 * The section writes it and the WebGL scene reads it, so the copy and the
 * packet moving between the nodes are always describing the same stage
 * without either one owning the other.
 */
export const signalProgress = { current: 0 };

export const SIGNAL_STAGE_COUNT = 4;

export function stageFromProgress(p: number) {
  return Math.min(SIGNAL_STAGE_COUNT - 1, Math.max(0, Math.floor(p * SIGNAL_STAGE_COUNT)));
}
