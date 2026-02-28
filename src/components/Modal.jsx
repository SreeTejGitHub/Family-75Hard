import React from "react"

export default function Modal({ isOpen, onClose, children }) {

    if (!isOpen) return null

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                {children}
            </div>
        </div>
    )
}

const overlayStyle = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000
}

const modalStyle = {
    background: "#111827",
    padding: "30px",
    borderRadius: "18px",
    width: "100%",
    maxWidth: "450px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.8)"
}