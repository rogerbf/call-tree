const test = require("ava")
const sinon = require("sinon")
const { map } = require("../source/library/map.js")

test("it is a function", (t) => {
  t.is(typeof map, "function")
})

test("calls the callback with the expected arguments", (t) => {
  const callback = sinon.fake()

  const tree = {
    a: {
      b: {
        c: [{ d: () => {}, e: () => {} }, { f: [{ g: () => {} }] }],
      },
      h: () => {},
    },
  }

  const expected = [
    [tree.a.b.c[0].d, { key: "d", path: ["a", "b", "c", "d"] }],
    [tree.a.b.c[0].e, { key: "e", path: ["a", "b", "c", "e"] }],
    [tree.a.b.c[1].f[0].g, { key: "g", path: ["a", "b", "c", "f", "g"] }],
    [tree.a.h, { key: "h", path: ["a", "h"] }],
  ]

  map(callback, tree)

  t.deepEqual(callback.args, expected)
})

test("it returns the expected result", (t) => {
  const callback = (_, { key }) => key

  const tree = {
    a: {
      b: {
        c: [{ d: () => {}, e: () => {} }, { f: [{ g: () => {} }] }],
      },
      h: () => {},
    },
  }

  const expected = {
    a: {
      b: {
        c: [{ d: "d", e: "e" }, { f: [{ g: "g" }] }],
      },
      h: "h",
    },
  }

  const actual = map(callback, tree)

  t.deepEqual(actual, expected)
})

test("({ a: [ fn, fn ] })", (t) => {
  const fn = () => 1
  const tree = { a: [fn, fn] }
  const callback = sinon.fake((fn) => fn())

  const expected = { a: [1, 1] }
  const actual = map(callback, tree)

  t.deepEqual(actual, expected)
})
