import {MyResponseTypeWithData} from '../../types/api'
import {db} from './firebase'

import type {OneLevelDeep, TwoLevelDeep} from './dbTypes'

async function getOneLevelDeep<T>({collection}: OneLevelDeep) {
  const response: MyResponseTypeWithData<Array<T>> = {
    isSuccessful: undefined,
    error: undefined,
  }

  await db
    .collection(collection)
    .get()
    .then(
      res => {
        response.isSuccessful = true
        response.data = res.docs.map(item => item.data() as T)
      },
      (err: Error) => {
        response.error = err
      },
    )
    .catch((err: Error) => {
      response.error = err
    })

  return response
}

async function getOneLevelDeepDoc<T>({collection, doc}: OneLevelDeep) {
  const response: MyResponseTypeWithData<T> = {
    isSuccessful: undefined,
    error: undefined,
  }

  await db
    .collection(collection)
    .doc(doc)
    .get()
    .then(
      res => {
        response.isSuccessful = true
        response.data = res.data() as T
      },
      (err: Error) => {
        response.error = err
      },
    )
    .catch((err: Error) => {
      response.error = err
    })

  return response
}

async function getTwoLevelDeep<T>({
  collection,
  doc,
  subCollection,
}: TwoLevelDeep) {
  const response: MyResponseTypeWithData<Array<T>> = {
    isSuccessful: undefined,
    error: undefined,
  }

  await db
    .collection(collection)
    .doc(doc)
    .collection(subCollection)
    .get()
    .then(
      res => {
        response.isSuccessful = true
        response.data = res.docs.map(item => item.data() as T)
      },
      (err: Error) => {
        response.error = err
      },
    )
    .catch((err: Error) => {
      response.error = err
    })

  return response
}

export {getOneLevelDeep, getOneLevelDeepDoc, getTwoLevelDeep}
