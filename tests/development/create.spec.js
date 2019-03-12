import create from "../../source/create"

describe(`create`, () => {
  it(`is a function`, () => {
    expect(typeof create).toEqual(`function`)
  })

  it(`has the expected api`, () => {
    const tree = create()

    expect(typeof tree).toEqual(`function`)
    expect(typeof tree.attach).toEqual(`function`)
    expect(typeof tree.prepare).toEqual(`function`)
    expect(tree.hasOwnProperty(`current`)).toEqual(true)
  })

  it(`throws if branch is not an object`, () => {
    const tree = create()

    expect(() => tree.attach()).toThrow()
    expect(() => tree.attach(``)).toThrow()
    expect(() => tree.attach(0)).toThrow()
    expect(() => tree.attach([])).toThrow()
    expect(() => tree.attach(() => {})).toThrow()
  })

  it(`initializes with initial value`, () => {
    const initial = { a: jest.fn() }
    const tree = create(initial)

    expect(tree.current).toEqual(initial)
  })

  // https://github.com/reduxjs/redux/blob/792ac5ae541a7c0792908df8f4e2da334184e74f/test/createStore.spec.js#L196
  it(`supports multiple branches`, () => {
    const tree = create()

    const listenerA = jest.fn()
    const listenerB = jest.fn()

    let unattachA = tree.attach({ a: listenerA })
    tree()
    expect(listenerA.mock.calls.length).toBe(1)
    expect(listenerB.mock.calls.length).toBe(0)

    tree()
    expect(listenerA.mock.calls.length).toBe(2)
    expect(listenerB.mock.calls.length).toBe(0)

    const unattachB = tree.attach({ b: listenerB })
    expect(listenerA.mock.calls.length).toBe(2)
    expect(listenerB.mock.calls.length).toBe(0)

    tree()
    expect(listenerA.mock.calls.length).toBe(3)
    expect(listenerB.mock.calls.length).toBe(1)

    unattachA()
    expect(listenerA.mock.calls.length).toBe(3)
    expect(listenerB.mock.calls.length).toBe(1)

    tree()
    expect(listenerA.mock.calls.length).toBe(3)
    expect(listenerB.mock.calls.length).toBe(2)

    unattachB()
    expect(listenerA.mock.calls.length).toBe(3)
    expect(listenerB.mock.calls.length).toBe(2)

    tree()
    expect(listenerA.mock.calls.length).toBe(3)
    expect(listenerB.mock.calls.length).toBe(2)

    unattachA = tree.attach({ a: listenerA })
    expect(listenerA.mock.calls.length).toBe(3)
    expect(listenerB.mock.calls.length).toBe(2)

    tree()
    expect(listenerA.mock.calls.length).toBe(4)
    expect(listenerB.mock.calls.length).toBe(2)
  })

  // https://github.com/reduxjs/redux/blob/792ac5ae541a7c0792908df8f4e2da334184e74f/test/createStore.spec.js#L243
  it(`only removes listener once when unattach is called`, () => {
    const tree = create()

    const listenerA = jest.fn()
    const listenerB = jest.fn()

    const unattachA = tree.attach({ a: listenerA })
    tree.attach({ b: listenerB })

    unattachA()
    unattachA()

    tree()
    expect(listenerA.mock.calls.length).toBe(0)
    expect(listenerB.mock.calls.length).toBe(1)
  })

  // https://github.com/reduxjs/redux/blob/792ac5ae541a7c0792908df8f4e2da334184e74f/test/createStore.spec.js#L259
  it(`only removes relevant listener when unattach is called`, () => {
    const tree = create()

    const listener = jest.fn()

    tree.attach({ a: listener })
    const unattachSecond = tree.attach({ a: listener })

    unattachSecond()
    unattachSecond()

    tree()
    expect(listener.mock.calls.length).toBe(1)
  })

  // https://github.com/reduxjs/redux/blob/792ac5ae541a7c0792908df8f4e2da334184e74f/test/createStore.spec.js#L273
  it(`supports removing a subscription within a subscription`, () => {
    const tree = create()

    const listenerA = jest.fn()
    const listenerB = jest.fn()
    const listenerC = jest.fn()

    tree.attach({ a: listenerA })
    const unattach = tree.attach({
      a: () => {
        listenerB()
        unattach()
      },
    })
    tree.attach({ a: listenerC })

    tree()
    tree()

    expect(listenerA.mock.calls.length).toBe(2)
    expect(listenerB.mock.calls.length).toBe(1)
    expect(listenerC.mock.calls.length).toBe(2)
  })

  // https://github.com/reduxjs/redux/blob/792ac5ae541a7c0792908df8f4e2da334184e74f/test/createStore.spec.js#L294
  it(`notifies all attached listeners about current regardless if any of them gets unattachd in the process`, () => {
    const tree = create()

    const unattachHandles = []
    const doUnattachAll = () => unattachHandles.forEach(unattach => unattach())

    const listener1 = jest.fn()
    const listener2 = jest.fn()
    const listener3 = jest.fn()

    unattachHandles.push(tree.attach({ a: () => listener1() }))
    unattachHandles.push(
      tree.attach({
        a: () => {
          listener2()
          doUnattachAll()
        },
      })
    )
    unattachHandles.push(tree.attach({ a: () => listener3() }))

    tree()
    expect(listener1.mock.calls.length).toBe(1)
    expect(listener2.mock.calls.length).toBe(1)
    expect(listener3.mock.calls.length).toBe(1)

    tree()
    expect(listener1.mock.calls.length).toBe(1)
    expect(listener2.mock.calls.length).toBe(1)
    expect(listener3.mock.calls.length).toBe(1)
  })

  // https://github.com/reduxjs/redux/blob/792ac5ae541a7c0792908df8f4e2da334184e74f/test/createStore.spec.js#L325
  it(`notifies only attached listeners active at the moment of current`, () => {
    const tree = create()

    const listener1 = jest.fn()
    const listener2 = jest.fn()
    const listener3 = jest.fn()

    let listener3Added = false
    const maybeAddThirdListener = () => {
      if (!listener3Added) {
        listener3Added = true
        tree.attach({ a: () => listener3() })
      }
    }

    tree.attach({ a: () => listener1() })
    tree.attach({
      a: () => {
        listener2()
        maybeAddThirdListener()
      },
    })

    tree()
    expect(listener1.mock.calls.length).toBe(1)
    expect(listener2.mock.calls.length).toBe(1)
    expect(listener3.mock.calls.length).toBe(0)

    tree()
    expect(listener1.mock.calls.length).toBe(2)
    expect(listener2.mock.calls.length).toBe(2)
    expect(listener3.mock.calls.length).toBe(1)
  })

  // https://github.com/reduxjs/redux/blob/792ac5ae541a7c0792908df8f4e2da334184e74f/test/createStore.spec.js#L357
  it(`uses the last snapshot of attached listeners during nested`, () => {
    const tree = create()

    const listener1 = jest.fn()
    const listener2 = jest.fn()
    const listener3 = jest.fn()
    const listener4 = jest.fn()

    let unattach4
    const unattach1 = tree.attach({
      a: () => {
        listener1()
        expect(listener1.mock.calls.length).toBe(1)
        expect(listener2.mock.calls.length).toBe(0)
        expect(listener3.mock.calls.length).toBe(0)
        expect(listener4.mock.calls.length).toBe(0)

        unattach1()
        unattach4 = tree.attach({ a: listener4 })
        tree()

        expect(listener1.mock.calls.length).toBe(1)
        expect(listener2.mock.calls.length).toBe(1)
        expect(listener3.mock.calls.length).toBe(1)
        expect(listener4.mock.calls.length).toBe(1)
      },
    })
    tree.attach({ a: listener2 })
    tree.attach({ a: listener3 })

    tree()
    expect(listener1.mock.calls.length).toBe(1)
    expect(listener2.mock.calls.length).toBe(2)
    expect(listener3.mock.calls.length).toBe(2)
    expect(listener4.mock.calls.length).toBe(1)

    unattach4()
    tree()
    expect(listener1.mock.calls.length).toBe(1)
    expect(listener2.mock.calls.length).toBe(3)
    expect(listener3.mock.calls.length).toBe(3)
    expect(listener4.mock.calls.length).toBe(1)
  })

  // https://github.com/reduxjs/redux/blob/792ac5ae541a7c0792908df8f4e2da334184e74f/test/createStore.spec.js#L413
  it(`does not leak private listeners array`, done => {
    const tree = create()

    tree.attach({
      a: function() {
        expect(this).toBe(undefined)
        done()
      },
    })

    tree()
  })

  test(`prepare`, () => {
    const tree = create()
    const listener = jest.fn()

    tree.attach({ a: listener, b: listener })

    const call = tree.prepare(({ a }) => ({ a }))

    call({ a: `a` })

    expect(listener.mock.calls.length).toBe(1)
    expect(listener.mock.calls[0]).toEqual([ `a` ])

    tree({ a: `a`, b: `b` })
    expect(listener.mock.calls.length).toBe(3)
    expect(listener.mock.calls[1]).toEqual([ `a` ])
    expect(listener.mock.calls[2]).toEqual([ `b` ])
  })
})
