export default function useChallengeProgress(activeChallenge) {

  const progress = activeChallenge?.progress || {}

  const day = progress.day || 1
  const completedDays = progress.completedDays || []
  const perfectDays = progress.perfectDays || []
  const longestStreak = progress.longestStreak || 0

  const completionPercent = activeChallenge
    ? Math.round((completedDays.length / activeChallenge.duration) * 100)
    : 0

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

  const currentStreak = calculateStreak(perfectDays).current

  return {
    day,
    completedDays,
    perfectDays,
    longestStreak,
    completionPercent,
    currentStreak
  }
}