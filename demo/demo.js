/* global Watcher, DEFAULT_DATA */

// --------------------------------------------------------

const KW = 'color: #35b; font-weight: bold;'
const LINK = 'color: #05f; text-decoration: underline;'
const VAL = 'color: #c36;'

// --------------------------------------------------------

const TREE_OPTIONS = {
  backColor: '#111',
  borderColor: '#ccc',
  showBorder: false,
  selectedIcon: 'glyphicon glyphicon-ok',
  selectedColor: 'yellow',
  selectedBackColor: '#333',
  onhoverColor: '#5cf'
}

// --------------------------------------------------------

function getCallback (selector) {
  return (added, removed) => {
    console.group(`%cCallback(%c"${selector}"%c: added %c${added.length}%c, removed %c${removed.length}%c)`,
      KW, LINK, KW, VAL, KW, VAL, KW)
    console.dir(added)
    console.dir(removed)
    // console.table(added)//.map(t => { const a = t.querySelector('.title'); return { title: a.textContent, url: a.href } }))
    // console.table(removed)//.map(t => { const a = t.querySelector('.title'); return { title: a.textContent, url: a.href } }))
    console.groupEnd()
  }
}

// --------------------------------------------------------

class DemoRunner {
  constructor ($tree) {
    this.$tree = $tree

    this._watcher = null
  }

  init () {
    this._watcher = new Watcher(document.getElementById('content'), true)

    this._watcher.add('.list-group-item', getCallback('.list-group-item'))
  }

  get watching () {
    return !!this._watcher && this._watcher.enabled
  }

  toggleWatchStatus () {
    if (this.watching) {
      this.stop()
      return false
    } else {
      this.start()
      return true
    }
  }

  start () {
    if (!this._watcher) {
      this.init()
    }

    this._watcher.start()
  }

  stop () {
    this._watcher.stop()
  }

  reset () {

  }
}

// --------------------------------------------------------

$(function () {
  const $output = $('#output')

  function $log (text) {
    if (text.match(/^<\w+>/)) {
      $output.prepend(text)
    } else {
      $output.prepend(`<p>${text}</p>`)
    }
  }

  // --------------------------------------------------------

  function initialiseTreeView (data) {
    const $tree = $('#treeview').treeview({
      data,
      ...TREE_OPTIONS,
      onNodeCollapsed (event, node) {
        $log(`Collapsed: ${node.text}`)
      },
      onNodeExpanded (event, node) {
        $log(`Expanded: ${node.text}`)
      }
    })

    const treeView = $tree.treeview(true)

    return { $tree, treeView }
  }

  function reinitialiseTreeView (data) {
    // $tree.treeview('remove')
    treeView.remove()
    return initialiseTreeView(data)
  }

  let { $tree, treeView } = initialiseTreeView(DEFAULT_DATA)

  console.info(`$tree, treeView`)
  console.dir($tree)
  console.dir(treeView)

  // --------------------------------------------------------

  function findExpandibleNodes () {
    return $tree.treeview('search', [
      $('#input-expand-node').val(),
      { ignoreCase: false, exactMatch: false }
    ])
  }

  // --------------------------------------------------------

  let levels = 2
  let silent = false

  $('#select-expand-node-levels').on('change', function (e) {
    levels = $(this).val()
    $log(`Set LEVELS to ${levels}.`)
  })

  $('#chk-expand-silent').on('click', function (e) {
    silent = $(this).val()
    $log(`Set SILENT to ${silent}.`)
  })

  // --------------------------------------------------------

  $('#input-expand-node').on('keyup', function (e) {
    const expandibleNodes = findExpandibleNodes()

    $('.expand-node').prop('disabled', !expandibleNodes.length)
  })

  $('#btn-expand-node.expand-node').on('click', function (e) {
    treeView.expandNode(findExpandibleNodes(), { level, silent })
    // doTreeAction('expandNode', true)
  })

  $('#btn-collapse-node.expand-node').on('click', function (e) {
    treeView.collapseNode(findExpandibleNodes(), { silent })
    // doTreeAction('collapseNode')
  })

  $('#btn-toggle-expanded.expand-node').on('click', function (e) {
    treeView.toggleNodeExpanded(findExpandibleNodes(), { silent })
    // doTreeAction('toggleNodeExpanded')
  })

  // Expand/collapse all
  $('#btn-expand-all').on('click', function (e) {
    const levels = $('#select-expand-node-levels').val()
    const silent = $('#chk-expand-silent').is(':checked')

    treeView.expandAll({ levels, silent })
  })

  $('#btn-collapse-all').on('click', function (e) {
    const silent = $('#chk-expand-silent').is(':checked')

    treeView.collapseAll({ silent })
  })

  // --------------------------------------------------------

  $('#btn-watcher-state').on('click', function (e) {
    const watching = Demo.toggleWatchStatus()

    $log(`${watching ? 'Started' : 'Stopped'} watcher...`)

    $(this)
      .text(watching ? 'Stop' : 'Start')
      .toggleClass('btn-info btn-secondary')
  })

  $('.btn-restart-tree').on('click', function (e) {
    const dataset = $(this).data('set')

    if (window[ dataset ]) {
      $log(`Reloading tree with data set ${dataset}`)

      reinitialiseTreeView(window[ dataset ])
    } else {
      $log(`No data set ${dataset} exists!`)
    }
  })

  // --------------------------------------------------------

  const Demo = new DemoRunner($tree)
  window.Demo = Demo
})
