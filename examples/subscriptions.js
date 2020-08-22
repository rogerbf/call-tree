const { mergeWith, concat, omit } = require("../")

let tree = {}

const broadcast = (state) => {
  mergeWith(
    (parameters, fn) => parameters !== undefined && fn(parameters),
    state,
    tree
  )
}

const nameListener = { name: (name) => console.log("name:", name) }
const homeListener = { places: { home: (home) => console.log("home:", home) } }

const listeners = [nameListener, homeListener]

listeners.forEach((listener) => {
  tree = concat(listener, tree)
})

broadcast({ name: "Jon" })
// name: Jon
broadcast({ name: "Jon", places: { home: "Mars" } })
// home: Mars

// remove nameListener from tree
tree = omit(nameListener, tree)

broadcast({ name: "Lo", places: { home: "Earth" } })
// home Earth
