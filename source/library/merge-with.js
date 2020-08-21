export const mergeWith = (callback, left, right) =>
  typeof right === "function"
    ? callback(left, right)
    : Array.isArray(right)
    ? right.map((x) => mergeWith(callback, left, x))
    : typeof right === "object"
    ? Object.keys(right).reduce(
        (result, key) =>
          Object.assign(result || {}, {
            [key]: mergeWith(
              callback,
              left ? left[key] : undefined,
              right[key]
            ),
          }),
        undefined
      )
    : undefined
