"use client";

import React from "react";

export default function TimeseriesChart({ title = "Crusher Efficiency Trend", data = null }) {
  // Default data: Last 30 days of efficiency
  const defaultData = [
    { day: 1, value: 89 },
    { day: 5, value: 89 },
    { day: 10, value: 88 },
    { day: 15, value: 87 },
    { day: 16, value: 84 }, // Anomaly - sudden drop
    { day: 20, value: 83 },
    { day: 25, value: 82 },
    { day: 30, value: 82 },
  ];

  const chartData = data || defaultData;
  
  // SVG dimensions
  const width = 600;
  const height = 200;
  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Scales
  const xScale = (day) => padding.left + (day / 30) * chartWidth;
  const yScale = (value) => padding.top + chartHeight - ((value - 75) / 20) * chartHeight;

  // Generate path for line chart
  const pathData = chartData
    .map((point, index) => {
      const x = xScale(point.day);
      const y = yScale(point.value);
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

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
      <div style={{ fontSize: "13px", fontWeight: "600", color: "#EF4444", marginBottom: "8px" }}>
        {title}
      </div>
      
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "auto" }}>
        {/* Grid lines */}
        {[80, 85, 90].map((value) => (
          <g key={value}>
            <line
              x1={padding.left}
              y1={yScale(value)}
              x2={width - padding.right}
              y2={yScale(value)}
              stroke="#e2e8f0"
              strokeWidth="1"
            />
            <text
              x={padding.left - 10}
              y={yScale(value) + 4}
              fontSize="10"
              textAnchor="end"
              fill="#718096"
            >
              {value}%
            </text>
          </g>
        ))}

        {/* X-axis labels */}
        {[0, 5, 10, 15, 20, 25, 30].map((day) => (
          <text
            key={day}
            x={xScale(day)}
            y={height - padding.bottom + 20}
            fontSize="10"
            textAnchor="middle"
            fill="#718096"
          >
            Day {day}
          </text>
        ))}

        {/* Line */}
        <path
          d={pathData}
          fill="none"
          stroke="#E67E22"
          strokeWidth="2"
        />

        {/* Data points */}
        {chartData.map((point, index) => {
          const isAnomaly = point.day === 16; // Anomaly point
          return (
            <circle
              key={index}
              cx={xScale(point.day)}
              cy={yScale(point.value)}
              r={isAnomaly ? 6 : 3}
              fill={isAnomaly ? "#EF4444" : "#E67E22"}
              stroke={isAnomaly ? "#991b1b" : "none"}
              strokeWidth={isAnomaly ? 2 : 0}
            />
          );
        })}

        {/* Anomaly annotation */}
        <g>
          <line
            x1={xScale(16)}
            y1={yScale(84) - 20}
            x2={xScale(16)}
            y2={yScale(84) - 5}
            stroke="#EF4444"
            strokeWidth="1"
          />
          <text
            x={xScale(16)}
            y={yScale(84) - 25}
            fontSize="10"
            textAnchor="middle"
            fill="#EF4444"
            fontWeight="600"
          >
            Anomaly: -3% drop
          </text>
        </g>

        {/* Axes */}
        <line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={height - padding.bottom}
          stroke="#cbd5e0"
          strokeWidth="2"
        />
        <line
          x1={padding.left}
          y1={height - padding.bottom}
          x2={width - padding.right}
          y2={height - padding.bottom}
          stroke="#cbd5e0"
          strokeWidth="2"
        />

        {/* Y-axis label */}
        <text
          x={15}
          y={height / 2}
          fontSize="11"
          fill="#4a5568"
          transform={`rotate(-90, 15, ${height / 2})`}
          textAnchor="middle"
          fontWeight="600"
        >
          Efficiency (%)
        </text>

        {/* X-axis label */}
        <text
          x={width / 2}
          y={height - 5}
          fontSize="11"
          fill="#4a5568"
          textAnchor="middle"
          fontWeight="600"
        >
          Days
        </text>
      </svg>

      <div style={{ fontSize: "11px", color: "#718096", marginTop: "8px", textAlign: "center" }}>
        Last 30 Days - Primary Crusher Efficiency Monitoring
      </div>
    </div>
  );
}

