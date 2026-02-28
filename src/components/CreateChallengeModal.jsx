import { useState, useEffect } from "react"
import Modal from "./Modal"

export default function CreateChallengeModal({
    isOpen,
    onClose,
    onCreate
}) {

    const [name, setName] = useState("")
    const [duration, setDuration] = useState("")
    const [taskCount, setTaskCount] = useState("")
    const [tasks, setTasks] = useState([])

    /* ---------------- RESET WHEN OPEN ---------------- */

    useEffect(() => {
        if (isOpen) {
            setName("")
            setDuration("")
            setTaskCount("")
            setTasks([])
        }
    }, [isOpen])

    /* ---------------- HANDLE TASK COUNT ---------------- */

    const handleTaskCountChange = (count) => {
        const newCount = Number(count)
        setTaskCount(newCount)
        setTasks(Array(newCount).fill(""))
    }

    /* ---------------- HANDLE TASK CHANGE ---------------- */

    const handleTaskChange = (index, value) => {
        const updated = [...tasks]
        updated[index] = value
        setTasks(updated)
    }

    /* ---------------- VALIDATION ---------------- */

    const isFormValid =
        name.trim() !== "" &&
        duration > 0 &&
        taskCount > 0 &&
        tasks.length === Number(taskCount) &&
        tasks.every(task => task.trim() !== "")

    /* ---------------- SUBMIT ---------------- */

    const handleSubmit = () => {
        if (!isFormValid) return

        onCreate({
            name: name.trim(),
            duration: Number(duration),
            tasks: tasks.map(t => t.trim())
        })

        onClose()
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>

            <h2 style={{ marginBottom: "20px" }}>
                Create New Challenge
            </h2>

            {/* Challenge Name */}
            <div style={inputGroup}>
                <label>Challenge Name</label>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={inputStyle}
                />
            </div>

            {/* Duration */}
            <div style={inputGroup}>
                <label>Duration (days)</label>
                <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    style={inputStyle}
                />
            </div>

            {/* Task Count */}
            <div style={inputGroup}>
                <label>How many tasks?</label>
                <select
                    value={taskCount}
                    onChange={(e) => handleTaskCountChange(e.target.value)}
                    style={inputStyle}
                >
                    <option value="">Select</option>
                    {Array.from({ length: 100 }, (_, i) => (
                        <option key={i} value={i + 1}>
                            {i + 1}
                        </option>
                    ))}
                </select>
            </div>

            {/* Dynamic Task Inputs */}
            {tasks.length > 0 && (
                <div style={{
                    maxHeight: "250px",
                    overflowY: "auto"
                }}>
                    {tasks.map((task, index) => (
                        <div key={index} style={inputGroup}>
                            <label>Task {index + 1}</label>
                            <input
                                value={task}
                                onChange={(e) =>
                                    handleTaskChange(index, e.target.value)
                                }
                                style={inputStyle}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Buttons */}
            <div style={{
                marginTop: "25px",
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px"
            }}>
                <button onClick={onClose}>
                    Cancel
                </button>

                <button
                    onClick={handleSubmit}
                    disabled={!isFormValid}
                    style={{
                        background: isFormValid ? "#2563eb" : "#374151",
                        color: "white",
                        padding: "10px 16px",
                        borderRadius: "8px",
                        fontWeight: "600",
                        cursor: isFormValid ? "pointer" : "not-allowed",
                        opacity: isFormValid ? 1 : 0.6
                    }}
                >
                    Create
                </button>
            </div>

        </Modal>
    )
}

/* ---------------- STYLES ---------------- */

const inputGroup = {
    marginBottom: "15px",
    display: "flex",
    flexDirection: "column",
    gap: "6px"
}

const inputStyle = {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #333",
    background: "#1f2937",
    color: "white"
}