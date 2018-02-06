
// ----------------------------------------------------

export function getMatchingElements (element: HTMLElement, selector: string): HTMLElement[] {
  return (element.matches(selector) ? [ element ] : []).concat(Array.from(element.querySelectorAll(selector)) as HTMLElement[])
}

// ----------------------------------------------------

export function getElementNodes (nodes: Node[]): HTMLElement[] {
  return nodes.filter(node => node instanceof Element) as HTMLElement[]
}
