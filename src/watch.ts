import { Css, MutationRecords, NodeMutationRecord, AttrMutationRecord, TextMutationRecord } from './interfaces'
import { log, logc } from './utils/l'

import Watcher from './watcher'
import { WatchOptions, WatchEvents } from './watch-options'
import { WatchResult, AttributeChange, TextChange } from './watch-result'
import { ElementSet } from './element-set'
import { Matcher } from './matcher'

import { getElementNodesFromNodeList, getTextNodesFromNodeList } from './utils/dom'

// ----------------------------------------------------

export type SelectorFunc = (element: HTMLElement) => HTMLElement[]

export type WatchCallback = (result: WatchResult) => void

// ----------------------------------------------------------

export class Watch {
  public findExisting: boolean

  public events: WatchEvents

  public attributes: Set<string> = new Set()
  public allAttributes: boolean = false

  matcher: Matcher

  addedElementSet: ElementSet = new ElementSet()
  removedElementSet: ElementSet = new ElementSet()

  attributeChanges: AttributeChange[] = []
  textChanges: TextChange[] = []

  // ----------------------------------------------------

  get [Symbol.toStringTag] () {
    return 'Watch'
  }

  // ----------------------------------------------------

  constructor (
    private parent: Watcher,
    public readonly options: WatchOptions,
    public readonly callback: WatchCallback
  ) {
    this.findExisting = typeof options.findExisting === 'boolean'
      ? options.findExisting
      : true

    this.events = options.events || WatchEvents.ElementsChanged

    if (options.attributes) {
      this.attributes = new Set(options.attributes)
    } else if (options.attribute) {
      this.attributes.add(options.attribute)
    } else {
      this.allAttributes = true
    }

    this.matcher = new Matcher(this.parent.root, this.options.selector)
  }

  // ----------------------------------------------------

  get selector () {
    return this.matcher.selector
  }

  // ----------------------------------------------------

  processExistingElements (): void {
    if (this.findExisting && this.events & WatchEvents.ElementsAdded) {
      const matchingElements = this.matcher.findAllMatchesInSubTree(this.parent.root)

      if (matchingElements.length > 0) {
        this.addedElementSet.addAll(matchingElements)

        this.doResultCallback()
      }
    }
  }

  // ----------------------------------------------------

  initialise () {
    this.addedElementSet.clear()
    this.removedElementSet.clear()

    this.attributeChanges = []
    this.textChanges = []

    if (this.parent.debug) {
      logc(`Watch.initialise()`, this)
    }
  }

  // ----------------------------------------------------

  doResultCallback () {
    if (this.parent.debug) {
      logc(`Watch.processResult(): addedElementSet, removedElementSet, attributeChanges, textChanges`, this.addedElementSet, this.removedElementSet, this.attributeChanges, this.textChanges)
    }

    if (this.addedElementSet.size > 0 ||
        this.removedElementSet.size > 0 ||
        this.attributeChanges.length > 0 ||
        this.textChanges.length > 0) {
      const result = new WatchResult(
        this.parent,
        [ ...this.addedElementSet ],
        [ ...this.removedElementSet ],
        [ ...this.attributeChanges ],
        [ ...this.textChanges ]
      )

      this.callback(result)

      this.initialise()
    }
  }

  // ----------------------------------------------------

  processRecords (records: MutationRecord[]): void {
    for (const [ idx, record ] of records.entries()) {
      if (this.parent.debug) {
        log(`Watch.processRecords(${idx}, type: ${record.type})`, record)
      }

      switch (record.type) {
        case 'childList':
          this.onNodeMutation(record as NodeMutationRecord)
          break

        case 'attributes':
          if (this.events & WatchEvents.AttributesChanged) {
            this.onAttrMutation(record as AttrMutationRecord)
          }
          break

        case 'characterData':
          if (this.events & WatchEvents.TextChanged) {
            this.onTextMutation(record as TextMutationRecord)
          }
          break

        default:
          throw new Error('Unknown mutation type "${record.type}"')
      }
    }

    this.doResultCallback()
  }

  // ----------------------------------------------------

  onNodeMutation (summary: NodeMutationRecord) {
    if (this.events & WatchEvents.ElementsAdded && summary.addedNodes.length > 0) {
      for (const element of getElementNodesFromNodeList(summary.addedNodes)) {
        this.addedElementSet.addAll(this.matcher.findAllMatchesInSubTree(element))
      }
    }

    if (this.events & WatchEvents.ElementsRemoved && summary.removedNodes.length > 0) {
      for (const element of getElementNodesFromNodeList(summary.removedNodes)) {
        this.removedElementSet.addAll(this.matcher.findAllMatchesInSubTree(element))
      }
    }

    if (this.events & WatchEvents.TextChanged) {
      const addedTextNodes = getTextNodesFromNodeList(summary.addedNodes)

      if (addedTextNodes.length > 0) {
        const removedTextNodes = getTextNodesFromNodeList(summary.removedNodes)

        const oldValue = removedTextNodes.length > 0
          ? removedTextNodes[ 0 ].textContent
          : null

        const value = addedTextNodes[ addedTextNodes.length - 1 ].textContent

        const change = new TextChange(summary.target as Element, value, oldValue)
        this.textChanges.push(change)
      }
    }
  }

  // ----------------------------------------------------

  onAttrMutation (summary: AttrMutationRecord) {
    const { target, attributeName, oldValue } = summary

    if (this.allAttributes || this.attributes.has(attributeName)) {
      const element = target as Element
      const value = element.getAttribute(attributeName)

      const change = new AttributeChange(element, attributeName, value, oldValue)
      this.attributeChanges.push(change)
    }
  }

  // ----------------------------------------------------

  onTextMutation (summary: TextMutationRecord) {
    const { target, oldValue } = summary
    const element = target.parentElement as Element

    const change = new TextChange(element, element.textContent, oldValue)
    this.textChanges.push(change)
  }

  // ----------------------------------------------------

  dump () {
    console.groupCollapsed(`%cWatch(%cselector: %c"${this.options.selector}"%c)`, Css.Kw, Css.Attr, Css.Link, Css.Kw)
    console.dir(this.options)
    console.log(this.callback.toString())
    console.groupEnd()
  }
}
