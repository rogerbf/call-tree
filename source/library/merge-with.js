export const mergeWith = (callback, left, right) =>
  typeof right === "function"
    ? callback(left, right)
    : Array.isArray(right)
    ? right.map((x) => mergeWith(callback, left, x))
    : typeof right === "object"
    ? Object.keys(left).reduce(
        (result, key) =>
          right[key] && left[key] !== undefined
            ? Object.assign(result || {}, {
                [key]: mergeWith(callback, left[key], right[key]),
              })
            : result,
        undefined
      )
    : undefined
