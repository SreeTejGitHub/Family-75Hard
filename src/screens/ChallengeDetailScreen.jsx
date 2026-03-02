import { useState } from "react"
import styles from "../styles"
import Header from "../components/Header"
import icon from "../assets/icon.png"

import ProgressModal from "../components/ProgressModal"

export default function ChallengeDetailScreen({
    user,
    logout,
    setView,
    setActiveChallengeId,
    activeChallenge,
    day,
    completedDays = [],
    longestStreak,
    completionPercent,
    currentStreak,
    taskProgress = [],
    updateTaskProgress,
    completeDay,
    toast
}) {

    const [progressModal, setProgressModal] = useState(null)

    const bestEverStreak = Math.max(
        longestStreak,
        ...(activeChallenge.history || []).map(h => h.longestStreak || 0)
    )

    return (
        <div style={styles.container}>
            <div style={styles.card}>

                <Header
                    user={user}
                    logout={logout}
                    setView={setView}
                    setActiveChallengeId={setActiveChallengeId}
                />

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

                {/* Streak */}
                <div style={styles.streakBox}>
                    🔥 {currentStreak} | 🏆 {longestStreak}
                </div>

                {/* Stats */}
                <div style={{ marginTop: "10px", fontSize: "14px" }}>
                    🔁 Completed: {activeChallenge.totalCompletions || 0} times
                </div>

                <div style={{ marginTop: "5px", fontSize: "14px" }}>
                    🔥 Best Ever Streak: {bestEverStreak}
                </div>

                {/* Day Grid */}
                <div style={styles.grid}>
                    {Array.from({ length: activeChallenge.duration }, (_, i) => {
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
                                    position: "relative",
                                    fontWeight: "600",
                                    fontSize: "14px",
                                    backgroundColor: isCompleted
                                        ? "#0f172a"
                                        : isCurrent
                                            ? "#3b82f6"
                                            : "#1f2937",
                                    color: isCompleted
                                        ? "#22c55e"
                                        : isCurrent
                                            ? "#ffffff"
                                            : "#94a3b8",
                                    border: isCurrent ? "2px solid #60a5fa" : "none",
                                    transition: "0.2s ease"
                                }}
                            >
                                {/* Day Number */}
                                <span style={{ zIndex: 1 }}>{d}</span>

                                {/* Completed Overlay */}
                                {isCompleted && (
                                    <img
                                        src={icon}
                                        alt="completed"
                                        style={{
                                            position: "absolute",
                                            width: "60%",
                                            height: "60%",
                                            objectFit: "contain",
                                            opacity: 0.15
                                        }}
                                    />
                                )}
                            </div>
                        )
                    })}
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
                                                : "#3b82f6"
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

            {/* Toast */}
            {toast && (
                <div
                    style={{
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
                    }}
                >
                    {toast.message}
                </div>
            )}

            {/* Progress Modal */}
            <ProgressModal
                isOpen={progressModal !== null}
                onClose={() => setProgressModal(null)}
                activeChallenge={activeChallenge}
                progressIndex={progressModal}
                taskProgress={taskProgress}
                updateTaskProgress={updateTaskProgress}
            />
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