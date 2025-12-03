"use client";

import React, { useState } from "react";
import { kpiData } from "../data/miningData";

export default function CopperMineProcessFlow({ onNodeClick }) {
  const [activeTab, setActiveTab] = useState("performance");

  return (
    <div style={{ background: "white", borderRadius: "12px", padding: "24px" }}>
      {/* Tabs */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "20px", borderBottom: "2px solid #e2e8f0" }}>
        <button
          onClick={() => setActiveTab("performance")}
          style={{
            padding: "10px 20px",
            background: activeTab === "performance" ? "#8B5CF6" : "transparent",
            color: activeTab === "performance" ? "white" : "#4a5568",
            border: "none",
            borderBottom: activeTab === "performance" ? "3px solid #8B5CF6" : "none",
            fontWeight: "600",
            fontSize: "13px",
            cursor: "pointer",
            borderRadius: "4px 4px 0 0",
          }}
        >
          Shift Performance
        </button>
        <button
          onClick={() => setActiveTab("lpo")}
          style={{
            padding: "10px 20px",
            background: activeTab === "lpo" ? "#8B5CF6" : "transparent",
            color: activeTab === "lpo" ? "white" : "#4a5568",
            border: "none",
            borderBottom: activeTab === "lpo" ? "3px solid #8B5CF6" : "none",
            fontWeight: "600",
            fontSize: "13px",
            cursor: "pointer",
            borderRadius: "4px 4px 0 0",
          }}
        >
          LPO Hotspots
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
        <KPICard icon="⛏" title="Run of Mine (ROM)" value="124,500" unit="tonnes" change="-7.62%" />
        <KPICard icon="⚙" title="Ore Processed" value="107,700" unit="tonnes" change="-7.68%" />
        <KPICard icon="🔶" title="Copper Produced" value="510" unit="tonnes" change="-7.68%" />
        <KPICard icon="📉" title="Estimated Production Loss" value="150" unit="tonnes/day" change="+1.34%" />
      </div>

      {/* Process Flow Diagram */}
      <div style={{ background: "#f7fafc", borderRadius: "8px", padding: "32px", position: "relative", minHeight: "500px" }}>
        <svg viewBox="0 0 1400 550" style={{ width: "100%", height: "auto" }}>
          {/* Section Labels */}
          <text x="100" y="30" fontSize="11" fontWeight="600" fill="#718096">1 MINING</text>
          <text x="400" y="30" fontSize="11" fontWeight="600" fill="#718096">2 CONCENTRATING</text>
          <text x="600" y="280" fontSize="11" fontWeight="600" fill="#718096">3 ORE BENEFICIATION</text>
          <text x="1050" y="280" fontSize="11" fontWeight="600" fill="#718096">4 ORE CONCENTRATE</text>
          <text x="1050" y="30" fontSize="11" fontWeight="600" fill="#718096">5 TAILINGS</text>
          <text x="1250" y="30" fontSize="11" fontWeight="600" fill="#718096">6 PRODUCTS</text>

          {/* Connecting Lines (Conveyors/Pipes) */}
          <path d="M 150,120 L 210,120" stroke="#a8c5da" strokeWidth="4" fill="none" />
          <path d="M 290,120 L 350,120" stroke="#a8c5da" strokeWidth="4" fill="none" />
          <path d="M 430,140 L 430,200" stroke="#a8c5da" strokeWidth="4" fill="none" />
          <path d="M 150,240 L 400,240" stroke="#a8c5da" strokeWidth="4" fill="none" />
          <path d="M 480,240 L 540,300" stroke="#a8c5da" strokeWidth="4" fill="none" />
          <path d="M 700,320 L 760,320" stroke="#a8c5da" strokeWidth="4" fill="none" />
          <path d="M 840,340 L 900,380" stroke="#a8c5da" strokeWidth="4" fill="none" />
          <path d="M 980,400 L 1040,400" stroke="#a8c5da" strokeWidth="4" fill="none" />

          {/* MINING SECTION */}
          
          {/* Loading & Hauling */}
          <EquipmentBox x="40" y="80" label="LOADING &\nHAULING" color="#7BA5B8" />
          
          {/* ROM BIN */}
          <g>
            <path d="M 180,80 L 220,80 L 240,100 L 240,140 L 160,140 L 160,100 Z" fill="#7BA5B8" stroke="#5B8FA3" strokeWidth="2" />
            <text x="200" y="165" fontSize="9" textAnchor="middle" fill="#1a1a1a" fontWeight="600">ROM BIN &</text>
            <text x="200" y="177" fontSize="9" textAnchor="middle" fill="#1a1a1a" fontWeight="600">PRIMARY CRUSHER</text>
          </g>

          {/* PRIMARY CRUSHER - ALERT STATE */}
          <g onClick={() => onNodeClick && onNodeClick()} style={{ cursor: "pointer" }}>
            {/* Red Alert Box */}
            <rect
              x="240" y="70" width="90" height="90"
              fill="rgba(239, 68, 68, 0.1)"
              stroke="#EF4444"
              strokeWidth="3"
              rx="4"
              style={{ animation: "pulseBorder 2s infinite" }}
            />
            
            {/* Crusher Equipment */}
            <path
              d="M 260,100 L 285,80 L 305,80 L 310,100 L 305,120 L 285,120 Z"
              fill="#EF4444"
              stroke="#991b1b"
              strokeWidth="2"
            />
            <circle cx="285" cy="100" r="8" fill="#7f1d1d" />
            
            {/* Alert Badge */}
            <circle cx="315" cy="80" r="10" fill="#EF4444" />
            <text x="315" y="84" fontSize="12" fontWeight="bold" textAnchor="middle" fill="white">!</text>
          </g>

          {/* SECONDARY CRUSHER */}
          <EquipmentBox x="350" y="100" label="SECONDARY\nCRUSHER" color="#7BA5B8" />

          {/* VIBRATING SCREEN */}
          <g>
            <rect x="240" y="190" width="80" height="40" rx="4" fill="#7BA5B8" stroke="#5B8FA3" strokeWidth="2" />
            <line x1="250" y1="200" x2="310" y2="220" stroke="#5B8FA3" strokeWidth="1" />
            <line x1="250" y1="210" x2="310" y2="230" stroke="#5B8FA3" strokeWidth="1" />
            <text x="280" y="255" fontSize="9" textAnchor="middle" fill="#1a1a1a" fontWeight="600">VIBRATING SCREEN</text>
          </g>

          {/* CONCENTRATING SECTION */}
          
          {/* Stockpile Conveyor */}
          <g>
            <rect x="360" y="220" width="100" height="30" rx="4" fill="#7BA5B8" stroke="#5B8FA3" strokeWidth="2" />
            <text x="410" y="270" fontSize="9" textAnchor="middle" fill="#1a1a1a" fontWeight="600">STOCKPILE</text>
            <text x="410" y="282" fontSize="9" textAnchor="middle" fill="#1a1a1a" fontWeight="600">CONVEYOR</text>
          </g>

          {/* Stockpile */}
          <g>
            <path d="M 460,300 L 490,280 L 520,280 L 550,300 L 550,340 L 460,340 Z" fill="#9CB8C8" stroke="#5B8FA3" strokeWidth="2" />
            <text x="505" y="365" fontSize="9" textAnchor="middle" fill="#1a1a1a" fontWeight="600">STOCKPILE</text>
          </g>

          {/* Stacker */}
          <EquipmentBox x="530" y="400" label="STACKER" color="#7BA5B8" size="small" />

          {/* ORE BENEFICIATION SECTION */}
          
          {/* SAG Mill */}
          <g>
            <circle cx="620" cy="340" r="35" fill="#7BA5B8" stroke="#5B8FA3" strokeWidth="2" />
            <circle cx="620" cy="340" r="25" fill="none" stroke="#5B8FA3" strokeWidth="1" />
            <text x="620" y="390" fontSize="9" textAnchor="middle" fill="#1a1a1a" fontWeight="600">SAG MILL</text>
          </g>

          {/* Feed Conveyor for Flotation Cell */}
          <EquipmentBox x="680" y="300" label="FEED CONVEYOR FOR\nFLOTATION CELL" color="#7BA5B8" size="medium" />

          {/* Flotation Cell */}
          <g>
            <rect x="780" y="310" width="60" height="50" rx="4" fill="#7BA5B8" stroke="#5B8FA3" strokeWidth="2" />
            <ellipse cx="810" cy="315" rx="25" ry="5" fill="#9CB8C8" />
            <line x1="790" y1="330" x2="830" y2="330" stroke="#5B8FA3" strokeWidth="1" />
            <line x1="790" y1="345" x2="830" y2="345" stroke="#5B8FA3" strokeWidth="1" />
            <text x="810" y="380" fontSize="9" textAnchor="middle" fill="#1a1a1a" fontWeight="600">FLOTATION CELL</text>
          </g>

          {/* Concentrated Ore Conveyor */}
          <EquipmentBox x="860" y="360" label="CONCENTRATED ORE\nCONVEYOR" color="#7BA5B8" size="medium" />

          {/* Concentrated Ore Stockpile */}
          <g>
            <path d="M 960,390 L 990,370 L 1020,370 L 1050,390 L 1050,430 L 960,430 Z" fill="#9CB8C8" stroke="#5B8FA3" strokeWidth="2" />
            <text x="1005" y="455" fontSize="9" textAnchor="middle" fill="#1a1a1a" fontWeight="600">CONCENTRATED ORE</text>
            <text x="1005" y="467" fontSize="9" textAnchor="middle" fill="#1a1a1a" fontWeight="600">STOCKPILE</text>
          </g>

          {/* Stacker */}
          <EquipmentBox x="1030" y="480" label="STACKER" color="#7BA5B8" size="small" />

          {/* ORE CONCENTRATE SECTION */}
          
          {/* Thickener */}
          <g>
            <circle cx="1110" cy="380" r="30" fill="#7BA5B8" stroke="#5B8FA3" strokeWidth="2" />
            <line x1="1090" y1="380" x2="1130" y2="380" stroke="#5B8FA3" strokeWidth="1" />
            <text x="1110" y="425" fontSize="9" textAnchor="middle" fill="#1a1a1a" fontWeight="600">THICKENER</text>
          </g>

          {/* TAILINGS SECTION */}
          
          {/* Thickener */}
          <g>
            <circle cx="1110" cy="100" r="30" fill="#7BA5B8" stroke="#5B8FA3" strokeWidth="2" />
            <text x="1110" y="145" fontSize="9" textAnchor="middle" fill="#1a1a1a" fontWeight="600">THICKENER</text>
          </g>

          {/* Tailings Dam */}
          <g>
            <path d="M 1180,90 L 1180,140 L 1260,140 L 1260,110 Z" fill="#9CB8C8" stroke="#5B8FA3" strokeWidth="2" />
            <text x="1220" y="165" fontSize="9" textAnchor="middle" fill="#1a1a1a" fontWeight="600">TAILINGS DAM</text>
          </g>

          {/* Tailings Fluid Transport */}
          <EquipmentBox x="1150" y="180" label="TAILINGS FLUID\nTRANSPORT" color="#7BA5B8" size="small" />

          {/* Rejects Conveyor */}
          <EquipmentBox x="1260" y="100" label="REJECTS\nCONVEYOR" color="#7BA5B8" size="small" />

          {/* PRODUCTS SECTION */}
          
          {/* Dispatch Feed Conveyor */}
          <EquipmentBox x="1250" y="360" label="DISPATCH FEED\nCONVEYOR" color="#7BA5B8" size="medium" />

          {/* Load Out Bin */}
          <g>
            <rect x="1280" y="440" width="60" height="50" rx="4" fill="#7BA5B8" stroke="#5B8FA3" strokeWidth="2" />
            <path d="M 1290,440 L 1310,420 L 1330,440" fill="none" stroke="#5B8FA3" strokeWidth="2" />
            <text x="1310" y="510" fontSize="9" textAnchor="middle" fill="#1a1a1a" fontWeight="600">LOAD OUT BIN</text>
          </g>

          {/* Ship Stackers */}
          <g>
            <rect x="1180" y="470" width="70" height="25" rx="4" fill="#7BA5B8" stroke="#5B8FA3" strokeWidth="2" />
            <polygon points="1200,465 1215,455 1230,465" fill="#5B8FA3" />
            <text x="1215" y="520" fontSize="9" textAnchor="middle" fill="#1a1a1a" fontWeight="600">SHIP STACKERS</text>
          </g>

          {/* Filtering */}
          <EquipmentBox x="1190" y="380" label="FILTERING" color="#7BA5B8" size="small" />
        </svg>

        {/* Click instruction overlay on Primary Crusher */}
        <div
          style={{
            position: "absolute",
            top: "150px",
            left: "240px",
            background: "rgba(239, 68, 68, 0.95)",
            color: "white",
            padding: "8px 12px",
            borderRadius: "4px",
            fontSize: "11px",
            fontWeight: "600",
            pointerEvents: "none",
          }}
        >
          Click to Investigate
        </div>
      </div>
    </div>
  );
}

// Reusable Equipment Box Component
function EquipmentBox({ x, y, label, color, size = "medium" }) {
  const dimensions = {
    small: { width: 60, height: 35 },
    medium: { width: 80, height: 45 },
    large: { width: 100, height: 60 },
  };

  const dim = dimensions[size];
  const lines = label.split("\n");

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={dim.width}
        height={dim.height}
        rx="4"
        fill={color}
        stroke="#5B8FA3"
        strokeWidth="2"
      />
      {lines.map((line, i) => (
        <text
          key={i}
          x={x + dim.width / 2}
          y={y + dim.height + 15 + i * 12}
          fontSize="9"
          textAnchor="middle"
          fill="#1a1a1a"
          fontWeight="600"
        >
          {line}
        </text>
      ))}
    </g>
  );
}

// KPI Card Component
function KPICard({ icon, title, value, unit, change }) {
  const isNegative = change.startsWith("-") || change.startsWith("+");
  const changeColor = change.startsWith("-") || change.includes("Loss") ? "#EF4444" : "#10B981";
  const arrow = change.startsWith("-") ? "↓" : "↑";

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "6px",
        padding: "12px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
        <span style={{ fontSize: "20px" }}>{icon}</span>
        <span style={{ fontSize: "11px", fontWeight: "600", color: "#718096", textTransform: "uppercase" }}>
          {title}
        </span>
      </div>
      <div style={{ fontSize: "24px", fontWeight: "700", color: "#1a1a1a" }}>
        {value}
      </div>
      <div style={{ fontSize: "11px", color: "#4a5568", marginBottom: "4px" }}>
        {unit}
      </div>
      <div style={{ fontSize: "12px", fontWeight: "600", color: changeColor }}>
        {arrow} {change.replace("-", "").replace("+", "")} MoM
      </div>
    </div>
  );
}

