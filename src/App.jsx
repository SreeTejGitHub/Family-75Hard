import useAuth from "./hooks/useAuth"
import useChallengeData from "./hooks/useChallengeData"
import useActiveChallenge from "./hooks/useActiveChallenge"
import useChallengeProgress from "./hooks/useChallengeProgress"
import useTaskProgress from "./hooks/useTaskProgress"
import useCompleteDay from "./hooks/useCompleteDay"

import AppUI from "./AppUI"

export default function App() {

  // AUTH
  const { user, loading, loginWithGoogle, logout } = useAuth()

  // CHALLENGE DATA
  const { challenges, createChallenge, loading: dataLoading } = useChallengeData(user)

  // ACTIVE CHALLENGE
  const {
    activeChallengeId,
    setActiveChallengeId,
    activeChallenge
  } = useActiveChallenge(challenges)

  // PROGRESS
  const progress = useChallengeProgress(activeChallenge)

  // TASK LOGIC
  const taskLogic = useTaskProgress(activeChallenge)

  // COMPLETE DAY
  const { completeDay } = useCompleteDay(user, activeChallenge)

  // Loading states
  if (loading) return <div>Loading...</div>
  if (!user)
    return <AppUI user={null} loginWithGoogle={loginWithGoogle} />
  if (dataLoading) return <div>Loading challenges...</div>

  return (
    <AppUI
      user={user}
      logout={logout}
      challenges={challenges}
      createChallenge={createChallenge}
      activeChallenge={activeChallenge}
      activeChallengeId={activeChallengeId}
      setActiveChallengeId={setActiveChallengeId}
      completeDay={completeDay}
      {...progress}
      {...taskLogic}
    />
  )
}