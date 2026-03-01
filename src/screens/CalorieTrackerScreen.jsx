import { useEffect, useState } from "react"
import { collection, getDocs, addDoc } from "firebase/firestore"
import { db } from "../firebase"
import styles from "../styles"
import Header from "../components/Header"
import useHealthMetrics from "../hooks/useHealthMetrics"

export default function CalorieTrackerScreen({
    user,
    logout,
    setView,
    setActiveChallengeId
}) {

    const today = new Date().toISOString().split("T")[0]

    const { calorieTarget, health } = useHealthMetrics(user)

    const [meals, setMeals] = useState([])
    const [templates, setTemplates] = useState([])

    const [form, setForm] = useState({
        mealType: "breakfast",
        name: "",
        calories: "",
        protein: "",
        carbs: "",
        fat: "",
        fiber: ""
    })

    // -----------------------------
    // LOAD DATA
    // -----------------------------

    useEffect(() => {
        if (!user) return
        loadMeals()
        loadTemplates()
    }, [user])

    const loadMeals = async () => {
        const snapshot = await getDocs(
            collection(db, "users", user.uid, "dailyLogs", today, "meals")
        )

        const data = []
        snapshot.forEach(doc => data.push({ id: doc.id, ...doc.data() }))
        setMeals(data)
    }

    const loadTemplates = async () => {
        const snapshot = await getDocs(
            collection(db, "users", user.uid, "mealTemplates")
        )

        const data = []
        snapshot.forEach(doc => data.push({ id: doc.id, ...doc.data() }))
        setTemplates(data)
    }

    // -----------------------------
    // ADD MEAL
    // -----------------------------

    const addMeal = async () => {

        await addDoc(
            collection(db, "users", user.uid, "dailyLogs", today, "meals"),
            {
                ...form,
                calories: Number(form.calories),
                protein: Number(form.protein),
                carbs: Number(form.carbs),
                fat: Number(form.fat),
                fiber: Number(form.fiber),
                createdAt: new Date()
            }
        )

        setForm({
            mealType: "breakfast",
            name: "",
            calories: "",
            protein: "",
            carbs: "",
            fat: "",
            fiber: ""
        })

        loadMeals()
    }

    // -----------------------------
    // SAVE TEMPLATE
    // -----------------------------

    const saveTemplate = async () => {
        await addDoc(
            collection(db, "users", user.uid, "mealTemplates"),
            {
                ...form,
                calories: Number(form.calories),
                protein: Number(form.protein),
                carbs: Number(form.carbs),
                fat: Number(form.fat),
                fiber: Number(form.fiber)
            }
        )

        loadTemplates()
    }

    // -----------------------------
    // TOTAL CALCULATIONS
    // -----------------------------

    const totalCalories = meals.reduce((sum, m) => sum + (m.calories || 0), 0)
    const totalProtein = meals.reduce((sum, m) => sum + (m.protein || 0), 0)
    const totalCarbs = meals.reduce((sum, m) => sum + (m.carbs || 0), 0)
    const totalFat = meals.reduce((sum, m) => sum + (m.fat || 0), 0)
    const totalFiber = meals.reduce((sum, m) => sum + (m.fiber || 0), 0)

    // Targets
    const proteinTarget = health?.weight || 150
    const fatTarget = Math.round((calorieTarget * 0.25) / 9)
    const carbsTarget = Math.round(
        (calorieTarget - (proteinTarget * 4 + fatTarget * 9)) / 4
    )
    const fiberTarget = health?.gender === "female" ? 25 : 35

    // Percentages
    const percent = calorieTarget
        ? Math.round((totalCalories / calorieTarget) * 100)
        : 0

    const proteinPercent = Math.round((totalProtein / proteinTarget) * 100)
    const carbsPercent = Math.round((totalCarbs / carbsTarget) * 100)
    const fatPercent = Math.round((totalFat / fatTarget) * 100)
    const fiberPercent = Math.round((totalFiber / fiberTarget) * 100)

    if (!health || !calorieTarget) {
        return <div style={{ padding: 30 }}>Loading...</div>
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

                <h1 style={{ marginTop: "20px" }}>
                    Daily Calorie Tracker
                </h1>

                {/* ---------------- DAILY SUMMARY ---------------- */}
                <div style={{ marginTop: "30px", display: "grid", gap: "20px" }}>

                    <MacroCard
                        title="🔥 Calories"
                        value={`${totalCalories} kcal`}
                        target={`${calorieTarget.toFixed(0)} kcal`}
                        percent={percent}
                    />

                    <MacroCard
                        title="🥩 Protein"
                        value={`${totalProtein} g`}
                        target={`${proteinTarget} g`}
                        percent={proteinPercent}
                    />

                    <MacroCard
                        title="🍞 Carbs"
                        value={`${totalCarbs} g`}
                        target={`${carbsTarget} g`}
                        percent={carbsPercent}
                    />

                    <MacroCard
                        title="🥑 Fat"
                        value={`${totalFat} g`}
                        target={`${fatTarget} g`}
                        percent={fatPercent}
                    />

                    <MacroCard
                        title="🌾 Fiber"
                        value={`${totalFiber} g`}
                        target={`${fiberTarget} g`}
                        percent={fiberPercent}
                    />
                </div>

                {/* ---------------- ADD MEAL ---------------- */}
                <div style={{ marginTop: "40px" }}>
                    <h3 style={{ marginBottom: "15px" }}>
                        ➕ Add Meal
                    </h3>

                    <div style={formGrid}>

                        <select
                            value={form.mealType}
                            onChange={e =>
                                setForm({ ...form, mealType: e.target.value })
                            }
                        >
                            <option value="breakfast">Breakfast</option>
                            <option value="lunch">Lunch</option>
                            <option value="dinner">Dinner</option>
                            <option value="snack">Snack</option>
                        </select>

                        <input
                            placeholder="Meal Name"
                            value={form.name}
                            onChange={e =>
                                setForm({ ...form, name: e.target.value })
                            }
                        />

                        <input
                            type="number"
                            placeholder="Calories"
                            value={form.calories}
                            onChange={e =>
                                setForm({ ...form, calories: e.target.value })
                            }
                        />

                        <input
                            type="number"
                            placeholder="Protein (g)"
                            value={form.protein}
                            onChange={e =>
                                setForm({ ...form, protein: e.target.value })
                            }
                        />

                        <input
                            type="number"
                            placeholder="Carbs (g)"
                            value={form.carbs}
                            onChange={e =>
                                setForm({ ...form, carbs: e.target.value })
                            }
                        />

                        <input
                            type="number"
                            placeholder="Fat (g)"
                            value={form.fat}
                            onChange={e =>
                                setForm({ ...form, fat: e.target.value })
                            }
                        />

                        <input
                            type="number"
                            placeholder="Fiber (g)"
                            value={form.fiber}
                            onChange={e =>
                                setForm({ ...form, fiber: e.target.value })
                            }
                        />
                    </div>

                    <div style={{ marginTop: "15px", display: "flex", gap: "12px" }}>
                        <button style={styles.primaryBtn} onClick={addMeal}>
                            Add Meal
                        </button>

                        <button style={secondaryBtn} onClick={saveTemplate}>
                            Save Template
                        </button>
                    </div>
                </div>

                {/* ---------------- TEMPLATES ---------------- */}
                <div style={{ marginTop: "40px" }}>
                    <h3>Templates</h3>
                    {templates.map(t => (
                        <div
                            key={t.id}
                            style={templateStyle}
                            onClick={() => setForm(t)}
                        >
                            {t.name} — {t.calories} kcal
                        </div>
                    ))}
                </div>

                {/* ---------------- MEALS ---------------- */}
                <div style={{ marginTop: "40px" }}>
                    <h3>Today's Meals</h3>
                    {meals.map(m => (
                        <div key={m.id} style={mealStyle}>
                            {m.mealType} — {m.name} — {m.calories} kcal
                        </div>
                    ))}
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

// ---------------- REUSABLE MACRO CARD ----------------

function MacroCard({ title, value, target, percent }) {
    return (
        <div style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>{title}</strong>
                <span>{percent}%</span>
            </div>

            <div style={{ marginTop: "6px", fontSize: "14px", opacity: 0.7 }}>
                {value} / {target}
            </div>

            <div style={progressBar}>
                <div
                    style={{
                        ...progressFill,
                        width: `${Math.min(percent, 100)}%`,
                        background:
                            percent > 110
                                ? "#ef4444"
                                : percent >= 100
                                ? "#22c55e"
                                : "#3b82f6"
                    }}
                />
            </div>
        </div>
    )
}

// ---------------- STYLES ----------------

const formGrid = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px"
}

const secondaryBtn = {
    padding: "10px 16px",
    background: "#1f2937",
    color: "white",
    border: "1px solid #334155",
    borderRadius: "8px",
    cursor: "pointer"
}

const cardStyle = {
    background: "linear-gradient(135deg, #1e293b, #0f172a)",
    padding: "20px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.4)"
}

const progressBar = {
    height: "8px",
    background: "#111827",
    borderRadius: "8px",
    overflow: "hidden",
    marginTop: "8px"
}

const progressFill = {
    height: "100%"
}

const templateStyle = {
    background: "#1f2937",
    padding: "10px",
    marginBottom: "8px",
    borderRadius: "8px",
    cursor: "pointer"
}

const mealStyle = {
    background: "#0f172a",
    padding: "10px",
    marginBottom: "8px",
    borderRadius: "8px"
}