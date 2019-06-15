const type = value => Object.prototype.toString.call(value)

const OBJECT = type({})
const ARRAY = type([])
const FUNCTION = type(Function)

const omit = (input, redaction) => {
  if (type(input) === OBJECT) {
    return Object.entries(redaction).reduce(
      (updated, [key, value]) => {
        if (updated.hasOwnProperty(key)) {
          if (type(value) === FUNCTION || type(value) === ARRAY) {
            const redacted = [].concat(value)
            const filtered = []
              .concat(updated[key])
              .filter(fn => !redacted.includes(fn))

            if (filtered.length) {
              return Object.assign(updated, {
                [key]: filtered.length > 1 ? filtered : filtered.pop(),
              })
            } else {
              delete updated[key]

              return updated
            }
          } else if (type(value) === OBJECT) {
            const result = omit(updated[key], value)

            if (type(result) === ARRAY) {
              const filtered = result.filter(x =>
                type(x) === OBJECT
                  ? Object.values(x).filter(value =>
                      type(value) === OBJECT
                        ? Object.keys(value).length > 0
                        : true
                    ).length
                  : true
              )

              return Object.assign(updated, {
                [key]: filtered.length === 1 ? filtered.pop() : filtered,
              })
            } else {
              return Object.assign(updated, { [key]: result })
            }
          } else {
            return updated
          }
        } else {
          return updated
        }
      },
      { ...input }
    )
  } else if (type(input) === ARRAY) {
    let updated = []

    for (let value of input) {
      if (type(value) === OBJECT) {
        const result = omit(value, redaction)

        if (Object.keys(result).length > 0) {
          updated.push(result)
        }
      } else {
        updated.push(value)
      }
    }

    return updated
  } else {
    return input
  }
}

export default (tree, ...trees) =>
  trees.reduce((result, tree) => omit(result, tree), {
    ...tree,
  })
