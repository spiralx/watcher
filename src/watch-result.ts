import Watcher from './watcher'
import { Watch } from './watch'
import { ElementSet } from './element-set'
import { WatchEvents } from './watch-options'
import { NodeMutation, AttrMutation, TextMutation, Mutation } from './interfaces'

import { getElementNodesFromNodeList } from './utils/dom'

// ----------------------------------------------------

export class AttributeChange {
  constructor (
    public element: Element,
    public name: string,
    public value: string | null
    // public oldValue: string | SVGNumberList
  ) {}
}

// ----------------------------------------------------

export class TextChange {
  constructor (
    public element: Element,
    public value: string | null
    // public oldValue: string
  ) {}
}

// ----------------------------------------------------

export class WatchResult {
  added: Element[] = []
  removed: Element[] = []

  addedElementSet: ElementSet = new ElementSet()
  removedElementSet: ElementSet = new ElementSet()

  // attributeChangeMap: ChangeMap = new ChangeMap()

  // allChanges: Map<Element, ElementChanges> = new Map()

  attributeChanges: Array<AttributeChange> = new Array<AttributeChange>()
  textChanges: Array<TextChange> = new Array<TextChange>()

  constructor (private parent: Watcher) {}

  // ----------------------------------------------------

  getData (): WatchResult {
    this.added = this.addedElementSet.toArray()
    this.removed = this.removedElementSet.toArray()

    return this
  }
  // ----------------------------------------------------

  onMutation (watch: Watch, summary: Mutation) {
    switch (summary.type) {
      case 'childList':
        this.onNodeMutation(watch, summary)
        break

      case 'attributes':
        if (watch.events & WatchEvents.AttributesChanged) {
          this.onAttrMutation(watch, summary)
        }
        break

      case 'characterData':
        if (watch.events & WatchEvents.TextChanged) {
          this.onTextMutation(watch, summary)
        }
        break

      default:
        throw new Error('Unknown mutation type "${record.type}"')
    }
  }

  // ----------------------------------------------------

  onNodeMutation (watch: Watch, summary: NodeMutation) {
    if (watch.events & WatchEvents.ElementsAdded && summary.addedNodes.length > 0) {
      for (const element of getElementNodesFromNodeList(summary.addedNodes)) {
        this.addedElementSet.addAll(watch.matcher.findAllMatchesInSubTree(element))
      }
    }

    if (watch.events & WatchEvents.ElementsRemoved && summary.removedNodes.length > 0) {
      for (const element of getElementNodesFromNodeList(summary.removedNodes)) {
        this.removedElementSet.addAll(watch.matcher.findAllMatchesInSubTree(element))
      }
    }
  }

  // ----------------------------------------------------

  onAttrMutation (watch: Watch, summary: AttrMutation) {
    const { target, attributeName, oldValue } = summary

    if (watch.attributes.has(attributeName)) {
      const element = target as Element
      const value = element.getAttribute(attributeName)

      // this.attributeChangeMap.onChange(attributeName, oldValue, value)

      const change = new AttributeChange(element, attributeName, value)
      this.attributeChanges.push(change)
    }
  }

  // ----------------------------------------------------

  onTextMutation (watch: Watch, summary: TextMutation) {
    const element = summary.target as Element
    this.textChanges.push(new TextChange(element, element.textContent))
  }
}
