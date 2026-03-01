import styles from "../styles"
import logo from "../assets/logo.png"

export default function LoginScreen({ loginWithGoogle }) {
    return (
        <div style={styles.container}>
            <div
                style={{
                    ...styles.card,
                    textAlign: "center",
                    padding: "60px 40px"
                }}
            >
                <img
                    src={logo}
                    alt="My Challenge Tracker"
                    style={{
                        width: "300px",
                        marginBottom: "0px"
                    }}
                />

                <p
                    style={{
                        opacity: 0.6,
                        marginBottom: "40px",
                        fontSize: "16px"
                    }}
                >
                    Track your habits. Build discipline. Stay consistent.
                </p>

                <button
                    onClick={loginWithGoogle}
                    style={{
                        background: "#2563eb",
                        color: "white",
                        padding: "14px 22px",
                        borderRadius: "12px",
                        fontSize: "16px",
                        fontWeight: "600",
                        cursor: "pointer",
                        border: "none",
                        boxShadow: "0 8px 20px rgba(37,99,235,0.5)"
                    }}
                >
                    🔐 Sign in using Google
                </button>
            </div>
        </div>
    )
}