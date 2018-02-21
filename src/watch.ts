import { WatchEvent, WatchOptions, SelectorFunc, ElementChangeHandlerFunc } from './interfaces'
import { KW , ATTR, LINK } from './styles'

import { getSelectorFunction } from './dom'

// ----------------------------------------------------------

const DEFAULT_OPTIONS: WatchOptions = {
  event: WatchEvent.ElementsChanged,
  attributes: []
}

// ----------------------------------------------------------

export class Watch {
  public selector: SelectorFunc

  public context: Object | null = null
  public findExisting: boolean = true
  public events: Set<WatchEvent>
  public attributes: Set<string>

  constructor (
    public readonly cssSelector: string,
    public readonly callback: ElementChangeHandlerFunc,
    options: WatchOptions = {}
  ) {
    this.selector = getSelectorFunction(this.cssSelector)

    options = { ...DEFAULT_OPTIONS, ...options }

    if (options.context != null) {
      this.context = options.context
    }

    if (typeof options.findExisting === 'boolean') {
      this.findExisting = options.findExisting
    }

    this.events = new Set(options.event ? [ options.event ] : options.events)

    if (this.events.has(WatchEvent.ElementsChanged)) {
      this.events.add(WatchEvent.ElementsAdded)
      this.events.add(WatchEvent.ElementsRemoved)
    }

    this.attributes = new Set(options.attribute ? [ options.attribute ] : options.attributes)
  }

  // ----------------------------------------------------

  dump () {
    console.groupCollapsed(`%cWatch(%cselector: %c"${this.cssSelector}"%c)`, KW, ATTR, LINK, KW)
    console.log(this.callback.toString())
    if (this.context) {
      console.dir(this.context)
    }
    console.groupEnd()
  }
}

// ----------------------------------------------------------

export interface ElementChangeResult {
  added?: HTMLElement[]
  removed?: HTMLElement[]
}

// ----------------------------------------------------------

export class ElementChangeWatch extends Watch {
  // ----------------------------------------------------

  invoke (added: HTMLElement[] | undefined, removed: HTMLElement[] | undefined): void {
    added = this.events.has(WatchEvent.ElementsAdded) ? added : undefined
    removed = this.events.has(WatchEvent.ElementsRemoved) ? removed : undefined

    const result: ElementChangeResult = { added, removed }

    this.callback.call(this.context, result)
  }

}
