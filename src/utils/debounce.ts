/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable func-names */
/* eslint-disable prefer-rest-params */
/* eslint-disable @typescript-eslint/no-this-alias */
/**
 * This function debounce the received function
 * @param { function } 	func				Function to be debounced
 * @param { number } 		wait				Time to wait before execut the function
 * @param { boolean } 	immediate		Param to define if the function will be executed immediately
 */
const debounce = (func: (...args: any) => void, wait?: number, immediate?: true) => {
  let timeout: string | number | NodeJS.Timeout | null | undefined

  return function (...args: any) {
    // @ts-ignore
    const context = this

    const later = () => {
      timeout = null
      if (!immediate) {
        func.apply(context, args)
      }
    }

    // @ts-ignore
    clearTimeout(timeout)

    timeout = setTimeout(later, wait)
  }
}

export default debounce
