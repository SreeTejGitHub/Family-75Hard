import styles from "../styles"
import Header from "../components/Header"
import { useState, useEffect } from "react"
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"
import { db } from "../firebase"

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

    const [health, setHealth] = useState({
        height: "",
        age: "",
        gender: "",
        activityLevel: "",
        goal: ""
    })

    const updateHealth = (field, value) => {
        setHealth(prev => ({ ...prev, [field]: value }))
    }

    const saveHealthProfile = async () => {
        try {
            await setDoc(
                doc(db, "users", user.uid),
                {
                    height: Number(health.height),
                    age: Number(health.age),
                    gender: health.gender,
                    activityLevel: health.activityLevel,
                    goal: health.goal,
                    updatedAt: serverTimestamp()
                },
                { merge: true }
            )

            alert("Health profile saved ✅")
        } catch (error) {
            console.error("Error saving health profile:", error)
        }
    }

    useEffect(() => {
        const fetchProfile = async () => {
            const docRef = doc(db, "users", user.uid)
            const snapshot = await getDoc(docRef)

            if (snapshot.exists()) {
                const data = snapshot.data()
                setHealth({
                    height: data.height || "",
                    age: data.age || "",
                    gender: data.gender || "",
                    activityLevel: data.activityLevel || "",
                    goal: data.goal || ""
                })
            }
        }

        if (user) fetchProfile()
    }, [user])

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

                {/* Health Info Section */}
                <div
                    style={{
                        marginTop: "30px",
                        background: "#1f2937",
                        padding: "20px",
                        borderRadius: "16px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px"
                    }}
                >
                    <h3>📊 Health Information</h3>

                    <input
                        type="number"
                        placeholder="Height (inches)"
                        value={health.height}
                        onChange={(e) => updateHealth("height", e.target.value)}
                        style={inputStyle}
                    />

                    <input
                        type="number"
                        placeholder="Age"
                        value={health.age}
                        onChange={(e) => updateHealth("age", e.target.value)}
                        style={inputStyle}
                    />

                    <select
                        value={health.gender}
                        onChange={(e) => updateHealth("gender", e.target.value)}
                        style={inputStyle}
                    >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>

                    <select
                        value={health.activityLevel}
                        onChange={(e) => updateHealth("activityLevel", e.target.value)}
                        style={inputStyle}
                    >
                        <option value="">Activity Level</option>
                        <option value="sedentary">Sedentary</option>
                        <option value="light">Light</option>
                        <option value="moderate">Moderate</option>
                        <option value="active">Active</option>
                        <option value="very_active">Very Active</option>
                    </select>

                    <select
                        value={health.goal}
                        onChange={(e) => updateHealth("goal", e.target.value)}
                        style={inputStyle}
                    >
                        <option value="">Goal</option>
                        <option value="fat_loss">Fat Loss</option>
                        <option value="maintain">Maintain</option>
                        <option value="muscle_gain">Muscle Gain</option>
                    </select>

                    <button
                        style={{ ...styles.primaryBtn, marginTop: "10px" }}
                        onClick={saveHealthProfile}
                    >
                        Save Health Info
                    </button>
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

const inputStyle = {
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    background: "#111827",
    color: "white",
    fontSize: "14px"
}