export const includes = (left, right) =>
  Array.isArray(right)
    ? right.find((value) => includes(left, value)) !== undefined
    : typeof left === "object" && typeof right === "object"
    ? Object.entries(right).reduce(
        (result, [key, value]) =>
          Object.prototype.hasOwnProperty.call(left, key)
            ? result || includes(left[key], value)
            : result || false,

        false
      )
    : typeof right === "object"
    ? Object.values(right).find((value) => includes(left, value)) !== undefined
    : left === right
