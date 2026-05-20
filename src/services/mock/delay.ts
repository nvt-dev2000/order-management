/** Simulated network latency for mock APIs */
export const MOCK_DELAY_MS = 350;

export function mockDelay(ms: number = MOCK_DELAY_MS): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
