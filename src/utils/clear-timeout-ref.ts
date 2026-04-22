const clearTimeoutRef = (ref: React.RefObject<NodeJS.Timeout | null>) => {
  if (ref.current) {
    clearTimeout(ref.current)

    ref.current = null
  }
}

export default clearTimeoutRef
