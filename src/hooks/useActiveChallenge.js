import { useMemo, useState } from "react"

export default function useActiveChallenge(challenges) {

  const [activeChallengeId, setActiveChallengeId] = useState(null)

  const activeChallenge = useMemo(
    () => challenges.find(c => c.id === activeChallengeId),
    [challenges, activeChallengeId]
  )

  return {
    activeChallengeId,
    setActiveChallengeId,
    activeChallenge
  }
}