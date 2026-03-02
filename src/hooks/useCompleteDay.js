import { doc, updateDoc, arrayUnion } from "firebase/firestore"
import { db } from "../firebase"

export default function useCompleteDay(user, activeChallenge) {

  const completeDay = async () => {

    if (!user || !activeChallenge) return

    const {
      tasks = [],
      progress = {},
      duration = 0,
      id
    } = activeChallenge

    const {
      day = 1,
      completedDays = [],
      perfectDays = []
    } = progress

    if (!Array.isArray(tasks)) return
    if (day > duration) return

    const isPerfect = (activeChallenge.taskProgress || []).every(p => p.completed)
    
    const updatedCompleted = completedDays.includes(day)
      ? completedDays
      : [...completedDays, day]

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