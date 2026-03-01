import { useState } from "react"
import styles from "../styles"
import Header from "../components/Header"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "../firebase"

export default function WeeklyTrackerScreen({
    user,
    logout,
    setView,
    setActiveChallengeId
}) {

    const [entries, setEntries] = useState([])
    const [toast, setToast] = useState(null)
    const [form, setForm] = useState({
        weight: "",
        chest: "",
        arms: "",
        waist: "",
        thighs: ""
    })

    const isFormComplete = Object.values(form).every(
        value => value !== "" && Number(value) > 0
    )

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async () => {
        try {
            await addDoc(
                collection(db, "users", user.uid, "weeklyMetrics"),
                {
                    weight: Number(form.weight),
                    chest: Number(form.chest),
                    arms: Number(form.arms),
                    waist: Number(form.waist),
                    thighs: Number(form.thighs),
                    createdAt: serverTimestamp()
                }
            )

            // Reset form
            setForm({
                weight: "",
                chest: "",
                arms: "",
                waist: "",
                thighs: "",
                steps: ""
            })

            setToast({
                type: "success",
                message: "Weekly entry saved successfully 🚀"
            })

            // Auto hide after 3 seconds
            setTimeout(() => setToast(null), 3000)
        } catch (error) {
            console.error("Error saving weekly entry:", error)
        }
    }
    return (
        <div style={styles.container}>
            <div style={styles.card}>

                <Header
                    user={user}
                    logout={logout}
                    setView={setView}
                    setActiveChallengeId={setActiveChallengeId}
                />

                {/* Input Form */}
                <h1 style={{ marginTop: "20px" }}>
                    Weekly Body Tracker
                </h1>

                <div style={{ marginTop: "25px", display: "flex", flexDirection: "column", gap: "25px" }}>

                    {/* 🔹 WEIGHT SECTION */}
                    <div style={sectionStyle}>
                        <h3 style={sectionTitle}>⚖ Weight</h3>

                        <input
                            type="number"
                            name="weight"
                            placeholder="Weight (lbs)"
                            value={form.weight}
                            onChange={handleChange}
                            style={inputStyle}
                        />
                    </div>

                    {/* 🔹 UPPER BODY */}
                    <div style={sectionStyle}>
                        <h3 style={sectionTitle}>💪 Upper Body</h3>

                        <input
                            type="number"
                            name="chest"
                            placeholder="Chest (in)"
                            value={form.chest}
                            onChange={handleChange}
                            style={inputStyle}
                        />

                        <input
                            type="number"
                            name="arms"
                            placeholder="Arms (in)"
                            value={form.arms}
                            onChange={handleChange}
                            style={inputStyle}
                        />
                    </div>

                    {/* 🔹 LOWER BODY */}
                    <div style={sectionStyle}>
                        <h3 style={sectionTitle}>🦵 Lower Body</h3>

                        <input
                            type="number"
                            name="waist"
                            placeholder="Waist (in)"
                            value={form.waist}
                            onChange={handleChange}
                            style={inputStyle}
                        />

                        <input
                            type="number"
                            name="thighs"
                            placeholder="Thighs (in)"
                            value={form.thighs}
                            onChange={handleChange}
                            style={inputStyle}
                        />
                    </div>

                    {/* Save Button */}
                    <button
                        style={{
                            ...styles.primaryBtn,
                            opacity: isFormComplete ? 1 : 0.5,
                            cursor: isFormComplete ? "pointer" : "not-allowed"
                        }}
                        onClick={handleSubmit}
                        disabled={!isFormComplete}
                    >
                        Save Weekly Entry
                    </button>

                </div>

                {/* History Section */}
                {entries.length > 0 && (
                    <div style={{ marginTop: "30px" }}>
                        <h3>History</h3>

                        <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "10px" }}>
                            {entries.map((entry, i) => (
                                <div
                                    key={i}
                                    style={{
                                        background: "#1f2937",
                                        padding: "12px",
                                        borderRadius: "10px",
                                        fontSize: "14px"
                                    }}
                                >
                                    <div style={{ opacity: 0.6 }}>
                                        {entry.date}
                                    </div>

                                    <div>
                                        ⚖ {entry.weight} lbs |
                                        Chest {entry.chest}" |
                                        Arms {entry.arms}" |
                                        Waist {entry.waist}" |
                                        Thighs {entry.thighs}" |
                                        🚶 {entry.steps} steps
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>

            {toast && (
                <div
                    style={{
                        position: "fixed",
                        bottom: "30px",
                        right: "30px",
                        padding: "14px 22px",
                        borderRadius: "10px",
                        backgroundColor:
                            toast.type === "success" ? "#16a34a" : "#dc2626",
                        color: "white",
                        fontWeight: "600",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
                        transition: "0.3s ease",
                        zIndex: 3000
                    }}
                >
                    {toast.message}
                </div>
            )}
        </div>
    )
}

const sectionStyle = {
    background: "#1f2937",
    padding: "18px",
    borderRadius: "14px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.4)"
}

const sectionTitle = {
    fontSize: "18px",
    marginBottom: "5px",
    opacity: 0.8
}

const inputStyle = {
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    background: "#111827",
    color: "white"
}