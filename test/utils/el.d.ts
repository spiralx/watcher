export declare type Properties = {
    [name: string]: any;
};
export declare type ELChild = Node | string | Array<any> | Properties;
/**
 * Function to generated nested HTML elements.
 *
 * @param {string} definition - TAG_NAME[#ID]?[.CLASS_NAME]*[#ID]? - create element with id/classes
 * @param {Array<Properties|Node|string|Array>} [children] - if an object use to set properties of element,
 *                                                           otherwise add a node, text node or the result of
 *                                                           calling EL using an array as its arguments
 * @return {Element} - constructed element
 */
export default function EL(definition?: string, ...children: ELChild[]): HTMLElement;
