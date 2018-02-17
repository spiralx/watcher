import l from './l'

// ----------------------------------------------------------

export type Attributes = string | { [ name: string ]: any }

// ----------------------------------------------------------

function parseDefinition (definition: string): HTMLElement {
  const [ , tag, ...bits ] = definition.split(/\b(?=[\.#])/g)

  const element = document.createElement(tag)

  bits.forEach(v => {
    if (v[0] === '.') {
      element.classList.add(v.substr(1))
    } else if (v[0] === '#') {
      element.id = v.substr(1)
    }
  })

  return element
}

// ----------------------------------------------------------

function setAttributes (element: HTMLElement, attributes: { [ prop: string]: any }): HTMLElement {
  if (attributes.dataset) {
    Object.assign(element.dataset, attributes.dataset)
    delete attributes.dataset
  }

  if (attributes.style) {
    Object.assign(element.style, attributes.style)
    delete attributes.style
  }

  return Object.assign(element, attributes)
}

// ----------------------------------------------------------

export type ELChild = Element | Array<any>

export function EL (definition: string, attributes: Attributes, ...children: ELChild[]): Element
export function EL (definition: string, ...children: ELChild[]): Element

/**
 * Function to generated nested HTML elements.
 *
 * @param {string} definition - TAG_NAME[#ID]?[.CLASS_NAME]*[#ID]? - create element with id/classes
 * @param {string|Object} [attributes] - if a string, set textContent, otherwise apply all attributes
 * @param {Array<Array|Element>} [children] - add children as nodes or the result of another EL
 * @return {Element} - constructed element
 */
export default function EL (definition: string, attributes: Attributes | ELChild, ...children: ELChild[]): HTMLElement {
  // l(definition, attributes, children)

  const element = parseDefinition(definition)

  if (typeof attributes === 'string') {
    element.textContent = attributes
  } else if (Array.isArray(attributes)  || attributes instanceof Element) {
    children = [ attributes, ...children ]
  } else if (typeof attributes === 'object') {
    setAttributes(element, attributes)
  }

  for (const child of children) {
    if (child instanceof Node) {
      element.appendChild(child)
    } else if (Array.isArray(child)) {
      element.appendChild(EL.apply(null, child))
    } else if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child))
    }
  }

  return element
}
