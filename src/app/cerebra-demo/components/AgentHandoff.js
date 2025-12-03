"use client";

import React from "react";

export default function AgentHandoff({ message }) {
  return (
    <div
      className="agent-handoff fade-in"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        padding: "16px",
        margin: "16px 0",
        background: "linear-gradient(90deg, rgba(139, 92, 246, 0.1), rgba(230, 126, 34, 0.1))",
        borderRadius: "8px",
        borderLeft: "3px solid #8B5CF6",
        borderRight: "3px solid #E67E22",
      }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#8B5CF6"
        strokeWidth="2"
        style={{ animation: "pulse 1s infinite" }}
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
      <span
        style={{
          fontSize: "13px",
          fontWeight: "600",
          color: "#8B5CF6",
          letterSpacing: "0.3px",
        }}
      >
        {message}
      </span>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#E67E22"
        strokeWidth="2"
        style={{ animation: "pulse 1s infinite", animationDelay: "0.5s" }}
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </div>
  );
}

