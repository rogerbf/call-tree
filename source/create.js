import { difference } from "simple-difference"
import call from "./library/call"
import concat from "./library/concat"
import includes from "./library/includes"
import map from "./library/map"
import omit from "./library/omit"

const toString = value => Object.prototype.toString.call(value)
const OBJECT = toString({})

const create = (initial = {}) => {
  let index = []

  const wrap = fn => {
    const wrapped = (...args) => fn(...args)
    index.push([wrapped, fn])

    return wrapped
  }

  const unwrap = wrapped => index.find(([w]) => w === wrapped)[1]

  let current = map(initial, wrap)
  let next = current

  const snapshot = () => {
    if (difference(next, current) === null) {
      next = { ...current }
    }
  }

  const tree = (...args) => {
    snapshot()

    return call(next, ...args)
  }

  Object.defineProperty(tree, `current`, {
    get() {
      snapshot()

      return map(next, unwrap)
    },
  })

  tree.attach = tree => {
    const type = toString(tree)

    if (type !== OBJECT) {
      throw new Error(`Expected ${OBJECT}, received ${type}.`)
    }

    let attached = true

    snapshot()

    const wrapped = map(tree, wrap)
    next = concat(next, wrapped)

    return () => {
      if (!attached) {
        return void 0
      }

      attached = false

      snapshot()

      next = omit(next, wrapped)
      map(wrapped, fn => index.splice(index.find(([w]) => w === fn), 1))

      return tree
    }
  }

  tree.prepare = fn => {
    snapshot()

    const tree = fn(next)

    return call.bind(null, tree)
  }

  tree.clear = () => {
    next = {}
    snapshot()

    return tree
  }

  tree.includes = x => {
    snapshot()

    if (typeof x === `function`) {
      return Boolean(index.find(pair => pair[1] === x))
    } else {
      return includes(map(next, unwrap), x)
    }
  }

  return tree
}

export default create
