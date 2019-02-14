import { call, concat, create, omit } from "../build/call-tree.cjs"

describe(`create`, () => {
  test(`typeof`, () => {
    expect(typeof create).toBe(`function`)
  })
})

describe(`call`, () => {
  test(`typeof`, () => {
    expect(typeof call).toBe(`function`)
  })
})

describe(`concat`, () => {
  test(`typeof`, () => {
    expect(typeof concat).toBe(`function`)
  })
})

describe(`omit`, () => {
  test(`typeof`, () => {
    expect(typeof omit).toBe(`function`)
  })
})
