import { call, concat, create, includes, map, omit } from "../"

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

describe(`includes`, () => {
  test(`typeof`, () => {
    expect(typeof includes).toBe(`function`)
  })
})

describe(`map`, () => {
  test(`typeof`, () => {
    expect(typeof map).toBe(`function`)
  })
})
