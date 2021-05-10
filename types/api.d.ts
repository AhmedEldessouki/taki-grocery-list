type MyResponseType = {
  isSuccessful?: boolean
  error?: Error
}

type MyResponseTypeWithData<T> = {
  data?: T
} & MyResponseType

export {MyResponseType, MyResponseTypeWithData}
