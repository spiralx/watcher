
// ----------------------------------------------------

export type SelectorFunc = (element: HTMLElement) => HTMLElement[]

// ----------------------------------------------------

export function getSelectorFunction (selector: string): SelectorFunc {
  return function (element: HTMLElement): HTMLElement[] {
    const matches: HTMLElement[] = []

    if (element.matches(selector)) {
      matches.push(element)
    }

    return matches.concat(Array.from(element.querySelectorAll(selector)))
  }
}

// ----------------------------------------------------

export function getElementNodes (nodes: Node[]): HTMLElement[] {
  return nodes.filter(node => node instanceof HTMLElement) as HTMLElement[]
}
