import { SelectorFunc, ElementChangeHandlerFunc, WatchOptions } from './interfaces'
import { BOLD, KW, ATTR, VAL, LINK } from './styles'

import { Watch } from './watch'
import { getSelectorFunction, getElementNodes } from './dom'

// ----------------------------------------------------------

export default class Watcher {

  observer: MutationObserver | null = null

  watchMap: Map<string, Watch> = new Map()

  constructor (
    private readonly root: HTMLElement = document.body,
    private readonly debug: boolean = false
  ) {
    if (!(root instanceof HTMLElement)) {
      throw new TypeError('Watch root is not a valid HTML element!')
    }
  }

  // ----------------------------------------------------

  add (selector: string, callback: ElementChangeHandlerFunc, options: WatchOptions = {}): Watch {
    if (this.debug) {
      console.groupCollapsed(`%cWatcher.add(%c${selector}%c, %c${this.count} watches%c)`, KW, LINK, KW, VAL, KW)
      console.log(callback.toString())
      if (options) {
        console.dir(options)
      }
      console.groupEnd()
    }

    const watch = new Watch(selector, callback, options)

    this.watchMap.set(selector, watch)

    return watch
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

    for (const watch of this.watches) {
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
    return Object.keys(this.watchMap).length
  }

  // ----------------------------------------------------

  get watches (): Watch[] {
    return [ ...Object.values(this.watchMap) ]
  }

  // ----------------------------------------------------

  start (): Watcher {
    if (this.debug) {
      console.info(`%cWatcher.start(%cenabled = %c${this.enabled ? 'true' : 'false'}%c, %c${this.count} watches%c)`, KW, ATTR, VAL, KW, VAL, KW)
    }

    if (!this.observer) {
      // Check for existing elements, pass to callback
      this.watches
        .map(watch => ({ watch, added: watch.selector(this.root) }))
        .filter(({ added }) => added.length > 0)
        .forEach(({ watch, added }) => watch.invoke(added, []))

      this.observer = new MutationObserver(summaries => {
        this.processSummaries(summaries)
      })

      this.observer.observe(this.root, {
        childList: true,
        attributes: true,
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
