import { WatchCallback, Watch } from './watch';
import { WatchOptions } from './watch-options';
export default class Watcher {
    readonly root: HTMLElement;
    readonly debug: boolean;
    observer: MutationObserver | null;
    readonly watches: Watch[];
    readonly [Symbol.toStringTag]: string;
    constructor(root?: HTMLElement, debug?: boolean);
    add(callback: WatchCallback): Watch;
    add(options: string | WatchOptions, callback: WatchCallback): Watch;
    readonly observing: boolean;
    readonly watchCount: number;
    processSummary(summary: MutationRecord): void;
    start(): this;
    stop(): this;
}
