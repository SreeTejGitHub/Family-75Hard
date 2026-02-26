import { useState, useEffect } from "react"
import AppUI from "./AppUI"
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth"
import { auth, provider } from "./firebase"

const create75HardTemplate = () => ({
  id: "75hard",
  name: "75 Hard",
  duration: 75,
  tasks: [
    "Workout 1",
    "Workout 2",
    "1 Gallon Water",
    "Read 10 Pages",
    "Progress Picture"
  ],
  progress: {
    day: 1,
    completedDays: [],
    perfectDays: [],
    longestStreak: 0,
    photos: {}
  }
})

export default function App() {
  const [user, setUser] = useState(null)
  const [challenges, setChallenges] = useState([])
  const [activeChallengeId, setActiveChallengeId] = useState(null)
  const [tasks, setTasks] = useState([])

  // 🔥 Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [])

  // 🔥 Load user challenges
  useEffect(() => {
    if (!user) return

    const saved = JSON.parse(
      localStorage.getItem(`challenges-${user.uid}`)
    )

    if (!saved || saved.length === 0) {
      const defaultChallenge = create75HardTemplate()
      setChallenges([defaultChallenge])
      localStorage.setItem(
        `challenges-${user.uid}`,
        JSON.stringify([defaultChallenge])
      )
    } else {
      setChallenges(saved)
    }

    setActiveChallengeId(null)
  }, [user])

  // 🔥 Save changes
  useEffect(() => {
    if (!user) return
    localStorage.setItem(
      `challenges-${user.uid}`,
      JSON.stringify(challenges)
    )
  }, [challenges, user])

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, provider)
    } catch (err) {
      console.error(err)
    }
  }

  const logout = async () => {
    await signOut(auth)
  }

  const activeChallenge = challenges.find(c => c.id === activeChallengeId)
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

  const calculateStreak = (days) => {
    let current = 0
    let longest = 0
    let sorted = [...days].sort((a, b) => a - b)
    for (let i = 0; i < sorted.length; i++) {
      if (i === 0 || sorted[i] === sorted[i - 1] + 1) current++
      else current = 1
      longest = Math.max(longest, current)
    }
    return { current, longest }
  }

  const toggleTask = (index) => {
    const updated = [...tasks]
    updated[index] = !updated[index]
    setTasks(updated)
  }

  const completeDay = () => {
    if (!activeChallenge) return

    const isPerfect = tasks.every(Boolean)
    const updatedCompleted = [...completedDays, day]
    const updatedPerfect = isPerfect ? [...perfectDays, day] : []

    const streakData = calculateStreak(updatedPerfect)

    const updatedProgress = {
      day: day + 1,
      completedDays: updatedCompleted,
      perfectDays: updatedPerfect,
      longestStreak: streakData.longest,
      photos
    }

    setChallenges(prev =>
      prev.map(c =>
        c.id === activeChallengeId
          ? { ...c, progress: updatedProgress }
          : c
      )
    )

    setTasks(Array(activeChallenge.tasks.length).fill(false))
  }

  const reset = () => {
    if (!activeChallenge) return

    const updatedProgress = {
      day: 1,
      completedDays: [],
      perfectDays: [],
      longestStreak: 0,
      photos: {}
    }

    setChallenges(prev =>
      prev.map(c =>
        c.id === activeChallengeId
          ? { ...c, progress: updatedProgress }
          : c
      )
    )
  }

  const createChallenge = () => {
    const name = prompt("Challenge name?")
    const duration = Number(prompt("How many days?"))
    if (!name || !duration) return

    const tasksInput = prompt("Enter tasks separated by commas")
    if (!tasksInput) return

    const newChallenge = {
      id: Date.now().toString(),
      name,
      duration,
      tasks: tasksInput.split(",").map(t => t.trim()),
      progress: {
        day: 1,
        completedDays: [],
        perfectDays: [],
        longestStreak: 0,
        photos: {}
      }
    }

    setChallenges(prev => [...prev, newChallenge])
  }

  const completionPercent = activeChallenge
    ? Math.round((completedDays.length / activeChallenge.duration) * 100)
    : 0

  const currentStreak = calculateStreak(perfectDays).current

  return (
    <AppUI
      user={user}
      loginWithGoogle={loginWithGoogle}
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
      toggleTask={toggleTask}
      completeDay={completeDay}
      reset={reset}
      photos={photos}
      createChallenge={createChallenge}
    />
  )
}