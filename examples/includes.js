import { includes } from "../source/index.js"

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

console.log(includes(e, tree)) // true
console.log(includes({ c: { d: { e } } }, tree)) // true
console.log(includes(f, tree)) // false
