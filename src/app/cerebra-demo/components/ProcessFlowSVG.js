"use client";

import React from "react";

export default function ProcessFlowSVG({ nodes, onNodeClick }) {
  return (
    <svg
      viewBox="0 0 1200 400"
      style={{
        width: "100%",
        height: "400px",
        background: "#f7fafc",
      }}
    >
      {/* Definitions for gradients and effects */}
      <defs>
        <linearGradient id="normalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#e2e8f0", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#cbd5e0", stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="criticalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#fecaca", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#ef4444", stopOpacity: 1 }} />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Connecting Conveyors/Pipes */}
      <line x1="140" y1="200" x2="220" y2="200" stroke="#cbd5e0" strokeWidth="8" />
      <line x1="380" y1="200" x2="460" y2="200" stroke="#cbd5e0" strokeWidth="8" />
      <line x1="620" y1="200" x2="700" y2="200" stroke="#cbd5e0" strokeWidth="8" />
      <line x1="860" y1="200" x2="940" y2="200" stroke="#cbd5e0" strokeWidth="8" />

      {/* Conveyor Arrows */}
      <polygon points="215,195 225,200 215,205" fill="#9ca3af" />
      <polygon points="455,195 465,200 455,205" fill="#9ca3af" />
      <polygon points="695,195 705,200 695,205" fill="#9ca3af" />
      <polygon points="935,195 945,200 935,205" fill="#9ca3af" />

      {/* ROM Bin (Hopper shape) */}
      <g id="rom-bin">
        <path
          d="M 40 140 L 100 140 L 120 180 L 120 240 L 20 240 L 20 180 Z"
          fill="url(#normalGrad)"
          stroke="#718096"
          strokeWidth="2"
        />
        <rect x="30" y="120" width="70" height="20" fill="#cbd5e0" stroke="#718096" strokeWidth="2" />
        <text x="70" y="200" fontSize="14" fontWeight="600" textAnchor="middle" fill="#1a1a1a">
          ROM Bin
        </text>
        <text x="70" y="220" fontSize="12" textAnchor="middle" fill="#4a5568">
          82%
        </text>
      </g>

      {/* Primary Crusher (Critical - with glow) */}
      <g
        id="primary-crusher"
        onClick={() => onNodeClick && onNodeClick(nodes[1])}
        style={{ cursor: "pointer" }}
      >
        {/* Pulsing glow effect */}
        <rect
          x="220" y="160" width="160" height="80"
          fill="rgba(239, 68, 68, 0.1)"
          stroke="#EF4444"
          strokeWidth="4"
          rx="8"
          filter="url(#glow)"
          style={{ animation: "pulseBorder 2s infinite" }}
        />
        
        {/* Main crusher body */}
        <path
          d="M 240 200 L 280 160 L 320 160 L 360 200 L 320 240 L 280 240 Z"
          fill="url(#criticalGrad)"
          stroke="#991b1b"
          strokeWidth="2"
        />
        
        {/* Crushing chamber detail */}
        <circle cx="300" cy="200" r="15" fill="#7f1d1d" />
        
        <text x="300" y="265" fontSize="14" fontWeight="700" textAnchor="middle" fill="#1a1a1a">
          Primary Crusher
        </text>
        <text x="300" y="283" fontSize="18" fontWeight="700" textAnchor="middle" fill="#EF4444">
          82%
        </text>
        <text x="300" y="298" fontSize="11" fontWeight="600" textAnchor="middle" fill="#EF4444">
          CRITICAL
        </text>
      </g>

      {/* Secondary Crusher */}
      <g id="secondary-crusher">
        <path
          d="M 480 180 L 520 160 L 560 160 L 600 180 L 600 220 L 560 240 L 520 240 L 480 220 Z"
          fill="url(#normalGrad)"
          stroke="#718096"
          strokeWidth="2"
        />
        <circle cx="540" cy="200" r="12" fill="#475569" />
        <text x="540" y="265" fontSize="14" fontWeight="600" textAnchor="middle" fill="#1a1a1a">
          Secondary
        </text>
        <text x="540" y="283" fontSize="16" fontWeight="600" textAnchor="middle" fill="#10B981">
          88%
        </text>
      </g>

      {/* Tertiary Crusher */}
      <g id="tertiary-crusher">
        <path
          d="M 720 185 L 755 165 L 785 165 L 820 185 L 820 215 L 785 235 L 755 235 L 720 215 Z"
          fill="url(#normalGrad)"
          stroke="#718096"
          strokeWidth="2"
        />
        <circle cx="770" cy="200" r="10" fill="#475569" />
        <text x="770" y="265" fontSize="14" fontWeight="600" textAnchor="middle" fill="#1a1a1a">
          Tertiary
        </text>
        <text x="770" y="283" fontSize="16" fontWeight="600" textAnchor="middle" fill="#10B981">
          90%
        </text>
      </g>

      {/* Final Product (Storage bin) */}
      <g id="final-product">
        <rect x="960" y="160" width="100" height="80" rx="8" fill="url(#normalGrad)" stroke="#718096" strokeWidth="2" />
        <path d="M 970 160 Q 1010 140 1050 160" fill="none" stroke="#718096" strokeWidth="2" />
        <text x="1010" y="195" fontSize="12" fontWeight="600" textAnchor="middle" fill="#1a1a1a">
          Final
        </text>
        <text x="1010" y="210" fontSize="12" fontWeight="600" textAnchor="middle" fill="#1a1a1a">
          Product
        </text>
        <text x="1010" y="230" fontSize="16" fontWeight="700" textAnchor="middle" fill="#10B981">
          510 t/hr
        </text>
      </g>

      {/* Alert Badge on Primary Crusher */}
      <g>
        <circle cx="360" cy="175" r="14" fill="#EF4444" />
        <text x="360" y="180" fontSize="16" fontWeight="700" textAnchor="middle" fill="white">
          !
        </text>
      </g>

      {/* Labels at bottom */}
      <text x="70" y="330" fontSize="11" textAnchor="middle" fill="#718096">
        Target: 85%
      </text>
      <text x="300" y="330" fontSize="11" textAnchor="middle" fill="#EF4444">
        Target: 89% (GAP: -7%)
      </text>
      <text x="540" y="330" fontSize="11" textAnchor="middle" fill="#718096">
        Target: 90%
      </text>
      <text x="770" y="330" fontSize="11" textAnchor="middle" fill="#718096">
        Target: 92%
      </text>
      <text x="1010" y="330" fontSize="11" textAnchor="middle" fill="#718096">
        Target: 550 t/hr
      </text>

      {/* Legend */}
      <g transform="translate(20, 360)">
        <circle cx="8" cy="8" r="6" fill="#10B981" />
        <text x="20" y="12" fontSize="11" fill="#4a5568">
          Normal Operation
        </text>
        
        <circle cx="140" cy="8" r="6" fill="#EF4444" />
        <text x="152" y="12" fontSize="11" fill="#4a5568">
          Critical Alert
        </text>
      </g>
    </svg>
  );
}

