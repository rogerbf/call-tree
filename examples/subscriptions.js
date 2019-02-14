const { difference } = require(`simple-difference`)
const { mask } = require(`mask-properties`)
const { create, call } = require(`../`)

const tree = create()
let state = undefined

const setState = nextState => {
  call(mask(tree.current, difference(state, nextState)), nextState)
  state = nextState
}

const nameListener = { name: name => console.log(`name:`, name) }
const homeListener = { places: { home: home => console.log(`home:`, home) } }

tree.attach(nameListener, homeListener)

setState({ name: `Jon` })
// name: Jon
setState({ name: `Jon`, places: { home: `Mars` } })
// home: Mars

tree.detach(nameListener)

setState({ name: `Lo`, places: { home: `Earth` } })
// home Earth
