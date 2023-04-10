/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * This function debounce the received function
 * @param { function } 	func				Function to be debounced
 * @param { number } 		wait				Time to wait before execut the function
 * @param { boolean } 	immediate		Param to define if the function will be executed immediately
 */
const debounce = (func: (...args: any[]) => void, wait?: number, immediate?: true) => {
  let timeout: NodeJS.Timeout | null = null

  return function debounced(this: typeof func, ...args: any[]) {
    const later = () => {
      timeout = null
      if (!immediate) {
        func.apply(this, args)
      }
    }

    if (immediate && !timeout) {
      /**
       * there's not need to clear the timeout
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
}

export default debounce
