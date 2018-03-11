export interface AttributeChange {
    target: HTMLElement;
    attribute: string;
    value: string | SVGNumberList;
}
export interface TextChange {
    target: HTMLElement;
    text: string;
}
export declare class WatchResult {
    added: Array<HTMLElement>;
    removed: Array<HTMLElement>;
    attributeChanges: Array<AttributeChange>;
    textChanges: Array<TextChange>;
}
