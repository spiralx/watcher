import Watcher from './watcher'

// ----------------------------------------------------

export class AttributeChange {
  constructor (
    public element: Element,
    public name: string,
    public value: string | null,
    public oldValue: string | null
  ) {}
}

// ----------------------------------------------------

export class TextChange {
  constructor (
    public element: Element,
    public value: string | null,
    public oldValue: string | null
  ) {}
}

// ----------------------------------------------------

export class WatchResult {
  constructor (
    private parent: Watcher,
    public added: Element[],
    public removed: Element[] = [],
    public attributeChanges: AttributeChange[] = [],
    public textChanges: TextChange[] = []
  ) {}
}
