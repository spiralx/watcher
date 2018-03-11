var EL = (function () {
'use strict';

function parseDefinition(definition) {
    let [tag, ...bits] = definition.split(/\b(?=[\.#])/g);
    if (tag[0] === '#' || tag[0] === '.') {
        bits.unshift(tag);
        tag = 'div';
    }
    const element = document.createElement(tag);
    bits.forEach(v => {
        if (v[0] === '.') {
            element.classList.add(v.substr(1));
        }
        else if (v[0] === '#') {
            element.id = v.substr(1);
        }
    });
    return element;
}
// ----------------------------------------------------------
function setProperties(element, properties) {
    if (properties.dataset) {
        Object.assign(element.dataset, properties.dataset);
        delete properties.dataset;
    }
    if (properties.style) {
        Object.assign(element.style, properties.style);
        delete properties.style;
    }
    return Object.assign(element, properties);
}
// ----------------------------------------------------------
/**
 * Function to generated nested HTML elements.
 *
 * @param {string} definition - TAG_NAME[#ID]?[.CLASS_NAME]*[#ID]? - create element with id/classes
 * @param {Array<Properties|Node|string|Array>} [children] - if an object use to set properties of element,
 *                                                           otherwise add a node, text node or the result of
 *                                                           calling EL using an array as its arguments
 * @return {Element} - constructed element
 */
function EL(definition = 'div', ...children) {
    // console.group(`${definition}`)
    // for (const child of children) {
    //   console.log(child)
    // }
    // console.groupEnd()
    const element = parseDefinition(definition);
    for (const child of children) {
        if (child instanceof Node) {
            element.appendChild(child);
        }
        else if (Array.isArray(child)) {
            element.appendChild(EL.apply(null, child));
        }
        else if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child));
        }
        else {
            setProperties(element, child);
        }
    }
    return element;
}

return EL;

}());
