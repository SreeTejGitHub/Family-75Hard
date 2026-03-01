import { useEffect, useState } from "react"
import { doc, getDoc, collection, query, orderBy, limit, getDocs } from "firebase/firestore"
import { db } from "../firebase"
import styles from "../styles"
import Header from "../components/Header"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

export default function HealthDashboardScreen({
    user,
    logout,
    setView,
    setActiveChallengeId
}) {

    const [health, setHealth] = useState(null)
    const [weight, setWeight] = useState(null)
    const [weightHistory, setWeightHistory] = useState([])

    useEffect(() => {
        const fetchData = async () => {

            // Get health profile
            const profileSnap = await getDoc(doc(db, "users", user.uid))
            if (profileSnap.exists()) {
                setHealth(profileSnap.data())
            }

            // Get latest weight
            const q = query(
                collection(db, "users", user.uid, "weeklyMetrics"),
                orderBy("createdAt", "asc")
            )

            const snapshot = await getDocs(q)

            const weightData = []
            snapshot.forEach(doc => {
                weightData.push({
                    date: doc.data().createdAt?.toDate().toLocaleDateString(),
                    weight: doc.data().weight
                })
            })

            setWeightHistory(weightData)
            setWeight(weightData[weightData.length - 1]?.weight)
        }

        fetchData()
    }, [user])

    if (!health || !weight) return <div style={{ padding: 30 }}>Loading Health Data...</div>

    // ---- CALCULATIONS ----
    // -----------------------------
    // UNIT CONVERSIONS
    // -----------------------------

    const heightInches = Number(health.height)
    const age = Number(health.age)

    const weightKg = weight * 0.453592
    const heightCm = heightInches * 2.54
    // -----------------------------
    // BMI CALCULATION
    // -----------------------------

    const bmi = ((weight / (heightInches * heightInches)) * 703).toFixed(1)

    let bmiCategory = ""
    let bmiColor = "#22c55e"

    if (bmi < 18.5) {
        bmiCategory = "Underweight"
        bmiColor = "#3b82f6"
    }
    else if (bmi < 25) {
        bmiCategory = "Normal"
        bmiColor = "#22c55e"
    }
    else if (bmi < 30) {
        bmiCategory = "Overweight"
        bmiColor = "#f59e0b"
    }
    else {
        bmiCategory = "Obese"
        bmiColor = "#ef4444"
    }

    // -----------------------------
    // BMR CALCULATION (Mifflin-St Jeor)
    // -----------------------------

    let bmr = 0

    if (health.gender === "male") {
        bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5
    } else {
        bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161
    }

    // -----------------------------
    // TDEE CALCULATION
    // -----------------------------

    const activityMap = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        very_active: 1.9
    }

    const tdee = bmr * (activityMap[health.activityLevel] || 1.2)

    // -----------------------------
    // CALORIE TARGET BASED ON GOAL
    // -----------------------------

    let calorieTarget = tdee

    if (health.goal === "fat_loss") calorieTarget = tdee - 500
    if (health.goal === "muscle_gain") calorieTarget = tdee + 300
    // -----------------------------

    // -----------------------------
    // BODY FAT ESTIMATION (Simplified Formula)
    // -----------------------------

    let bodyFat = ((1.20 * bmi) + (0.23 * age) - 16.2).toFixed(1)

    // -----------------------------
    // MACRO BREAKDOWN
    // -----------------------------

    const protein = weight // 1g per lb
    const fat = (calorieTarget * 0.25) / 9
    const carbs = (calorieTarget - (protein * 4 + fat * 9)) / 4

    // -----------------------------
    // 12 WEEK PROJECTION
    // -----------------------------

    let weeklyChange = 0
    if (health.goal === "fat_loss") weeklyChange = -1
    if (health.goal === "muscle_gain") weeklyChange = 0.6

    const projectedWeight = weight + (weeklyChange * 12)

    const projectedBodyFat =
        health.goal === "fat_loss"
            ? (bodyFat - 3).toFixed(1)
            : (Number(bodyFat) + 1).toFixed(1)


    // -----------------------------
    // ACTIVITY EXPLANATION
    // -----------------------------

    const activityDescriptions = {
        sedentary: "Little to no exercise. Mostly sitting.",
        light: "Light exercise 1–3 days/week.",
        moderate: "Moderate exercise 3–5 days/week.",
        active: "Hard exercise 6–7 days/week.",
        very_active: "Very intense training + physical job."
    }

    const activityExplanation = activityDescriptions[health.activityLevel]

    // -----------------------------
    // ACTIVITY REQUIREMENT
    // -----------------------------

    const deficit = tdee - calorieTarget

    const walkingMinutes = deficit / 5
    const joggingMinutes = deficit / 10
    const runningMinutes = deficit / 13

    // view
    return (
        <div style={styles.container}>
            <div style={styles.card}>

                <Header
                    user={user}
                    logout={logout}
                    setView={setView}
                    setActiveChallengeId={setActiveChallengeId}
                />

                <h1 style={{ marginTop: "20px" }}>Health Dashboard</h1>

                {/* main grid */}
                <div style={gridStyle}>

                    <Card title="⚖ Current Weight" value={`${weight} lbs`} />

                    <Card
                        title="📊 BMI"
                        value={
                            <span style={{ color: bmiColor }}>
                                {bmi} ({bmiCategory})
                            </span>
                        }
                    />

                    <Card title="🔥 BMR" value={`${bmr.toFixed(0)} kcal`} />
                    <Card title="⚡ TDEE" value={`${tdee.toFixed(0)} kcal`} />
                    <Card title="🎯 Daily Target" value={`${calorieTarget.toFixed(0)} kcal`} />
                    <Card title="🧬 Body Fat %" value={`${bodyFat}%`} />

                </div>

                {/* Advanced Analytics Section */}
                <div style={{ marginTop: "40px", display: "grid", gap: "20px" }}>

                    <div style={cardStyle}>
                        <h3 style={{ marginBottom: "15px" }}>🍽 Macro Breakdown</h3>
                        <div>Protein: {protein.toFixed(0)}g</div>
                        <div>Fat: {fat.toFixed(0)}g</div>
                        <div>Carbs: {carbs.toFixed(0)}g</div>
                    </div>

                    <div style={cardStyle}>
                        <h3 style={{ marginBottom: "15px" }}>📆 12-Week Projection</h3>
                        <div>Projected Weight: {projectedWeight.toFixed(1)} lbs</div>
                        <div>Projected Body Fat: {projectedBodyFat}%</div>
                    </div>

                </div>

                <div>
                    <Card
                        title="🔮 Projected Body Fat"
                        value={`${projectedBodyFat}%`}
                    />
                </div>

                {/* Activity Coaching Card */}
                <div style={cardStyle}>
                    <h3 style={{ marginBottom: "15px" }}>🏃 Activity Guidance</h3>

                    <div style={{ marginBottom: "10px" }}>
                        <strong>Selected Activity:</strong> {health.activityLevel}
                    </div>

                    <div style={{ opacity: 0.7, marginBottom: "15px" }}>
                        {activityExplanation}
                    </div>

                    {health.goal === "fat_loss" && (
                        <>
                            <div>🔥 Daily Deficit Needed: {deficit.toFixed(0)} kcal</div>

                            <div style={{ marginTop: "10px" }}>
                                🚶 Walking: {walkingMinutes.toFixed(0)} minutes
                            </div>

                            <div>
                                🏃 Jogging: {joggingMinutes.toFixed(0)} minutes
                            </div>

                            <div>
                                🏃‍♂️ Running: {runningMinutes.toFixed(0)} minutes
                            </div>
                        </>
                    )}
                </div>

                {/* weight trend */}
                <div style={{ marginTop: "50px", height: "300px" }}>
                    <h3 style={{ marginBottom: "20px" }}>📈 Weight Trend</h3>

                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={weightHistory}>
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="weight"
                                stroke="#22c55e"
                                strokeWidth={3}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <button
                    style={{ ...styles.primaryBtn, marginTop: "30px" }}
                    onClick={() => setView("home")}
                >
                    ← Back
                </button>

            </div>
        </div>
    )
}

function Card({ title, value }) {
    return (
        <div style={cardStyle}>
            <div style={{ opacity: 0.6 }}>{title}</div>
            <div style={{ fontSize: "22px", fontWeight: "600" }}>{value}</div>
        </div>
    )
}

const gridStyle = {
    marginTop: "30px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px"
}

const cardStyle = {
    background: "linear-gradient(135deg, #1e293b, #0f172a)",
    padding: "20px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
}