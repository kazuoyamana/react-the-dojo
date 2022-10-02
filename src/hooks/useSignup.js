import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { useEffect, useState } from "react"
import { fireAuth, fireDB, fireStorage } from "../firebase/config"
import { useAuthContext } from "./useAuthContext"

export const useSignup = () => {
  const [isCancelled, setIsCancelled] = useState(false)
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const { dispatch } = useAuthContext()

  const signup = async (email, password, displayName, thumbnail) => {
    setError(null)
    setIsPending(true)

    try {
      // signup user
      const res = await createUserWithEmailAndPassword(fireAuth, email, password)
      console.log(res)

      if (!res) {
        throw new Error("Could not complete signup")
      }

      // ------------------------- 画像アップロード処理開始 -------------------------

      // アップロード先のパスを設定 "thumbnails" は存在しなければ自動で作成される
      const uploadPath = `thumbnails/${res.user.uid}/${thumbnail.name}`
      const storageRef = ref(fireStorage, uploadPath)

      // 画像をアップロード
      const img = await uploadBytes(storageRef, thumbnail)

      // アップロードした画像の絶対パスを取得（promiseが返るのでawait必須）
      const imgUrl = await getDownloadURL(img.ref)

      // ------------------------- 画像アップロード処理終了 -------------------------

      // [ユーザー作成後] displayName と photoURL を加えてプロフィールを更新
      await updateProfile(res.user, { displayName, photoURL: imgUrl })

      // ユーザごとにドキュメントを作成
      // これはアバター付きオンラインユーザーの一覧を作成するためのもの
      const usersCollectionRef = doc(fireDB, "users", res.user.uid)
      await setDoc(usersCollectionRef, {
        online: true,
        displayName,
        photoURL: imgUrl,
      })

      // dispatch login action
      dispatch({ type: "LOGIN", payload: res.user })

      // update state
      if (!isCancelled) {
        setIsPending(false)
        setError(null)
      }
    } catch (err) {
      if (!isCancelled) {
        console.log(err.code)
        setError(getJapaneseErrorMsg(err))
        setIsPending(false)
      }
    }
  }

  useEffect(() => {
    return () => setIsCancelled(true)
  }, [])

  return { error, isPending, signup }
}

//
// Japanese error messages
//
const getJapaneseErrorMsg = (err) => {
  switch (err.code) {
    case "auth/invalid-email":
      return "メールアドレスの形式が正しくありません"
    case "auth/email-already-in-use":
      return "このメールアドレスはすでに使用されています"
    case "auth/weak-password":
      return "パスワードが短すぎるようです（６文字以上）"
    default:
      return err.message
  }
}
