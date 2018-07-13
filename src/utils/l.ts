import { Css } from '../interfaces'

// ----------------------------------------------------------

export function logElement (tag: string, attrs: any, children: any[]) {
  console.group(`%c${tag}`, Css.Bold)
  console.info(`%cattrs = ${JSON.stringify(attrs, null, 2)}`, Css.Inverse)
  // console.info(`%cdata = ${JSON.stringify(data, null, 2)}`, Css.Inverse)
  if (children) {
    console.table(children)
  }
  console.groupEnd()
}

// ----------------------------------------------------------

function _log (collapsed: boolean, title: string, objs: any[]) {
  if (collapsed) {
    console.groupCollapsed(`%c${title}`, Css.Kw)
  } else {
    console.group(`%c${title}`, Css.Kw)
  }

  for (const obj of objs) {
    console.dir(obj)
  }

  console.groupEnd()
}

export function log (title: string, ...objs: any[]) {
  _log(false, title, objs)
}

export function logc (title: string, ...objs: any[]) {
  _log(true, title, objs)
}
