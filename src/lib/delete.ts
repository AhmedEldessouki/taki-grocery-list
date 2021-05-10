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
      err => (response.error = err),
    )
    .catch(error => {
      response.error = error
    })
  return response
}

export {deleteOneLevelDeep}
