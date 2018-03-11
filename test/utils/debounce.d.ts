/**
 * Wait until interval ms has elapsed between function calls to
 * call the function i.e. delay until after calls have stopped.
 *
 * If immediate, instead call the function on the first call, then
 * ignore further calls until delay ms after further calls have
 * stopped.
 */
export default function debounce(func: Function, interval?: number, immediate?: boolean): Function;
