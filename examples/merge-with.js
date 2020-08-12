const { mergeWith } = require("../")

const callback = (data, fn) => fn(data)

const tree = {
  timestamp: (ms) => new Date(ms).toISOString(),
  payload: (data) => JSON.stringify(data),
}

console.log(
  mergeWith(
    callback,
    { timestamp: Date.now(), payload: { message: "hello" } },
    tree
  )
)
// {
//   timestamp: '2020-08-03T20:00:42.924Z',
//   payload: '{"message":"hello"}'
// }
