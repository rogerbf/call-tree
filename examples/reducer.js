const { map } = require("../")

const reducer = {
  name: (state = "Pike", action = {}) => {
    if (action.type === "RENAME") {
      return action.payload
    } else {
      return state
    }
  },
}

let state

const reduce = (action) => {
  state = map((fn) => fn(state, action), reducer)
  console.log(state)
}

reduce()

const action = {
  type: "RENAME",
  payload: "Kirk",
}

reduce(action)
