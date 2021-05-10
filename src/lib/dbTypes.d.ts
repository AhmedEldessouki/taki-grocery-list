// -----------------------
// ------ Firestore ------
// -----------------------

// ------ Root ------
type Collection = 'grocery' | 'users'

// ------- Users Collection -------
type UsersCollection = {
  collection: 'users'
  doc?: string
}
// ------- Grocery Collection -------
type GroceryCollection = {
  collection: 'grocery'
  doc?: string
}

export type OneLevelDeep = GroceryCollection | UsersCollection

export type OneLevelDeepWithData<T> = OneLevelDeep & {data: T}
