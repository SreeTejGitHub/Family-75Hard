import { useState } from "react"

export default function CreateChallengeModal({
  isOpen,
  onClose,
  onCreate
}) {
  const [step, setStep] = useState(1)

  // Step 1 fields
  const [name, setName] = useState("")
  const [duration, setDuration] = useState("")
  const [taskCount, setTaskCount] = useState("")

  // Step 2 fields
  const [tasks, setTasks] = useState([])
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0)

  const [taskName, setTaskName] = useState("")
  const [unit, setUnit] = useState("")
  const [target, setTarget] = useState("")

  if (!isOpen) return null

  const canGoNext =
    name.trim() &&
    duration > 0 &&
    taskCount > 0

  const canSaveTask =
    taskName.trim() &&
    unit.trim() &&
    target > 0

  const handleNext = () => {
    setTasks(Array(Number(taskCount)).fill(null))
    setStep(2)
  }

  const saveTask = () => {
    const updated = [...tasks]
    updated[currentTaskIndex] = {
      name: taskName,
      unit,
      target: Number(target)
    }

    setTasks(updated)

    // Reset inputs
    setTaskName("")
    setUnit("")
    setTarget("")

    if (currentTaskIndex + 1 < taskCount) {
      setCurrentTaskIndex(currentTaskIndex + 1)
    } else {
      // All tasks added
      onCreate({
        name,
        duration: Number(duration),
        tasks: updated
      })

      onClose()
    }
  }

  return (
    <div style={modalStyle.overlay}>
      <div style={modalStyle.card}>

        {step === 1 && (
          <>
            <h2>Create New Challenge</h2>

            <input
              placeholder="Challenge Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={modalStyle.input}
            />

            <input
              placeholder="Duration (days)"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              style={modalStyle.input}
            />

            <input
              placeholder="Number of Tasks"
              type="number"
              value={taskCount}
              onChange={(e) => setTaskCount(e.target.value)}
              style={modalStyle.input}
            />

            <div style={modalStyle.actions}>
              <button onClick={onClose}>Cancel</button>

              <button
                disabled={!canGoNext}
                onClick={handleNext}
              >
                Next →
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2>
              Task {currentTaskIndex + 1} of {taskCount}
            </h2>

            <input
              placeholder="Task Name"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              style={modalStyle.input}
            />

            <input
              placeholder="Measurement Unit (minutes, reps, liters)"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              style={modalStyle.input}
            />

            <input
              placeholder="Target Number"
              type="number"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              style={modalStyle.input}
            />

            <div style={modalStyle.actions}>
              <button onClick={onClose}>Cancel</button>

              <button
                disabled={!canSaveTask}
                onClick={saveTask}
              >
                {currentTaskIndex + 1 === Number(taskCount)
                  ? "Create Challenge"
                  : "Next Task →"}
              </button>
            </div>
          </>
        )}

      </div>
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
    justifyContent: "center"
  },
  card: {
    background: "#111827",
    padding: "30px",
    borderRadius: "12px",
    width: "400px"
  },
  input: {
    width: "100%",
    padding: "12px",
    marginTop: "15px",
    borderRadius: "8px",
    border: "none",
    background: "#1f2937",
    color: "white"
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "25px"
  }
}