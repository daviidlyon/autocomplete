/* eslint-disable @typescript-eslint/ban-types */
export function debounce<Params extends unknown[]>(
  func: Function,
  delay: number = 300
) {
  let timeoutId: ReturnType<typeof setTimeout>;

  return function (...args: Params) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}
