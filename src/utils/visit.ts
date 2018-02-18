import { INode } from '../interfaces'

// ----------------------------------------------------

export function visit (root: INode, visitor: Function): void {
  function walk (node: INode) {
    visitor(node)
    if (node.nodes) {
      node.nodes.forEach(walk)
    }
  }

  walk(root)
}
