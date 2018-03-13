
export class ElementSet extends Set<Element> {
  // get [Symbol.toStringTag]: string () {
  //   return 'ElementSet'
  // }

  // ----------------------------------------------------

  addAll (elements: Element[] | ElementSet): this {
    for (const element of elements) {
      super.add(element)
    }

    return this
  }

  // ----------------------------------------------------

  toArray (): Element[] {
    return Array.from(this)
  }
}
