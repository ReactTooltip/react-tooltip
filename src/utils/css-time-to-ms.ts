const cssTimeToMs = (time: string): number => {
  const match = time.match(/^([\d.]+)(m?s)$/)
  if (!match) {
    return 0
  }
  const [, amount, unit] = match
  return Number(amount) * (unit === 'ms' ? 1 : 1000)
}

export default cssTimeToMs
