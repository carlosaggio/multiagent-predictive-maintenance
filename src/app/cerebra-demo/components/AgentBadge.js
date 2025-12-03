"use client";

import React from "react";

export default function AgentBadge({ badge, color, size = 32, pulsing = false }) {
  return (
    <div
      className={`agent-badge ${badge.toLowerCase()} ${pulsing ? "pulsing" : ""}`}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        fontSize: size * 0.375,
        animation: pulsing ? "huddlePulse 2s infinite" : "none",
      }}
    >
      {badge}
    </div>
  );
}


