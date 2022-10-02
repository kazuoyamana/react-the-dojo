import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore"
import { useEffect, useRef, useState } from "react"
import { fireDB } from "../firebase/config"

export const useCollection = (collectionName, queryCondition, orderCondition) => {
  const [documents, setDocuments] = useState(null)
  const [error, setError] = useState(null)

  // useEffectの無限ループを防ぐためにuseRefでラップ
  const q = useRef(queryCondition).current
  const o = useRef(orderCondition).current

  useEffect(() => {
    let ref = collection(fireDB, collectionName)

    // q（クエリ条件）が存在する時はクエリ作成
    if (q) {
      ref = query(ref, where(...q))
    }

    // o（並び替え条件）が存在する時は並び替え指定（注）Firebase側でindexの設定が必要
    if (o) {
      ref = query(ref, orderBy(...o))
    }

    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        let results = []
        snapshot.forEach((doc) => {
          results.push({ ...doc.data(), id: doc.id })
        })

        // update state
        setDocuments(results)
        setError(null)
      },
      (err) => {
        console.log(err)
        setError("could not fetch the data")
      }
    )

    // unsubscribe on unmount
    return () => unsubscribe()
  }, [collectionName, q, o])

  return { documents, error }
}
