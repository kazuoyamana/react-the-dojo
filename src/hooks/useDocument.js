import { doc, getDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { fireDB } from "../firebase/config"

export const useDocument = (collectionName, id) => {
  const [document, setDocument] = useState(null)
  const [error, setError] = useState(null)
  const [reload, setReload] = useState(false)

  useEffect(() => {
    const getDocument = async () => {
      try {
        const docRef = doc(fireDB, collectionName, id)
        const snapshot = await getDoc(docRef)

        // whether document exists
        if (snapshot.data()) {
          setDocument({ ...snapshot.data(), id: snapshot.id })
        } else {
          setError("No such document exist")
        }
      } catch (err) {
        console.log(err)
        setError("failed to get document")
      }
    }

    getDocument()
  }, [collectionName, id, reload])

  return { document, error, setReload }
}
