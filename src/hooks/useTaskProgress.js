import { useState, useEffect } from "react"

export default function useTaskProgress(activeChallenge) {

  const [taskProgress, setTaskProgress] = useState([])

  useEffect(() => {
    if (!activeChallenge?.tasks) {
      setTaskProgress([])
      return
    }

    // Initialize array with 0 for each task
    setTaskProgress(
      activeChallenge.tasks.map(() => 0)
    )

  }, [activeChallenge])

  const updateTaskProgress = (index, value) => {
    setTaskProgress(prev => {
      const updated = [...prev]
      updated[index] = value
      return updated
    })
  }

  return {
    taskProgress,
    updateTaskProgress
  }
}