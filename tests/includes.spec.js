import test from "ava"
import { includes } from "../source/library/includes.js"

test("typeof", (t) => {
  t.is(typeof includes, "function")
})

test("(() => {}, {})", (t) => {
  const fn = () => {}
  const tree = {}

  t.false(includes(fn, tree))
})

test("(fn, { a: fn })", (t) => {
  const fn = () => {}
  const tree = { a: fn }

  t.true(includes(fn, tree))
})

test("(fn, [ fn ])", (t) => {
  const fn = () => {}
  const tree = [fn]

  t.true(includes(fn, tree))
})

test("(fn, { a: { b: fn } })", (t) => {
  const fn = () => {}
  const tree = { a: { b: fn } }

  t.true(includes(fn, tree))
})

test("(fnB, { a: { b: fn, c: [ fnA, fnB ] } })", (t) => {
  const fn = () => {}
  const fnA = () => {}
  const fnB = () => {}
  const tree = { a: { b: fn, c: [fnA, fnB] } }

  t.true(includes(fnB, tree))
})

test("(fnB, { a: { b: fn, c: [ fnA, { d: fnB } ] } })", (t) => {
  const fn = () => {}
  const fnA = () => {}
  const fnB = () => {}
  const tree = { a: { b: fn, c: [fnA, { d: fnB }] } }

  t.true(includes(fnB, tree))
})

test("({ a: { c: { d: fnB } } }, { a: { b: fn, c: [ fnA, { d: fnB } ] } })", (t) => {
  const fn = () => {}
  const fnA = () => {}
  const fnB = () => {}
  const tree = { a: { b: fn, c: [fnA, { d: fnB }] } }

  t.true(includes({ a: { c: { d: fnB } } }, tree))
})
