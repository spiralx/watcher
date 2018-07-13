
// ----------------------------------------------------

export class Matcher {
  constructor (
    public readonly root: Element,
    public readonly selector: string = '*'
  ) {}

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
