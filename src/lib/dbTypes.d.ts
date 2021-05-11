// -----------------------
// ------ Firestore ------
// -----------------------

// ------ Root ------
type Collection = 'grocery' | 'users'

type GroceryDocs = 'groceryList'

// ------- Users Collection -------
type UsersCollection = {
  collection: 'users'
  doc?: string
}
// ------- Grocery Collection -------
type GroceryCollection = {
  collection: 'grocery'
  doc: GroceryDocs
  subCollection: string
  subDoc?: string
}

export type OneLevelDeep = UsersCollection
export type TwoLevelDeep = GroceryCollection

export type OneLevelDeepWithData<T> = OneLevelDeep & {data: T}
export type TwoLevelDeepWithData<T> = TwoLevelDeep & {data: T}
