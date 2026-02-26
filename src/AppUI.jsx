import styles from "./styles"

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

  if (challenges.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>No Challenges Yet</h1>
          <button style={styles.primaryBtn} onClick={createChallenge}>
            + Create Challenge
          </button>
          <button onClick={logout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </div>
    )
  }
if (!activeChallengeId || !activeChallenge) {

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

        {/* 👋 Greeting */}
        <h2 style={{ marginBottom: "5px" }}>
          Hello {user.displayName || "Champion"} 👋
        </h2>

        {/* 📊 Lifetime Overview */}
        <div style={{
          marginBottom: "20px",
          padding: "14px",
          background: "#111827",
          borderRadius: "10px"
        }}>

          <div style={{ fontWeight: "bold", marginBottom: "6px" }}>
            📊 Lifetime Stats
          </div>

          <div>🏆 Total Completions: {totalCompletionsAll}</div>
          <div>🔥 Best Ever Streak: {bestEverAcrossAll}</div>

          {totalCompletionsAll === 0 && (
            <div style={{ marginTop: "6px", opacity: 0.6 }}>
              Start your first challenge 🚀
            </div>
          )}
        </div>

        {/* 🏅 Challenge Breakdown */}
        {challenges.some(c => (c.totalCompletions || 0) > 0) && (
          <div style={{
            marginBottom: "20px",
            padding: "14px",
            background: "#1f2937",
            borderRadius: "10px"
          }}>
            <div style={{ fontWeight: "bold", marginBottom: "6px" }}>
              🏅 Challenge Achievements
            </div>

            {challenges
              .filter(c => (c.totalCompletions || 0) > 0)
              .map(c => (
                <div key={c.id}>
                  {c.name} → {c.totalCompletions} time
                  {c.totalCompletions > 1 ? "s" : ""}
                </div>
              ))
            }
          </div>
        )}

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

        <button style={styles.primaryBtn} onClick={createChallenge}>
          + Create Challenge
        </button>

        <button onClick={logout} style={styles.logoutBtn}>
          Logout
        </button>

      </div>
    </div>
  )
}

  /* ---------------- DERIVED LIFETIME STATS ---------------- */

  const totalCompletions = activeChallenge.totalCompletions || 0
  const history = activeChallenge.history || []

  const bestEverStreak = Math.max(
    longestStreak,
    ...history.map(h => h.longestStreak || 0)
  )

  /* ---------------- MAIN UI ---------------- */

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        {/* HEADER */}
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

          <div>
            <button
              onClick={() => setActiveChallengeId(null)}
              style={styles.logoutBtn}
            >
              Switch
            </button>
            <button onClick={logout} style={styles.logoutBtn}>
              Logout
            </button>
          </div>
        </div>

        {/* TITLE */}
        <h1 style={styles.title}>
          {activeChallenge.name}
        </h1>

        <p style={styles.subtitle}>
          Day {day} of {activeChallenge.duration}
        </p>

        {/* PROGRESS BAR */}
        <div style={styles.progressBar}>
          <div
            style={{
              ...styles.progressFill,
              width: `${completionPercent}%`
            }}
          />
        </div>

        {/* CURRENT STATS */}
        <div style={styles.streakBox}>
          🔥 {currentStreak} | 🏆 {longestStreak}
        </div>

        {/* LIFETIME STATS */}
        <div style={{ marginTop: "10px", fontSize: "14px" }}>
          🔁 Completed: {totalCompletions} times
        </div>

        <div style={{ marginTop: "5px", fontSize: "14px" }}>
          🔥 Best Ever Streak: {bestEverStreak}
        </div>

        {/* COMPLETION BANNER */}
        {day > activeChallenge.duration && (
          <div style={{
            marginTop: "15px",
            padding: "10px",
            background: "#16a34a",
            borderRadius: "8px",
            fontWeight: "bold"
          }}>
            🎉 Congratulations! Challenge Completed.
          </div>
        )}

        {/* DAY GRID */}
        <div style={styles.grid}>
          {Array.from(
            { length: activeChallenge.duration },
            (_, i) => {
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
            }
          )}
        </div>

        {/* TASKS */}
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

        {/* PHOTO UPLOAD */}
        <div style={{ marginTop: "15px" }}>
          <input
            id="photoUpload"
            type="file"
            accept="image/*"
            capture="environment"
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

        {/* PHOTO PREVIEW */}
        {photos?.[day] && (
          <img
            src={photos[day]}
            alt="progress"
            style={styles.previewImage}
          />
        )}

        {/* COMPLETE BUTTON */}
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

      {/* TOAST */}
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
          boxShadow: "0 5px 20px rgba(0,0,0,0.4)",
          animation: "fadeSlide 0.3s ease"
        }}>
          {toast.message}
        </div>
      )}
    </div>
  )
}