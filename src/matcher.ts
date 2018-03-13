
// ----------------------------------------------------

export interface MatchOptions {
  root?: Element
  selector?: string
}

// ----------------------------------------------------

export class Matcher {
  readonly root: Element
  readonly selector: string

  // ----------------------------------------------------

  constructor (options: MatchOptions = {}) {
    this.root = options.root || document.body
    this.selector = options.selector || '*'
  }

  // ----------------------------------------------------

  matchesElement (element: Element): boolean {
    return element.matches(this.selector)
  }

  // ----------------------------------------------------

  findAllMatchesInSubTree (element: Element): Element[] {
    const matches: Element[] = Array.from(element.querySelectorAll(this.selector))

    if (this.matchesElement(element)) {
      matches.unshift(element)
    }

    return matches
  }
}
