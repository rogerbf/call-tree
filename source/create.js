import call from "./library/call"
import concat from "./library/concat"
import omit from "./library/omit"

const create = (data = {}) => {
  const tree = (...args) => call(data, ...args)

  Object.assign(tree, {
    attach(...branches) {
      data = concat(data, ...branches)

      return tree
    },

    detach(...branches) {
      data = omit(data, ...branches)

      return tree
    },
  })

  Object.defineProperty(tree, `current`, {
    get() {
      return data
    },
  })

  return tree
}

export default create
