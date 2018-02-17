import { BOLD, KW, ATTR, VAL, LINK } from './styles'

import { SelectorFunc, getSelectorFunction, getElementNodes } from './dom'

// ----------------------------------------------------------

export type ElementChangeHandlerFunc = (added: HTMLElement[], removed: HTMLElement[]) => void

export interface WatchMap {
  [ selector: string ]: Watch
}

// ----------------------------------------------------------

export class Watch {
  selector: SelectorFunc

  constructor (
    public readonly cssSelector: string,
    private callback: ElementChangeHandlerFunc,
    private context: Object = {}
  ) {
    this.selector = getSelectorFunction(this.cssSelector)
  }

  invoke (added: Element[], removed: Element[]): void {
    this.callback.call(this.context, added, removed)
  }

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

export default class Watcher {

  observer: MutationObserver | null = null

  watches: WatchMap = {}

  constructor (
    private readonly root: HTMLElement = document.body,
    private readonly debug: boolean = false
  ) {
    if (!(root instanceof HTMLElement)) {
      throw new TypeError('Watch root is not a valid HTML element!')
    }
  }

  // ----------------------------------------------------

  add (selector: string, callback: ElementChangeHandlerFunc, context: Object = {}): Watcher {
    if (this.debug) {
      console.groupCollapsed(`%cWatcher.add(%c${selector}%c, %c${this.count} watches%c)`, KW, LINK, KW, VAL, KW)
      console.log(callback.toString())
      if (context) {
        console.dir(context)
      }
      console.groupEnd()
    }

    this.watches[ selector ] = new Watch(selector, callback, context)

    return this
  }

  // ----------------------------------------------------

  processSummaries (summaries: MutationRecord[]): void {
    summaries.forEach(summary => this.processSummary(summary))
  }

  // ----------------------------------------------------

  getAllMatchingElements (selector: SelectorFunc, rootElements: HTMLElement[]) {
    rootElements.map(selector)
  }

  // ----------------------------------------------------

  processSummary (summary: MutationRecord): void {
    if (this.debug) {
      console.groupCollapsed(`%cWatcher.processSummary(%ctype=%c${summary.type}%c)`, KW, ATTR, VAL, KW)
      console.dir(summary)
      console.groupEnd()
    }

    const addedElements: HTMLElement[] = getElementNodes(Array.from(summary.addedNodes))
    const removedElements: HTMLElement[] = getElementNodes(Array.from(summary.removedNodes))

    for (const watch of Object.values(this.watches)) {
      const matchingElementsAdded = new Set<HTMLElement>(addedElements.map(watch.selector).reduce((out, elems) => [ ...out, ...elems ], []))
      const matchingElementsRemoved = new Set<HTMLElement>(addedElements.map(watch.selector).reduce((out, elems) => [ ...out, ...elems ], []))

      if (matchingElementsAdded.size || matchingElementsRemoved.size) {
        watch.invoke([ ...matchingElementsAdded ], [ ...matchingElementsRemoved ])
      }
    }
  }

  // ----------------------------------------------------

  get enabled (): boolean {
    return !!this.observer
  }

  // ----------------------------------------------------

  get count (): number {
    return Object.keys(this.watches).length
  }

  // ----------------------------------------------------

  start (): Watcher {
    if (this.debug) {
      console.info(`%cWatcher.start(%cenabled = %c${this.enabled ? 'true' : 'false'}%c, %c${this.count} watches%c)`, KW, ATTR, VAL, KW, VAL, KW)
    }

    if (!this.observer) {
      // Check for existing elements, pass to callback
      for (const watch of Object.values(this.watches)) {
        const matchingAdded = watch.selector(this.root)

        if (matchingAdded.length) {
          watch.invoke(matchingAdded, [])
        }
      }

      this.observer = new MutationObserver(summaries => {
        this.processSummaries(summaries)
      })

      this.observer.observe(this.root, {
        childList: true,
        subtree: true
      })
    }

    return this
  }

  // ----------------------------------------------------

  stop (): Watcher {
    if (this.observer) {
      this.processSummaries(this.observer.takeRecords())

      this.observer.disconnect()
      this.observer = null
    }

    return this
  }

}
