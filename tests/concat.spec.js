const test = require("ava")
const { concat } = require("../source/library/concat.js")

test("typeof", (t) => {
  t.is(typeof concat, "function")
})

test("shallow concat", (t) => {
  const tree = Object.freeze({
    a: () => {},
    b: [() => {}],
  })

  const updates = {
    a: () => {},
    b: () => {},
  }

  const expected = {
    a: [tree.a, updates.a],
    b: [tree.b[0], updates.b],
  }

  const actual = concat(updates, tree)

  t.deepEqual(actual, expected)
  t.is(typeof tree.a, "function")
  t.is(tree.b.length, 1)
})

test("deep concat", (t) => {
  const tree = Object.freeze({
    a: () => {},
    b: () => {},
    c: {
      d: "d",
      e: {
        f: 1,
        g: () => {},
      },
    },
  })

  const updates = {
    a: () => {},
    b: [() => {}, () => {}],
    c: {
      e: () => {},
    },
  }

  const expected = {
    a: [tree.a, updates.a],
    b: [tree.b, ...updates.b],
    c: {
      ...tree.c,
      e: [tree.c.e, updates.c.e],
    },
  }

  const actual = concat(updates, tree)

  t.deepEqual(actual, expected)
})

test("({ a: () => {} }, { a: { b: () => {} } })", (t) => {
  const tree = { a: () => {} }
  const updates = { a: { b: () => {} } }

  const expected = {
    a: [tree.a, updates.a],
  }

  const actual = concat(updates, tree)

  t.deepEqual(actual, expected)
})

test("({ a: [ () => {} ] }, { a: { b: () => {} } })", (t) => {
  const tree = { a: [() => {}] }
  const updates = { a: { b: () => {} } }

  const expected = {
    a: [tree.a[0], updates.a],
  }

  const actual = concat(updates, tree)

  t.deepEqual(actual, expected)
})

test("({ a: 1 }, { a: { b: () => {} } })", (t) => {
  const tree = { a: 1 }
  const updates = { a: { b: () => {} } }

  const expected = {
    a: [tree.a, updates.a],
  }

  const actual = concat(updates, tree)

  t.deepEqual(actual, expected)
})

test("({ a: 1 }, { a: 2 })", (t) => {
  const tree = { a: 1 }
  const updates = { a: 2 }

  const expected = {
    a: [1, 2],
  }

  const actual = concat(updates, tree)

  t.deepEqual(actual, expected)
})

test("({}, { a: 1 })", (t) => {
  const tree = {}
  const updates = { a: 1 }

  const expected = {
    a: 1,
  }

  const actual = concat(updates, tree)

  t.deepEqual(actual, expected)
})

test("does not add duplicates", (t) => {
  const a = () => {}
  const tree = { a }
  const updates = { a }

  const expected = { a }
  const actual = concat(tree, updates)

  t.deepEqual(actual, expected)
})
