import { useState, useEffect, useMemo } from "react"
import AppUI from "./AppUI"

import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { storage } from "./firebase"

import {
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "firebase/auth"

import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  updateDoc,
  arrayUnion
} from "firebase/firestore"

import { auth, provider, db } from "./firebase"

export default function App() {

  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  const [challenges, setChallenges] = useState([])
  const [dataLoading, setDataLoading] = useState(true)

  const [activeChallengeId, setActiveChallengeId] = useState(null)

  const [tasks, setTasks] = useState([])
  const [toast, setToast] = useState(null)

  /* ---------------- AUTH ---------------- */

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setAuthLoading(false)
    })
    return unsub
  }, [])

  /* ---------------- FIRESTORE ---------------- */

  useEffect(() => {
    if (!user) {
      setChallenges([])
      setDataLoading(false)
      return
    }

    setDataLoading(true)

    const refCol = collection(db, "users", user.uid, "challenges")

    const unsub = onSnapshot(refCol, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setChallenges(data)
      setDataLoading(false)
    })

    return unsub
  }, [user])

  /* ---------------- DERIVED ---------------- */

  const activeChallenge = useMemo(
    () => challenges.find(c => c.id === activeChallengeId),
    [challenges, activeChallengeId]
  )

  const progress = activeChallenge?.progress || {}

  const day = progress.day || 1
  const completedDays = progress.completedDays || []
  const perfectDays = progress.perfectDays || []
  const longestStreak = progress.longestStreak || 0
  const photos = progress.photos || {}

  useEffect(() => {
    if (activeChallenge) {
      setTasks(Array(activeChallenge.tasks.length).fill(false))
    }
  }, [activeChallengeId])

  /* ---------------- UTIL ---------------- */

  const calculateStreak = (days) => {
    let current = 0
    let longest = 0
    const sorted = [...days].sort((a, b) => a - b)

    for (let i = 0; i < sorted.length; i++) {
      if (i === 0 || sorted[i] === sorted[i - 1] + 1) current++
      else current = 1
      longest = Math.max(longest, current)
    }

    return { current, longest }
  }

  /* ---------------- ACTIONS ---------------- */

  const loginWithGoogle = async () => {
    await signInWithPopup(auth, provider)
  }

  const logout = async () => {
    await signOut(auth)
    setActiveChallengeId(null)
  }

  const createChallenge = async () => {
    if (!user) return

    const name = prompt("Challenge name?")
    const duration = Number(prompt("How many days?"))
    const tasksInput = prompt("Tasks (comma separated)?")

    if (!name || !duration || !tasksInput) return

    const challenge = {
      name,
      duration,
      tasks: tasksInput.split(",").map(t => t.trim()),
      progress: {
        day: 1,
        completedDays: [],
        perfectDays: [],
        longestStreak: 0,
        photos: {}
      },
      history: [],
      totalCompletions: 0
    }

    const newRef = doc(collection(db, "users", user.uid, "challenges"))
    await setDoc(newRef, challenge)
  }

  const completeDay = async () => {
    if (!user || !activeChallenge) return
    if (day > activeChallenge.duration) return

    const isPerfect = tasks.every(Boolean)

    const updatedCompleted = completedDays.includes(day)
      ? completedDays
      : [...completedDays, day]

    const updatedPerfect =
      isPerfect && !perfectDays.includes(day)
        ? [...perfectDays, day]
        : perfectDays

    const streakData = calculateStreak(updatedPerfect)
    const isLastDay = day === activeChallenge.duration

    if (isLastDay) {
      const historyEntry = {
        completedAt: new Date(),
        longestStreak: streakData.longest,
        perfectDaysCount: updatedPerfect.length
      }

      await updateDoc(
        doc(db, "users", user.uid, "challenges", activeChallenge.id),
        {
          history: arrayUnion(historyEntry),
          totalCompletions:
            (activeChallenge.totalCompletions || 0) + 1,
          progress: {
            day: 1,
            completedDays: [],
            perfectDays: [],
            longestStreak: 0,
            photos: {}
          }
        }
      )

      setToast({ type: "success", message: "🏆 Challenge Completed!" })
    } else {
      await updateDoc(
        doc(db, "users", user.uid, "challenges", activeChallenge.id),
        {
          progress: {
            day: day + 1,
            completedDays: updatedCompleted,
            perfectDays: updatedPerfect,
            longestStreak: streakData.longest,
            photos
          }
        }
      )

      setToast({ type: "success", message: "✅ Day Completed!" })
    }

    setTimeout(() => setToast(null), 2500)
    setTasks(Array(activeChallenge.tasks.length).fill(false))
  }

  const handlePhotoUpload = async (e) => {
    if (!user || !activeChallenge) return
    const file = e.target.files[0]
    if (!file) return

    const fileRef = ref(
      storage,
      `users/${user.uid}/${activeChallenge.id}/day-${day}.jpg`
    )

    await uploadBytes(fileRef, file)
    const downloadURL = await getDownloadURL(fileRef)

    await updateDoc(
      doc(db, "users", user.uid, "challenges", activeChallenge.id),
      {
        "progress.photos": {
          ...photos,
          [day]: downloadURL
        }
      }
    )

    setToast({ type: "success", message: "📸 Uploaded!" })
    setTimeout(() => setToast(null), 2500)
  }

  if (authLoading) return <div>Checking authentication...</div>
  if (!user) return <AppUI user={null} loginWithGoogle={loginWithGoogle} />
  if (dataLoading) return <div>Loading challenges...</div>

  const completionPercent = activeChallenge
    ? Math.round((completedDays.length / activeChallenge.duration) * 100)
    : 0

  const currentStreak = calculateStreak(perfectDays).current

  return (
    <AppUI
      user={user}
      logout={logout}
      challenges={challenges}
      activeChallenge={activeChallenge}
      activeChallengeId={activeChallengeId}
      setActiveChallengeId={setActiveChallengeId}
      day={day}
      completedDays={completedDays}
      longestStreak={longestStreak}
      completionPercent={completionPercent}
      currentStreak={currentStreak}
      tasks={tasks}
      toggleTask={(i) => {
        const updated = [...tasks]
        updated[i] = !updated[i]
        setTasks(updated)
      }}
      completeDay={completeDay}
      createChallenge={createChallenge}
      toast={toast}
      handlePhotoUpload={handlePhotoUpload}
      photos={photos}
    />
  )
}