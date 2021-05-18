import type {MyResponseType} from '../../types/api'
import type {OneLevelDeep, TwoLevelDeep} from './dbTypes'
import {db} from './firebase'

async function deleteOneLevelDeep({collection, doc}: OneLevelDeep) {
  const response: MyResponseType = {isSuccessful: undefined, error: undefined}
  await db
    .collection(collection)
    .doc(doc)
    .delete()
    .then(
      () => {
        response.isSuccessful = true
      },
      (err: Error) => (response.error = err),
    )
    .catch((err: Error) => {
      response.error = err
    })
  return response
}

async function deleteTwoLevelDeep({
  collection,
  doc,
  subCollection,
  subDoc,
}: TwoLevelDeep) {
  const response: MyResponseType = {isSuccessful: undefined, error: undefined}
  await db
    .collection(collection)
    .doc(doc)
    .collection(subCollection)
    .doc(subDoc)
    .delete()
    .then(
      () => {
        response.isSuccessful = true
      },
      (err: Error) => (response.error = err),
    )
    .catch((err: Error) => {
      response.error = err
    })
  return response
}

export {deleteOneLevelDeep, deleteTwoLevelDeep}
