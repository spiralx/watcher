import { Css } from './interfaces'

// ----------------------------------------------------------

export default function l (tag: string, attrs: any, children: any[]) {
  console.group(`%c${tag}`, Css.Bold)
  console.info(`%cattrs = ${JSON.stringify(attrs, null, 2)}`, Css.Inverse)
  // console.info(`%cdata = ${JSON.stringify(data, null, 2)}`, Css.Inverse)
  if (children) {
    console.table(children)
  }
  console.groupEnd()
}
