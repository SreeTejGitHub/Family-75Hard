const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "black",
    color: "white",
    padding: "20px"
  },
  card: { width: "100%", maxWidth: "420px" },
  title: { fontSize: "28px", textAlign: "center", marginBottom: "10px" },
  subtitle: { textAlign: "center", marginBottom: "15px", color: "#9ca3af" },
  headerRow: { display: "flex", justifyContent: "space-between", marginBottom: "10px" },
  userLabel: { fontSize: "13px", color: "#9ca3af" },
  logoutBtn: {
    background: "none",
    border: "none",
    color: "#f87171",
    marginLeft: "10px",
    cursor: "pointer"
  },
  progressBar: {
    height: "8px",
    background: "#1f2937",
    borderRadius: "5px",
    marginBottom: "15px"
  },
  progressFill: {
    height: "100%",
    background: "#22c55e",
    borderRadius: "5px"
  },
  streakBox: { textAlign: "center", marginBottom: "15px" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(15, 1fr)",
    gap: "4px",
    marginBottom: "20px"
  },
  gridItem: { paddingTop: "100%", borderRadius: "3px" },
  task: {
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "10px",
    cursor: "pointer"
  },
  primaryBtn: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    background: "white",
    color: "black",
    borderRadius: "6px",
    border: "none",
    fontWeight: "bold"
  },
  resetBtn: {
    width: "100%",
    marginTop: "10px",
    background: "none",
    border: "none",
    color: "#f87171"
  },
  photoLabel: {
    display: "block",
    padding: "10px",
    background: "#1f2937",
    borderRadius: "8px",
    textAlign: "center",
    cursor: "pointer",
    marginTop: "10px"
  },
  previewImage: {
    width: "100%",
    borderRadius: "8px",
    marginTop: "10px"
  }
}

const styleSheet = document.styleSheets[0]

styleSheet.insertRule(`
@keyframes fadeSlide {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`, styleSheet.cssRules.length)
export default styles