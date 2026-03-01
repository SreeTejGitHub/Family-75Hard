import styles from "../styles"
import Header from "../components/Header"

export default function ProfileScreen({
    user,
    challenges = [],
    setView,
    logout,
    setActiveChallengeId
}) {

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

                <Header
                    user={user}
                    logout={logout}
                    setView={setView}
                    setActiveChallengeId={setActiveChallengeId}
                />

                {/* Profile Section */}
                <div
                    style={{
                        textAlign: "center",
                        marginTop: "30px"
                    }}
                >
                    {user?.photoURL && (
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

                    <h1
                        style={{
                            fontSize: "28px",
                            marginBottom: "8px"
                        }}
                    >
                        {user?.displayName}
                    </h1>

                    <div
                        style={{
                            opacity: 0.6,
                            fontSize: "16px"
                        }}
                    >
                        {user?.email}
                    </div>
                </div>

                {/* Stats Card */}
                <div
                    style={{
                        marginTop: "30px",
                        background: "linear-gradient(135deg, #1e293b, #0f172a)",
                        padding: "20px",
                        borderRadius: "16px",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                        fontSize: "18px"
                    }}
                >
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