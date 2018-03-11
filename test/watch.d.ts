import { WatchOptions, WatchEvents } from './watch-options';
import { WatchResult } from './watch-result';
export declare type SelectorFunc = (element: HTMLElement) => HTMLElement[];
export declare type WatchCallback = (result: WatchResult) => void;
export declare class Watch {
    readonly options: WatchOptions;
    readonly callback: WatchCallback;
    selector: string;
    selectorFunction: SelectorFunc;
    findExisting: boolean;
    events: WatchEvents;
    attributes: Set<string>;
    readonly [Symbol.toStringTag]: string;
    constructor(options: WatchOptions, callback: WatchCallback);
    processSummary(summary: MutationRecord, debug?: boolean): void;
    processElement(element: HTMLElement): void;
    dump(): void;
    private processElements(elements);
    private invoke(added, removed, debug?);
}
