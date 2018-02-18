interface Console {
  group (groupTitle?: string, ...optionalParams: any[]): void
}

// ----------------------------------------------------

export interface INode {
  nodes?: INode[]
}

// ----------------------------------------------------

export type SelectorFunc = (element: HTMLElement) => HTMLElement[]

// ----------------------------------------------------

export type ElementChangeHandlerFunc = (added: HTMLElement[], removed: HTMLElement[]) => void
