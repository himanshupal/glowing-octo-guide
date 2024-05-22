export const getNumberOrFallback = (value: unknown, fallback = 0): number => {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
};
