import includes from "../../source/library/includes"

describe(`includes`, () => {
  test(`typeof`, () => {
    expect(typeof includes).toEqual(`function`)
  })

  test(`()`, () => {
    expect(includes()).toEqual(true)
  })

  test(`({}, () => {})`, () => {
    expect(includes({}, () => {})).toEqual(false)
  })

  test(`({ a: 0 }, 0)`, () => {
    const n = 0

    expect(includes({ a: n }, n)).toEqual(true)
  })

  test(`({ a: 1 }, 1)`, () => {
    const n = 1

    expect(includes({ a: n }, n)).toEqual(true)
  })

  test(`({ a: 'a' }, 'a')`, () => {
    expect(includes({ a: `a` }, `a`)).toEqual(true)
  })

  test(`({ a: fn }, fn)`, () => {
    const fn = () => {}

    expect(includes({ a: fn }, fn)).toEqual(true)
  })

  test(`([ fn ], fn)`, () => {
    const fn = () => {}

    expect(includes([ fn ], fn)).toEqual(true)
  })

  test(`([ 0 ], 0)`, () => {
    const n = 0

    expect(includes([ n ], n)).toEqual(true)
  })

  test(`([ 'a' ], 0)`, () => {
    expect(includes([ `a` ], 0)).toEqual(false)
  })

  test(`({ a: { b: fn } }, 1)`, () => {
    const n = 1

    expect(includes({ a: { b: () => {} } }, n)).toEqual(false)
  })

  test(`({ a: { b: fn } }, 1)`, () => {
    const fn = () => {}

    expect(includes({ a: { b: fn } }, fn)).toEqual(true)
  })

  test(`({ a: { b: fn, c: [ fnA, fnB ] } }, fnB)`, () => {
    const fn = () => {}
    const fnA = () => {}
    const fnB = () => {}

    expect(includes({ a: { b: fn, c: [ fnA, fnB ] } }, fnB)).toEqual(true)
  })

  test(`({ a: { b: fn, c: [ fnA, { d: fnB } ] } }, fnB)`, () => {
    const fn = () => {}
    const fnA = () => {}
    const fnB = () => {}

    expect(includes({ a: { b: fn, c: [ fnA, { d: fnB } ] } }, fnB)).toEqual(true)
  })

  test(`({ a: { b: fn, c: [ fnA, { d: fnB } ] } }, { a: { c: { d: fnB } } } )`, () => {
    const fn = () => {}
    const fnA = () => {}
    const fnB = () => {}

    expect(
      includes({ a: { b: fn, c: [ fnA, { d: fnB } ] } }, { a: { c: { d: fnB } } })
    ).toEqual(true)
  })
})
