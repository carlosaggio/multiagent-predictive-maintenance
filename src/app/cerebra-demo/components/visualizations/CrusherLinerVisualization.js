"use client";

import React from 'react';

export default function CrusherLinerVisualization() {
  return (
    <div style={{ 
      background: 'white', 
      borderRadius: '8px', 
      padding: '20px',
      border: '1px solid #e2e8f0'
    }}>
      <div style={{ 
        fontSize: '13px', 
        fontWeight: '600', 
        color: '#1a1a2e',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A100FF" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <path d="M3 9h18"/>
          <path d="M9 21V9"/>
        </svg>
        Crusher Liner Wear Analysis - Cross Section View
      </div>

      <svg viewBox="0 0 600 320" style={{ width: '100%', maxHeight: '300px' }}>
        <defs>
          {/* Gradients for 3D effect */}
          <linearGradient id="linerGradientTop" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#9ca3af" />
            <stop offset="100%" stopColor="#6b7280" />
          </linearGradient>
          
          <linearGradient id="linerGradientFront" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FCA5A5" />
            <stop offset="25%" stopColor="#FBBF24" />
            <stop offset="60%" stopColor="#6EE7B7" />
            <stop offset="100%" stopColor="#6EE7B7" />
          </linearGradient>
          
          <linearGradient id="linerGradientSide" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4b5563" />
            <stop offset="100%" stopColor="#374151" />
          </linearGradient>

          {/* Pattern for steel texture */}
          <pattern id="steelPattern" width="4" height="4" patternUnits="userSpaceOnUse">
            <rect width="4" height="4" fill="#9ca3af"/>
            <circle cx="2" cy="2" r="0.5" fill="#6b7280"/>
          </pattern>
        </defs>

        {/* Title label */}
        <text x="300" y="20" textAnchor="middle" fontSize="12" fontWeight="600" fill="#1a1a2e">
          Isometric Cross-Section: Primary Crusher Jaw Liner
        </text>

        {/* Main liner body - isometric 3D view */}
        {/* Back face (top surface) */}
        <path
          d="M 80,80 L 160,50 L 520,50 L 440,80 Z"
          fill="url(#linerGradientTop)"
          stroke="#4b5563"
          strokeWidth="1"
        />
        
        {/* Right side face */}
        <path
          d="M 440,80 L 520,50 L 520,200 L 440,230 Z"
          fill="url(#linerGradientSide)"
          stroke="#4b5563"
          strokeWidth="1"
        />
        
        {/* Front face with wear gradient */}
        <path
          d="M 80,80 L 440,80 L 440,230 L 80,230 Z"
          fill="url(#linerGradientFront)"
          stroke="#4b5563"
          strokeWidth="2"
        />

        {/* Wear zone markers on front face */}
        {/* Critical zone */}
        <rect x="80" y="80" width="90" height="150" fill="rgba(239,68,68,0.3)" stroke="none" />
        <line x1="170" y1="80" x2="170" y2="230" stroke="#EF4444" strokeWidth="2" strokeDasharray="4 2" />
        
        {/* Moderate zone */}
        <rect x="170" y="80" width="90" height="150" fill="rgba(251,191,36,0.2)" stroke="none" />
        <line x1="260" y1="80" x2="260" y2="230" stroke="#FBBF24" strokeWidth="2" strokeDasharray="4 2" />

        {/* Thickness measurement lines */}
        {/* Feed side (critical) */}
        <line x1="60" y1="100" x2="60" y2="210" stroke="#4b5563" strokeWidth="1" />
        <line x1="55" y1="100" x2="65" y2="100" stroke="#4b5563" strokeWidth="1" />
        <line x1="55" y1="210" x2="65" y2="210" stroke="#4b5563" strokeWidth="1" />
        <text x="50" y="160" textAnchor="end" fontSize="10" fill="#EF4444" fontWeight="600">
          65mm
        </text>
        <text x="50" y="172" textAnchor="end" fontSize="9" fill="#718096">
          (65%)
        </text>

        {/* Middle section */}
        <line x1="215" y1="240" x2="215" y2="260" stroke="#4b5563" strokeWidth="1" />
        <text x="215" y="275" textAnchor="middle" fontSize="10" fill="#FBBF24" fontWeight="600">
          78mm (78%)
        </text>

        {/* Discharge side (good) */}
        <line x1="460" y1="100" x2="460" y2="210" stroke="#4b5563" strokeWidth="1" />
        <line x1="455" y1="100" x2="465" y2="100" stroke="#4b5563" strokeWidth="1" />
        <line x1="455" y1="210" x2="465" y2="210" stroke="#4b5563" strokeWidth="1" />
        <text x="475" y="160" fontSize="10" fill="#10B981" fontWeight="600">
          95mm
        </text>
        <text x="475" y="172" fontSize="9" fill="#718096">
          (95%)
        </text>

        {/* Zone labels */}
        <text x="125" y="270" textAnchor="middle" fontSize="10" fill="#EF4444" fontWeight="600">
          FEED SIDE
        </text>
        <text x="125" y="282" textAnchor="middle" fontSize="9" fill="#718096">
          Critical Wear
        </text>

        <text x="350" y="270" textAnchor="middle" fontSize="10" fill="#10B981" fontWeight="600">
          DISCHARGE SIDE
        </text>
        <text x="350" y="282" textAnchor="middle" fontSize="9" fill="#718096">
          Normal Condition
        </text>

        {/* Direction arrow */}
        <g transform="translate(260, 295)">
          <path d="M 0,0 L 60,0" stroke="#1a1a2e" strokeWidth="1.5" markerEnd="url(#arrow)" />
          <text x="30" y="15" textAnchor="middle" fontSize="9" fill="#718096">Material Flow</text>
          <polygon points="60,0 52,-4 52,4" fill="#1a1a2e" />
        </g>

        {/* New liner reference line */}
        <line x1="80" y1="75" x2="440" y2="75" stroke="#A100FF" strokeWidth="1" strokeDasharray="8 4" />
        <text x="445" y="78" fontSize="9" fill="#A100FF">New liner profile (100mm)</text>
      </svg>

      {/* Legend */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '24px', 
        marginTop: '12px',
        paddingTop: '12px',
        borderTop: '1px solid #e2e8f0',
        fontSize: '10px'
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '16px', height: '10px', background: '#FCA5A5', borderRadius: '2px' }} />
          <span style={{ color: '#EF4444' }}>Critical (&lt;70%)</span>
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '16px', height: '10px', background: '#FBBF24', borderRadius: '2px' }} />
          <span style={{ color: '#B45309' }}>Moderate (70-85%)</span>
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '16px', height: '10px', background: '#6EE7B7', borderRadius: '2px' }} />
          <span style={{ color: '#059669' }}>Good (&gt;85%)</span>
        </span>
      </div>

      {/* Analysis finding */}
      <div style={{ 
        marginTop: '16px', 
        padding: '12px', 
        background: '#FEF2F2',
        borderLeft: '3px solid #EF4444',
        borderRadius: '0 4px 4px 0',
        fontSize: '12px',
        color: '#991B1B'
      }}>
        <strong>Diagnostic Finding:</strong> Severe asymmetric wear detected. Feed side (Zone B) at 65% remaining - below critical 70% threshold. 
        Wear pattern indicates jaw misalignment. Last replacement: May 2024 (8 months, exceeds 6-month design life).
        <span style={{ color: '#1a1a2e', fontWeight: '600' }}> RUL: 5-7 days</span> at current wear rate of 8.75%/month.
      </div>
    </div>
  );
}

