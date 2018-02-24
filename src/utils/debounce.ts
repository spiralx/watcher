
// ----------------------------------------------------------------------------

/**
 * Wait until interval ms has elapsed between function calls to
 * call the function i.e. delay until after calls have stopped.
 *
 * If immediate, instead call the function on the first call, then
 * ignore further calls until delay ms after further calls have
 * stopped.
 */
export default function debounce (func: Function, interval: number = 100, immediate: boolean = false): Function {
  let timeout: number

  return function debounced (...args: any[]) {
    // const fn = func.bind(this)

    function afterThreshold () {
      if (!immediate) {
        func(...args)
      }

      timeout = 0
    }

    const callNow = immediate && !timeout

    window.clearTimeout(timeout)
    timeout = window.setTimeout(afterThreshold, interval)

    if (callNow) {
      func(...args)
    }
  }
}
