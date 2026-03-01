import { useState, useEffect } from "react"

export default function useTaskProgress(activeChallenge) {

  const [taskProgress, setTaskProgress] = useState({})
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    if (!activeChallenge) return

    const initial = {}
    activeChallenge.tasks.forEach((_, i) => {
      initial[i] = 0
    })

    setTaskProgress(initial)
    setTasks(Array(activeChallenge.tasks.length).fill(false))

  }, [activeChallenge])

  const updateTaskProgress = (index, value) => {
    setTaskProgress(prev => ({
      ...prev,
      [index]: value
    }))
  }

  const toggleTask = (i) => {
    const updated = [...tasks]
    updated[i] = !updated[i]
    setTasks(updated)
  }

  return {
    taskProgress,
    updateTaskProgress,
    tasks,
    toggleTask
  }
}