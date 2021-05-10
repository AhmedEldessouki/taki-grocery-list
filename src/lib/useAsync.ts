import {useCallback, useEffect, useReducer, useRef} from 'react'

function useSafeDispatch<T, S>(dispatch: React.Dispatch<IAction<T, S>>) {
  const mounted = useRef(false)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  return useCallback(
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    (action: IAction<T, S>): React.Dispatch<IAction<T, S>> | void =>
      mounted.current ? dispatch(action) : undefined,
    [dispatch],
  )
}

type Status = 'idle' | 'pending' | 'resolved' | 'rejected'

interface IAction<T, S> {
  type: T
  payload?: S
}

function asyncReducer(
  state: useAsyncReducerState,
  action: IAction<Status, unknown>,
) {
  switch (action.type) {
    case 'idle': {
      state.status = 'idle'
      return {...state}
    }
    case 'pending': {
      state.status = 'pending'
      return {...state}
    }
    case 'resolved': {
      state.status = 'resolved'
      return {...state}
    }
    case 'rejected': {
      state.status = 'rejected'
      return {...state}
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}
interface useAsyncReducerState {
  status: Status
}

interface useAsyncProps {
  isIdle: boolean
  isLoading: boolean
  isSuccess: boolean
  isRejected: boolean

  status: Status
  dispatch: React.Dispatch<IAction<Status, unknown>>
}

function useAsync(
  initialState: useAsyncReducerState = {status: 'idle'},
): useAsyncProps {
  const initialStateRef = useRef({
    ...initialState,
  })
  const [state, unsafeDispatch] = useReducer(
    asyncReducer,
    initialStateRef.current,
  )

  const dispatch = useSafeDispatch(unsafeDispatch)
  const {status} = state
  return {
    isIdle: status === 'idle',
    isLoading: status === 'pending',
    isSuccess: status === 'resolved',
    isRejected: status === 'rejected',

    status,
    dispatch,
  }
}

export {useAsync}
