const toString = value => Object.prototype.toString.call(value)

const FUNCTION = toString(Function)
const OBJECT = toString({})
const ARRAY = toString([])

const map = (input = {}, callback, path = []) => {
  switch (toString(input)) {
    case FUNCTION:
      return callback ? callback(input, path) : input
    case OBJECT:
      return Object.entries(input).reduce(
        (result, [key, value]) =>
          Object.assign(result, {
            [key]: map(value, callback, path.concat(key)),
          }),
        {}
      )
    case ARRAY:
      return input.map(value => map(value, callback, path))
    default:
      return input
  }
}

export default map
