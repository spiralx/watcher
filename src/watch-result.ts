
// ----------------------------------------------------

export interface AttributeChange {
  target: HTMLElement
  attribute: string
  value: string | SVGNumberList
}

// ----------------------------------------------------

export interface TextChange {
  target: HTMLElement
  text: string
}

// ----------------------------------------------------

export class WatchResult {
  added: Array<HTMLElement> = new Array<HTMLElement>()
  removed: Array<HTMLElement> = new Array<HTMLElement>()
  attributeChanges: Array<AttributeChange> = new Array<AttributeChange>()
  textChanges: Array<TextChange> = new Array<TextChange>()
}
