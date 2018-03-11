import { Css } from './interfaces'

import { WatchOptions, WatchEvents } from './watch-options'
import { WatchResult } from './watch-result'
import { ElementSet } from './element-set'

import { getSelectorFunction, getElementNodesFromNodeList } from './utils/dom'

// ----------------------------------------------------

export type SelectorFunc = (element: HTMLElement) => HTMLElement[]

export type WatchCallback = (result: WatchResult) => void

// ----------------------------------------------------------

export class Watch {
  public selector: string
  public selectorFunction: SelectorFunc

  public findExisting: boolean

  public events: WatchEvents
  public attributes: Set<string> = new Set()

  // ----------------------------------------------------

  get [Symbol.toStringTag] () {
    return 'Watch'
  }

  // ----------------------------------------------------

  constructor (
    public readonly options: WatchOptions,
    public readonly callback: WatchCallback
  ) {
    this.selector = this.options.selector || '*'
    this.selectorFunction = getSelectorFunction(this.selector)

    this.findExisting = typeof options.findExisting === 'boolean'
      ? options.findExisting
      : true

    this.events = options.events || WatchEvents.ElementsChanged

    if (options.attributes) {
      this.attributes = new Set(options.attributes)
    } else if (options.attribute) {
      this.attributes.add(options.attribute)
    }
  }

  // ----------------------------------------------------

  processSummary (summary: MutationRecord, debug: boolean = false): void {
    const addedElements = getElementNodesFromNodeList(summary.addedNodes)
    const removedElements = getElementNodesFromNodeList(summary.removedNodes)

    const matchingAddedElements: ElementSet = this.processElements(addedElements)
    const matchingRemovedElements: ElementSet = this.processElements(removedElements)

    if (debug) {
      console.groupCollapsed(`%cWatch.processSummary(%ctype=%c${summary.type}%c)`, Css.Kw, Css.Attr, Css.Val, Css.Kw)

      if (addedElements.length) {
        console.group(`Added elements`)
        console.dir(addedElements)
        console.dir(matchingAddedElements)
        console.groupEnd()
      }

      if (removedElements.length) {
        console.group(`Removed elements`)
        console.dir(removedElements)
        console.dir(matchingRemovedElements)
        console.groupEnd()
      }

      console.groupEnd()
    }

    this.invoke(matchingAddedElements.toArray(), matchingRemovedElements.toArray(), debug)
  }

  // ----------------------------------------------------

  processElement (element: HTMLElement): void {
    this.invoke(this.selectorFunction(element), [])
  }

  // ----------------------------------------------------

  dump () {
    console.groupCollapsed(`%cWatch(%cselector: %c"${this.options.selector}"%c)`, Css.Kw, Css.Attr, Css.Link, Css.Kw)
    console.dir(this.options)
    console.log(this.callback.toString())
    console.groupEnd()
  }

  // ----------------------------------------------------

  private processElements (elements: HTMLElement[]): ElementSet {
    return elements.reduce((matches: ElementSet, element: HTMLElement) => matches.addAll(this.selectorFunction(element)), new ElementSet())
  }

  // ----------------------------------------------------

  private invoke (added: HTMLElement[], removed: HTMLElement[], debug: boolean = false) {
    if (added.length > 0 || removed.length > 0) {
      const result = new WatchResult()
      result.added = added
      result.removed = removed

      if (debug) {
        console.groupCollapsed(`%cWatch.invoke()`, Css.Kw)
        console.dir(result)
        console.groupEnd()
      }

      this.callback(result)
      // this.callback.call(this.context, result)
    }
  }
}
