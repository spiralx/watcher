# watcher

Simple library to watch for particular DOM mutations.


### Using `watcher` in your project

#### Adding `watcher` to the project

To add `watcher` to your project's dependencies use the command

```sh
yarn add watcher
npm add --save watcher
```

#### How to use this package

```js
import Watcher from './watcher'

// Create a new watcher object for all nodes starting at the given root element
const watcher = new Watcher(document.getElementById('.content .comments'))

// Watch for DOM events for elements matching a given selector and run
// the given callback function with the details of each DOM event
const watch = watcher.add('.comment .comment-body a[href]', result => {
  if (result.added.length > 0) {
    console.group('Added links')
    result.added.forEach(elem => console.log(elem, elem.href))
    console.groupEnd()
  }

  if (result.removed.length > 0) {
    console.group('Removed links')
    result.removed.forEach(elem => console.log(elem, href))
    console.groupEnd()
  }
})

// Start watching for DOM changes
watcher.start()

// Stop watching for DOM changes
watcher.end()
```


### Contributing to `watcher`

#### Installing a local project

You can install a local copy of the `watcher` project by running

```sh
git clone https://github.com/spiralx/watcher
```

from the command line, and then

```sh
cd watcher
yarn
```

to change to the project directory and install the project's dependencies from NPM.

#### Development process

When doing local development, run

```sh
yarn start
```

from the project directory to start the development build process. This builds the package from the source code and opens the demonstration page in your browser, then watches the project's source code files for any changes, which trigger rebuilding the package and reloading the demo page in your browser.

#### Testing

While the development build process is active, you can then run

```sh
yarn run test
```

from another shell to open the project test results page in your browser (it will open in a separate tab to the demo page), and then reload it whenever either the package has been rebuild, or when the test code has been changed in `test/tests.js`.

#### Other commands

To remove all of the files created by the development process run the following command:

```sh
yarn run clean
```

To run TSLint on the project's source code you can run the following command:

```sh
yarn run lint
```

#### Production build

You can use the command

```sh
yarn run build
```

to build the package from the source code without doing anything else.
