const clearTimeoutRef = (ref: React.MutableRefObject<NodeJS.Timeout | null>) => {
  if (ref.current) {
    clearTimeout(ref.current)
    // eslint-disable-next-line no-param-reassign
    ref.current = null
  }
}

export default clearTimeoutRef
