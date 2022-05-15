export const omitFunctionFromArray = (fn, obj, key) => {
  const arr = obj[key].filter((element) => element !== fn)

  switch (arr.length) {
    case 0:
      delete obj[key]
      break
    case 1:
      obj[key] = arr.pop()
      break
    default:
      obj[key] = arr
  }

  return obj
}

export const omitFunctionFromObject = (fn, obj, key) => {
  obj[key] === fn && delete obj[key]
  return obj
}

export const omitFunction = ({ left, obj, key }) =>
  Array.isArray(obj[key])
    ? omitFunctionFromArray(left, obj, key)
    : omitFunctionFromObject(left, obj, key)

export const maybeCopy = (right) =>
  Array.isArray(right)
    ? [...right]
    : typeof right === "object"
    ? { ...right }
    : right

const processRight = (arr, { left, right, omit }) =>
  right.reduce((out, element) => {
    const result = omit(left, element)

    if (typeof result !== "object") {
      out.splice(-1, 0, result)
    } else {
      Object.keys(result).length && out.splice(-1, 0, result)
    }

    return out
  }, arr)

const updateObject = (arr, { obj, key }) => {
  switch (arr.length) {
    case 0:
      delete obj[key]
      break
    case 1:
      obj[key] = arr.pop()
      break
    default:
      obj[key] = arr
  }

  return obj
}

export const omitArray = (state) =>
  [processRight, updateObject].reduce(
    (previous, next) => next(previous, state),
    []
  )

export const omitObject = ({ left, obj, omit, key }) =>
  Object.entries(left).reduce(
    (obj, [key, value]) => {
      if (Object.hasOwnProperty.call(obj, key)) {
        omit(value, obj[key], { obj, key })

        if (
          typeof obj[key] === "object" &&
          Object.values(obj[key]).length === 0
        ) {
          delete obj[key]
        }
      }

      return obj
    },
    key ? obj[key] : obj
  )
