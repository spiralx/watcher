import { WatchEvent, WatchOptions, WatchCallback, SelectorFunc, Css } from './interfaces'
import { WatchResult } from './watch-result'

import { getSelectorFunction, getElementNodes } from './dom'

// ----------------------------------------------------

export type SelectorFunc = (element: HTMLElement) => HTMLElement[]

// ----------------------------------------------------------

export abstract class Watch {
  public selector: SelectorFunc

  public context: Object | null = null
  public findExisting: boolean = true
  public events: Set<WatchEvent> = new Set()
  public attributes: Set<string> = new Set()

  constructor (
    public readonly options: WatchOptions,
    public readonly callback: WatchCallback
  ) {
    this.selector = getSelectorFunction(this.options.selector)

    if (options.context != null) {
      this.context = options.context
    }

    if (typeof options.findExisting === 'boolean') {
      this.findExisting = options.findExisting
    }

    if (options.events) {
      this.events = new Set(options.events)
    } else if (options.event) {
      this.events.add(options.event)
    } else {
      this.events.add(WatchEvent.ElementsAdded)
      this.events.add(WatchEvent.ElementsRemoved)
    }

    if (this.events.has(WatchEvent.ElementsChanged)) {
      this.events.add(WatchEvent.ElementsAdded)
      this.events.add(WatchEvent.ElementsRemoved)
    }

    if (options.attributes) {
      this.attributes = new Set(options.attributes)
    } else if (options.attribute) {
      this.attributes.add(options.attribute)
    }
  }

  // ----------------------------------------------------

  abstract processSummary (summary: MutationRecord): void

  // ----------------------------------------------------

  dump () {
    console.groupCollapsed(`%cWatch(%cselector: %c"${this.options.selector}"%c)`, Css.Kw, Css.Attr, Css.Link, Css.Kw)
    console.log(this.callback.toString())
    if (this.context) {
      console.dir(this.context)
    }
    console.groupEnd()
  }
}

// ----------------------------------------------------------

export class ElementChangeWatch extends Watch {
  processSummary (summary: MutationRecord): void {
    const matchingAddedElements: Set<HTMLElement> = this.processNodes(Array.from(summary.addedNodes))
    const matchingRemovedElements: Set<HTMLElement> = this.processNodes(Array.from(summary.removedNodes))

    this.invoke([ ...matchingAddedElements ], [ ...matchingRemovedElements ])
  }

  // ----------------------------------------------------

  processElement (element: HTMLElement): void {
    const matchingAddedElements: Set<HTMLElement> = this.processNodes([ element ])

    this.invoke([ ...matchingAddedElements ], [])
  }

  // ----------------------------------------------------

  private processNodes (nodes: Node[]): Set<HTMLElement> {
    const elements = getElementNodes(Array.from(nodes))

    return elements.reduce((matches: Set<HTMLElement>, element: HTMLElement) => {
      this.selector(element).forEach(matchedElem => {
        matches.add(matchedElem)
      })

      return matches
    }, new Set<HTMLElement>())
  }

  // ----------------------------------------------------

  private invoke (added: HTMLElement[], removed: HTMLElement[]) {
    if (added.length > 0 || removed.length > 0) {
      const result = new WatchResult()
      result.added = added
      result.removed = removed

      this.callback.call(this.context, result)
    }
  }
}
