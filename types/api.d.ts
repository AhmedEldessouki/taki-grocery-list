type MyResponseType = {
  isSuccessful?: boolean
  error?: Error
}

type MyResponseTypeWithData<T> = {
  data?: T
} & MyResponseType

type GroceryItemType = {
  name: string
  bgColor: string
  quantity: number
  priority: number
  isDone: boolean
}

export {MyResponseType, MyResponseTypeWithData, GroceryItemType}
