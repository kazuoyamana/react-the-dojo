import { initializeApp } from "firebase/app"
import { getFirestore, Timestamp } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
}

// init Firebase
const app = initializeApp(firebaseConfig)

// init services
const fireDB = getFirestore(app)
const fireAuth = getAuth(app)
const fireStorage = getStorage()

// timestamp
const timestamp = Timestamp

export { fireDB, fireAuth, fireStorage, timestamp }
