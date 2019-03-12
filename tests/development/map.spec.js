import map from "../../source/library/map"

describe(`map`, () => {
  test(`typeof`, () => {
    expect(typeof map).toEqual(`function`)
  })

  test(`()`, () => {
    expect(map()).toEqual({})
  })

  test(`('')`, () => {
    expect(map(``)).toEqual(``)
  })

  test(`({ a: () => {} })`, () => {
    const tree = { a: () => {} }

    expect(map(tree)).toEqual(tree)
  })

  test(`({ a: () => {}, b: () => {} })`, () => {
    const tree = { a: () => {}, b: () => {} }
    const callback = jest.fn((fn, path) => fn)

    expect(map(tree, callback)).toEqual(tree)
    expect(callback.mock.calls).toEqual([ [ tree.a, [ `a` ] ], [ tree.b, [ `b` ] ] ])
  })

  test(`({ a: [ () => {}, () => {} ] })`, () => {
    const tree = { a: [ () => {}, () => {} ] }
    const callback = jest.fn(fn => fn)

    expect(map(tree, callback)).toEqual(tree)
    expect(callback.mock.calls).toEqual([
      [ tree.a[0], [ `a` ] ],
      [ tree.a[1], [ `a` ] ],
    ])
  })

  test(`({ a: [ () => {}, () => {} ], b: [ () => {}, () => {} ] })`, () => {
    const tree = { a: [ () => {}, () => {} ], b: [ () => {}, () => {} ] }
    const callback = jest.fn(fn => fn)

    expect(map(tree, callback)).toEqual(tree)
    expect(callback.mock.calls).toEqual([
      [ tree.a[0], [ `a` ] ],
      [ tree.a[1], [ `a` ] ],
      [ tree.b[0], [ `b` ] ],
      [ tree.b[1], [ `b` ] ],
    ])
  })

  test(`({ a: [ { b: () => {} } ] })`, () => {
    const tree = { a: [ { b: () => {} } ] }
    const callback = jest.fn(fn => fn)

    expect(map(tree, callback)).toEqual(tree)
    expect(callback.mock.calls).toEqual([ [ tree.a[0].b, [ `a`, `b` ] ] ])
  })

  test(`({ a: [ { b: [ () => {}, () => {} ] } ] })`, () => {
    const tree = { a: [ { b: [ () => {}, () => {} ] } ] }
    const callback = jest.fn(fn => fn)

    expect(map(tree, callback)).toEqual(tree)
    expect(callback.mock.calls).toEqual([
      [ tree.a[0].b[0], [ `a`, `b` ] ],
      [ tree.a[0].b[1], [ `a`, `b` ] ],
    ])
  })

  test(`({ a: [ { b: [ () => {}, () => {} ] } ] })`, () => {
    const tree = {
      a: [ { b: [ () => {}, { c: () => {}, d: [ () => {}, () => {} ] } ] } ],
    }
    const callback = jest.fn(fn => fn)

    expect(map(tree, callback)).toEqual(tree)
    expect(callback.mock.calls).toEqual([
      [ tree.a[0].b[0], [ `a`, `b` ] ],
      [ tree.a[0].b[1].c, [ `a`, `b`, `c` ] ],
      [ tree.a[0].b[1].d[0], [ `a`, `b`, `d` ] ],
      [ tree.a[0].b[1].d[1], [ `a`, `b`, `d` ] ],
    ])
  })

  test(`({ a: [ fn, fn ] })`, () => {
    const fn = () => {}
    const tree = { a: [ fn, fn ] }
    const callback = jest.fn(fn => () => fn())
    const actual = map(tree, callback)

    expect(actual).not.toEqual(tree)
    expect(callback.mock.calls).toEqual([
      [ tree.a[0], [ `a` ] ],
      [ tree.a[1], [ `a` ] ],
    ])
    expect(actual.a[0]).not.toEqual(tree.a[0])
    expect(actual.a[1]).not.toEqual(tree.a[1])
  })
})
