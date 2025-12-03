"use client";

import React from "react";

// Icons for different tool call types
const ThinkingIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <circle cx="8" cy="12" r="1" fill="#8B5CF6" />
    <circle cx="12" cy="12" r="1" fill="#8B5CF6" />
    <circle cx="16" cy="12" r="1" fill="#8B5CF6" />
  </svg>
);

const ToolIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A100FF" strokeWidth="2">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);

const MemoryIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0078D4" strokeWidth="2">
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
  </svg>
);

const RetrieveIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="9" y1="15" x2="15" y2="15" />
  </svg>
);

const VectorSearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
    <path d="M11 8a3 3 0 0 0-3 3" />
  </svg>
);

const AnalysisIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a1a2e" strokeWidth="2">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function ToolCallDisplay({ call, isVisible }) {
  if (!isVisible) return null;

  const getIcon = () => {
    switch (call.type) {
      case "thinking":
        return <ThinkingIcon />;
      case "tool":
        return <ToolIcon />;
      case "memory":
        return <MemoryIcon />;
      case "retrieve":
        return <RetrieveIcon />;
      case "vector_search":
        return <VectorSearchIcon />;
      case "analysis":
        return <AnalysisIcon />;
      case "tool_result":
        return null; // No icon for results
      default:
        return null;
    }
  };

  const getLabel = () => {
    switch (call.type) {
      case "thinking":
        return "THINKING";
      case "tool":
        return "TOOL";
      case "memory":
        return "MEMORY";
      case "retrieve":
        return "RETRIEVE";
      case "vector_search":
        return "VECTOR SEARCH";
      case "analysis":
        return "ANALYSIS";
      default:
        return "";
    }
  };

  const getColor = () => {
    switch (call.type) {
      case "thinking":
        return "#8B5CF6";
      case "tool":
        return "#A100FF";
      case "memory":
        return "#0078D4";
      case "retrieve":
        return "#3B82F6";
      case "vector_search":
        return "#F59E0B";
      case "analysis":
        return "#1a1a2e";
      default:
        return "#4a5568";
    }
  };

  const isResult = call.type === "tool_result";

  return (
    <div
      className="tool-call-item fade-in"
      style={{
        display: "flex",
        gap: "8px",
        marginBottom: "8px",
        paddingLeft: isResult ? "24px" : "0",
        alignItems: "flex-start",
      }}
    >
      {!isResult && (
        <div style={{ marginTop: "2px", flexShrink: 0 }}>{getIcon()}</div>
      )}
      <div style={{ flex: 1 }}>
        {!isResult && (
          <span
            style={{
              fontSize: "11px",
              fontWeight: "700",
              color: getColor(),
              marginRight: "8px",
              letterSpacing: "0.5px",
            }}
          >
            [{getLabel()}]
          </span>
        )}
        {call.type === "tool" && call.name && (
          <span style={{ fontSize: "13px", color: "#1a1a1a", fontFamily: "monospace" }}>
            {call.name}
            {call.params && `(${JSON.stringify(call.params).slice(0, 60)}...)`}
          </span>
        )}
        {call.type === "tool_result" && (
          <span style={{ fontSize: "13px", color: "#4a5568" }}>
            <span style={{ marginRight: "4px" }}>-&gt;</span>
            {call.data}
          </span>
        )}
        {(call.type === "thinking" || call.type === "memory" || call.type === "retrieve" || call.type === "vector_search") && (
          <span style={{ fontSize: "13px", color: "#1a1a1a" }}>{call.text}</span>
        )}
        {call.type === "analysis" && (
          <span style={{ fontSize: "13px", color: "#1a1a1a", fontWeight: "600" }}>
            {call.text}
          </span>
        )}
        {call.query && (
          <div
            style={{
              fontSize: "12px",
              color: "#718096",
              marginTop: "4px",
              paddingLeft: "16px",
              fontStyle: "italic",
            }}
          >
            Query: "{call.query}"
          </div>
        )}
        {call.results && (
          <div
            style={{
              fontSize: "12px",
              color: "#718096",
              marginTop: "4px",
              paddingLeft: "16px",
            }}
          >
            {call.results}
          </div>
        )}
      </div>
    </div>
  );
}

