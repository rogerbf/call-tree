const test = require("ava")
const sinon = require("sinon")
const { mergeWith } = require("../source/library/merge-with.js")

test("it is a function", (t) => {
  t.is(typeof mergeWith, "function")
})

test("calls the callback with the expected parameters", (t) => {
  const callback = sinon.fake()

  const parameters = {
    a: "a",
    b: { b1: "b1", b2: "b2", b3: { b31: "b31" } },
  }

  const tree = { a: () => {}, b: [() => {}, { b3: { b31: () => {} } }] }

  const expected = [
    [parameters.a, tree.a],
    [parameters.b, tree.b[0]],
    ["b31", tree.b[1].b3.b31],
  ]

  mergeWith(callback, parameters, tree)

  t.deepEqual(callback.args, expected)
})

test("returns the expected result", (t) => {
  const callback = (parameter) => parameter

  const parameters = {
    a: "a",
    b: { b1: "b1", b2: "b2", b3: { b31: "b31" } },
  }

  const tree = { a: () => {}, b: [() => {}, { b3: { b31: () => {} } }] }

  const expected = {
    a: "a",
    b: [{ b1: "b1", b2: "b2", b3: { b31: "b31" } }, { b3: { b31: "b31" } }],
  }

  const actual = mergeWith(callback, parameters, tree)

  t.deepEqual(actual, expected)
})
