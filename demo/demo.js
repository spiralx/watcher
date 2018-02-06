
function logChanges(added, removed) {
  console.group(`Added ${added.length} / Removed ${removed.length}`)
  console.dir(added)
  console.dir(removed)
  //console.table(added)//.map(t => { const a = t.querySelector('.title'); return { title: a.textContent, url: a.href } }))
  //console.table(removed)//.map(t => { const a = t.querySelector('.title'); return { title: a.textContent, url: a.href } }))
  console.groupEnd()
}

// ----------------------------------------------------------

watcher = new Watcher(document.body, true)

watcher.add('li', logChanges)

watcher.start()
