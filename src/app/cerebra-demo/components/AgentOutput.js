"use client";

import React, { useState, useEffect } from "react";
import AgentBadge from "./AgentBadge";
import ToolCallDisplay from "./ToolCallDisplay";
import TimeseriesChart from "./TimeseriesChart";
import WearPatternDiagram from "./WearPatternDiagram";

export default function AgentOutput({ agent, toolCalls = [], isActive, isComplete, delay = 0 }) {
  const [visibleCalls, setVisibleCalls] = useState([]);
  const [currentCallIndex, setCurrentCallIndex] = useState(0);

  // Progressive reveal of tool calls
  useEffect(() => {
    if (!isActive || toolCalls.length === 0) {
      setVisibleCalls([]);
      setCurrentCallIndex(0);
      return;
    }

    // Start after delay
    const startTimeout = setTimeout(() => {
      let callIndex = 0;
      
      const showNextCall = () => {
        if (callIndex < toolCalls.length) {
          const call = toolCalls[callIndex];
          setVisibleCalls((prev) => [...prev, call]);
          setCurrentCallIndex(callIndex + 1);
          
          callIndex++;
          // Schedule next call based on duration
          setTimeout(showNextCall, call.duration || 1000);
        }
      };
      
      showNextCall();
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [isActive, toolCalls, delay]);

  const status = isActive ? "Analyzing..." : isComplete ? "Complete" : "Idle";
  const statusColor = isActive ? "#8B5CF6" : isComplete ? "#10B981" : "#9ca3af";

  return (
    <div className="agent-output fade-in">
      <div className="agent-header">
        <AgentBadge badge={agent.badge} color={agent.color} pulsing={isActive} />
        <div>
          <div className="agent-name">{agent.name}</div>
          <div style={{ fontSize: "11px", color: statusColor, fontWeight: "500" }}>
            {status}
            {agent.azureService && isActive && (
              <span style={{ color: "#718096", marginLeft: "8px" }}>
                | {agent.azureService}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="agent-content">
        {/* Tool Calls */}
        {visibleCalls.length > 0 && (
          <div style={{ marginTop: "12px" }}>
            {visibleCalls.map((call, index) => (
              <ToolCallDisplay key={index} call={call} isVisible={true} />
            ))}
          </div>
        )}

        {/* Visual Elements for Specific Agents */}
        {isComplete && agent.id === "ta" && (
          <TimeseriesChart />
        )}

        {isComplete && agent.id === "ld" && (
          <WearPatternDiagram />
        )}

        {/* Completion Message */}
        {isComplete && (
          <div
            style={{
              marginTop: "12px",
              borderLeft: "3px solid #10B981",
              paddingLeft: "12px",
            }}
          >
            <div style={{ fontSize: "13px", fontWeight: "600", color: "#10B981", marginBottom: "4px" }}>
              Analysis Complete
            </div>
            <div style={{ fontSize: "12px", color: "#4a5568" }}>
              Confidence: {agent.confidence || 90}% | 
              Elapsed: {(toolCalls.reduce((acc, call) => acc + (call.duration || 0), 0) / 1000).toFixed(1)}s
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

