import { mergeWith } from "../source/index.js"

const callback = (data, fn) => fn(data)

const tree = {
  timestamp: (ms) => new Date(ms).toISOString(),
  payload: (data) => JSON.stringify(data),
}

const data = { timestamp: 1598076530245, payload: { message: "hello" } }

console.log(mergeWith(callback, data, tree))
// {
//   timestamp: '2020-08-22T06:08:50.245Z',
//   payload: '{"message":"hello"}'
// }
