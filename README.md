# call-tree

An exploratory library for working objects containing functions.

## `concat(object, object)`

Creates an object with values from both objects without adding duplicates where both nodes are the same function.

```javascript
import { concat } from "call-tree"

concat({ a: () => {}, b: () => {} }, { a: () => {} })
// {
//   a: [
//     () => {},
//     () => {}
//   ],
//   b: () => {}
// }
```

## `includes(value, object)`

Returns `true` if value can be found in object, `false` if not. The value can either be a function or an object with a single leaf node of type function.

```javascript
import { includes } from "call-tree"

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

includes(e, tree) // true
includes({ c: { d: { e } } }) // true
includes(f, tree) // false
```

## `map(callback, object)`

Creates an object with the result of calling the callback with any function found in object.

The callback is called with two arguments: `(function, { key, path })`.

```javascript
import { map } from "call-tree"

const tree = {
  a: {
    b: (path) => path,
  },
  c: {
    d: [{ e: (path) => path }],
  },
}

const callback = (fn, { path }) => fn(path)

console.log(map(callback, tree))
// {
//   a: {
//     b: [ "a", "b" ],
//   },
//   c: {
//     d: [
//       {
//         e: [ "c", "d", "e" ],
//       },
//     ],
//   },
// }
```

## `mergeWith(callback, object, object)`

Creates an object with the merged values of the inputs customized by the callback, which is called for every function found within the second object.

The callback is called with two arguments: `(firstObjectValueAtKey, function)`.

```javascript
import { mergeWith } from "call-tree"

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
```

## `omit(value, object)`

Creates an object with the specified value omitted. Assuming value has a single leaf node of type function.

```javascript
import { omit } from "call-tree"

const a = () => {}
const b = () => {}

omit({ x: b }, { x: [a, b] })
// { x: a }
```
