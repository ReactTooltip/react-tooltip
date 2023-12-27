export const cssTimeToMs = (time: string): number => {
  const match = time.match(/^([\d.]+)(m?s?)$/)
  if (!match) {
    return 0
  }
  const [, amount, unit] = match
  if (unit !== 's' && unit !== 'ms') {
    return 0
  }
  return Number(amount) * (unit === 'ms' ? 1 : 1000)
}
