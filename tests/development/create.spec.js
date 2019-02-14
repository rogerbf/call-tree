import create from "../../source/create"

describe(`create`, () => {
  test(`typeof`, () => {
    expect(typeof create).toEqual(`function`)
  })

  test(`()`, () => {
    const tree = create()

    expect(typeof tree).toEqual(`function`)
    expect(typeof tree.attach).toEqual(`function`)
    expect(typeof tree.detach).toEqual(`function`)
    expect(tree.current).toEqual({})
    expect(tree()).toEqual(undefined)
  })

  test(`({ a: () => {} })`, () => {
    const initialTree = { a: () => {} }

    const tree = create(initialTree)

    expect(typeof tree).toEqual(`function`)
    expect(typeof tree.attach).toEqual(`function`)
    expect(typeof tree.detach).toEqual(`function`)
    expect(tree.current).toEqual({ a: initialTree.a })
  })

  test(`detach`, () => {
    const initialTree = { a: () => {} }

    const tree = create(initialTree)

    expect(tree.detach({ a: initialTree.a })).toEqual(tree)
    expect(tree.current).toEqual({})
    expect(initialTree).toEqual({ a: expect.any(Function) })
  })

  test(`attach`, () => {
    const tree = create()

    const branches = [ { a: () => {} }, { a: () => {} } ]

    expect(tree.attach(branches[0])).toEqual(tree)
    expect(tree.current).toEqual({ a: branches[0].a })

    tree.attach(branches[1])

    expect(tree.current).toEqual({ a: [ branches[0].a, branches[1].a ] })
  })
})
