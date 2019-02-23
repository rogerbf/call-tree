const type = value => Object.prototype.toString.call(value)

const OBJECT = type({})
const ARRAY = type([])

const includes = (input, test) => {
  const typeOfInput = type(input)

  if (typeOfInput === OBJECT) {
    const result = Object.values(input).find(value => includes(value, test))
    return Boolean(result) || result === 0 ? true : false
  } else if (typeOfInput === ARRAY) {
    const result = input.find(value => includes(value, test))
    return Boolean(result) || result === 0 ? true : false
  } else {
    return input === test
  }
}

export default includes
