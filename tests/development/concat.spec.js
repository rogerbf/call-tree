import concat from "../../source/library/concat"

describe(`concat`, () => {
  test(`typeof`, () => {
    expect(typeof concat).toBe(`function`)
  })

  test(`()`, () => {
    expect(concat()).toEqual({})
  })

  test(`shallow concat`, () => {
    const tree = {
      a: () => {},
      b: [ () => {} ],
    }
    const changes = {
      a: () => {},
      b: () => {},
    }
    const expected = {
      a: [ tree.a, changes.a ],
      b: [ tree.b[0], changes.b ],
    }

    expect(concat(tree, changes)).toEqual(expected)

    expect(tree).toEqual({
      a: expect.any(Function),
      b: expect.arrayContaining([ expect.any(Function) ]),
    })
  })

  test(`deep concat`, () => {
    const tree = {
      a: () => {},
      b: () => {},
      c: {
        d: `d`,
        e: {
          f: 1,
          g: () => {},
        },
      },
    }

    const changes = {
      a: () => {},
      b: [ () => {}, () => {} ],
      c: {
        e: () => {},
      },
    }

    const expected = {
      a: [ tree.a, changes.a ],
      b: [ tree.b, ...changes.b ],
      c: {
        ...tree.c,
        e: [ tree.c.e, changes.c.e ],
      },
    }

    expect(concat(tree, changes)).toEqual(expected)

    expect(tree).toEqual({
      a: expect.any(Function),
      b: expect.any(Function),
      c: {
        d: `d`,
        e: {
          f: 1,
          g: expect.any(Function),
        },
      },
    })
  })

  test(`concat multiple trees`, () => {
    const trees = [
      { a: () => {} },
      { b: () => {} },
      {
        a: () => {},
        c: {
          d: () => {},
        },
      },
      { c: { d: [ () => {}, () => {} ] } },
    ]

    const expected = {
      a: [ trees[0].a, trees[2].a ],
      b: trees[1].b,
      c: {
        d: [ trees[2].c.d, ...trees[3].c.d ],
      },
    }

    expect(concat(...trees)).toEqual(expected)
  })

  test(`({ a: () => {} }, { a: { b: () => {} } })`, () => {
    const tree = { a: () => {} }
    const branch = { a: { b: () => {} } }
    const expected = {
      a: [ tree.a, branch.a ],
    }

    expect(concat(tree, branch)).toEqual(expected)
  })

  test(`({ a: [ () => {} ] }, { a: { b: () => {} } })`, () => {
    const tree = { a: [ () => {} ] }
    const branch = { a: { b: () => {} } }
    const expected = {
      a: [ tree.a[0], branch.a ],
    }

    expect(concat(tree, branch)).toEqual(expected)
  })

  test(`({ a: 1 }, { a: { b: () => {} } })`, () => {
    const tree = { a: 1 }
    const branch = { a: { b: () => {} } }
    const expected = {
      a: [ tree.a, branch.a ],
    }

    expect(concat(tree, branch)).toEqual(expected)
  })

  test(`({ a: 1 }, { a: 2 })`, () => {
    const tree = { a: 1 }
    const branch = { a: 2 }
    const expected = {
      a: [ 1, 2 ],
    }

    expect(concat(tree, branch)).toEqual(expected)
  })

  test(`({}, { a: 1 })`, () => {
    const tree = {}
    const branch = { a: 1 }
    const expected = {
      a: 1,
    }

    expect(concat(tree, branch)).toEqual(expected)
  })

  test(`example`, () => {
    const steps = [
      { a: { b: () => {} } },
      { a: { b: () => {} } },
      { a: () => {} },
    ]

    const tree = concat({}, ...steps)

    expect(tree).toEqual({
      a: [ { b: [ steps[0].a.b, steps[1].a.b ] }, steps[2].a ],
    })
  })
})
