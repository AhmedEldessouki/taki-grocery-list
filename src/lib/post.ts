import type {MyResponseType} from '../../types/api'
import type {OneLevelDeepWithData, TwoLevelDeepWithData} from './dbTypes'
import myFirebase, {db} from './firebase'

type SetOptionsForPost = {
  setOptions?: myFirebase.firestore.SetOptions
}

// If the document does not exist, it will be created.
export async function postOneLevelDeep<T>({
  collection,
  doc,
  data,
  ...setOptions
}: OneLevelDeepWithData<T> &
  SetOptionsForPost &
  myFirebase.firestore.SetOptions) {
  const response: MyResponseType = {isSuccessful: undefined, error: undefined}
  // , timeStamp: firebase.firestore.Timestamp.now().toDate()
  await db
    .collection(collection)
    .doc(doc)
    .set({...data}, {...setOptions})
    .then(() => {
      response.isSuccessful = true
    })
    .catch((error: Error) => {
      response.error = error
    })
  return response
}

export async function postTwoLevelDeep<T>({
  collection,
  doc,
  subCollection,
  subDoc,
  data,
  ...setOptions
}: TwoLevelDeepWithData<T> &
  SetOptionsForPost &
  myFirebase.firestore.SetOptions) {
  const response: MyResponseType = {isSuccessful: undefined, error: undefined}
  await db
    .collection(collection)
    .doc(doc)
    .collection(subCollection)
    .doc(subDoc)
    .set(
      {...data, timeStamp: myFirebase.firestore.Timestamp.now().toDate()},
      {...setOptions},
    )
    .then(() => {
      response.isSuccessful = true
    })
    .catch((error: Error) => {
      response.error = error
    })
  return response
}
