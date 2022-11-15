/**
 * This function debounce the received function
 * @param { function } 	func				Function to be debounced
 * @param { number } 		wait				Time to wait before execut the function
 * @param { boolean } 	immediate		Param to define if the function will be executed immediately
 */
const debounce = (func, wait, immediate) => {
  let timeout

  return function () {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this
    const args = arguments

    const later = () => {
      timeout = null
      if (!immediate) {
        func.apply(context, args)
      }
    }

    const callNow = immediate && !timeout

    clearTimeout(timeout)

    timeout = setTimeout(later, wait)

    if (callNow) {
      func.apply(context, args)
    }
  }
}

export default debounce
