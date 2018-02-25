/* globals Watcher, mocha, should, describe, it, before, beforeEach, afterEach */

/* eslint-disable no-unused-expressions */

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

  const NOOP_CALLBACK = result => {}

  before(() => {
    div = document.getElementById('test-div')
  })

  // beforeEach(() => {
  // })

  afterEach(() => {
    if (watcher && watcher.connected) {
      watcher.disconnect()
    }

    div.innerHTML = ''
    watcher = null
    watch = null
  })

  describe('Creating a new Watcher', () => {
    it('should work without parameters', () => {
      watcher = new Watcher()

      console.info(watcher)

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
})
