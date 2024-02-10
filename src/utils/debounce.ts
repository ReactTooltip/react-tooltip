/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * This function debounce the received function
 * @param { function } 	func				Function to be debounced
 * @param { number } 		wait				Time to wait before execut the function
 * @param { boolean } 	immediate		Param to define if the function will be executed immediately
 */
const debounce = <T, A extends any[]>(
  func: (...args: A) => void,
  wait?: number,
  immediate?: boolean,
) => {
  let timeout: NodeJS.Timeout | null = null

  const debounced = function debounced(this: T, ...args: A): void {
    const later = () => {
      timeout = null
      if (!immediate) {
        func.apply(this, args)
      }
    }

    if (immediate && !timeout) {
      /**
       * there's no need to clear the timeout
       * since we expect it to resolve and set `timeout = null`
       */
      func.apply(this, args)
      timeout = setTimeout(later, wait)
    }

    if (!immediate) {
      if (timeout) {
        clearTimeout(timeout)
      }
      timeout = setTimeout(later, wait)
    }
  }

  debounced.cancel = () => {
    /* c8 ignore start */
    if (!timeout) {
      return
    }
    /* c8 ignore end */
    clearTimeout(timeout)
    timeout = null
  }

  return debounced
}

export default debounce
