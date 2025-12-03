"use client";

import React from "react";

export default function WearPatternDiagram() {
  return (
    <div
      style={{
        background: "white",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        padding: "16px",
        marginTop: "12px",
      }}
    >
      <div style={{ fontSize: "13px", fontWeight: "600", color: "#3B82F6", marginBottom: "12px" }}>
        Liner Wear Pattern Analysis
      </div>

      <svg viewBox="0 0 400 250" style={{ width: "100%", height: "auto" }}>
        {/* Cross-section view of crusher liner */}
        
        {/* Liner outline */}
        <path
          d="M 50,50 L 350,50 L 350,200 L 50,200 Z"
          fill="none"
          stroke="#1a1a1a"
          strokeWidth="2"
        />

        {/* Wear zones - color coded */}
        
        {/* Critical wear zone (RED) - Feed side */}
        <rect x="50" y="50" width="100" height="150" fill="#FEE2E2" stroke="#EF4444" strokeWidth="2" />
        <text x="100" y="130" fontSize="12" textAnchor="middle" fontWeight="600" fill="#991b1b">
          CRITICAL
        </text>
        <text x="100" y="145" fontSize="10" textAnchor="middle" fill="#991b1b">
          40-65%
        </text>

        {/* Moderate wear zone (YELLOW) */}
        <rect x="150" y="50" width="100" height="150" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" />
        <text x="200" y="130" fontSize="12" textAnchor="middle" fontWeight="600" fill="#92400E">
          MODERATE
        </text>
        <text x="200" y="145" fontSize="10" textAnchor="middle" fill="#92400E">
          66-80%
        </text>

        {/* Good condition zone (GREEN) */}
        <rect x="250" y="50" width="100" height="150" fill="#D1FAE5" stroke="#10B981" strokeWidth="2" />
        <text x="300" y="130" fontSize="12" textAnchor="middle" fontWeight="600" fill="#065F46">
          GOOD
        </text>
        <text x="300" y="145" fontSize="10" textAnchor="middle" fill="#065F46">
          81-100%
        </text>

        {/* Thickness measurements */}
        <text x="100" y="225" fontSize="10" textAnchor="middle" fill="#4a5568">
          Current: 65mm
        </text>
        <text x="200" y="225" fontSize="10" textAnchor="middle" fill="#4a5568">
          Current: 75mm
        </text>
        <text x="300" y="225" fontSize="10" textAnchor="middle" fill="#4a5568">
          Current: 95mm
        </text>

        {/* Labels */}
        <text x="50" y="35" fontSize="11" fontWeight="600" fill="#1a1a1a">
          FEED SIDE
        </text>
        <text x="300" y="35" fontSize="11" fontWeight="600" fill="#1a1a1a" textAnchor="end">
          DISCHARGE SIDE
        </text>

        {/* Scale indicator */}
        <text x="370" y="125" fontSize="9" fill="#718096">
          100mm
        </text>
        <line x1="365" y1="50" x2="365" y2="200" stroke="#718096" strokeWidth="1" />
        <line x1="362" y1="50" x2="368" y2="50" stroke="#718096" strokeWidth="1" />
        <line x1="362" y1="200" x2="368" y2="200" stroke="#718096" strokeWidth="1" />
      </svg>

      <div style={{ fontSize: "11px", color: "#718096", marginTop: "12px" }}>
        <strong>Finding:</strong> Uneven wear pattern detected. Feed side at 65% thickness (CRITICAL).
        Recommended action: IMMEDIATE REPLACEMENT
      </div>
    </div>
  );
}

