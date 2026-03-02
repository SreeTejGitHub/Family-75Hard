import styles from "../styles"
import Header from "../components/Header"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import useHealthMetrics from "../hooks/useHealthMetrics"

export default function HealthDashboardScreen({
    user,
    logout,
    setView,
    setActiveChallengeId
}) {

    const {
        health,
        weight,
        bmi,
        bmiCategory,
        bmiColor,
        bmr,
        tdee,
        calorieTarget,
        protein,
        fat,
        carbs,
        bodyFat,
        weightHistory,
        projectedWeight,
        exerciseDeficit
    } = useHealthMetrics(user)

    if (!health || !weight) {
        return <div style={{ padding: 30 }}>Loading Health Data...</div>
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

                <h1 style={{ marginTop: "20px" }}>Health Dashboard</h1>

                {/* -----------------------------
                   MAIN METRICS GRID
                ------------------------------ */}
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
                    <Card
                        title="🧬 Body Fat %"
                        value={
                            bodyFat
                                ? `${bodyFat}%`
                                : "Add neck & waist measurements"
                        }
                    />
                </div>

                {/* -----------------------------
                   MACROS & PROJECTION
                ------------------------------ */}
                <div style={{ marginTop: "40px", display: "grid", gap: "20px" }}>

                    <div style={cardStyle}>
                        <h3 style={{ marginBottom: "15px" }}>🍽 Target Macro Breakdown</h3>
                        <div>Protein: {protein.toFixed(0)}g</div>
                        <div>Fat: {fat.toFixed(0)}g</div>
                        <div>Carbs: {carbs.toFixed(0)}g</div>
                    </div>

                    <div style={cardStyle}>
                        <h3 style={{ marginBottom: "15px" }}>📆 12-Week Projection</h3>
                        Projected Weight: {projectedWeight ? projectedWeight.toFixed(1) : "--"} lbs
                    </div>
                </div>

                {/* -----------------------------
                   ACTIVITY GUIDANCE
                ------------------------------ */}
                {health.goal === "fat_loss" && (
                    <div style={{ ...cardStyle, marginTop: "30px" }}>
                        <h3 style={{ marginBottom: "15px" }}>🏃 Smart Deficit Split</h3>

                        <div>Diet Deficit: 300 kcal</div>
                        <div>Exercise Burn Target: {exerciseDeficit} kcal</div>

                        <div style={{ marginTop: "15px", opacity: 0.7 }}>
                            Example Activity Needed:
                        </div>

                        <div>🚶 Walking: {(exerciseDeficit / 5).toFixed(0)} min</div>
                        <div>🏃 Jogging: {(exerciseDeficit / 10).toFixed(0)} min</div>
                        <div>🏃‍♂️ Running: {(exerciseDeficit / 13).toFixed(0)} min</div>
                    </div>
                )}

                {/* -----------------------------
                   WEIGHT TREND CHART
                ------------------------------ */}
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

// -----------------------------
// Reusable Card Component
// -----------------------------

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