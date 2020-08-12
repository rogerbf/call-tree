const _map = ({ callback, tree, value, key, current, path = [] }) =>
  typeof value === "function"
    ? callback(value, { key, path })
    : Array.isArray(value)
    ? value.map((element) => _map({ callback, tree, value: element, path }))
    : typeof value === "object"
    ? Object.entries(value).reduce(
        (current, [key, value]) =>
          Object.assign(current || {}, {
            [key]: _map({
              callback,
              tree,
              value,
              key,
              current: current || {},
              path: path.concat(key),
            }),
          }),
        undefined
      )
    : current

export const map = (callback, tree) => _map({ callback, tree, value: tree })
