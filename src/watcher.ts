import { throttle } from 'lodash-es'

import { Css } from './interfaces'

import { WatchCallback, Watch } from './watch'
import { WatchOptions } from './watch-options'

// ----------------------------------------------------------

const DEBOUNCE_TIME = 250

// ----------------------------------------------------------

export default class Watcher {

  observer: MutationObserver
  observing: boolean = false

  mutationQueue: MutationRecord[] = []

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

    this.observer = new MutationObserver(records => {
      this.addRecords(records)
      this.processRecords()
    })

    this.processRecords = throttle(this.processRecords.bind(this), DEBOUNCE_TIME, { leading: true })
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

    if (this.observing) {
      watch.processExistingElements()
    }

    this.watches.push(watch)

    return watch
  }

  // ----------------------------------------------------

  addRecords (records: MutationRecord[]) {
    this.mutationQueue.push(...records)

    if (this.debug) {
      console.info(`Adding ${records.length} records to queue, queue has ${this.mutationQueue.length} records`)
    }
  }

  // ----------------------------------------------------

  processRecords () {
    if (this.mutationQueue.length > 0) {
      if (this.debug) {
        console.info(`Processing ${this.mutationQueue.length} records`)
      }

      if (this.observing) {
        this.addRecords(this.disconnect())
      }

      for (const watch of this.watches) {
        watch.processRecords(this.mutationQueue)
      }

      this.mutationQueue = []

      if (this.observing) {
        this.observe()
      }
    }
  }

  // ----------------------------------------------------

  get watchCount (): number {
    return this.watches.length
  }

  // ----------------------------------------------------

  start (): this {
    if (!this.watchCount) {
      throw new Error('Cannot start Watcher without any watches!')
    }

    if (this.debug) {
      console.info(`%cWatcher.start(%cenabled = %c${this.observing ? 'true' : 'false'}%c, %c${this.watchCount} watches%c)`, Css.Kw, Css.Attr, Css.Val, Css.Kw, Css.Val, Css.Kw)
    }

    if (!this.observing) {
      // Check for existing elements, pass to callback
      for (const watch of this.watches) {
        watch.processExistingElements()
      }

      this.observe()
      this.observing = true
    }

    return this
  }

  // ----------------------------------------------------

  stop (): this {
    if (this.observing) {
      this.addRecords(this.disconnect())

      this.observing = false

      this.processRecords()
    }

    return this
  }

  // ----------------------------------------------------

  private observe (): void {
    this.observer.observe(this.root, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeOldValue: true,
      characterData: true,
      characterDataOldValue: true
    })
  }

  // ----------------------------------------------------

  private disconnect (): MutationRecord[] {
    const records = this.observer.takeRecords()

    this.observer.disconnect()

    return records
  }
}
