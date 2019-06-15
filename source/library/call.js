const call = (input, parameters, ...args) =>
  typeof input === `function`
    ? input(parameters, ...args)
    : Array.isArray(input)
    ? input.map(x => call(x, parameters, ...args))
    : typeof input === `object`
    ? Object.entries(input).reduce(
        (result, [key, input]) =>
          Object.assign(result || {}, {
            [key]:
              typeof input === `function`
                ? input((parameters || {})[key], ...args)
                : Array.isArray(input)
                ? input.map(x => call(x, (parameters || {})[key], ...args))
                : typeof input === `object`
                ? call(input, (parameters || {})[key], ...args)
                : input,
          }),
        undefined
      )
    : input

export default call
