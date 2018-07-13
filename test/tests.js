/* eslint-disable no-unused-expressions, no-unused-vars */
/* globals Watcher, EL, mocha, sinon, should, describe, it, before, after, beforeEach, afterEach */

mocha.setup({
  ui: 'bdd',
  ignoreLeaks: true
})

// const expect = chai.expect
// chai.should()

describe('Watcher', () => {
  let div
  let watcher
  let watch

  window.div = div = document.getElementById('test-div')

  const NOOP_CALLBACK = result => {}

  const CB_ARG = cb => cb.getCall(0).args[0]

  const checkResultForNodes = (cb, prop, ...nodes) => {
    CB_ARG(cb).should.have.property(prop)
      .which.eql(nodes)
  }

  const checkResultForChanges = (cb, prop, ...changes) => {
    const result = CB_ARG(cb)

    result.should.have.property(prop)
      .and.have.property('length')
      .which.equals(changes.length)

    for (let i = 0; i < changes.length; i++) {
      const resultChange = result[ prop ][ i ]

      for (const [ key, value ] of Object.entries(changes[ i ])) {
        resultChange.should.have.property(key)
          .which.eql(value)
      }
    }
  }

  function addWatch (selector, options = {}) {
    if (typeof selector === 'string') {
      options.selector = selector
    } else {
      options = selector
    }

    const cb = sinon.spy()
    watcher.add(options, cb)
    return cb
  }

  function changeOpts (options) {
    return {
      findExisting: false,
      events: 15,
      ...options
    }
  }

  function closeWatcher () {
    if (watcher && watcher.observing) {
      watcher.stop()
    }

    watcher = null
  }

  // ----------------------------------------------------

  beforeEach(() => {
    div.innerHTML = ''
  })

  afterEach(() => {
    watch = null
  })

  // ----------------------------------------------------

  describe('Creating a new Watcher', () => {
    afterEach(() => {
      closeWatcher()
    })

    it('should work without parameters', () => {
      watcher = new Watcher()

      watcher.should.be.instanceOf(Watcher)
      watcher.root.should.be.equal(document.body)
      watcher.debug.should.be.false()
      watcher.observing.should.be.false()
      watcher.watchCount.should.equal(0)
    })

    it('should work with a root node parameter', () => {
      watcher = new Watcher(div)

      watcher.should.be.instanceOf(Watcher)
      watcher.root.should.be.equal(div)
      watcher.debug.should.be.false()
      watcher.observing.should.be.false()
      watcher.watchCount.should.equal(0)
    })

    it('should work with a root node and debug parameters', () => {
      watcher = new Watcher(div, true)

      watcher.should.be.instanceOf(Watcher)
      watcher.root.should.be.equal(div)
      watcher.debug.should.be.true()
      watcher.observing.should.be.false()
      watcher.watchCount.should.equal(0)
    })
  })

  describe('Adding watches', () => {
    beforeEach(() => {
      watcher = new Watcher(div)
    })

    afterEach(() => {
      closeWatcher()
    })

    it('should throw an error if no callback passed', () => {
      should.throws(() => watcher.add({}))
      should.throws(() => watcher.add('div'))
    })

    it('should take an empty option object', () => {
      watch = watcher.add({}, NOOP_CALLBACK)

      should.exist(watch)

      watch.should.have.class('Watch')

      watch.selector.should.be.equal('*')
      should.equal(watch.context, null)
      watch.findExisting.should.be.true()
      watch.events.should.equal(1 + 2)

      watch.attributes.should.have.class('Set').and.have.size(0)

      watch.callback.should.equal(NOOP_CALLBACK)

      watcher.watchCount.should.equal(1)
      watcher.observing.should.be.false()
    })

    it('should take a selector string', () => {
      watch = watcher.add('div', NOOP_CALLBACK)

      should.exist(watch)

      watch.should.have.class('Watch')
        .and.have.property('selector')
        .which.equals('div')
    })

    it('should take just a selector', () => {
      watch = watcher.add({ selector: 'div' }, NOOP_CALLBACK)

      watch.should.have.class('Watch')
        .and.have.property('selector')
        .which.equals('div')
    })

    it('should take an attribute or attributes', () => {
      watch = watcher.add({ attribute: 'href' }, NOOP_CALLBACK)

      watch.should.have.property('attributes')
        .which.eql(new Set([ 'href' ]))

      watch = watcher.add({ attributes: [ 'href', 'rel', 'title' ] }, NOOP_CALLBACK)

      watch.should.have.property('attributes')
        .which.eql(new Set([ 'href', 'rel', 'title' ]))
    })
  })

  describe('Connecting and disconnecting', () => {
    beforeEach(() => {
      watcher = new Watcher(div)
    })

    afterEach(() => {
      closeWatcher()
    })

    it('start() should throw an error if no watches', () => {
      (() => watcher.start()).should.throw(Error)

      watcher.watchCount.should.equal(0)
      watcher.observing.should.be.false()
    })

    it('should start successfully if watches present and return itself', () => {
      watcher.add('p', NOOP_CALLBACK)

      should.doesNotThrow(() => watcher.start())

      watcher.start().should.equal(watcher)

      watcher.watchCount.should.equal(1)
      watcher.observing.should.be.true()
    })

    it('should work if start() called and already started', () => {
      watcher.add('p', NOOP_CALLBACK)

      should.doesNotThrow(() => watcher.start())

      should.doesNotThrow(() => watcher.start())

      watcher.watchCount.should.equal(1)
      watcher.observing.should.be.true()
    })

    it('should return itself from start()', () => {
      watcher.add('p', NOOP_CALLBACK)

      watcher.start().should.equal(watcher)
    })

    it('should work if stop() called when not observing', () => {
      should.doesNotThrow(() => watcher.stop())
    })

    it('should return itself from stop()', () => {
      watcher.add('p', NOOP_CALLBACK)

      watcher.stop().should.equal(watcher)
    })

    it('should stop observing on stop()', () => {
      watcher.add('p', NOOP_CALLBACK)

      watcher.start()
      watcher.observing.should.be.true()

      watcher.stop()
      watcher.observing.should.be.false()
    })
  })

  describe('Matching existing elements', () => {
    beforeEach(() => {
      watcher = new Watcher(div)
    })

    afterEach(() => {
      closeWatcher()
    })

    it('should matching the root node if selector matches', () => {
      const cb = addWatch('div')

      watcher.start()
      watcher.stop()

      cb.should.be.calledOnce()
      checkResultForNodes(cb, 'added', div)
    })

    it('should match existing nodes in subtree', () => {
      const cb = addWatch('p')

      const p1 = EL('p', 'Some text.')
      const p2 = EL('p', 'Some more text.')

      div.appendChild(p1)
      div.appendChild(EL('div', p2))

      watcher.start()
      watcher.stop()

      cb.should.be.calledOnce()
      checkResultForNodes(cb, 'added', p1, p2)
    })

    it('should not match existing nodes if findExisting is false', () => {
      const cb = addWatch('p', { findExisting: false })

      const p1 = EL('p', 'Some text.')
      const p2 = EL('p', 'Some more text.')

      div.appendChild(p1)
      div.appendChild(EL('div', p2))

      watcher.start()
      watcher.stop()

      cb.should.not.have.been.called()
    })
  })

  describe('Matching added elements', () => {
    beforeEach(() => {
      watcher = new Watcher(div)
    })

    afterEach(() => {
      closeWatcher()
    })

    it('should match on tag', () => {
      const cb = addWatch('span')

      watcher.start()

      const newNode = EL('span')
      div.appendChild(newNode)

      watcher.stop()

      cb.should.be.calledOnce()
      checkResultForNodes(cb, 'added', newNode)
    })

    it('should not match on other tags', () => {
      const cb = addWatch('span')

      watcher.start()

      div.appendChild(EL('p'))

      watcher.stop()

      cb.should.not.have.been.called()
    })

    it('should match on class', () => {
      const cb = addWatch('.foo')

      watcher.start()

      const newNode = EL('span.foo')
      div.appendChild(newNode)

      watcher.stop()

      cb.should.be.calledOnce()
      checkResultForNodes(cb, 'added', newNode)
    })

    it('should match on ID', () => {
      const cb = addWatch('#foo')

      watcher.start()

      const newNode = EL('#foo')
      div.appendChild(newNode)

      watcher.stop()

      cb.should.be.calledOnce()
      checkResultForNodes(cb, 'added', newNode)
    })

    it('should match on multiple selectors', () => {
      const cb = addWatch('p, .foo')

      watcher.start()

      const p1 = EL('p.foo')
      const p2 = EL('.foo')
      const p3 = EL('p')
      const newNode = EL('div', p1, p2, p3)
      div.appendChild(newNode)

      watcher.stop()

      cb.should.be.calledOnce()
      checkResultForNodes(cb, 'added', p1, p2, p3)
    })

    it('should not match elements added in the callback', () => {
      const cb = sinon.spy(result => {
        console.log(p1.childElementCount, result)
        if (p1.childElementCount === 0) {
          p1.appendChild(p2)
        }
      })

      watcher.add('p', cb)
      watcher.start()

      const p1 = EL('p.foo')
      const p2 = EL('p.bar')
      div.appendChild(p1)

      watcher.stop()

      console.log(div.innerHTML)

      cb.should.be.calledOnce()
      checkResultForNodes(cb, 'added', p1)
    })
  })

  describe('Matching removed elements', () => {
    let p1
    let p2
    let sp1

    beforeEach(() => {
      watcher = new Watcher(div)

      p1 = EL('p', 'Some text.')
      sp1 = EL('span', 'more')
      p2 = EL('p', 'Some ', sp1, ' text.')

      div.appendChild(p1)
      div.appendChild(EL('div', p2))
    })

    afterEach(() => {
      closeWatcher()
    })

    it('should match on tag', () => {
      const cb = addWatch('p', { findExisting: false })

      watcher.start()

      p1.remove()

      watcher.stop()

      cb.should.be.calledOnce()
      checkResultForNodes(cb, 'removed', p1)
    })

    it('should not match on other tags', () => {
      const cb = addWatch('p', { findExisting: false })

      watcher.start()

      sp1.remove()

      watcher.stop()

      cb.should.not.have.been.called()
    })

    it('should match multiple removed nodes', () => {
      const cb = addWatch('p', { findExisting: false })

      watcher.start()

      div.querySelectorAll('p').forEach(e => e.remove())

      watcher.stop()

      cb.should.be.calledOnce()
      checkResultForNodes(cb, 'removed', p1, p2)
    })
  })

  describe('Match attribute changes', () => {
    let p1
    let p2
    let sp1

    beforeEach(() => {
      watcher = new Watcher(div)

      p1 = EL('p', { 'id': 'foo' }, 'Some bold text.')
      p2 = EL('p', 'Some plain text.')

      div.appendChild(p1)
      div.appendChild(p2)
    })

    afterEach(() => {
      closeWatcher()
    })

    it('should match an attribute change on any element', () => {
      const cb = addWatch(changeOpts({ attribute: 'id' }))

      watcher.start()

      p1.setAttribute('id', 'bar')

      watcher.stop()

      cb.should.be.calledOnce()
      checkResultForChanges(cb, 'attributeChanges', {
        element: p1,
        name: 'id',
        value: 'bar',
        oldValue: 'foo'
      })
    })

    it('should match a new attribute on any element', () => {
      const cb = addWatch(changeOpts({ attribute: 'id' }))

      watcher.start()

      p2.setAttribute('id', 'bar')

      watcher.stop()

      cb.should.be.calledOnce()
      checkResultForChanges(cb, 'attributeChanges', {
        element: p2,
        name: 'id',
        value: 'bar',
        oldValue: null
      })
    })

    it('should match a removed attribute on any element', () => {
      const cb = addWatch(changeOpts({ attribute: 'id' }))

      watcher.start()

      p1.removeAttribute('id')

      watcher.stop()

      cb.should.be.calledOnce()
      checkResultForChanges(cb, 'attributeChanges', {
        element: p1,
        name: 'id',
        value: null,
        oldValue: 'foo'
      })
    })

    it('should match multiple attribute changes across elements', () => {
      const cb = addWatch(changeOpts({ attribute: 'id' }))

      watcher.start()

      p1.setAttribute('id', 'bar')
      p2.setAttribute('id', 'bar')

      watcher.stop()

      cb.should.be.calledOnce()
      checkResultForChanges(cb, 'attributeChanges', {
        element: p1,
        name: 'id',
        value: 'bar',
        oldValue: 'foo'
      }, {
        element: p2,
        name: 'id',
        value: 'bar',
        oldValue: null
      })
    })

    it('should match multiple different attribute changes across elements', () => {
      const cb = addWatch(changeOpts({ attributes: [ 'id', 'name' ] }))

      watcher.start()

      p1.setAttribute('id', 'bar')
      p2.setAttribute('name', 'p2')

      watcher.stop()

      cb.should.be.calledOnce()
      checkResultForChanges(cb, 'attributeChanges', {
        element: p1,
        name: 'id',
        value: 'bar',
        oldValue: 'foo'
      }, {
        element: p2,
        name: 'name',
        value: 'p2',
        oldValue: null
      })
    })
  })

  describe('Match text changes', () => {
    let p1
    let p2
    let sp1

    beforeEach(() => {
      watcher = new Watcher(div)

      p1 = EL('p', 'Some text')

      div.appendChild(p1)
    })

    afterEach(() => {
      closeWatcher()
    })

    it('should match a text change on any element', () => {
      const cb = addWatch(changeOpts({}))

      watcher.start()

      p1.textContent = 'New text'

      watcher.stop()

      cb.should.be.calledOnce()
      checkResultForChanges(cb, 'textChanges', {
        element: p1,
        value: 'New text',
        oldValue: 'Some text'
      })
    })

    it('should match multiple text changes on any element', () => {
      const cb = addWatch(changeOpts({}))

      watcher.start()

      p1.textContent = 'Mid text'
      p1.textContent = 'New text'

      watcher.stop()

      cb.should.be.calledOnce()
      checkResultForChanges(cb, 'textChanges', {
        element: p1,
        value: 'Mid text',
        oldValue: 'Some text'
      }, {
        element: p1,
        value: 'New text',
        oldValue: 'Mid text'
      })
    })
  })
})
