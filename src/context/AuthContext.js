import { onAuthStateChanged } from "firebase/auth"
import { createContext, useEffect, useReducer } from "react"
import { fireAuth } from "../firebase/config"

export const AuthContext = createContext()

export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload }
    case "LOGOUT":
      return { ...state, user: null }
    case "AUTH_IS_READY":
      return { ...state, user: action.payload, authIsReady: true }
    default:
      return state
  }
}

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    authIsReady: false,
  })

  useEffect(() => {
    // onAuthStateChanged()でログインしてるかどうかを確認。
    // ログインしてれば、第２引数のコールバック関数が実行される。
    const unsub = onAuthStateChanged(fireAuth, (user) => {
      dispatch({ type: "AUTH_IS_READY", payload: user })
      unsub()
    })
  }, [])

  console.log("AuthContext state:", state)

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>{children}</AuthContext.Provider>
  )
}
