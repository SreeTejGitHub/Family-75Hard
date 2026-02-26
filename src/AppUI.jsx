import styles from "./styles"

export default function AppUI(props) {
    const {
        user,
        challenges,
        activeChallenge,
        activeChallengeId,
        setActiveChallengeId,
        setUser,
        day,
        completedDays,
        perfectDays,
        longestStreak,
        completionPercent,
        currentStreak,
        tasks,
        toggleTask,
        completeDay,
        reset,
        handlePhotoUpload,
        photos,
        createChallenge
    } = props

    // LOGIN SCREEN
    if (!user) {
        return (
            <div style={styles.container}>
                <div style={styles.card}>
                    <h1 style={styles.title}>Select Profile</h1>
                    {["Sree", "Wife", "Family"].map(name => (
                        <button
                            key={name}
                            style={styles.primaryBtn}
                            onClick={() => setUser(name)}
                        >
                            {name}
                        </button>
                    ))}
                </div>
            </div>
        )
    }

    // CHALLENGE SELECT
    if (user && !activeChallengeId) {
        return (
            <div style={styles.container}>
                <div style={styles.card}>
                    <h1 style={styles.title}>Select Challenge</h1>

                    {challenges.map(c => (
                        <button
                            key={c.id}
                            style={styles.primaryBtn}
                            onClick={() => setActiveChallengeId(c.id)}
                        >
                            {c.name}
                        </button>
                    ))}
                    <button
                        style={styles.primaryBtn}
                        onClick={createChallenge}
                    >
                        + Create Challenge
                    </button>

                </div>
            </div>
        )
    }

    // MAIN TRACKER
    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.headerRow}>
                    <div style={styles.userLabel}>👤 {user}</div>

                    <div>
                        <button
                            onClick={() => setActiveChallengeId(null)}
                            style={styles.logoutBtn}
                        >
                            Switch
                        </button>

                        <button
                            onClick={() => setUser(null)}
                            style={styles.logoutBtn}
                        >
                            Logout
                        </button>
                    </div>
                </div>

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

                {activeChallenge.tasks.map((task, i) => (
                    <div
                        key={i}
                        onClick={() => toggleTask(i)}
                        style={{
                            ...styles.task,
                            backgroundColor: tasks[i] ? "#16a34a" : "#1f2937"
                        }}
                    >
                        {task}
                    </div>
                ))}

                <label style={styles.photoLabel}>
                    📸 Upload Photo
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        style={{ display: "none" }}
                    />
                </label>

                {photos[day] && (
                    <img src={photos[day]} alt="progress" style={styles.previewImage} />
                )}

                <button style={styles.primaryBtn} onClick={completeDay}>
                    Complete Day
                </button>

                <button style={styles.resetBtn} onClick={reset}>
                    Reset
                </button>
            </div>
        </div>
    )
}