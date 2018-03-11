import { SelectorFunc } from '../watch'

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

export function getElementNodesFromNodeList (nodes: NodeList): HTMLElement[] {
  return getElementNodes(Array.from(nodes))
}

// ----------------------------------------------------

export function getElementNodes (nodes: Node[]): HTMLElement[] {
  return nodes.filter(node => node instanceof HTMLElement) as HTMLElement[]
}
