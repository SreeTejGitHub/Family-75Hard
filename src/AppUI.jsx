import styles from "./styles"
import { useState, useRef, useEffect } from "react"

export default function AppUI({
    user,
    loginWithGoogle,
    logout,
    challenges = [],
    activeChallenge,
    activeChallengeId,
    setActiveChallengeId,
    day = 1,
    completedDays = [],
    longestStreak = 0,
    completionPercent = 0,
    currentStreak = 0,
    tasks = [],
    toggleTask,
    completeDay,
    reset,
    photos = {},
    createChallenge,
    handlePhotoUpload,
    toast
}) {

    /* ---------------- MENU ---------------- */

    const [menuOpen, setMenuOpen] = useState(false)
    const [currentView, setCurrentView] = useState("home")
    const menuRef = useRef(null)

    const menuItemStyle = {
        padding: "8px",
        cursor: "pointer",
        borderRadius: "6px",
        fontSize: "14px"
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    /* ---------------- HEADER (GLOBAL) ---------------- */

    const Header = () => (
        <div style={styles.headerRow}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {user.photoURL && (
                    <img
                        src={user.photoURL}
                        alt="profile"
                        width="28"
                        style={{ borderRadius: "50%" }}
                    />
                )}
                <span style={styles.userLabel}>
                    {user.displayName || "User"}
                </span>
            </div>

            <div style={{ position: "relative" }} ref={menuRef}>
                <button
                    onClick={() => setMenuOpen(prev => !prev)}
                    style={{
                        background: "none",
                        border: "none",
                        color: "white",
                        fontSize: "20px",
                        cursor: "pointer"
                    }}
                >
                    ☰
                </button>

                {menuOpen && (
                    <div
                        style={{
                            position: "absolute",
                            top: "40px",
                            right: "0",
                            background: "#1f2937",
                            borderRadius: "8px",
                            padding: "8px",
                            width: "180px",
                            boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
                            zIndex: 1000
                        }}
                    >
                        <div
                            style={menuItemStyle}
                            onClick={() => {
                                setCurrentView("profile")
                                setMenuOpen(false)
                            }}
                        >
                            👤 Profile
                        </div>

                        <div
                            style={menuItemStyle}
                            onClick={() => {
                                setCurrentView("home")
                                setMenuOpen(false)
                            }}
                        >
                            📋 Challenges
                        </div>

                        <div
                            style={{ ...menuItemStyle, color: "#ef4444" }}
                            onClick={() => {
                                logout()
                                setMenuOpen(false)
                            }}
                        >
                            🚪 Logout
                        </div>
                    </div>
                )}
            </div>
        </div>
    )

    /* ---------------- NOT LOGGED IN ---------------- */

    if (!user) {
        return (
            <div style={styles.container}>
                <div style={styles.card}>
                    <h1 style={styles.title}>75 Hard</h1>
                    <button style={styles.primaryBtn} onClick={loginWithGoogle}>
                        Sign in with Google
                    </button>
                </div>
            </div>
        )
    }

    /* ---------------- PROFILE SCREEN (MUST BE FIRST) ---------------- */

    if (currentView === "profile") {

        const totalCompletionsAll = challenges.reduce(
            (sum, c) => sum + (c.totalCompletions || 0),
            0
        )

        const bestEverAcrossAll = Math.max(
            0,
            ...challenges.map(c =>
                Math.max(
                    c.progress?.longestStreak || 0,
                    ...(c.history || []).map(h => h.longestStreak || 0)
                )
            )
        )

        return (
            <div style={styles.container}>
                <div style={styles.card}>
                    <Header />

                    <div style={{ textAlign: "center", marginTop: "20px" }}>
                        {user.photoURL && (
                            <img
                                src={user.photoURL}
                                alt="profile"
                                width="90"
                                style={{ borderRadius: "50%", marginBottom: "10px" }}
                            />
                        )}
                        <h2>{user.displayName}</h2>
                        <div style={{ opacity: 0.7 }}>{user.email}</div>
                    </div>

                    <div style={{
                        background: "#111827",
                        padding: "16px",
                        borderRadius: "10px",
                        marginTop: "20px"
                    }}>
                        <div>🏆 Total Completions: {totalCompletionsAll}</div>
                        <div>🔥 Best Ever Streak: {bestEverAcrossAll}</div>
                        <div>📋 Total Challenges: {challenges.length}</div>
                    </div>

                    <button
                        style={{ ...styles.primaryBtn, marginTop: "20px" }}
                        onClick={() => setCurrentView("home")}
                    >
                        ← Back
                    </button>
                </div>
            </div>
        )
    }

    /* ---------------- NO CHALLENGES ---------------- */

    if (challenges.length === 0) {
        return (
            <div style={styles.container}>
                <div style={styles.card}>
                    <Header />
                    <h1 style={styles.title}>No Challenges Yet</h1>
                    <button style={styles.primaryBtn} onClick={createChallenge}>
                        + Create Challenge
                    </button>
                </div>
            </div>
        )
    }

    /* ---------------- SELECT CHALLENGE SCREEN ---------------- */

    if (!activeChallengeId || !activeChallenge) {
        return (
            <div style={styles.container}>
                <div style={styles.card}>
                    <Header />

                    <h1 style={styles.title}>Select Challenge</h1>

                    {challenges.map(c => (
                        <button
                            key={c.id}
                            style={styles.primaryBtn}
                            onClick={() => {
                                setCurrentView("home")
                                setActiveChallengeId(c.id)
                            }}
                        >
                            {c.name}
                        </button>
                    ))}

                    <button style={styles.primaryBtn} onClick={createChallenge}>
                        + Create Challenge
                    </button>
                </div>
            </div>
        )
    }
    /* ---------------- ACTIVE CHALLENGE UI ---------------- */

    const totalCompletions = activeChallenge.totalCompletions || 0
    const history = activeChallenge.history || []

    const bestEverStreak = Math.max(
        longestStreak,
        ...history.map(h => h.longestStreak || 0)
    )

    return (
        <div style={styles.container}>
            <div style={styles.card}>

                <Header />

                <h1 style={styles.title}>{activeChallenge.name}</h1>

                <p style={styles.subtitle}>
                    Day {day} of {activeChallenge.duration}
                </p>

                <div style={styles.progressBar}>
                    <div
                        style={{
                            ...styles.progressFill,
                            width: `${completionPercent}%`
                        }}
                    />
                </div>

                <div style={styles.streakBox}>
                    🔥 {currentStreak} | 🏆 {longestStreak}
                </div>

                <div style={{ marginTop: "10px", fontSize: "14px" }}>
                    🔁 Completed: {totalCompletions} times
                </div>

                <div style={{ marginTop: "5px", fontSize: "14px" }}>
                    🔥 Best Ever Streak: {bestEverStreak}
                </div>

                <div style={styles.grid}>
                    {Array.from({ length: activeChallenge.duration }, (_, i) => {
                        const d = i + 1
                        return (
                            <div
                                key={i}
                                style={{
                                    ...styles.gridItem,
                                    backgroundColor: completedDays.includes(d)
                                        ? "#22c55e"
                                        : d === day
                                            ? "#3b82f6"
                                            : "#1f2937"
                                }}
                            />
                        )
                    })}
                </div>

                {(activeChallenge.tasks || []).map((task, i) => (
                    <div
                        key={i}
                        onClick={() => toggleTask?.(i)}
                        style={{
                            ...styles.task,
                            backgroundColor: tasks[i] ? "#16a34a" : "#1f2937"
                        }}
                    >
                        {task}
                    </div>
                ))}

                <div style={{ marginTop: "15px" }}>
                    <input
                        id="photoUpload"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        style={{ display: "none" }}
                    />

                    <button
                        style={styles.primaryBtn}
                        onClick={() =>
                            document.getElementById("photoUpload")?.click()
                        }
                    >
                        📸 Upload Progress Photo
                    </button>
                </div>

                {photos?.[day] && (
                    <img
                        src={photos[day]}
                        alt="progress"
                        style={styles.previewImage}
                    />
                )}

                <button
                    style={{
                        ...styles.primaryBtn,
                        opacity: day > activeChallenge.duration ? 0.5 : 1,
                        cursor: day > activeChallenge.duration
                            ? "not-allowed"
                            : "pointer"
                    }}
                    onClick={completeDay}
                    disabled={day > activeChallenge.duration}
                >
                    {day > activeChallenge.duration
                        ? "Challenge Completed 🎉"
                        : "Complete Day"}
                </button>

                {reset && (
                    <button style={styles.resetBtn} onClick={reset}>
                        Reset
                    </button>
                )}

            </div>

            {toast && (
                <div style={{
                    position: "fixed",
                    bottom: "30px",
                    right: "30px",
                    padding: "12px 20px",
                    borderRadius: "8px",
                    backgroundColor:
                        toast.type === "success" ? "#16a34a" : "#dc2626",
                    color: "white",
                    fontWeight: "bold",
                    boxShadow: "0 5px 20px rgba(0,0,0,0.4)"
                }}>
                    {toast.message}
                </div>
            )}
        </div>
    )
}