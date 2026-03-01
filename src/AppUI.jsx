import styles from "./styles"
import { useState, useRef, useEffect } from "react"
import CreateChallengeModal from "./components/CreateChallengeModal"
import logo from "./assets/logo.png"

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
        return (
            <div style={styles.container}>
                <div style={{
                    ...styles.card,
                    textAlign: "center",
                    padding: "60px 40px"
                }}>

                    <img
                        src={logo}
                        alt="My Challenge Tracker"
                        style={{
                            width: "300px",
                            marginBottom: "0px"
                        }}
                    />

                    <p style={{
                        opacity: 0.6,
                        marginBottom: "40px",
                        fontSize: "16px"
                    }}>
                        Track your habits. Build discipline. Stay consistent.
                    </p>

                    <button
                        onClick={loginWithGoogle}
                        style={{
                            background: "#2563eb",
                            color: "white",
                            padding: "14px 22px",
                            borderRadius: "12px",
                            fontSize: "16px",
                            fontWeight: "600",
                            cursor: "pointer",
                            border: "none",
                            boxShadow: "0 8px 20px rgba(37,99,235,0.5)"
                        }}
                    >
                        🔐 Sign in using Google
                    </button>

                </div>
            </div>
        )
    }

    const Header = () => (
        <div style={styles.headerRow}>
            <img
                src={logo}
                alt="logo"
                style={{
                    width: "100px",
                    height: "50px",
                    borderRadius: "6px"
                }}
            />
            <span>{user.displayName}</span>
            <div ref={menuRef} style={{ position: "relative" }}>
                <button onClick={() => setMenuOpen(!menuOpen)}>☰</button>
                {menuOpen && (
                    <div
                        style={{
                            position: "absolute",
                            top: "45px",
                            right: "0",
                            background: "#1f2937",
                            borderRadius: "14px",
                            padding: "12px",
                            width: "200px",
                            boxShadow: "0 15px 40px rgba(0,0,0,0.6)",
                            zIndex: 1000,
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px"
                        }}
                    >

                        {/* Profile */}
                        <div
                            onClick={() => {
                                setView("profile")
                                setMenuOpen(false)
                            }}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                padding: "10px",
                                borderRadius: "10px",
                                cursor: "pointer",
                                fontSize: "16px"
                            }}
                        >
                            <span>👤</span>
                            <span>Profile</span>
                        </div>

                        {/* Challenges */}
                        <div
                            onClick={() => {
                                setActiveChallengeId(null)
                                setView("home")
                                setMenuOpen(false)
                            }}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                padding: "10px",
                                borderRadius: "10px",
                                cursor: "pointer",
                                fontSize: "16px"
                            }}
                        >
                            <span>📋</span>
                            <span>Challenges</span>
                        </div>

                        {/* Logout */}
                        <div
                            onClick={() => {
                                logout()
                                setMenuOpen(false)
                            }}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                padding: "10px",
                                borderRadius: "10px",
                                cursor: "pointer",
                                fontSize: "16px",
                                color: "#ef4444"
                            }}
                        >
                            <span>🚪</span>
                            <span>Logout</span>
                        </div>

                    </div>
                )}
            </div>
        </div>
    )

    if (view === "profile") {

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

                    {/* Profile Section */}
                    <div style={{
                        textAlign: "center",
                        marginTop: "30px"
                    }}>

                        {user.photoURL && (
                            <img
                                src={user.photoURL}
                                alt="profile"
                                width="120"
                                height="120"
                                style={{
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                    marginBottom: "20px",
                                    boxShadow: "0 10px 30px rgba(0,0,0,0.6)"
                                }}
                            />
                        )}

                        <h1 style={{
                            fontSize: "28px",
                            marginBottom: "8px"
                        }}>
                            {user.displayName}
                        </h1>

                        <div style={{
                            opacity: 0.6,
                            fontSize: "16px"
                        }}>
                            {user.email}
                        </div>

                    </div>

                    {/* Stats Card */}
                    <div style={{
                        marginTop: "30px",
                        background: "linear-gradient(135deg, #1e293b, #0f172a)",
                        padding: "20px",
                        borderRadius: "16px",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                        fontSize: "18px"
                    }}>
                        <div>🏆 Total Completions: {totalCompletionsAll}</div>
                        <div>🔥 Best Ever Streak: {bestEverAcrossAll}</div>
                        <div>📋 Total Challenges: {challenges.length}</div>
                    </div>

                    {/* Back Button */}
                    <button
                        style={{
                            ...styles.primaryBtn,
                            marginTop: "30px"
                        }}
                        onClick={() => setView("home")}
                    >
                        ← Back
                    </button>

                </div>
            </div>
        )
    }

    if (!activeChallengeId || !activeChallenge) {
        return (
            <div style={styles.container}>
                <div style={styles.card}>

                    <Header />

                    <h1 style={{
                        fontSize: "36px",
                        marginTop: "30px",
                        marginBottom: "30px"
                    }}>
                        Select Challenge
                    </h1>

                    {/* Challenge List */}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "16px"
                        }}
                    >
                        {challenges.map((c) => {
                            const completed =
                                c.progress?.completedDays?.length || 0

                            const duration = c.duration || 1

                            const percent = Math.round(
                                (completed / duration) * 100
                            )

                            return (
                                <div
                                    key={c.id}
                                    onClick={() => setActiveChallengeId(c.id)}
                                    style={{
                                        padding: "18px",
                                        borderRadius: "14px",
                                        background:
                                            "linear-gradient(135deg, #1e293b, #0f172a)",
                                        cursor: "pointer",
                                        fontSize: "20px",
                                        fontWeight: "600",
                                        boxShadow: "0 8px 25px rgba(0,0,0,0.5)",
                                        transition: "0.2s ease"
                                    }}
                                    onMouseEnter={(e) =>
                                        (e.currentTarget.style.transform = "scale(1.02)")
                                    }
                                    onMouseLeave={(e) =>
                                        (e.currentTarget.style.transform = "scale(1)")
                                    }
                                >
                                    {/* Title Row */}
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            marginBottom: "10px"
                                        }}
                                    >
                                        <span>{c.name}</span>
                                        <span style={{ fontSize: "14px", opacity: 0.7 }}>
                                            {percent}%
                                        </span>
                                    </div>

                                    {/* Progress Bar */}
                                    <div
                                        style={{
                                            height: "8px",
                                            width: "100%",
                                            background: "#0f172a",
                                            borderRadius: "8px",
                                            overflow: "hidden"
                                        }}
                                    >
                                        <div
                                            style={{
                                                height: "100%",
                                                width: `${percent}%`,
                                                background:
                                                    percent === 100
                                                        ? "linear-gradient(90deg, #16a34a, #22c55e)"
                                                        : "linear-gradient(90deg, #16a34a, #15803d)",
                                                transition: "width 0.4s ease"
                                            }}
                                        />
                                    </div>

                                    {/* Small Stats */}
                                    <div
                                        style={{
                                            marginTop: "8px",
                                            fontSize: "13px",
                                            opacity: 0.6
                                        }}
                                    >
                                        {completed} / {duration} days completed
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Create Button */}
                    <button
                        style={{
                            ...styles.primaryBtn,
                            marginTop: "30px",
                            fontSize: "18px"
                        }}
                        onClick={() => setShowCreateModal(true)}
                    >
                        + Create Challenge
                    </button>

                </div>
                <CreateChallengeModal
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    onCreate={createChallenge}
                />
            </div>
        )
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>

                <Header />

                <h1 style={styles.title}>{activeChallenge.name}</h1>

                <p style={styles.subtitle}>
                    Day {day} of {activeChallenge.duration}
                </p>

                {/* Progress Bar */}
                <div style={styles.progressBar}>
                    <div
                        style={{
                            ...styles.progressFill,
                            width: `${completionPercent}%`
                        }}
                    />
                </div>

                {/* Streak + Trophy */}
                <div style={styles.streakBox}>
                    🔥 {currentStreak} | 🏆 {longestStreak}
                </div>

                {/* Completion Stats */}
                <div style={{ marginTop: "10px", fontSize: "14px" }}>
                    🔁 Completed: {activeChallenge.totalCompletions || 0} times
                </div>

                <div style={{ marginTop: "5px", fontSize: "14px" }}>
                    🔥 Best Ever Streak: {
                        Math.max(
                            longestStreak,
                            ...(activeChallenge.history || []).map(h => h.longestStreak || 0)
                        )
                    }
                </div>

                {/* Day Grid */}
                <div style={styles.grid}>
                    {Array.from(
                        { length: activeChallenge.duration },
                        (_, i) => {
                            const d = i + 1
                            const isCompleted = completedDays.includes(d)
                            const isCurrent = d === day

                            return (
                                <div
                                    key={i}
                                    style={{
                                        ...styles.gridItem,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: !isCompleted
                                            ? isCurrent
                                                ? "#3b82f6"
                                                : "#1f2937"
                                            : "#0f172a",
                                        overflow: "hidden"
                                    }}
                                >
                                    {isCompleted && (
                                        <img
                                            src="./assets/icon.png"
                                            alt="completed"
                                            style={{
                                                width: "70%",
                                                height: "70%",
                                                objectFit: "contain",
                                                opacity: 0.95
                                            }}
                                        />
                                    )}
                                </div>
                            )
                        }
                    )}
                </div>

                {/* Tasks */}
                {(activeChallenge.tasks || []).map((task, i) => {
                    const current = taskProgress[i] || 0
                    const percent = Math.min(
                        100,
                        Math.round((current / task.target) * 100)
                    )

                    return (
                        <div
                            key={i}
                            onClick={() => {
                                if (task.target === 1) {
                                    updateTaskProgress(i, current === 1 ? 0 : 1)
                                } else {
                                    setProgressModal(i)
                                }
                            }}
                            style={{
                                ...styles.task,
                                backgroundColor: "#1f2937",
                                cursor: "pointer"
                            }}
                        >
                            <div style={{ fontWeight: "600" }}>
                                {task.name}
                            </div>

                            <div style={{ fontSize: "13px", opacity: 0.6 }}>
                                {current} / {task.target} {task.unit}
                            </div>

                            {/* Progress Bar */}
                            <div
                                style={{
                                    marginTop: "6px",
                                    height: "6px",
                                    background: "#0f172a",
                                    borderRadius: "6px",
                                    overflow: "hidden"
                                }}
                            >
                                <div
                                    style={{
                                        width: `${percent}%`,
                                        height: "100%",
                                        background:
                                            percent === 100
                                                ? "#22c55e"
                                                : "#3b82f6",
                                        transition: "0.3s ease"
                                    }}
                                />
                            </div>
                        </div>
                    )
                })}

                {/* Complete Button */}
                <button
                    style={{
                        ...styles.primaryBtn,
                        marginTop: "20px",
                        opacity: day > activeChallenge.duration ? 0.5 : 1
                    }}
                    onClick={completeDay}
                    disabled={day > activeChallenge.duration}
                >
                    {day > activeChallenge.duration
                        ? "Challenge Completed 🎉"
                        : "Complete Day"}
                </button>

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

            {
                progressModal !== null && (
                    <div style={modalStyle.overlay}>
                        <div style={modalStyle.card}>
                            <h3>{activeChallenge.tasks[progressModal].name}</h3>

                            <p>
                                Target: {activeChallenge.tasks[progressModal].target}{" "}
                                {activeChallenge.tasks[progressModal].unit}
                            </p>

                            <input
                                type="number"
                                min="0"
                                max={activeChallenge.tasks[progressModal].target}
                                value={taskProgress[progressModal] || 0}
                                onChange={(e) =>
                                    updateTaskProgress(
                                        progressModal,
                                        Number(e.target.value)
                                    )
                                }
                                style={modalStyle.input}
                            />

                            <div style={{ marginTop: "10px", fontSize: "14px" }}>
                                {Math.round(
                                    ((taskProgress[progressModal] || 0) /
                                        activeChallenge.tasks[progressModal].target) *
                                    100
                                )}
                                %
                            </div>

                            <div style={modalStyle.actions}>
                                <button onClick={() => setProgressModal(null)}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
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