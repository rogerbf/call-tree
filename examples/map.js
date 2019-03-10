const { map } = require(`../`)

const tree = {
  a: {
    b: path => path,
  },
  c: {
    d: [ { e: path => path } ],
  },
}

const callback = (fn, path) => fn(path)

console.log(JSON.stringify(map(tree, callback), null, 2))
// {
//   "a": {
//     "b": [
//       "a",
//       "b"
//     ]
//   },
//   "c": {
//     "d": [
//       {
//         "e": [
//           "c",
//           "d",
//           "e"
//         ]
//       }
//     ]
//   }
// }
