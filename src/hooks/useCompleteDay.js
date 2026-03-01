import { doc, updateDoc, arrayUnion } from "firebase/firestore"
import { db } from "../firebase"

export default function useCompleteDay(user, activeChallenge) {

  const completeDay = async ({
    tasks,
    day,
    completedDays,
    perfectDays
  }) => {

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

    const isLastDay = day === activeChallenge.duration

    if (isLastDay) {

      const historyEntry = {
        completedAt: new Date(),
        longestStreak: updatedPerfect.length,
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
          }
        }
      )

    } else {

      await updateDoc(
        doc(db, "users", user.uid, "challenges", activeChallenge.id),
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