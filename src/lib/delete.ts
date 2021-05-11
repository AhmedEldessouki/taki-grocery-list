import type {MyResponseType} from '../../types/api'
import type {OneLevelDeep} from './dbTypes'
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

export {deleteOneLevelDeep}
