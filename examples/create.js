/* eslint no-console: 0 */
const { create } = require(`../`)

const tree = create({ x: console.log })

const parameters = {
  x: `x`,
  y: {
    z: `z`,
  },
}

tree.attach({ y: { z: console.log } })

tree(parameters, 1, 2, 3)
// x 1 2 3
// z 1 2 3

tree.attach({ y: console.log })

tree(parameters)
// x
// z
// { z: 'z' }
