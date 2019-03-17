import { difference } from 'simple-difference'
import call from './library/call'
import concat from './library/concat'
import map from './library/map'
import omit from './library/omit'

const toString = value => Object.prototype.toString.call(value)

const OBJECT = toString({})

const create = (initial = {}) => {
  let wrappedBranches = new Map()

  const wrap = fn => {
    const wrapped = (...args) => fn(...args)
    wrappedBranches.set(wrapped, fn)

    return wrapped
  }

  const unwrap = wrapped => wrappedBranches.get(wrapped)

  let current = map(initial, wrap)
  let next = current

  const snapshot = () => {
    if (difference(next, current) === null) {
      next = { ...current }
    }
  }

  const attach = tree => {
    const type = toString(tree)

    if (type !== OBJECT) {
      throw new Error(`Expected ${ OBJECT }, received ${ type }.`)
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
      wrappedBranches.delete(wrapped)

      return tree
    }
  }

  const prepare = fn => {
    current = next

    const tree = fn(current)

    return call.bind(null, tree)
  }

  const _call = (...args) => {
    current = next

    return call(current, ...args)
  }

  const clear = () => {
    next = {}
    current = next

    return tree
  }

  const tree = Object.assign(_call, {
    attach,
    prepare,
    clear,
  })

  Object.defineProperty(tree, `current`, {
    get() {
      current = next

      return map(current, unwrap)
    },
  })

  return tree
}

export default create
