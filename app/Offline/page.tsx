"use client";

import React from "react";

const OfflinePage = () => {
    return (
        <div style={{
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            textAlign: "center",
            padding: "20px",
            backgroundColor: "#ffffff",
            color: "#000000",
            fontFamily: "Inter, system-ui, sans-serif"
        }}>
            <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>⚠️ You are offline</h1>
            <p style={{ fontSize: "1.2rem", color: "#666", marginBottom: "2rem" }}>
                Please check your internet connection to continue browsing Mern Kart.
            </p>
            <button
                onClick={() => window.location.reload()}
                style={{
                    padding: "12px 24px",
                    fontSize: "1rem",
                    fontWeight: "600",
                    backgroundColor: "#000000",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "opacity 0.2s"
                }}
            >
                Try Again
            </button>
        </div>
    );
}

export default OfflinePage;