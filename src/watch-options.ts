
// ----------------------------------------------------

export interface WatchOptions {
  selector?: string
  findExisting?: boolean
  events?: WatchEvents
  attribute?: string
  attributes?: string[]
}

// ----------------------------------------------------

export enum WatchEvents {
  ElementsAdded = 1,
  ElementsRemoved = 2,
  AttributesChanged = 4,
  TextChanged = 8,

  ElementsChanged = ElementsAdded | ElementsRemoved,
  AllChanges = ElementsAdded | ElementsRemoved | AttributesChanged | TextChanged
}
