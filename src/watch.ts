import { SelectorFunc, ElementChangeHandlerFunc } from './interfaces'
import { KW , ATTR, LINK } from './styles'

import { getSelectorFunction } from './dom'

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
