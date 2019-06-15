const type = value => Object.prototype.toString.call(value)

const OBJECT = type({})
const ARRAY = type([])

const includes = (input, test) => {
  const typeOfInput = type(input)
  const typeOfTest = type(test)

  if (typeOfInput === OBJECT) {
    if (typeOfTest === OBJECT) {
      return Object.entries(input).reduce((result, [key, value]) => {
        if (test.hasOwnProperty(key)) {
          return result || includes(value, test[key])
        } else {
          return result || false
        }
      }, false)
    } else {
      const result = Object.values(input).find(value => includes(value, test))
      return Boolean(result) || result === 0 ? true : false
    }
  } else if (typeOfInput === ARRAY) {
    const result = input.find(value => includes(value, test))
    return Boolean(result) || result === 0 ? true : false
  } else {
    return input === test
  }
}

export default includes
