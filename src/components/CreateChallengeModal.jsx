import { useState } from "react"
import Modal from "./Modal"

export default function CreateChallengeModal({
    isOpen,
    onClose,
    onCreate
}) {

    const [name, setName] = useState("")
    const [duration, setDuration] = useState(75)
    const [tasks, setTasks] = useState("")

    const handleSubmit = () => {
        if (!name || !duration || !tasks) return

        onCreate({
            name,
            duration: Number(duration),
            tasks: tasks.split(",").map(t => t.trim())
        })

        setName("")
        setDuration(75)
        setTasks("")
        onClose()
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>

            <h2 style={{ marginBottom: "20px" }}>
                Create New Challenge
            </h2>

            <div style={inputGroup}>
                <label>Challenge Name</label>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={inputStyle}
                />
            </div>

            <div style={inputGroup}>
                <label>Duration (days)</label>
                <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    style={inputStyle}
                />
            </div>

            <div style={inputGroup}>
                <label>Tasks (comma separated)</label>
                <input
                    value={tasks}
                    onChange={(e) => setTasks(e.target.value)}
                    style={inputStyle}
                />
            </div>

            <div style={{
                marginTop: "25px",
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px"
            }}>
                <button onClick={onClose}>
                    Cancel
                </button>

                <button
                    onClick={handleSubmit}
                    style={{
                        background: "#2563eb",
                        color: "white",
                        padding: "8px 14px",
                        borderRadius: "8px"
                    }}
                >
                    Create
                </button>
            </div>

        </Modal>
    )
}

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