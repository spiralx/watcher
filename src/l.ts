import { BOLD, INV } from './styles'

// ----------------------------------------------------------

export default function l (tag: string, attrs: any, children: any[]) {
  console.group(`%c${tag}`, BOLD)
  console.info(`%cattrs = ${JSON.stringify(attrs, null, 2)}`, INV)
  // console.info(`%cdata = ${JSON.stringify(data, null, 2)}%c`, INV, RESET)
  if (children) {
    console.table(children)
  }
  console.groupEnd()
}
