/* eslint no-console: 0 */
const { includes } = require(`../`)

const e = () => {}
const f = () => {}

const tree = {
  a: {
    b: () => {},
  },
  c: {
    d: [{ e }],
  },
}

console.log(includes(tree, e)) // true
console.log(includes(tree, f)) // false
