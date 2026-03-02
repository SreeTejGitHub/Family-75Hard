import { doc, updateDoc, arrayUnion } from "firebase/firestore"
import { db } from "../firebase"

export default function useCompleteDay(user, activeChallenge, taskProgress = []) {

  const completeDay = async () => {

    if (!user || !activeChallenge) return

    const {
      progress = {},
      duration = 0,
      id
    } = activeChallenge

    const {
      day = 1,
      completedDays = [],
      perfectDays = []
    } = progress

    if (day > duration) return

    // ✅ Check real progress
    if (!Array.isArray(taskProgress)) return
    const hasAnyProgress = taskProgress.some(val => val > 0)

    const isPerfect =
      taskProgress.length > 0 &&
      activeChallenge.tasks.every((task, i) =>
        (taskProgress[i] || 0) >= task.target
      )

    const updatedCompleted =
      hasAnyProgress && !completedDays.includes(day)
        ? [...completedDays, day]
        : completedDays

    const updatedPerfect =
      isPerfect && !perfectDays.includes(day)
        ? [...perfectDays, day]
        : perfectDays

    const isLastDay = day === duration

    if (isLastDay) {

      const historyEntry = {
        completedAt: new Date(),
        longestStreak: updatedPerfect.length,
        perfectDaysCount: updatedPerfect.length
      }

      await updateDoc(
        doc(db, "users", user.uid, "challenges", id),
        {
          history: arrayUnion(historyEntry),
          totalCompletions:
            (activeChallenge.totalCompletions || 0) + 1,
          progress: {
            day: 1,
            completedDays: [],
            perfectDays: [],
            longestStreak: 0,
          }
        }
      )

    } else {

      await updateDoc(
        doc(db, "users", user.uid, "challenges", id),
        {
          progress: {
            day: day + 1,
            completedDays: updatedCompleted,
            perfectDays: updatedPerfect,
            longestStreak: updatedPerfect.length
          }
        }
      )
    }
  }

  return { completeDay }
}