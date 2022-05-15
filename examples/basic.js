import { concat, map } from "../source/index.js"

let tree = { x: console.log }

map((fn, { path }) => fn(path), tree)

// ["x"]

tree = concat({ y: { z: console.log } }, tree)

map((fn, { path }) => fn(path), tree)
// ["x"]
// ["y", "z"]

tree = concat({ y: console.log }, tree)

map((fn, { path }) => fn(path), tree)
// ["x"]
// ["y", "z"]
// ["y"]
