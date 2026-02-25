import { useState, useEffect } from "react"
import confetti from "canvas-confetti"

const TASKS = [
  "Workout 1 (45 min)",
  "Workout 2 (Outdoor)",
  "1 Gallon Water",
  "Read 10 Pages",
  "Progress Picture"
]

export default function App() {
  const [day, setDay] = useState(1)
  const [tasks, setTasks] = useState(Array(5).fill(false))
  const [completedDays, setCompletedDays] = useState([])
  const [longestStreak, setLongestStreak] = useState(0)
  const [badge, setBadge] = useState("")
  const [view, setView] = useState("tracker")
  const [photos, setPhotos] = useState({})

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("75hard"))
    if (saved) {
      setDay(saved.day)
      setTasks(saved.tasks)
      setCompletedDays(saved.completedDays || [])
      setLongestStreak(saved.longestStreak || 0)
      setPhotos(saved.photos || {})
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(
      "75hard",
      JSON.stringify({
        day,
        tasks,
        completedDays,
        longestStreak,
        photos
      })
    )
  }, [day, tasks, completedDays, longestStreak, photos])

  const completionPercent = Math.round(
    (completedDays.length / 75) * 100
  )

  const consistencyScore = Math.round(
    (completedDays.length / day) * 100 || 0
  )
  const calculateStreak = (days) => {
    let current = 0
    let longest = 0
    let sorted = [...days].sort((a, b) => a - b)

    for (let i = 0; i < sorted.length; i++) {
      if (i === 0 || sorted[i] === sorted[i - 1] + 1) {
        current++
      } else {
        current = 1
      }
      longest = Math.max(longest, current)
    }

    return { current, longest }
  }

  const toggleTask = (index) => {
    const updated = [...tasks]
    updated[index] = !updated[index]
    setTasks(updated)
  }

  const fireConfetti = (power = "normal") => {
    if (power === "mega") {
      confetti({
        particleCount: 500,
        spread: 180,
        startVelocity: 60,
        origin: { y: 0.6 }
      })
    } else if (power === "big") {
      confetti({
        particleCount: 250,
        spread: 120,
        origin: { y: 0.6 }
      })
    } else {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      })
    }
  }

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setPhotos(prev => ({
        ...prev,
        [day]: reader.result
      }))
    }
    reader.readAsDataURL(file)
  }
  const completeDay = () => {
    // Ensure all tasks are completed
    if (!tasks.every(Boolean)) {
      alert("Complete all tasks first.")
      return
    }

    // Prevent duplicate completion
    if (!completedDays.includes(day)) {
      const updatedDays = [...completedDays, day]
      setCompletedDays(updatedDays)

      // Recalculate streak
      const streakData = calculateStreak(updatedDays)
      setLongestStreak(streakData.longest)

      // Default daily celebration
      setBadge("🎉 DAY COMPLETE")
      fireConfetti("normal")

      // Weekly milestone
      if (updatedDays.length % 7 === 0) {
        setBadge("🔥 7 DAY STREAK")
        setTimeout(() => fireConfetti("big"), 300)
      }

      // Major milestones
      if ([30, 50].includes(updatedDays.length)) {
        setBadge(`🏆 ${updatedDays.length} DAYS STRONG`)
        setTimeout(() => fireConfetti("mega"), 500)
      }

      // Final completion
      if (updatedDays.length === 75) {
        setBadge("🚀 75 HARD COMPLETE")
        setTimeout(() => fireConfetti("mega"), 600)
      }

      // Auto-hide badge after 2.5 seconds
      setTimeout(() => {
        setBadge("")
      }, 2500)
    }

    // Move to next day or finish
    if (day === 75) {
      alert("🎉 75 Hard Completed!")
    } else {
      setDay(day + 1)
      setTasks(Array(5).fill(false))
    }
  }

  const reset = () => {
    if (confirm("Reset entire challenge?")) {
      setDay(1)
      setTasks(Array(5).fill(false))
      setCompletedDays([])
      setLongestStreak(0)
    }
  }

  const progress = Math.round((completedDays.length / 75) * 100)
  const currentStreak = calculateStreak(completedDays).current
  // useEffect(() => {
  //   fireConfetti()
  // }, [])
  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <h1 style={styles.title}>75 Hard</h1>
        <p style={styles.subtitle}>Day {day} of 75</p>

        {/* Toggle Buttons */}
        <div style={styles.toggleRow}>
          <button
            style={view === "tracker" ? styles.activeTab : styles.tab}
            onClick={() => setView("tracker")}
          >
            Tracker
          </button>
          <button
            style={view === "stats" ? styles.activeTab : styles.tab}
            onClick={() => setView("stats")}
          >
            Stats
          </button>
        </div>

        {/* ===== TRACKER VIEW ===== */}
        {view === "tracker" && (
          <>
            {/* Progress Bar */}
            <div style={styles.progressBar}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${progress}%`
                }}
              />
            </div>

            {/* Streak Section */}
            <div style={styles.streakBox}>
              <div>
                🔥 Current Streak: <strong>{currentStreak}</strong>
              </div>
              <div>
                🏆 Longest Streak: <strong>{longestStreak}</strong>
              </div>
            </div>

            {/* 75-Day Grid */}
            <div style={styles.grid}>
              {Array.from({ length: 75 }, (_, i) => {
                const dayNumber = i + 1
                const isCompleted = completedDays.includes(dayNumber)
                const isCurrent = dayNumber === day

                return (
                  <div
                    key={i}
                    style={{
                      ...styles.gridItem,
                      backgroundColor: isCompleted
                        ? "#22c55e"
                        : isCurrent
                          ? "#3b82f6"
                          : "#1f2937"
                    }}
                  />
                )
              })}
            </div>

            {/* Tasks */}
            {TASKS.map((task, i) => (
              <div
                key={i}
                onClick={() => toggleTask(i)}
                style={{
                  ...styles.task,
                  backgroundColor: tasks[i] ? "#16a34a" : "#1f2937",
                  textDecoration: tasks[i] ? "line-through" : "none"
                }}
              >
                {task}
              </div>
            ))}
            <div style={{ marginTop: "15px" }}>
              <label style={styles.photoLabel}>
                📸 Upload Progress Photo
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoUpload}
                  style={{ display: "none" }}
                />
              </label>

              {photos[day] && (
                <img
                  src={photos[day]}
                  alt="Progress"
                  style={styles.previewImage}
                />
              )}
            </div>
            <button style={styles.primaryBtn} onClick={completeDay}>
              Complete Day
            </button>

            <button style={styles.resetBtn} onClick={reset}>
              Reset Challenge
            </button>
          </>
        )}

        {/* ===== STATS VIEW ===== */}
        {view === "stats" && (
          <div style={styles.statsContainer}>
            <div style={styles.statCard}>
              📊 Completion
              <div style={styles.statValue}>{completionPercent}%</div>
            </div>

            <div style={styles.statCard}>
              🔥 Current Streak
              <div style={styles.statValue}>{currentStreak}</div>
            </div>

            <div style={styles.statCard}>
              🏆 Longest Streak
              <div style={styles.statValue}>{longestStreak}</div>
            </div>

            <div style={styles.statCard}>
              📅 Days Completed
              <div style={styles.statValue}>{completedDays.length}/75</div>
            </div>

            <div style={styles.statCard}>
              📈 Consistency
              <div style={styles.statValue}>{consistencyScore}%</div>
            </div>
            <div style={{ marginTop: "20px" }}>
              <h3 style={{ marginBottom: "10px" }}>📸 Progress Photos</h3>
              <div style={styles.photoGrid}>
                {Object.keys(photos).map(d => (
                  <img
                    key={d}
                    src={photos[d]}
                    alt={`Day ${d}`}
                    style={styles.photoThumbnail}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

const styles = {
  photoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "6px"
  },
  photoThumbnail: {
    width: "100%",
    borderRadius: "6px"
  },
  photoLabel: {
    display: "block",
    padding: "10px",
    backgroundColor: "#1f2937",
    borderRadius: "8px",
    textAlign: "center",
    cursor: "pointer",
    marginBottom: "10px"
  },
  previewImage: {
    width: "100%",
    borderRadius: "8px",
    marginTop: "10px"
  },
  toggleRow: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "15px",
    gap: "10px"
  },
  tab: {
    padding: "6px 12px",
    background: "#1f2937",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },
  activeTab: {
    padding: "6px 12px",
    background: "#22c55e",
    color: "black",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold"
  },
  statsContainer: {
    display: "grid",
    gap: "12px"
  },
  statCard: {
    backgroundColor: "#111827",
    padding: "15px",
    borderRadius: "12px",
    textAlign: "center",
    fontSize: "14px",
    color: "#9ca3af"
  },
  statValue: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#22c55e",
    marginTop: "5px"
  },
  badgeOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    pointerEvents: "none",
    zIndex: 999
  },
  badge: {
    backgroundColor: "#111827",
    border: "3px solid #22c55e",
    color: "#22c55e",
    padding: "30px 40px",
    borderRadius: "20px",
    fontSize: "22px",
    fontWeight: "bold",
    textAlign: "center",
    boxShadow: "0 0 25px #22c55e",
    animation: "badgePop 0.6s ease, badgeFade 2.5s ease forwards"
  },
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
    color: "white",
    padding: "20px"
  },
  card: {
    width: "100%",
    maxWidth: "420px"
  },
  title: {
    fontSize: "32px",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "10px"
  },
  subtitle: {
    textAlign: "center",
    marginBottom: "15px",
    color: "#9ca3af"
  },
  progressBar: {
    width: "100%",
    height: "8px",
    backgroundColor: "#1f2937",
    borderRadius: "5px",
    marginBottom: "15px"
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#22c55e",
    borderRadius: "5px",
    transition: "width 0.3s ease"
  },
  streakBox: {
    marginBottom: "15px",
    fontSize: "14px",
    display: "flex",
    justifyContent: "space-between",
    color: "#9ca3af"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(15, 1fr)",
    gap: "4px",
    marginBottom: "20px"
  },
  gridItem: {
    width: "100%",
    paddingTop: "100%",
    borderRadius: "3px"
  },
  task: {
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "10px",
    cursor: "pointer"
  },
  primaryBtn: {
    width: "100%",
    padding: "10px",
    marginTop: "15px",
    backgroundColor: "white",
    color: "black",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold"
  },
  resetBtn: {
    width: "100%",
    marginTop: "10px",
    background: "none",
    border: "none",
    color: "#f87171",
    cursor: "pointer"
  }
}