// Default pricing per 1M tokens (USD). Tweak to match your provider.
export const PRICING = {
  inputPerMillion: 0.15,
  outputPerMillion: 0.6,
};

export function estimateCost(inputTokens: number, outputTokens: number) {
  const cost =
    (inputTokens / 1_000_000) * PRICING.inputPerMillion +
    (outputTokens / 1_000_000) * PRICING.outputPerMillion;
  return cost;
}

export function formatCost(cost: number) {
  if (cost < 0.001) return `$${(cost * 1000).toFixed(3)}m`; // millicents-ish
  return `$${cost.toFixed(4)}`;
}
