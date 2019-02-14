import call from "./library/call"
import concat from "./library/concat"
import omit from "./library/omit"

const create = (tree = {}) => {
  const instance = (...args) => call(tree, ...args)

  Object.assign(instance, {
    attach(...branches) {
      tree = concat(tree, ...branches)

      return instance
    },

    detach(...branches) {
      tree = omit(tree, ...branches)

      return instance
    },
  })

  Object.defineProperty(instance, `current`, {
    get() {
      return tree
    },
  })

  return instance
}

export default create
