import { useEffect, useState } from "react"
import { doc, getDoc, collection, query, orderBy, getDocs } from "firebase/firestore"
import { db } from "../firebase"

export default function useHealthMetrics(user) {

    const [health, setHealth] = useState(null)
    const [weight, setWeight] = useState(null)
    const [weightHistory, setWeightHistory] = useState([])

    useEffect(() => {
        if (!user) return

        const fetchData = async () => {

            // Get health profile
            const profileSnap = await getDoc(doc(db, "users", user.uid))
            if (profileSnap.exists()) {
                setHealth(profileSnap.data())
            }

            // Get weight history
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

    if (!health || !weight) return {}

    // -----------------------------
    // UNIT CONVERSION
    // -----------------------------

    const heightInches = Number(health.height)
    const age = Number(health.age)

    const weightKg = weight * 0.453592
    const heightCm = heightInches * 2.54

    // -----------------------------
    // BMI
    // -----------------------------

    const bmi = ((weight / (heightInches * heightInches)) * 703)

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
    // BMR
    // -----------------------------

    let bmr = 0

    if (health.gender === "male") {
        bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5
    } else {
        bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161
    }

    // -----------------------------
    // TDEE
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
    // SMART DEFICIT SPLIT
    // -----------------------------

    let dietDeficit = 0
    let exerciseDeficit = 0

    if (health.goal === "fat_loss") {
        dietDeficit = 300
        exerciseDeficit = 200
    }

    const calorieTarget = tdee - dietDeficit

    // -----------------------------
    // MACROS
    // -----------------------------

    const protein = weight
    const fat = (calorieTarget * 0.25) / 9
    const carbs = (calorieTarget - (protein * 4 + fat * 9)) / 4

    // -----------------------------
    // PROJECTIONS
    // -----------------------------

    const weeklyChange =
        health.goal === "fat_loss" ? -1 :
        health.goal === "muscle_gain" ? 0.6 : 0

    const projectedWeight = weight + (weeklyChange * 12)

    return {
        health,
        weight,
        weightHistory,
        bmi: bmi.toFixed(1),
        bmiCategory,
        bmiColor,
        bmr,
        tdee,
        calorieTarget,
        exerciseDeficit,
        protein,
        fat,
        carbs,
        projectedWeight
    }
}