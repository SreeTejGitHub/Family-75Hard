import styles from "../styles"
import Header from "../components/Header"
import CreateChallengeModal from "../components/CreateChallengeModal"

export default function ChallengeListScreen({
    user,
    logout,
    setView,
    challenges = [],
    setActiveChallengeId,
    showCreateModal,
    setShowCreateModal,
    createChallenge
}) {

    return (
        <div style={styles.container}>
            <div style={styles.card}>

                <Header
                    user={user}
                    logout={logout}
                    setView={setView}
                    setActiveChallengeId={setActiveChallengeId}
                />

                <h1
                    style={{
                        fontSize: "36px",
                        marginTop: "30px",
                        marginBottom: "30px"
                    }}
                >
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