import { signInWithEmailAndPassword } from "firebase/auth"
import { doc, updateDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { fireAuth, fireDB } from "../firebase/config"
import { useAuthContext } from "./useAuthContext"

export const useLogin = () => {
  const [isCancelled, setIsCancelled] = useState(false)
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const { dispatch } = useAuthContext()

  const login = async (email, password) => {
    setError(null)
    setIsPending(true)

    // sign in
    try {
      const res = await signInWithEmailAndPassword(fireAuth, email, password)

      // update for online statue
      const updateRef = doc(fireDB, "users", res.user.uid)
      await updateDoc(updateRef, { online: true })

      // dispatch login action
      dispatch({ type: "LOGIN", payload: res.user })

      // update state
      if (!isCancelled) {
        setIsPending(false)
        setError(null)
      }
    } catch (err) {
      if (!isCancelled) {
        console.log(err.message)
        setError(err.message)
        setIsPending(false)
      }
    }
  }

  useEffect(() => {
    return () => setIsCancelled(true)
  }, [])

  return { login, error, isPending }
}
