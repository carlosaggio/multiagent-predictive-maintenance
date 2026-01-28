"use client";

import React, { useState, useEffect } from 'react';
import ConstraintLaneBoard from '../../waio/ConstraintLaneBoard';
import { WAIO_AGENT_CONFIG, WAIO_HUDDLE_LANES, WAIO_CURATED_RESPONSES } from '../../../data/waio/waioAgents';

/**
 * WAIO Parallel Huddle Stage Component
 * 
 * Shows the parallel constraint-clearing engine in action.
 */

// Progress phases
const PHASES = ['initializing', 'running', 'consolidating', 'complete'];

// Orchestrator message component
function OrchestratorMessage({ phase, message }) {
  const getIcon = () => {
    switch (phase) {
      case 'initializing':
        return '⚙️';
      case 'running':
        return '🔄';
      case 'consolidating':
        return '📊';
      case 'complete':
        return '✅';
      default:
        return '🤖';
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      padding: '14px 16px',
      background: 'linear-gradient(135deg, #A100FF10 0%, #7C3AED10 100%)',
      borderRadius: '8px',
      border: '1px solid #A100FF30',
      marginBottom: '16px',
    }}>
      <div style={{
        width: '36px',
        height: '36px',
        borderRadius: '8px',
        background: '#A100FF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        flexShrink: 0,
      }}>
        {getIcon()}
      </div>
      <div>
        <div style={{ 
          fontSize: '11px', 
          fontWeight: '600', 
          color: '#A100FF',
          marginBottom: '4px',
        }}>
          Shift Optimiser (SO)
        </div>
        <div style={{ 
          fontSize: '12px', 
          color: '#4B5563',
          lineHeight: '1.5',
        }}>
          {message}
        </div>
      </div>
    </div>
  );
}

// Consolidated findings component
function ConsolidatedFindings({ lanes, responses }) {
  return (
    <div style={{
      background: '#F9FAFB',
      borderRadius: '8px',
      padding: '16px',
      marginTop: '20px',
    }}>
      <div style={{ 
        fontSize: '12px', 
        fontWeight: '600', 
        color: '#1A1A2E',
        marginBottom: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A100FF" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        Consolidated Findings
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {Object.entries(responses).map(([agentId, response]) => {
          if (agentId === 'SO') return null;
          const agent = WAIO_AGENT_CONFIG[agentId];
          if (!agent) return null;
          
          return (
            <div 
              key={agentId}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                padding: '10px 12px',
                background: 'white',
                borderRadius: '6px',
                borderLeft: `3px solid ${agent.color}`,
              }}
            >
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '4px',
                background: agent.color,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: '700',
                flexShrink: 0,
              }}>
                {agentId}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  fontSize: '11px', 
                  fontWeight: '600', 
                  color: '#1A1A2E',
                  marginBottom: '2px',
                }}>
                  {agent.name}
                </div>
                <div style={{ 
                  fontSize: '11px', 
                  color: '#4B5563',
                  lineHeight: '1.4',
                }}>
                  {response.content}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function WAIOParallelHuddleStage({ onComplete, selectedObjective }) {
  const [phase, setPhase] = useState('initializing');
  const [activeLanes, setActiveLanes] = useState([]);
  const [completedLanes, setCompletedLanes] = useState([]);
  const [orchestratorMessage, setOrchestratorMessage] = useState(
    'Initializing parallel constraint-clearing engine...'
  );

  // Initialize lanes with progress state
  const lanesWithProgress = WAIO_HUDDLE_LANES.map(lane => ({
    ...lane,
    progress: completedLanes.includes(lane.id) ? 1 : 
              activeLanes.includes(lane.id) ? 0.5 : 0,
    status: completedLanes.includes(lane.id) ? 'cleared' :
            activeLanes.includes(lane.id) ? 'running' : 'pending',
    finding: WAIO_CURATED_RESPONSES[lane.agentId]?.content?.substring(0, 80) + '...' || 'Analyzing...',
    actions: [
      { label: 'View details', severity: 'info' },
      { label: 'Apply fix', severity: 'success' },
    ],
  }));

  // Simulate parallel execution
  useEffect(() => {
    const timers = [];

    // Phase 1: Initialize
    timers.push(setTimeout(() => {
      setPhase('running');
      setOrchestratorMessage(
        `Running ${WAIO_HUDDLE_LANES.length} constraint-clearing lanes in parallel. Objective: ${selectedObjective || 'Balanced'}.`
      );
      setActiveLanes(WAIO_HUDDLE_LANES.map(l => l.id));
    }, 1000));

    // Phase 2: Complete lanes progressively
    WAIO_HUDDLE_LANES.forEach((lane, idx) => {
      timers.push(setTimeout(() => {
        setCompletedLanes(prev => [...prev, lane.id]);
      }, 2000 + idx * 500));
    });

    // Phase 3: Consolidate
    timers.push(setTimeout(() => {
      setPhase('consolidating');
      setOrchestratorMessage(
        'All lanes complete. Consolidating findings and generating plan options...'
      );
    }, 2000 + WAIO_HUDDLE_LANES.length * 500 + 500));

    // Phase 4: Complete
    timers.push(setTimeout(() => {
      setPhase('complete');
      setOrchestratorMessage(
        'Analysis complete. 3 feasible plan options generated based on constraint analysis and selected objective weights.'
      );
      onComplete?.();
    }, 2000 + WAIO_HUDDLE_LANES.length * 500 + 2000));

    return () => timers.forEach(t => clearTimeout(t));
  }, [selectedObjective, onComplete]);

  return (
    <div style={{
      background: 'white',
      borderRadius: '8px',
      border: '1px solid #E2E8F0',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '20px',
        background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2D44 100%)',
      }}>
        <div style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}>
          <div>
            <div style={{ 
              fontSize: '16px', 
              fontWeight: '700', 
              color: 'white',
              marginBottom: '8px',
            }}>
              Parallel Constraint-Clearing Engine
            </div>
            <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
              Running {WAIO_HUDDLE_LANES.length} lanes simultaneously to clear constraints and generate plan options
            </div>
          </div>
          
          {/* Status indicator */}
          <div style={{
            padding: '6px 12px',
            background: phase === 'complete' ? '#10B98120' : '#A100FF20',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: phase === 'complete' ? '#10B981' : '#A100FF',
              animation: phase !== 'complete' ? 'pulse 1.5s infinite' : 'none',
            }} />
            <span style={{ 
              fontSize: '11px', 
              fontWeight: '600', 
              color: phase === 'complete' ? '#10B981' : '#A100FF',
              textTransform: 'capitalize',
            }}>
              {phase}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '20px' }}>
        {/* Orchestrator message */}
        <OrchestratorMessage phase={phase} message={orchestratorMessage} />

        {/* Lane board */}
        <ConstraintLaneBoard
          lanes={lanesWithProgress}
          agentConfig={WAIO_AGENT_CONFIG}
          animateProgress={false}
        />

        {/* Consolidated findings (show when complete) */}
        {phase === 'complete' && (
          <ConsolidatedFindings 
            lanes={WAIO_HUDDLE_LANES}
            responses={WAIO_CURATED_RESPONSES}
          />
        )}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}

export { OrchestratorMessage, ConsolidatedFindings };
