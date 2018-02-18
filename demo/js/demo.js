/* global Watcher, DATA_SETS */

// --------------------------------------------------------

const KW = 'color: #35b; font-weight: bold;'
const LINK = 'color: #05f; text-decoration: underline;'
const VAL = 'color: #c36;'

// --------------------------------------------------------

const TREE_OPTIONS = {
  backColor: '#111',
  borderColor: '#ccc',
  showBorder: false,
  showIcon: true,
  selectedIcon: 'glyphicon glyphicon-ok',
  selectedColor: 'yellow',
  selectedBackColor: '#333',
  onhoverColor: '#5cf'
}

// --------------------------------------------------------

function getCallback (selector, logger) {
  return (added, removed) => {
    logger(`<p><span style="${KW}">${selector}:</span> added <span style="${VAL}">${added.length}</span>, removed <span style="${VAL}">${removed.length}</span></p>`)

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
  constructor ($tree, $log) {
    this.$tree = $tree
    this.$log = $log

    this._watcher = null
  }

  init () {
    this._watcher = new Watcher(document.getElementById('content'), true)

    this._watcher.add('.list-group-item', getCallback('.list-group-item', this.$log))
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
    const handlers = names => names.split(' ')
      .map(name => name[0].toUpperCase() + name.substr(1))
      .reduce((out, name) => ({
        ...out,
        [ 'onNode' + name ]: (event, node) => {
          $log(`<p><span style="${KW}">${name}:</span> <span style="${VAL}">${node.text}</span></p>`)
        }
      }), {})

    const $tree = $('#treeview').treeview({
      data,
      ...TREE_OPTIONS,
      ...handlers(`selected unselected expanded collapsed enabled disabled checked unchecked searchComplete searchCleared`)
    })

    const treeView = $tree.treeview(true)

    return { $tree, treeView }
  }

  function reinitialiseTreeView (data) {
    // $tree.treeview('remove')
    treeView.remove()
    return initialiseTreeView(data)
  }

  let { $tree, treeView } = initialiseTreeView(DATA_SETS.DEFAULT_DATA)

  console.info(`$tree, treeView`)
  console.dir($tree)
  console.dir(treeView)

  // --------------------------------------------------------

  function findExpandibleNodes () {
    return $tree.treeview('search', [
      $('#input-expand-node').val(),
      { ignoreCase: true, exactMatch: false }
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
    silent = $(this).prop('checked')
    $log(`Set SILENT to ${silent}.`)
  })

  // --------------------------------------------------------

  $('#input-expand-node').on('keyup', function (e) {
    const expandibleNodes = findExpandibleNodes()

    $('.expand-node').prop('disabled', !expandibleNodes.length)
  })

  $('#btn-expand-node.expand-node').on('click', function (e) {
    treeView.expandNode(findExpandibleNodes(), { levels, silent })
  })

  $('#btn-collapse-node.expand-node').on('click', function (e) {
    treeView.collapseNode(findExpandibleNodes(), { silent })
  })

  $('#btn-toggle-expanded.expand-node').on('click', function (e) {
    treeView.toggleNodeExpanded(findExpandibleNodes(), { silent })
  })

  // Expand/collapse all
  $('#btn-expand-all').on('click', function (e) {
    treeView.expandAll({ levels, silent })
  })

  $('#btn-collapse-all').on('click', function (e) {
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

    if (DATA_SETS.hasOwnProperty(dataset)) {
      $log(`Reloading tree with data set ${dataset}`)

      reinitialiseTreeView(DATA_SETS[ dataset ])
    } else {
      $log(`No data set ${dataset} exists!`)
    }
  })

  // --------------------------------------------------------

  const Demo = new DemoRunner($tree, $log)
  window.Demo = Demo
})
