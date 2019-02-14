# call-tree

```javascript
import { create } from "call-tree"

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
```

## api

### `create([tree])`

#### `.attach([ ...branches ])`

#### `.detach([ ...branches ])`

#### `.current`

### `call(tree[,parameters[, ...args ]])`

```javascript
import { call } from "call-tree"
```

### `concat(tree[, ...trees])`

```javascript
import { concat } from "call-tree"

concat(
  { a: () => {} },
  { a: () => {}, b: () => {} }
)
// {
//   a: [
//     () => {},
//     () => {}
//   ],
//   b: () => {}
// }
```

### `omit(tree[, ...trees])`

```javascript
import { omit } from "call-tree"

const a = () => {}
const b = () => {}

omit(
  { x: [ a, b ] },
  { x: b }
)
// { x: a }
```