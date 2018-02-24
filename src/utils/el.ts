
function parseDefinition (definition: string): HTMLElement {
  const [ , tag, ...bits ] = definition.split(/\b(?=[\.#])/g)

  const element = document.createElement(tag || 'div')

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

function setProperties (element: HTMLElement, properties: Properties): HTMLElement {
  if (properties.dataset) {
    Object.assign(element.dataset, properties.dataset)
    delete properties.dataset
  }

  if (properties.style) {
    Object.assign(element.style, properties.style)
    delete properties.style
  }

  return Object.assign(element, properties)
}

// ----------------------------------------------------------

export type Properties = {
  [ name: string ]: any
}

export type ELChild = HTMLElement | string | Array<any>

// ----------------------------------------------------------

const getClass = (val: any): string => Object.prototype.toString.call(val).slice(8, -1)

// ----------------------------------------------------------

/**
 * Function to generated nested HTML elements.
 *
 * @param {string} definition - TAG_NAME[#ID]?[.CLASS_NAME]*[#ID]? - create element with id/classes
 * @param {string|{}} [properties] - if a string, set textContent, otherwise apply all properties
 * @param {Array<Array|Element>} [children] - add children as nodes or the result of another EL
 * @return {Element} - constructed element
 */
export default function EL (definition: string = 'div', properties?: Properties | ELChild, ...children: ELChild[]): HTMLElement {
  // console.group(`%c${definition}`, BOLD)
  // console.info(`%cattrs = ${JSON.stringify(properties, null, 2)}`, INV)
  // // console.info(`%cdata = ${JSON.stringify(data, null, 2)}%c`, INV, RESET)
  // if (children) {
  //   console.table(children)
  // }
  // console.groupEnd()

  const element = parseDefinition(definition)

  if (properties) {
    if (typeof properties === 'object' && !Array.isArray(properties)) {
      setProperties(element, properties)
    } else {
      children.unshift(properties)
    }
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
