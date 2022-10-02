import { addDoc, collection, deleteDoc, doc, setDoc, updateDoc } from "firebase/firestore"
import { useEffect, useReducer, useState } from "react"
import { fireDB, timestamp } from "../firebase/config"

const initialState = {
  document: null,
  isPending: false,
  error: null,
  success: null,
}

const firestoreReducer = (state, action) => {
  switch (action.type) {
    case "IS_PENDING":
      return { isPending: true, document: null, success: false, error: null }
    case "ADDED_DOCUMENT":
      return { isPending: false, document: action.payload, success: true, error: null }
    case "DELETED_DOCUMENT":
      return { isPending: false, document: null, success: true, error: null }
    case "UPDATED_DOCUMENT":
      return { isPending: false, document: action.payload, success: true, error: null }
    case "ERROR":
      return { isPending: false, document: null, success: false, error: action.payload }
    default:
      return state
  }
}

export const useFirestore = (collectionName) => {
  const [state, dispatch] = useReducer(firestoreReducer, initialState)
  const [isCancelled, setIsCancelled] = useState(false)

  // only dispatch is not cancelled
  const dispatchIfNotCancelled = (action) => {
    if (!isCancelled) {
      dispatch(action)
    }
  }

  // collection ref
  const ref = collection(fireDB, collectionName)

  // add a document
  const addDocument = (doc) => {
    dispatch({ type: "IS_PENDING", payload: doc })

    const createdAt = timestamp.fromDate(new Date())

    addDoc(ref, { ...doc, createdAt })
      .then((res) => {
        if (!isCancelled) {
          dispatchIfNotCancelled({ type: "ADDED_DOCUMENT", payload: res })
        }
      })
      .catch((err) => {
        dispatchIfNotCancelled({ type: "ERROR", payload: err.message })
      })
  }

  // update documents
  const updateDocument = async (id, updates) => {
    dispatch({ type: "IS_PENDING" })

    try {
      // ↓ ここでdocRefを作ってもいいし、updateDoc内部でdoc()でrefを再利用して作ってもよい
      // const docRef = doc(fireDB, collectionName, id)
      const updatedDocument = await updateDoc(doc(ref, id), updates)
      dispatchIfNotCancelled({ type: "UPDATED_DOCUMENT", payload: updatedDocument })
      return updatedDocument
    } catch (err) {
      dispatchIfNotCancelled({ type: "ERROR", payload: err.message })
      return null
    }
  }

  // delete a document
  const deleteDocument = (id) => {
    dispatch({ type: "IS_PENDING" })

    deleteDoc(doc(ref, id))
      .then(() => {
        dispatchIfNotCancelled({ type: "DELETED_DOCUMENT" })
      })
      .catch((err) => {
        dispatchIfNotCancelled({ type: "ERROR", payload: "could not delete" })
        console.log(err)
      })
  }

  useEffect(() => {
    return () => setIsCancelled(true)
  }, [])

  return { addDocument, deleteDocument, state, updateDocument }
}
