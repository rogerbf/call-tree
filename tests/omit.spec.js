import test from "ava"
import { omit } from "../source/library/omit.js"

const getUniqueFunctions = (n) =>
  Array(n)
    .fill(undefined)
    .map(() => () => {})

test("it is a function", (t) => {
  t.is(typeof omit, "function")
})

test("it returns a new tree with function removed", (t) => {
  const a = () => {}
  const tree = { a }
  const slice = { a }

  const expected = {}
  const actual = omit(slice, tree)

  t.deepEqual(actual, expected)
})

test("it does not remove all instances of the function", (t) => {
  const a = () => {}
  const tree = { a, b: { a } }

  const expected = { a, b: { a } }
  const actual = omit(a, tree)

  t.deepEqual(actual, expected)
})

test("it returns a new tree with function removed (array)", (t) => {
  const one = () => {}
  const tree = { a: [one] }
  const slice = { a: one }

  const expected = {}
  const actual = omit(slice, tree)

  t.deepEqual(actual, expected)
})

test("it returns a new tree with function removed (array, many functions)", (t) => {
  const [one, two] = getUniqueFunctions(2)

  const tree = { a: [one, two] }
  const slice = { a: one }

  const expected = { a: two }
  const actual = omit(slice, tree)

  t.deepEqual(actual, expected)
})

test("it does not modify original object array", (t) => {
  const [one, two] = getUniqueFunctions(2)

  const tree = { a: [one, two] }
  const slice = { a: one }

  omit(slice, tree)

  t.is(tree.a.length, 2)
})

test("it returns a new tree with function removed (object within array)", (t) => {
  const [one, two] = getUniqueFunctions(2)

  const tree = { a: [one, { b: two }] }
  const slice = { a: { b: two } }

  const expected = { a: one }
  const actual = omit(slice, tree)

  t.deepEqual(actual, expected)
})

test("(slice, tree) shallow", (t) => {
  const [one, two] = getUniqueFunctions(2)

  const tree = {
    a: one,
    // A single function in a array is not default behavior, different from v2
    b: [two],
  }

  const slice = { a: one }

  const expected = { b: [two] }
  const actual = omit(slice, tree)

  t.deepEqual(actual, expected)
})

test("(slice, tree) deep #1", (t) => {
  const [one, two, three] = getUniqueFunctions(3)

  const tree = {
    a: one,
    b: {
      c: {
        d: two,
        e: [three],
      },
    },
  }

  const slice = { b: { c: { d: two } } }

  const expected = {
    a: one,
    b: {
      c: {
        e: [three],
      },
    },
  }

  const actual = omit(slice, tree)

  t.deepEqual(actual, expected)
})

test("(slice, tree) deep #2", (t) => {
  const [one, two, three, four] = getUniqueFunctions(4)

  const tree = {
    a: one,
    b: {
      c: {
        d: two,
        e: [three, four],
      },
    },
  }

  const slice = { b: { c: { e: three } } }

  const expected = {
    a: one,
    b: {
      c: {
        d: two,
        e: four,
      },
    },
  }

  const actual = omit(slice, tree)

  t.deepEqual(actual, expected)
})

test("(slice, tree) deep #3", (t) => {
  const [one, two, three, four, five] = getUniqueFunctions(5)

  const tree = {
    a: one,
    b: {
      c: {
        d: two,
        e: [three, four, five],
      },
    },
  }

  const slice = { b: { c: { e: four } } }

  const expected = {
    a: one,
    b: {
      c: {
        d: two,
        e: [three, five],
      },
    },
  }

  const actual = omit(slice, tree)

  t.deepEqual(actual, expected)
})

test("(slice, tree) -> tree #1", (t) => {
  const [one, two] = getUniqueFunctions(2)

  const tree = {
    a: one,
  }

  const slice = {
    b: two,
  }

  const expected = {
    a: one,
  }

  const actual = omit(slice, tree)

  t.deepEqual(actual, expected)
})

test("(slice, tree) -> tree #2", (t) => {
  const one = () => {}

  const tree = {
    a: one,
  }

  const slice = {
    a: 1,
  }

  const expected = {
    a: one,
  }

  const actual = omit(slice, tree)

  t.deepEqual(actual, expected)
})

test("(slice, tree) -> tree #3", (t) => {
  const [one, two] = getUniqueFunctions(2)

  const tree = {
    a: [one, { b: two }, { b: two }],
  }

  const slice = {
    a: { b: two },
  }

  const expected = { a: one }

  const actual = omit(slice, tree)

  t.deepEqual(actual, expected)
})

test("(slice, tree) -> tree #4", (t) => {
  const [one, two] = getUniqueFunctions(2)

  const tree = {
    a: [one, { b: two }, { b: { c: two } }],
  }

  const slice = {
    a: { b: { c: two } },
  }

  const expected = {
    a: [{ b: two }, one],
  }

  const actual = omit(slice, tree)

  t.deepEqual(actual, expected)
})

test("(slice, tree) -> tree #5", (t) => {
  const [one, two] = getUniqueFunctions(2)

  const tree = {
    a: [one, { b: [two, two] }, { b: two }],
  }

  const slice = {
    a: { b: two },
  }

  const expected = {
    a: one,
  }

  const actual = omit(slice, tree)

  t.deepEqual(actual, expected)
})

test("(slice, tree) -> tree #6", (t) => {
  const [one, two, three, four] = getUniqueFunctions(4)

  const tree = {
    a: [one, { b: [two, three] }, { b: four }],
  }

  const slice = {
    a: { b: three },
  }

  const expected = {
    a: [{ b: two }, { b: four }, one],
  }

  const actual = omit(slice, tree)

  t.deepEqual(actual, expected)
})
