import { useState, useEffect } from "react"
import { collection, onSnapshot } from "firebase/firestore"
import { db } from "../firebase"

export default function useChallengeData(user) {

  const [challenges, setChallenges] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setChallenges([])
      setLoading(false)
      return
    }

    const ref = collection(db, "users", user.uid, "challenges")

    const unsub = onSnapshot(ref, snapshot => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setChallenges(data)
      setLoading(false)
    })

    return unsub
  }, [user])

  return { challenges, loading }
}