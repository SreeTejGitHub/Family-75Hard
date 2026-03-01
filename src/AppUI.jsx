import styles from "./styles"
import { useState, useRef, useEffect } from "react"
import CreateChallengeModal from "./components/CreateChallengeModal"
import logo from "./assets/logo.png"

import LoginScreen from "./screens/LoginScreen"
import Header from "./components/Header"
import ProfileScreen from "./screens/ProfileScreen"
import ChallengeListScreen from "./screens/ChallengeListScreen"
import ChallengeDetailScreen from "./screens/ChallengeDetailScreen"

export default function AppUI({
    user,
    loginWithGoogle,
    logout,
    challenges = [],
    activeChallenge,
    activeChallengeId,
    setActiveChallengeId,
    day,
    completedDays,
    longestStreak,
    completionPercent,
    currentStreak,
    tasks,
    toggleTask,
    completeDay,
    createChallenge,
    toast,
    taskProgress,
    updateTaskProgress
}) {

    const [menuOpen, setMenuOpen] = useState(false)
    const [view, setView] = useState("home")
    const menuRef = useRef(null)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [progressModal, setProgressModal] = useState(null)

    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false)
            }
        }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [])

    if (!user) {
        return <LoginScreen loginWithGoogle={loginWithGoogle} />
    }


    if (view === "profile") {
        return (
            <ProfileScreen
                user={user}
                challenges={challenges}
                setView={setView}
                logout={logout}
                setActiveChallengeId={setActiveChallengeId}
            />
        )
    }

    if (!activeChallengeId || !activeChallenge) {
        return (
            <ChallengeListScreen
                user={user}
                logout={logout}
                setView={setView}
                challenges={challenges}
                setActiveChallengeId={setActiveChallengeId}
                showCreateModal={showCreateModal}
                setShowCreateModal={setShowCreateModal}
                createChallenge={createChallenge}
            />
        )
    }

    return (
        <ChallengeDetailScreen
            user={user}
            logout={logout}
            setView={setView}
            setActiveChallengeId={setActiveChallengeId}
            activeChallenge={activeChallenge}
            day={day}
            completedDays={completedDays}
            longestStreak={longestStreak}
            completionPercent={completionPercent}
            currentStreak={currentStreak}
            taskProgress={taskProgress}
            updateTaskProgress={updateTaskProgress}
            completeDay={completeDay}
            toast={toast}
        />
    )
}

const modalStyle = {
    overlay: {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000
    },
    card: {
        background: "#111827",
        padding: "25px",
        borderRadius: "12px",
        width: "300px"
    },
    input: {
        width: "100%",
        padding: "10px",
        marginTop: "10px",
        borderRadius: "8px",
        border: "none",
        background: "#1f2937",
        color: "white"
    },
    actions: {
        display: "flex",
        justifyContent: "flex-end",
        marginTop: "15px"
    }
}