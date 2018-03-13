import { Css, Mutation, NodeMutation, AttrMutation, TextMutation } from './interfaces'

import Watcher from './watcher'
import { WatchOptions, WatchEvents } from './watch-options'
import { WatchResult } from './watch-result'
import { ElementSet } from './element-set'
import { Matcher } from './matcher'

import { getSelectorFunction, getElementNodesFromNodeList } from './utils/dom'

// ----------------------------------------------------

export type SelectorFunc = (element: HTMLElement) => HTMLElement[]

export type WatchCallback = (result: WatchResult) => void

// ----------------------------------------------------------

export class Watch {
  // public debug: boolean

  public selector: string
  matcher: Matcher
  // public selectorFunction: SelectorFunc

  public findExisting: boolean

  public events: WatchEvents
  public attributes: Set<string> = new Set()

  result: WatchResult = new WatchResult(this.parent)

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
    // this.debug = !!options.debug

    this.selector = this.options.selector || '*'

    // this.selectorFunction = getSelectorFunction(this.selector)
    this.findExisting = typeof options.findExisting === 'boolean'
      ? options.findExisting
      : true

    this.events = options.events || WatchEvents.ElementsChanged

    if (options.attributes) {
      this.attributes = new Set(options.attributes)
    } else if (options.attribute) {
      this.attributes.add(options.attribute)
    }

    this.matcher = new Matcher({
      root: this.parent.root,
      selector: this.selector
    })

    // this.initialiseResult()
  }

  // ----------------------------------------------------

  initialiseResult () {
    this.result = new WatchResult(this.parent)

    if (this.parent.debug) {
      console.groupCollapsed(`%cWatch.processResult(): newResult`, Css.Kw)
      console.dir(this.result)
      console.groupEnd()
    }
  }

  // ----------------------------------------------------

  processResult () {
    if (this.result) {
      if (this.parent.debug) {
        console.groupCollapsed(`%cWatch.processResult(): currentResult`, Css.Kw)
        console.dir(this.result)
        console.groupEnd()
      }

      const data = {
        added: this.result.addedElementSet.toArray(),
        removed: this.result.removedElementSet.toArray(),
        attributes: this.result.attributeChanges,
        text: this.result.textChanges
      }

      this.callback(this.result.getData())
    }

    this.initialiseResult()
  }

  // ----------------------------------------------------

  processRecords (records: MutationRecord[]): void {
    // const result = new WatchResult(this)
    const result = this.result

    for (const record of records) {
      switch (record.type) {
        case 'childList':
          result.onNodeMutation(this, record as NodeMutation)
          break
        case 'attributes':
          result.onAttrMutation(this, record as AttrMutation)
          break
        case 'characterData':
          result.onTextMutation(this, record as TextMutation)
          break
        default:
          throw new Error('Unknown mutation type "${record.type}"')
      }
    }
  }

  // ----------------------------------------------------

  processExistingElements (): void {
    const matchingElements = this.matcher.findAllMatchesInSubTree(this.parent.root)

    if (matchingElements.length > 0) {
      this.result.addedElementSet.addAll(matchingElements)

      this.processResult()
    }
  }

  // ----------------------------------------------------

  // processSummary (summary: MutationRecord, debug: boolean = false): void {
  //   const result = new WatchResult()

  //   if (this.events & WatchEvents.ElementsAdded) {
  //     const addedElements = getElementNodesFromNodeList(summary.addedNodes)
  //     const matchingAddedElements: ElementSet = this.processElements(addedElements)

  //     result.added = [ ...matchingAddedElements ]
  //   }

  //   if (this.events & WatchEvents.ElementsRemoved) {
  //     const removedElements = getElementNodesFromNodeList(summary.removedNodes)
  //     const matchingRemovedElements: ElementSet = this.processElements(removedElements)

  //     result.removed = [ ...matchingRemovedElements ]
  //   }

  //   if (debug) {
  //     console.groupCollapsed(`%cWatch.processSummary(%ctype=%c${summary.type}%c)`, Css.Kw, Css.Attr, Css.Val, Css.Kw)

  //     if (summary.addedNodes.length) {
  //       console.group(`Added elements`)
  //       console.dir(summary.addedNodes)
  //       console.dir(result.added)
  //       console.groupEnd()
  //     }

  //     if (summary.removedNodes.length) {
  //       console.group(`Removed elements`)
  //       console.dir(summary.removedNodes)
  //       console.dir(result.removed)
  //       console.groupEnd()
  //     }

  //     console.groupEnd()
  //   }

  //   this.invoke(result, debug)
  // }

  // ----------------------------------------------------

  // processElement (element: HTMLElement): void {
  //   const result = new WatchResult()
  //   result.added = this.selectorFunction(element)

  //   if (result.added.length > 0) {
  //     this.invoke(result, false)
  //   }
  // }

  // ----------------------------------------------------

  dump () {
    console.groupCollapsed(`%cWatch(%cselector: %c"${this.options.selector}"%c)`, Css.Kw, Css.Attr, Css.Link, Css.Kw)
    console.dir(this.options)
    console.log(this.callback.toString())
    console.groupEnd()
  }

  // ----------------------------------------------------

  // private processElements (elements: HTMLElement[]): ElementSet {
  //   return elements.reduce((matches: ElementSet, element: HTMLElement) => matches.addAll(this.selectorFunction(element)), new ElementSet())
  // }
}
