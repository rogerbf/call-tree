/* eslint no-console: 0 */
const { difference } = require(`simple-difference`)
const { mask } = require(`mask-properties`)
const { create, call } = require(`../`)

const tree = create()
let state = undefined

const setState = nextState => {
  call(mask(tree.current, difference(state, nextState).diff), nextState)
  state = nextState
}

const nameListener = { name: name => console.log(`name:`, name) }
const homeListener = { places: { home: home => console.log(`home:`, home) } }

const detachNameListener = tree.attach(nameListener)
tree.attach(homeListener)

setState({ name: `Jon` })
// name: Jon
setState({ name: `Jon`, places: { home: `Mars` } })
// home: Mars

detachNameListener()

setState({ name: `Lo`, places: { home: `Earth` } })
// home Earth
