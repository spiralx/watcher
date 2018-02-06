import { RESET, BOLD, KW, ATTR, VAL, LINK } from './styles'

import { getMatchingElements, getElementNodes } from './dom'

// ----------------------------------------------------------

export default class Watcher {

  observer: MutationObserver

  watches: WatchMap = {}

  constructor (private readonly root: HTMLElement = document.body, private readonly debug: boolean = false) {
    if (!(root instanceof HTMLElement)) {
      throw new TypeError('Watch root is not a valid HTML element!')
    }
  }

  // ----------------------------------------------------

  add (selector: string, callback: Function, context: Object = {}): Watcher {
    if (this.debug) {
      console.info(`%cWatcher.add(%c${selector}%c, %o, %c${this.count} watches%c)%c`,
                   KW, LINK, KW, context || {}, VAL, KW, RESET)
      console.log(callback.toString())
    }

    context = Object.assign({}, context, { selector })

    this.watches[selector] = callback.bind(context)

    return this
  }

  // ----------------------------------------------------

  processSummaries (summaries: MutationRecord[]): void {
    summaries.forEach(summary => this.processSummary(summary))
  }

  // ----------------------------------------------------

  processSummary (summary: MutationRecord): void {
    if (this.debug) {
      console.info(`%cWatcher.processSummary(%ctype=%c${summary.type}%c, %o)%c`,
                   KW, ATTR, VAL, KW, summary, RESET)
    }

    const addedElements: HTMLElement[] = getElementNodes(Array.from(summary.addedNodes))
    const removedElements: HTMLElement[] = getElementNodes(Array.from(summary.removedNodes))

    for (const selector in this.watches) {
      const matchingAdded: Set<HTMLElement> = new Set(addedElements.reduce((res, elem) => res.concat(getMatchingElements(elem, selector)), []))
      const matchingRemoved: Set<HTMLElement> = new Set(removedElements.reduce((res, elem) => res.concat(getMatchingElements(elem, selector)), []))

      if (matchingAdded.size || matchingRemoved.size) {
        this.watches[selector]([...matchingAdded], [...matchingRemoved])
      }
    }
  }

  // ----------------------------------------------------

  get enabled (): boolean {
    return !!this.observer
  }

  get count (): number {
    return Object.keys(this.watches).length
  }

  // ----------------------------------------------------

  start (): Watcher {
    if (this.debug) {
      const { enabled, count } = this
      console.info(`%cWatcher.start(%cenabled = %c${enabled ? 'true' : 'false'}%c, %c${count} watches%c)%c`,
                   KW, ATTR, VAL, KW, VAL, KW, RESET)
    }

    if (!this.observer) {
      // Check for existing elements, pass to callback
      for (const selector in this.watches) {
        const matchingAdded = getMatchingElements(this.root, selector)

        if (matchingAdded.length) {
          this.watches[selector](matchingAdded, [])
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
