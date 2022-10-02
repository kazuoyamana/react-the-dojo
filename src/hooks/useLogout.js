import { signOut } from "firebase/auth"
import { doc, updateDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { fireAuth, fireDB } from "../firebase/config"
import { useAuthContext } from "./useAuthContext"

export const useLogout = () => {
  const [isCancelled, setIsCancelled] = useState(false)
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const { dispatch, user } = useAuthContext()

  const logout = async () => {
    setError(null)
    setIsPending(true)

    // sign the user out
    try {
      // update for online statue
      const { uid } = user
      const updateRef = doc(fireDB, "users", uid)
      await updateDoc(updateRef, { online: false })

      // sign out
      await signOut(fireAuth)

      // dispatch logout action
      dispatch({ type: "LOGOUT" })

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

  return { logout, error, isPending }
}
