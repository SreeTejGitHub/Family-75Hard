export default function ProgressModal({
    isOpen,
    onClose,
    activeChallenge,
    progressIndex,
    taskProgress = [],
    updateTaskProgress
}) {
    if (!isOpen || progressIndex === null) return null

    const task = activeChallenge.tasks[progressIndex]
    const currentValue = taskProgress[progressIndex] || 0

    const percent = Math.round(
        (currentValue / task.target) * 100
    )

    return (
        <div style={modalStyle.overlay}>
            <div style={modalStyle.card}>
                <h3>{task.name}</h3>

                <p>
                    Target: {task.target} {task.unit}
                </p>

                <input
                    type="number"
                    min="0"
                    max={task.target}
                    value={currentValue}
                    onChange={(e) =>
                        updateTaskProgress(
                            progressIndex,
                            Number(e.target.value)
                        )
                    }
                    style={modalStyle.input}
                />

                <div style={{ marginTop: "10px", fontSize: "14px" }}>
                    {percent}%
                </div>

                <div style={modalStyle.actions}>
                    <button onClick={onClose}>
                        Close
                    </button>
                </div>
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