import { WatchResult } from './watch-result'

// ----------------------------------------------------

interface Console {
  group (groupTitle?: string, ...optionalParams: any[]): void
}

// ----------------------------------------------------

export namespace Css {
  export const Inverse = 'color: white; background: black'
  export const Error = 'font-weight: bold; color: #f4f'
  export const Link = 'color: #05f; font-weight: normal; text-decoration: underline'
  export const Bold = 'font-weight: bold'
  export const Blue = 'color: #05f'
  export const Kw = 'color: #35b; font-weight: bold; font-style: normal; text-decoration: none'
  export const Attr = 'color: #563; font-weight: normal; font-style: italic; text-decoration: none'
  export const Val = 'color: #c36; font-weight: normal; font-style: normal; text-decoration: none'
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
  selector: string
  context?: object
  findExisting?: boolean
  event?: WatchEvent
  events?: WatchEvent[]
  attribute?: string
  attributes?: string[]
}

// ----------------------------------------------------

export interface INode {
  nodes?: INode[]
}

// ----------------------------------------------------

export type SelectorFunc = (element: HTMLElement) => HTMLElement[]

// ----------------------------------------------------

export type WatchCallback = (result: WatchResult) => void
