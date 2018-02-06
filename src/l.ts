import { RESET, BOLD, INV } from './styles'

// ----------------------------------------------------------

export default function l(tag: string, attrs: any, children: any[]) {
  console.group(`%c${tag}%c`, BOLD, RESET)
  console.info(`%cattrs = ${JSON.stringify(attrs, null, 2)}%c`, INV, RESET)
  // console.info(`%cdata = ${JSON.stringify(data, null, 2)}%c`, INV, RESET)
  if (children) {
    console.table(children)
  }
  console.groupEnd()
}
