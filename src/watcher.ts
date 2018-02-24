import { SelectorFunc, WatchOptions, WatchCallback, Css } from './interfaces'

import { Watch, ElementChangeWatch } from './watch'

// ----------------------------------------------------------

export default class Watcher {

  observer: MutationObserver | null = null

  watchMap: Map<string, ElementChangeWatch> = new Map()

  constructor (
    private readonly root: HTMLElement = document.body,
    private readonly debug: boolean = false
  ) {
    if (!(root instanceof HTMLElement)) {
      throw new TypeError('Watch root is not a valid HTML element!')
    }
  }

  // ----------------------------------------------------

  add (options: WatchOptions, callback: WatchCallback): ElementChangeWatch {
    if (this.debug) {
      console.groupCollapsed(`%cWatcher.add(%c${options.selector}%c, %c${this.count} watches%c)`, Css.Kw, Css.Link, Css.Kw, Css.Val, Css.Kw)
      console.log(callback.toString())
      if (options) {
        console.dir(options)
      }
      console.groupEnd()
    }

    const watch = new ElementChangeWatch(options, callback)

    this.watchMap.set(options.selector, watch)

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
      console.groupCollapsed(`%cWatcher.processSummary(%ctype=%c${summary.type}%c)`, Css.Kw, Css.Attr, Css.Val, Css.Kw)
      console.dir(summary)
      console.groupEnd()
    }

    for (const watch of this.watches) {
      watch.processSummary(summary)
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

  get watches (): ElementChangeWatch[] {
    return [ ...Object.values(this.watchMap) ]
  }

  // ----------------------------------------------------

  start (): Watcher {
    if (this.debug) {
      console.info(`%cWatcher.start(%cenabled = %c${this.enabled ? 'true' : 'false'}%c, %c${this.count} watches%c)`, Css.Kw, Css.Attr, Css.Val, Css.Kw, Css.Val, Css.Kw)
    }

    if (!this.observer) {
      // Check for existing elements, pass to callback
      for (const watch of this.watches) {
        if (watch.findExisting) {
          watch.processElement(this.root)
        }
      }

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
