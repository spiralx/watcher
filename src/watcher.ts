import { Css, Mutation } from './interfaces'

import { WatchCallback, Watch } from './watch'
import { WatchOptions, WatchEvents } from './watch-options'

// ----------------------------------------------------------

export default class Watcher {

  observer: MutationObserver | null = null

  // readonly watcheMap: Map<string, Watch> = new Map()
  readonly watches: Watch[] = []

  // ----------------------------------------------------

  get [Symbol.toStringTag] () {
    return 'Watcher'
  }

  // ----------------------------------------------------

  constructor (
    public readonly root: HTMLElement = document.body,
    public readonly debug: boolean = false
  ) {
    if (!(root instanceof HTMLElement)) {
      throw new TypeError('Watch root is not a valid HTML element!')
    }
  }

  // ----------------------------------------------------

  add (callback: WatchCallback): Watch
  add (options: string | WatchOptions, callback: WatchCallback): Watch

  add (options: string | WatchOptions | WatchCallback, callback?: WatchCallback): Watch {
    if (typeof options === 'string') {
      options = {
        selector: options
      }
    } else if (typeof options === 'function') {
      callback = options
      options = {}
    }

    if (!callback) {
      throw new Error('No callback function specified when calling Watcher.add()')
    }

    if (this.debug) {
      console.groupCollapsed(`%cWatcher.add(selector: %c${options.selector}%c, %c${this.watchCount} watches%c)`, Css.Kw, Css.Link, Css.Kw, Css.Val, Css.Kw)
      console.log(callback.toString())
      if (options) {
        console.dir(options)
      }
      console.groupEnd()
    }

    const watch = new Watch(this, options, callback)

    this.watches.push(watch)

    return watch
  }

  // ----------------------------------------------------

  get observing (): boolean {
    return !!this.observer
  }

  // ----------------------------------------------------

  get watchCount (): number {
    return this.watches.length
  }

  // ----------------------------------------------------

  // get watches (): Watch[] {
  //   return [ ...this.watchMap.values() ]
  // }

  // ----------------------------------------------------

  // processSummary (summary: MutationRecord): void {
  //   if (this.debug) {
  //     console.groupCollapsed(`%cWatcher.processSummary(%ctype=%c${summary.type}%c)`, Css.Kw, Css.Attr, Css.Val, Css.Kw)
  //     console.dir(summary)
  //     console.groupEnd()
  //   }

  //   for (const watch of this.watches) {
  //     watch.processSummary(summary, this.debug)
  //   }
  // }

  // ----------------------------------------------------

  start (): this {
    if (!this.watchCount) {
      throw new Error('Cannot start Watcher without any watches!')
    }

    if (this.debug) {
      console.info(`%cWatcher.start(%cenabled = %c${this.observing ? 'true' : 'false'}%c, %c${this.watchCount} watches%c)`, Css.Kw, Css.Attr, Css.Val, Css.Kw, Css.Val, Css.Kw)
    }

    if (!this.observer) {
      // Check for existing elements, pass to callback
      for (const watch of this.watches) {
        if (watch.findExisting && watch.events & WatchEvents.ElementsAdded) {
          watch.processExistingElements()
        }
      }

      this.observer = new MutationObserver(summaries => {
        for (const watch of this.watches) {
          watch.processRecords(summaries)
        }
        // summaries.forEach(summary => this.processSummary(summary))
      })

      this.observer.observe(this.root, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeOldValue: true,
        characterData: true,
        characterDataOldValue: true
      })
    }

    return this
  }

  // ----------------------------------------------------

  stop (): this {
    if (this.observer) {
      // this.observer.takeRecords().forEach(summary => this.processSummary(summary))

      const records = this.observer.takeRecords()
      this.observer.disconnect()

      for (const watch of this.watches) {
        watch.processRecords(records)
      }

      this.observer = null
    }

    return this
  }
}
