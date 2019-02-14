import omit from "../../source/library/omit"

describe(`omit`, () => {
  test(`typeof`, () => {
    expect(typeof omit).toEqual(`function`)
  })

  test(`()`, () => {
    expect(omit()).toEqual({})
  })

  test(`(tree)`, () => {
    const tree = {
      a: () => {},
      b: [ () => {} ],
    }

    expect(omit(tree)).toEqual(tree)
  })

  test(`(tree, branch) shallow`, () => {
    const tree = {
      a: () => {},
      b: [ () => {} ],
    }

    const branch = { a: tree.a }

    expect(omit(tree, branch)).toEqual({ b: tree.b })
    expect(tree).toEqual(
      expect.objectContaining({
        a: expect.any(Function),
        b: expect.arrayContaining([ expect.any(Function) ]),
      })
    )
  })

  test(`(tree, branch, branch) shallow`, () => {
    const tree = {
      a: () => {},
      b: [ () => {} ],
    }

    const branches = [ { a: tree.a }, { b: tree.b } ]

    expect(omit(tree, ...branches)).toEqual({})
    expect(tree).toEqual(
      expect.objectContaining({
        a: expect.any(Function),
        b: expect.arrayContaining([ expect.any(Function) ]),
      })
    )
  })

  test(`(tree, branch) deep #1`, () => {
    const tree = {
      a: () => {},
      b: {
        c: {
          d: () => {},
          e: [ () => {} ],
        },
      },
    }

    const branch = { b: { c: { d: tree.b.c.d } } }

    expect(omit(tree, branch)).toEqual({
      a: tree.a,
      b: {
        c: {
          e: tree.b.c.e,
        },
      },
    })

    expect(tree).toEqual(
      expect.objectContaining({
        a: expect.any(Function),
        b: {
          c: {
            d: expect.any(Function),
            e: expect.arrayContaining([ expect.any(Function) ]),
          },
        },
      })
    )
  })

  test(`(tree, branch) deep #2`, () => {
    const tree = {
      a: () => {},
      b: {
        c: {
          d: () => {},
          e: [ () => {}, () => {} ],
        },
      },
    }

    const branch = { b: { c: { e: [ tree.b.c.e[0] ] } } }

    expect(omit(tree, branch)).toEqual({
      a: tree.a,
      b: {
        c: {
          d: tree.b.c.d,
          e: tree.b.c.e[1],
        },
      },
    })

    expect(tree).toEqual(
      expect.objectContaining({
        a: expect.any(Function),
        b: {
          c: {
            d: expect.any(Function),
            e: expect.arrayContaining([
              expect.any(Function),
              expect.any(Function),
            ]),
          },
        },
      })
    )
  })

  test(`(tree, branch) deep #3`, () => {
    const tree = {
      a: () => {},
      b: {
        c: {
          d: () => {},
          e: [ () => {}, () => {}, () => {} ],
        },
      },
    }

    const branch = { b: { c: { e: [ tree.b.c.e[1] ] } } }

    expect(omit(tree, branch)).toEqual({
      a: tree.a,
      b: {
        c: {
          d: tree.b.c.d,
          e: [ tree.b.c.e[0], tree.b.c.e[2] ],
        },
      },
    })

    expect(tree).toEqual(
      expect.objectContaining({
        a: expect.any(Function),
        b: {
          c: {
            d: expect.any(Function),
            e: expect.arrayContaining([
              expect.any(Function),
              expect.any(Function),
              expect.any(Function),
            ]),
          },
        },
      })
    )
  })

  test(`(tree, branch) -> tree`, () => {
    const tree = {
      a: () => {},
    }
    const branch = {
      b: () => {},
    }

    expect(omit(tree, branch)).toEqual({
      a: expect.any(Function),
    })
  })

  test(`(tree, branch) -> tree`, () => {
    const tree = {
      a: () => {},
    }
    const branch = {
      a: 1,
    }

    expect(omit(tree, branch)).toEqual({
      a: expect.any(Function),
    })
  })

  test(`(tree, branch) -> tree`, () => {
    const tree = {
      a: [ () => {}, { b: console.log }, { b: console.log } ],
    }
    const branch = {
      a: { b: console.log },
    }

    expect(omit(tree, branch)).toEqual({
      a: expect.any(Function),
    })
  })

  test(`(tree, branch) -> tree`, () => {
    const tree = {
      a: [ () => {}, { b: console.log }, { b: { c: console.log } } ],
    }
    const branch = {
      a: { b: { c: console.log } },
    }

    expect(omit(tree, branch)).toEqual({
      a: [ tree.a[0], tree.a[1] ],
    })
  })

  test(`(tree, branch) -> tree`, () => {
    const tree = {
      a: [ () => {}, { b: [ console.log, console.log ] }, { b: console.log } ],
    }

    const branch = {
      a: { b: console.log },
    }

    expect(omit(tree, branch)).toEqual({
      a: tree.a[0],
    })
  })

  test(`(tree, branch) -> tree`, () => {
    const tree = {
      a: [ () => {}, { b: [ () => {}, () => {} ] }, { b: () => {} } ],
    }

    const branch = {
      a: { b: tree.a[1].b[1] },
    }

    expect(omit(tree, branch)).toEqual({
      a: [ tree.a[0], { b: tree.a[1].b[0] }, { b: tree.a[2].b } ],
    })
  })
})
