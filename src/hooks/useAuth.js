import { useState, useEffect } from "react"
import { auth, provider } from "../firebase"
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth"

export default function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [])

  const loginWithGoogle = async () => {
    await signInWithPopup(auth, provider)
  }

  const logout = async () => {
    await signOut(auth)
  }

  return { user, loading, loginWithGoogle, logout }
}