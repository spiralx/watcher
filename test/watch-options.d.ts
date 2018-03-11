export interface WatchOptions {
    selector?: string;
    findExisting?: boolean;
    events?: WatchEvents;
    attribute?: string;
    attributes?: string[];
}
export declare enum WatchEvents {
    ElementsAdded = 1,
    ElementsRemoved = 2,
    AttributesChanged = 4,
    TextChanged = 8,
    ElementsChanged = 3,
    AllChanges = 15,
}
