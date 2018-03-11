
export class ElementSet extends Set<HTMLElement> {
  // get [Symbol.toStringTag]: string () {
  //   return 'ElementSet'
  // }

  // ----------------------------------------------------

  addAll (elements: HTMLElement[] | ElementSet): this {
    for (const element of elements) {
      super.add(element)
    }

    return this
  }

  // ----------------------------------------------------

  toArray (): HTMLElement[] {
    return Array.from(this)
  }
}
