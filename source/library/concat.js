const concat = (input, addition) =>
  Object.entries(addition).reduce(
    (result, [key, value]) =>
      Object.assign(result, {
        [key]: !Object.prototype.hasOwnProperty.call(result, key)
          ? value
          : typeof value === `function` || Array.isArray(value)
          ? [].concat(result[key], value)
          : typeof result[key] === `object` &&
            !Array.isArray(result[key]) &&
            typeof value === `object`
          ? concat(result[key], value)
          : [].concat(result[key], value),
      }),
    { ...input },
  )

export default (tree = {}, ...trees) =>
  trees.reduce((result, tree) => concat(result, tree), {
    ...tree,
  })
