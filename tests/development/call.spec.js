import call from "../../source/library/call"

describe(`call`, () => {
  test(`typeof`, () => {
    expect(typeof call).toBe(`function`)
  })

  test(`()`, () => {
    expect(call()).toBe(undefined)
  })

  test(`without functions, no parameters`, () => {
    const tree = {
      version: `1.0.0`,
    }

    expect(call(tree)).toEqual({
      version: `1.0.0`,
    })
  })

  test(`without functions, with parameters`, () => {
    const tree = {
      version: `1.0.0`,
    }
    const parameters = { testing: [1, 2, 3] }
    const result = call(tree, parameters)

    expect(result).toEqual({
      version: `1.0.0`,
    })
  })

  test(`without functions, no parameters`, () => {
    const tree = {
      meta: {
        version: `1.0.0`,
      },
    }
    const result = call(tree)

    expect(result).toEqual({
      meta: {
        version: `1.0.0`,
      },
    })
  })

  test(`calls functions`, () => {
    const counter = jest.fn(() => 0)
    const bears = jest.fn(() => [])

    const tree = {
      counter,
      animals: {
        bears,
      },
    }

    const result = call(tree)

    expect(counter).toHaveBeenCalledTimes(1)
    expect(bears).toHaveBeenCalledTimes(1)
    expect(result).toEqual({
      counter: 0,
      animals: {
        bears: [],
      },
    })
  })

  test(`calls functions`, () => {
    const counter = jest.fn((parameters = 0) => parameters + 1)
    const bears = jest.fn((parameters = []) => [...parameters, `brown`])
    const cats = jest.fn((parameters = []) => [...parameters, `ragdoll`])

    const tree = {
      counter: counter,
      animals: {
        bears: bears,
        cats: cats,
      },
    }

    const parameters = {
      counter: 1,
      animals: {
        bears: [`grizzly`],
        cats: [`birman`],
      },
      untouched: {
        text: `still here`,
      },
    }

    const result = call(tree, parameters)

    expect(result).toEqual({
      counter: 2,
      animals: {
        bears: [`grizzly`, `brown`],
        cats: [`birman`, `ragdoll`],
      },
    })
  })

  test(`array`, () => {
    const b = jest.fn(() => `b`)

    const tree = {
      a: [
        1,
        `a`,
        {
          b,
        },
        () => `c`,
      ],
    }

    const expected = {
      a: [1, `a`, { b: `b` }, `c`],
    }

    expect(
      call(tree, {
        a: {
          b: `b`,
          c: `c`,
        },
      })
    ).toEqual(expected)
    expect(b).toHaveBeenCalledWith(`b`)
  })

  test(`nested array`, () => {
    const tree = {
      a: [
        [
          1,
          `a`,
          {
            b: jest.fn(() => `b`),
          },
          () => `c`,
        ],
      ],
    }

    const expected = {
      a: [[1, `a`, { b: `b` }, `c`]],
    }

    expect(call(tree)).toEqual(expected)
  })

  test(`forwards extra arguments`, () => {
    const a = jest.fn()
    const b = jest.fn()
    const c = jest.fn()

    const tree = {
      a,
      b: {
        b,
      },
      c: [c],
    }

    expect(call(tree, undefined, 1, 2, 3)).toEqual({
      a: undefined,
      b: {
        b: undefined,
      },
      c: [undefined],
    })

    expect(a).toHaveBeenCalledWith(undefined, 1, 2, 3)
    expect(b).toHaveBeenCalledWith(undefined, 1, 2, 3)
    expect(c).toHaveBeenCalledWith(undefined, 1, 2, 3)
  })
})
