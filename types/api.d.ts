type MyResponseType = {
  isSuccessful?: boolean
  error?: Error
}

type MyResponseTypeWithData<T> = {
  data?: T
} & MyResponseType

type GroceryItemType = {name: string; isDone: boolean}

export {MyResponseType, MyResponseTypeWithData, GroceryItemType}
