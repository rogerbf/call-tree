const concatFunction = (fn, target) =>
  Array.isArray(target)
    ? [...new Set([].concat(target, fn))]
    : fn === target
    ? fn
    : [].concat(target, fn)

export const concat = (branch, tree) =>
  Object.entries(branch).reduce(
    (result, [key, value]) =>
      Object.assign(result, {
        [key]: !Object.prototype.hasOwnProperty.call(result, key)
          ? value
          : typeof value === "function"
          ? concatFunction(value, result[key])
          : Array.isArray(value)
          ? [].concat(result[key], value)
          : typeof result[key] === "object" &&
            !Array.isArray(result[key]) &&
            typeof value === "object"
          ? concat(value, result[key])
          : [].concat(result[key], value),
      }),
    { ...tree }
  )
