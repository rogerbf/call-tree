const { call } = require(`../`)

const reducer = {
  name: (state = `Pike`, action = {}) => {
    if (action.type === `RENAME`) {
      return action.payload
    } else {
      return state
    }
  },
}

const reduce = call.bind(null, reducer)

const initialState = reduce()

const action = {
  type: `RENAME`,
  payload: `Kirk`,
}

const nextState = reduce(initialState, action)

console.log(`initial: `, initialState)
console.log(`next:    `, nextState)
