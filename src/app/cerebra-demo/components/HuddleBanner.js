"use client";

import React, { useState, useEffect } from 'react';

// Agent colors - aligned with actual huddle agents
const agentColors = {
  RO: '#F59E0B', // Orange - Resource Orchestration
  TA: '#EF4444', // Red - Timeseries Analysis
  MI: '#8B5CF6', // Purple - Maintenance Intelligence
  IL: '#10B981', // Green - Inventory & Logistics
  LD: '#3B82F6', // Blue - Liner Diagnostics
};

// Use actual agent IDs that match the workflow
const agentDisplayCodes = {
  RO: 'RO',
  TA: 'TA',
  MI: 'MI',
  IL: 'IL',
  LD: 'LD',
};

const agentNames = {
  RO: 'Resource',
  TA: 'Timeseries',
  MI: 'Intelligence',
  IL: 'Inventory',
  LD: 'Liner Diag',
};

const AgentBadge = ({ code, color, isActive, isActivated, isComplete, showLabel = false }) => (
  <div style={{ textAlign: 'center' }}>
    <div
      style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: isActivated || isComplete ? color : '#4B5563',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        fontWeight: '700',
        color: 'white',
        boxShadow: isActive 
          ? `0 0 0 3px ${color}50, 0 0 20px ${color}80` 
          : isActivated 
            ? `0 0 0 2px ${color}30`
            : 'none',
        transition: 'all 0.5s ease',
        transform: isActive ? 'scale(1.1)' : 'scale(1)',
        opacity: isActivated || isComplete ? 1 : 0.5,
      }}
    >
      {isComplete ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      ) : code}
    </div>
    {showLabel && (
      <div style={{ 
        fontSize: '9px', 
        color: isActivated ? '#E2E8F0' : '#6B7280',
        marginTop: '4px',
        transition: 'color 0.3s ease'
      }}>
        {agentNames[code] || code}
      </div>
    )}
  </div>
);

// Orchestrator badge (Super Agent)
const OrchestratorBadge = ({ isActive }) => (
  <div style={{ 
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    <div
      style={{
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #A100FF 0%, #7C3AED 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: isActive 
          ? '0 0 0 4px rgba(161, 0, 255, 0.3), 0 0 30px rgba(161, 0, 255, 0.5)' 
          : '0 0 0 2px rgba(161, 0, 255, 0.2)',
        transition: 'all 0.5s ease',
        transform: isActive ? 'scale(1.05)' : 'scale(1)',
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" 
          stroke="white" strokeWidth="2" fill="none"/>
      </svg>
    </div>
    <div style={{ 
      fontSize: '10px', 
      color: '#A100FF',
      marginTop: '6px',
      fontWeight: '600',
      textAlign: 'center',
      whiteSpace: 'nowrap',
    }}>
      Super Agent
    </div>
  </div>
);

export default function HuddleBanner({ 
  agents = ['RO', 'TA', 'MI', 'IL', 'LD'],
  activeAgent = null,
  isComplete = false,
  activatedAgents = [], // Which agents have been activated by orchestrator
  showOrchestrator = true,
  orchestratorPhase = 'idle', // 'idle' | 'activating' | 'monitoring' | 'complete'
  currentActivatingAgent = null,
}) {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2D44 100%)',
        borderRadius: '12px',
        padding: '20px 24px',
        textAlign: 'center',
        margin: '20px 0',
      }}
    >
      {/* Status text */}
      <div
        style={{
          color: 'white',
          fontSize: '14px',
          fontWeight: '600',
          marginBottom: '6px',
        }}
      >
        {isComplete ? 'Huddle Complete' : 
         orchestratorPhase === 'activating' ? 'Initializing Trusted Huddle' :
         'Trusted Huddle In-Progress'}
      </div>
      
      {/* Subtitle showing orchestrator action */}
      {orchestratorPhase === 'activating' && currentActivatingAgent && (
        <div style={{
          color: agentColors[currentActivatingAgent],
          fontSize: '11px',
          marginBottom: '16px',
          opacity: 0.9,
        }}>
          Activating {agentNames[currentActivatingAgent]} Agent...
        </div>
      )}
      
      {orchestratorPhase === 'monitoring' && !isComplete && (
        <div style={{
          color: '#9CA3AF',
          fontSize: '11px',
          marginBottom: '16px',
        }}>
          Orchestrating multi-agent collaboration
        </div>
      )}
      
      {isComplete && (
        <div style={{
          color: '#10B981',
          fontSize: '11px',
          marginBottom: '16px',
        }}>
          All agents synchronized • Analysis complete
        </div>
      )}
      
      {/* Agent badges with orchestrator */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}
      >
        {/* Orchestrator */}
        {showOrchestrator && (
          <>
            <OrchestratorBadge isActive={orchestratorPhase === 'activating'} />
            
            {/* Connection lines from orchestrator */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              padding: '0 8px',
            }}>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: orchestratorPhase !== 'idle' ? '#A100FF' : '#4B5563',
                    opacity: orchestratorPhase !== 'idle' ? 1 : 0.5,
                    animation: orchestratorPhase === 'activating' 
                      ? `pulse 0.8s ease-in-out ${i * 0.15}s infinite` 
                      : 'none',
                  }}
                />
              ))}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" 
                stroke={orchestratorPhase !== 'idle' ? '#A100FF' : '#4B5563'}
                strokeWidth="2"
                style={{ opacity: orchestratorPhase !== 'idle' ? 1 : 0.5 }}
              >
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </div>
          </>
        )}
        
        {/* Agent badges */}
        {agents.map((agentId, index) => {
          const isActivated = activatedAgents.includes(agentId);
          const isCurrentlyActivating = currentActivatingAgent === agentId;
          const isAgentActive = activeAgent === agentId;
          const isAgentComplete = isComplete || (activatedAgents.indexOf(agentId) < activatedAgents.indexOf(activeAgent));
          
          return (
            <div key={agentId} style={{ position: 'relative' }}>
              <AgentBadge
                code={agentDisplayCodes[agentId] || agentId}
                color={agentColors[agentId] || '#6B7280'}
                isActive={isAgentActive || isCurrentlyActivating}
                isActivated={isActivated}
                isComplete={isComplete}
                showLabel={true}
              />
              
              {/* Activation pulse effect */}
              {isCurrentlyActivating && (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  border: `2px solid ${agentColors[agentId]}`,
                  animation: 'activationPulse 1s ease-out infinite',
                  pointerEvents: 'none',
                }}/>
              )}
            </div>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes activationPulse {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// Export individual components for use elsewhere
export { AgentBadge, OrchestratorBadge, agentColors, agentDisplayCodes, agentNames };
