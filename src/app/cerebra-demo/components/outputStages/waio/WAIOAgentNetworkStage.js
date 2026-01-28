"use client";

import React from 'react';
import { WAIO_AGENT_CONFIG } from '../../../data/waio/waioAgents';

/**
 * WAIO Agent Network Stage Component
 * 
 * Displays the WAIO agent network with parallel constraint-clearing lanes.
 */

// Agent tile component
function AgentTile({ agent, isActive }) {
  return (
    <div style={{
      background: isActive ? agent.color : 'white',
      borderRadius: '8px',
      border: `2px solid ${agent.color}`,
      padding: '16px',
      textAlign: 'center',
      transition: 'all 0.3s ease',
      cursor: 'default',
      minWidth: '120px',
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '8px',
        background: isActive ? 'rgba(255,255,255,0.2)' : `${agent.color}15`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 10px',
        fontSize: '18px',
        fontWeight: '700',
        color: isActive ? 'white' : agent.color,
      }}>
        {agent.id}
      </div>
      <div style={{
        fontSize: '12px',
        fontWeight: '600',
        color: isActive ? 'white' : '#1A1A2E',
        marginBottom: '4px',
      }}>
        {agent.name}
      </div>
      <div style={{
        fontSize: '10px',
        color: isActive ? 'rgba(255,255,255,0.8)' : '#6B7280',
      }}>
        Lane {agent.lane === 'orchestrator' ? '∞' : agent.lane}
      </div>
    </div>
  );
}

// Lane row component
function LaneRow({ laneNumber, title, agentId, color }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '8px 12px',
      background: '#F9FAFB',
      borderRadius: '6px',
      marginBottom: '6px',
    }}>
      <div style={{
        width: '24px',
        height: '24px',
        borderRadius: '4px',
        background: color,
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '10px',
        fontWeight: '700',
      }}>
        {agentId}
      </div>
      <div style={{ flex: 1 }}>
        <span style={{ fontSize: '11px', color: '#6B7280' }}>Lane {laneNumber}: </span>
        <span style={{ fontSize: '11px', fontWeight: '600', color: '#1A1A2E' }}>{title}</span>
      </div>
      <div style={{
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: '#10B981',
      }} />
    </div>
  );
}

export default function WAIOAgentNetworkStage({ onComplete }) {
  const agents = Object.values(WAIO_AGENT_CONFIG);
  const orchestrator = agents.find(a => a.lane === 'orchestrator');
  const laneAgents = agents.filter(a => a.lane !== 'orchestrator').sort((a, b) => a.lane - b.lane);
  const hasCompletedRef = React.useRef(false);

  // Simulate completion after animation - only call once
  React.useEffect(() => {
    if (hasCompletedRef.current) return;
    
    const timer = setTimeout(() => {
      if (!hasCompletedRef.current) {
        hasCompletedRef.current = true;
        onComplete?.();
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, []); // Empty dependency array - only run once on mount

  return (
    <div style={{
      padding: '20px',
      background: 'white',
      borderRadius: '8px',
      border: '1px solid #E2E8F0',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ 
          fontSize: '16px', 
          fontWeight: '700', 
          color: '#1A1A2E',
          marginBottom: '8px',
        }}>
          WAIO Agent Network
        </div>
        <div style={{ fontSize: '12px', color: '#6B7280' }}>
          Parallel constraint-clearing engine with 6 specialized lanes + orchestrator
        </div>
      </div>

      {/* Key takeaways */}
      <div style={{
        background: '#F5F3FF',
        borderRadius: '8px',
        padding: '14px 16px',
        marginBottom: '24px',
        borderLeft: '4px solid #A100FF',
      }}>
        <div style={{ 
          fontSize: '11px', 
          fontWeight: '600', 
          color: '#A100FF',
          marginBottom: '8px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}>
          Key Takeaways
        </div>
        <ul style={{ 
          margin: 0, 
          paddingLeft: '16px', 
          fontSize: '12px', 
          color: '#4B5563',
          lineHeight: '1.6',
        }}>
          <li>6 parallel lanes analyze constraints simultaneously</li>
          <li>Each lane produces findings, status, and recommended actions</li>
          <li>Orchestrator consolidates and generates optimised shift plans</li>
        </ul>
      </div>

      {/* Orchestrator */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center',
        marginBottom: '24px',
      }}>
        <AgentTile agent={orchestrator} isActive={true} />
      </div>

      {/* Connection line */}
      <div style={{
        width: '2px',
        height: '24px',
        background: '#A100FF',
        margin: '0 auto 24px',
      }} />

      {/* Lane agents grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '12px',
        marginBottom: '24px',
      }}>
        {laneAgents.map(agent => (
          <AgentTile key={agent.id} agent={agent} isActive={false} />
        ))}
      </div>

      {/* Lane summary */}
      <div style={{
        background: '#F9FAFB',
        borderRadius: '8px',
        padding: '16px',
      }}>
        <div style={{ 
          fontSize: '11px', 
          fontWeight: '600', 
          color: '#6B7280',
          marginBottom: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}>
          Constraint-Clearing Lanes
        </div>
        {laneAgents.map(agent => (
          <LaneRow
            key={agent.id}
            laneNumber={agent.lane}
            title={agent.role}
            agentId={agent.id}
            color={agent.color}
          />
        ))}
      </div>
    </div>
  );
}

export { AgentTile, LaneRow };
