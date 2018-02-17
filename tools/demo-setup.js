const path = require('path')

const copy = require('recursive-copy')
const colors = require('colors') // eslint-disable-line no-unused-vars

// --------------------------------------------------------------------

async function main () {
  const COPY_OPTS = {
    overwrite: true,
    debug: true
  }

  const getopts = (options = {}) => Object.assign(options, COPY_OPTS)

  const directoryByExtension = fp => {
    const en = path.extname(fp)

    return en
      ? path.join(en.substr(1), fp)
      : fp
  }

  console.log(` ⌛ demo-setup.js started, cwd: ${process.cwd()}`.yellow.bold)

  try {
    await Promise.all([
      copy(
        'node_modules/jquery/dist',
        'demo/vendor/jquery',
        getopts()
      ),
      copy(
        'node_modules/bootstrap/dist',
        'demo/vendor/bootstrap',
        getopts()
      ),
      copy(
        'node_modules/bootstrap-treeview/public',
        'demo/vendor/bootstrap-treeview',
        getopts({ filter: [ 'css/*', 'js/*' ] })
      ),
      copy(
        'node_modules/bootstrap-treeview/dist',
        'demo/vendor/bootstrap-treeview',
        getopts({ rename: directoryByExtension })
      ),
      copy(
        'dist/watcher.umd.js',
        'demo/js/watcher.js',
        getopts()
      )
    ])

    console.info(` ✔ demo-setup.js completed`.green.bold)
  } catch (ex) {
    console.error(` ✘ demo-setup.js failed due to error`.red.bold, ex)
  }
}

main()
