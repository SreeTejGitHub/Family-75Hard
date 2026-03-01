import { useState, useRef, useEffect } from "react"
import styles from "../styles"
import logo from "../assets/logo.png"

export default function Header({
    user,
    logout,
    setView,
    setActiveChallengeId
}) {
    const [menuOpen, setMenuOpen] = useState(false)
    const menuRef = useRef(null)

    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false)
            }
        }

        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [])

    return (
        <div style={styles.headerRow}>
            <img
                src={logo}
                alt="logo"
                style={{
                    width: "100px",
                    height: "50px",
                    borderRadius: "6px"
                }}
            />

            <span>{user?.displayName}</span>

            <div ref={menuRef} style={{ position: "relative" }}>
                <button onClick={() => setMenuOpen(!menuOpen)}>☰</button>

                {menuOpen && (
                    <div
                        style={{
                            position: "absolute",
                            top: "45px",
                            right: "0",
                            background: "#1f2937",
                            borderRadius: "14px",
                            padding: "12px",
                            width: "200px",
                            boxShadow: "0 15px 40px rgba(0,0,0,0.6)",
                            zIndex: 1000,
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px"
                        }}
                    >
                        {/* Profile */}
                        <div
                            onClick={() => {
                                setView("profile")
                                setMenuOpen(false)
                            }}
                            style={menuItemStyle}
                        >
                            <span>👤</span>
                            <span>Profile</span>
                        </div>

                        {/* Challenges */}
                        <div
                            onClick={() => {
                                setActiveChallengeId(null)
                                setView("home")
                                setMenuOpen(false)
                            }}
                            style={menuItemStyle}
                        >
                            <span>📋</span>
                            <span>Challenges</span>
                        </div>

                        {/* week Stats */}
                        <div
                            onClick={() => {
                                setView("weekly")
                                setMenuOpen(false)
                            }}
                            style={menuItemStyle}
                        >
                            <span>📊</span>
                            <span>Weekly Tracker</span>
                        </div>

                        <div
                            onClick={() => {
                                setView("health")
                                setMenuOpen(false)
                            }}
                            style={menuItemStyle}
                        >
                            <span>🩺</span>
                            <span>Health Dashboard</span>
                        </div>

                        {/* Logout */}
                        <div
                            onClick={() => {
                                logout()
                                setMenuOpen(false)
                            }}
                            style={{
                                ...menuItemStyle,
                                color: "#ef4444"
                            }}
                        >
                            <span>🚪</span>
                            <span>Logout</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

const menuItemStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "16px"
}