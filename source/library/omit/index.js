import {
  getDefaultObjValue,
  omitArray,
  omitFunction,
  omitObject,
} from "./helpers.js"

export const omit = (
  left,
  right,
  { obj = getDefaultObjValue(right), key } = {}
) =>
  typeof left === "function"
    ? omitFunction({ left, obj, key })
    : Array.isArray(right)
    ? omitArray({ left, right, obj, key, omit })
    : typeof left === "object" && typeof right === "object"
    ? omitObject({ left, right, obj, key, omit })
    : obj
