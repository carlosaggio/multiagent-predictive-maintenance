"use client";

import React, { useState, useEffect } from "react";
import AgentBadge from "./AgentBadge";
import AgentOutput from "./AgentOutput";
import { huddleAgents, huddleOutputs } from "../data/agentOutputs";
import { huddleToolCalls } from "../data/agentToolCalls";

export default function TrustedHuddle({ isStarted, onComplete }) {
  const [activeHuddleIndex, setActiveHuddleIndex] = useState(-1);
  const [completedHuddleAgents, setCompletedHuddleAgents] = useState([]);
  const [showSummary, setShowSummary] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!isStarted || hasStarted) return;
    
    setHasStarted(true);

    let currentIndex = 0;
    const huddleAgentsList = Object.keys(huddleToolCalls); // [ro, po, ma, sc, ra]

    const runHuddleAgent = () => {
      if (currentIndex >= huddleAgentsList.length) {
        // All huddle agents complete
        if (!showSummary) {
          setTimeout(() => {
            setShowSummary(true);
          }, 1000);
        }
        return;
      }

      const agentId = huddleAgentsList[currentIndex];
      const toolCalls = huddleToolCalls[agentId] || [];
      const agentDuration = toolCalls.reduce((acc, call) => acc + (call.duration || 0), 0);

      // Activate huddle agent
      setActiveHuddleIndex(currentIndex);

      // After agent completes
      setTimeout(() => {
        setCompletedHuddleAgents((prev) => [...prev, currentIndex]);
        setActiveHuddleIndex(-1);

        // Small pause before next agent
        setTimeout(() => {
          currentIndex++;
          runHuddleAgent();
        }, 800);
      }, agentDuration + 300);
    };

    // Start huddle sequence after brief delay
    setTimeout(() => {
      runHuddleAgent();
    }, 500);
  }, [hasStarted]);

  // Notify parent when summary shows (only once)
  useEffect(() => {
    if (showSummary && onComplete) {
      const timer = setTimeout(() => onComplete(), 2000);
      return () => clearTimeout(timer);
    }
  }, [showSummary, onComplete]);

  const huddleAgentsWithIds = huddleAgents.map((agent, index) => ({
    ...agent,
    fullName: huddleOutputs[agent.id]?.title || agent.name,
    toolCalls: huddleToolCalls[agent.id] || [],
  }));

  return (
    <div className="agent-output fade-in">
      <div className="agent-header">
        <AgentBadge badge="SA" color="#A100FF" />
        <span className="agent-name">Super Agent</span>
      </div>
      <div className="agent-content">
        <div className="agent-description" style={{ marginBottom: "16px" }}>
          Initiating collaborative session with specialized agents...
        </div>

        <div className="trusted-huddle">
          <div className="trusted-huddle-title">Huddle In-Progress</div>
          <div className="trusted-huddle-agents">
            {huddleAgentsWithIds.map((agent, index) => {
              const isActive = index === activeHuddleIndex;
              const isComplete = completedHuddleAgents.includes(index);
              const shouldShow = isActive || isComplete;

              return (
                <div
                  key={agent.id}
                  className={`huddle-agent ${shouldShow ? "" : "opacity-30"}`}
                  style={{
                    backgroundColor: agent.color,
                    opacity: shouldShow ? 1 : 0.3,
                    animation: isActive ? "huddlePulse 2s infinite" : "none",
                  }}
                >
                  {agent.badge}
                </div>
              );
            })}
          </div>
        </div>

        {/* Huddle Agent Outputs */}
        <div style={{ marginTop: "24px" }}>
          {huddleAgentsWithIds.map((agent, index) => {
            const isActive = index === activeHuddleIndex;
            const isComplete = completedHuddleAgents.includes(index);

            if (!isActive && !isComplete) return null;

            return (
              <AgentOutput
                key={agent.id}
                agent={{
                  id: agent.id,
                  badge: agent.badge,
                  color: agent.color,
                  name: agent.fullName,
                }}
                toolCalls={agent.toolCalls}
                isActive={isActive}
                isComplete={isComplete}
                delay={0}
              />
            );
          })}
        </div>

        {/* Summary after all huddle agents complete */}
        {showSummary && (
          <div
            className="fade-in"
            style={{
              marginTop: "24px",
              borderLeft: "3px solid #10B981",
              paddingLeft: "16px",
            }}
          >
            <div
              style={{
                fontSize: "14px",
                fontWeight: "700",
                color: "#10B981",
                marginBottom: "8px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Multi-Agent Consensus Achieved
            </div>
            <div style={{ fontSize: "13px", color: "#4a5568" }}>
              All agents have completed their analysis. Collaborative intelligence synthesis complete.
              Proceeding to action recommendations...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
