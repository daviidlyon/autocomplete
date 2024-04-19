/* This function ensures that the active element is visible */
export function scrollIntoViewIfNeeded(element: HTMLElement) {
  const parent = element.parentElement;
  if (!parent) return;

  const parentRect = parent.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();

  const isInView =
    elementRect.top >= parentRect.top &&
    elementRect.bottom <= parentRect.bottom;

  if (!isInView) {
    if (elementRect.top < parentRect.top) {
      parent.scrollTop -= parentRect.top - elementRect.top;
    } else {
      parent.scrollTop += elementRect.bottom - parentRect.bottom;
    }
  }
}
