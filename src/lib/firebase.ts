import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/database'
// import "firebase/analytics";

// TODO: Replace the following with your app's Firebase project configuration
// For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: `${process.env.REACT_APP_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  databaseURL: `https://${process.env.REACT_APP_FIREBASE_PROJECT_ID}.firebaseio.com`,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: `${process.env.REACT_APP_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: `G-${process.env.REACT_APP_FIREBASE_MEASUREMENT_ID}`,
}

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}
const db = firebase.firestore()
const auth = firebase.auth()

// For stopping Next.js from showing "useEmulator is already in use" Error
const isEmulatorActive = window.localStorage.getItem('isEmulatorActive')

if (process.env.NODE_ENV !== 'production' && isEmulatorActive === 'true') {
  db.useEmulator('localhost', 8080)
  auth.useEmulator('http://localhost:9099')
  window.localStorage.setItem('isEmulatorActive', 'true')
}

export default firebase
export {db, auth}
