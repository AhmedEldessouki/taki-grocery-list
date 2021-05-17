// --------------------------------------------------------------------------------------------------------------------------------
// -------------------------------------- This Is Just A Reference For When The Time Comes  ---------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------
// ----- Updating data with transactions Ref:https://firebase.google.com/docs/firestore/manage-data/transactions#transactions -----

import {db} from './firebase'

// --------------------------------------------------------------------------------------------------------------------------------
async function firestoreTransaction() {
  // Create a reference to the SF doc.
  const sfDocRef = db.collection('cities').doc('SF')

  // Uncomment to initialize the doc.
  // sfDocRef.set({ population: 0 });

  try {
    await db.runTransaction(transaction => {
      // This code may get re-run multiple times if there are conflicts.
      return transaction.get(sfDocRef).then(sfDoc => {
        if (!sfDoc.exists) {
          throw Error('Document does not exist!')
        }

        // Add one person to the city population.
        // Note: this could be done without a transaction
        //       by updating the population using FieldValue.increment()
        const newPopulation = (sfDoc.data()?.population as number) + 1
        transaction.update(sfDocRef, {population: newPopulation})
      })
    })
    console.log('Transaction successfully committed!')
  } catch (error: unknown) {
    console.log('Transaction failed: ', error)
  }
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------------------
// ----- Passing information out of transactions Ref:https://firebase.google.com/docs/firestore/manage-data/transactions#passing_information_out_of_transactions -----
// -------------------------------------------------------------------------------------------------------------------------------------------------------------------
function firestoreTransactionWithOutput() {
  // Create a reference to the SF doc.
  const sfDocRef = db.collection('cities').doc('SF')

  db.runTransaction(transaction => {
    return transaction.get(sfDocRef).then(sfDoc => {
      if (!sfDoc.exists) {
        throw Error('Document does not exist!')
      }

      const newPopulation = (sfDoc.data()?.population as number) + 1
      if (newPopulation <= 1000000) {
        transaction.update(sfDocRef, {population: newPopulation})
        return newPopulation
      } else {
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject('Sorry! Population is too big.')
      }
    })
  })
    .then(newPopulation => {
      console.log('Population increased to ', newPopulation)
    })
    .catch(err => {
      // This will be an "population is too big" error.
      console.error(err)
    })
}

// -----------------------------------------------------------------------------------------------------------------
// ----- Batched writes Ref:https://firebase.google.com/docs/firestore/manage-data/transactions#batched-writes -----
// -----------------------------------------------------------------------------------------------------------------
function firestoreBatch() {
  // Get a new write batch
  const batch = db.batch()

  // Set the value of 'NYC'
  const nycRef = db.collection('cities').doc('NYC')
  batch.set(nycRef, {name: 'New York City'})

  // Update the population of 'SF'
  const sfRef = db.collection('cities').doc('SF')
  batch.update(sfRef, {population: 1000000})

  // Delete the city 'LA'
  const laRef = db.collection('cities').doc('LA')
  batch.delete(laRef)

  // Commit the batch
  batch.commit().then(() => {
    // ...
  })
}

export {firestoreBatch, firestoreTransaction, firestoreTransactionWithOutput}
