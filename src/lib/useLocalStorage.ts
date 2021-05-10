import React from 'react'

type UseLocalStorageOptions = {
  serialize?: typeof JSON.stringify
  deserialize?: typeof JSON.parse
}

function useLocalStorageState<TState>(
  key: string,
  defaultValue: TState,
  {
    serialize = JSON.stringify,
    deserialize = JSON.parse,
  }: UseLocalStorageOptions = {},
) {
  const [state, setState] = React.useState(() => {
    const valueInLocalStorage = window.localStorage.getItem(key)
    if (valueInLocalStorage) {
      return deserialize(valueInLocalStorage)
    }
    return defaultValue instanceof Function ? defaultValue() : defaultValue
  })

  const prevKeyRef = React.useRef(key)

  React.useEffect(() => {
    const prevKey = prevKeyRef.current
    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey)
    }
    prevKeyRef.current = key
    window.localStorage.setItem(key, serialize(state))
  }, [key, state, serialize])

  return [state, setState]
}
export {useLocalStorageState}
