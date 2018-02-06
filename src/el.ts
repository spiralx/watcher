import l from './l'

// ----------------------------------------------------------

/**
 * Function to generated nested HTML elements.
 *
 * @param {string} definition - TAG_NAME[#ID]?[.CLASS_NAME]*[#ID]? - create element with id/classes
 * @param {string|Object} [attributes] - if a string, set textContent, otherwise apply all attributes
 * @param {Array<Array|HTMLElement>} [children] - add children as nodes or the result of another EL
 * @return {HTMLElement} - constructed element
 */
export default function EL(definition: string, attributes: Object|any[]|HTMLElement|string, ...children: any[]): HTMLElement {
  l(definition, attributes, children)

  function inner_attr(attrs, key) {
    if (key in attrs) {
      Object.assign(element[key], attributes[key])
      delete attributes[key]
    }
    return attrs
  }

  const m = definition.split(/\b(?=[\.#])/g),
        element = document.createElement(m.shift())

  m.forEach(v => {
    if (v[0] === '.') {
      element.classList.add(v.substr(1))
    }
    else if (v[0] === '#') {
      element.id = v.substr(1)
    }
  })

  if (Array.isArray(attributes) || attributes instanceof HTMLElement) {
    children.unshift(attributes)
    attributes = {}
  }
  else if (typeof attributes === 'string') {
    attributes = { textContent: attributes }
  }

  inner_attr(attributes, 'dataset')
  inner_attr(attributes, 'style')

  Object.assign(element, attributes || {})

  for (const child of children) {
    element.appendChild(child instanceof HTMLElement ? child : EL.apply(null, child))
  }

  return element
}
