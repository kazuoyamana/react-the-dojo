import { initializeApp } from "firebase/app"
import { getFirestore, Timestamp } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyD8IiecQk3dqiVPsxVspkS0gCF3F7eeJ70",
  authDomain: "thedojo-ac438.firebaseapp.com",
  projectId: "thedojo-ac438",
  storageBucket: "thedojo-ac438.appspot.com",
  messagingSenderId: "503128874861",
  appId: "1:503128874861:web:cd25d69a4fa6265ba48464",
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
