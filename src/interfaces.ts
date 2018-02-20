interface Console {
  group (groupTitle?: string, ...optionalParams: any[]): void
}

// ----------------------------------------------------

export enum WatchEvent {
  ElementsAdded,
  ElementsRemoved,
  ElementsChanged,
  AttributesChanged,
  TextChanged
}

// ----------------------------------------------------

export interface WatchOptions {
  context?: Object | null
  findExisting?: boolean
  event?: WatchEvent
  events?: WatchEvent[]
  attribute?: string
  attributes?: string[]
}

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

export interface WatchResult {
  added?: HTMLElement[]
  removed?: HTMLElement[]
  attributeChanged?: AttributeChange[]
  textChanged?: TextChange[]
}

// ----------------------------------------------------

export interface INode {
  nodes?: INode[]
}

// ----------------------------------------------------

export type SelectorFunc = (element: HTMLElement) => HTMLElement[]

// ----------------------------------------------------

export type ElementChangeHandlerFunc = (changes: WatchResult) => void
