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
  return getNodesByType<HTMLElement>(nodes, 1)
}

// ----------------------------------------------------

export function getTextNodesFromNodeList (nodes: NodeList): Text[] {
  return getNodesByType<Text>(nodes, 3)
}

// ----------------------------------------------------

export function getNodesByType<T extends Node> (nodes: NodeList, nodeType: number): T[] {
  return Array.from(nodes).filter(node => node.nodeType === nodeType) as T[]
}
