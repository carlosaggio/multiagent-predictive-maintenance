'use client';

import { useState, useEffect, useRef } from 'react';
import { MRO_AGENT_CONFIG } from '../../../data/mro/mroAgentConfig';

const agentOrder = ['OO', 'MP', 'CS', 'WE', 'SC', 'RA', 'OR'];

export default function MROAgentNetworkStage({ onBack, onStageAction, onComplete }) {
  const [revealedAgents, setRevealedAgents] = useState([]);
  const [showSummary, setShowSummary] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [expandedAgent, setExpandedAgent] = useState(null);
  const [showNetworkHealth, setShowNetworkHealth] = useState(false);
  const [showAgentLogs, setShowAgentLogs] = useState(false);
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    agentOrder.forEach((agentId, index) => {
      setTimeout(() => {
        setRevealedAgents(prev => [...prev, agentId]);
      }, 400 + index * 350);
    });

    setTimeout(() => {
      setShowSummary(true);
    }, 400 + agentOrder.length * 350 + 400);

    setTimeout(() => {
      setShowNetworkHealth(true);
    }, 400 + agentOrder.length * 350 + 600);

    setTimeout(() => {
      setAnimationComplete(true);
    }, 400 + agentOrder.length * 350 + 1200);
  }, []);

  const orchestrator = MRO_AGENT_CONFIG['OO'];
  const laneAgents = agentOrder.filter(id => id !== 'OO');

  const toggleAgentExpand = (agentId) => {
    setExpandedAgent(expandedAgent === agentId ? null : agentId);
  };

  const getAgentDetails = (agentId) => {
    const agent = MRO_AGENT_CONFIG[agentId];
    return {
      role: agent.role,
      capabilities: agent.capabilities || ['Status monitoring', 'Real-time updates', 'Alert coordination'],
      currentTask: 'Synchronising with network...'
    };
  };

  return (
    <div style={{ padding: '0', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <style>{`
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', padding: '16px 20px', borderBottom: '2px solid #A100FF' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#A100FF', animation: 'pulse 1.5s infinite' }} />
          <span style={{ color: '#A100FF', fontSize: '13px', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase' }}>MRO Agent Network</span>
        </div>
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', marginTop: '4px' }}>Activating specialised operations intelligence agents...</div>
      </div>

      <div style={{ flex: 1, padding: '20px', background: '#f8fafc', overflow: 'auto' }}>
        {/* Orchestrator */}
        {revealedAgents.includes('OO') && (
          <div style={{ animation: 'scaleIn 0.4s ease-out', textAlign: 'center', marginBottom: '16px' }}>
            <div
              onClick={() => toggleAgentExpand('OO')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                background: 'white',
                border: `2px solid ${orchestrator.color}`,
                borderRadius: '8px',
                padding: '12px 24px',
                boxShadow: '0 2px 8px rgba(161,0,255,0.15)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(161,0,255,0.25)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(161,0,255,0.15)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: orchestrator.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: '700' }}>{orchestrator.id}</div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b' }}>{orchestrator.name}</div>
                <div style={{ fontSize: '10px', color: '#6B7280' }}>{orchestrator.role}</div>
              </div>
            </div>

            {/* Expanded Agent Details */}
            {expandedAgent === 'OO' && (
              <div style={{
                marginTop: '12px',
                padding: '12px 16px',
                background: 'white',
                border: `1px solid ${orchestrator.color}30`,
                borderRadius: '6px',
                animation: 'fadeSlideUp 0.3s ease-out',
              }}>
                <div style={{ fontSize: '10px', fontWeight: '600', color: '#6B7280', marginBottom: '8px', textTransform: 'uppercase' }}>Agent Details</div>
                <div style={{ fontSize: '10px', color: '#1e293b', marginBottom: '6px' }}>
                  <strong>Role:</strong> {getAgentDetails('OO').role}
                </div>
                <div style={{ fontSize: '10px', color: '#1e293b', marginBottom: '6px' }}>
                  <strong>Current Task:</strong> {getAgentDetails('OO').currentTask}
                </div>
                <div style={{ fontSize: '10px', color: '#1e293b' }}>
                  <strong>Capabilities:</strong> {getAgentDetails('OO').capabilities.join(', ')}
                </div>
              </div>
            )}

            {/* Vertical connector */}
            <div style={{ width: '2px', height: '20px', background: '#A100FF', margin: '0 auto', opacity: 0.4 }} />
          </div>
        )}

        {/* Lane Agents Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
          {laneAgents.map((agentId) => {
            const agent = MRO_AGENT_CONFIG[agentId];
            const isRevealed = revealedAgents.includes(agentId);
            const isExpanded = expandedAgent === agentId;

            return (
              <div key={agentId}>
                <div
                  onClick={() => toggleAgentExpand(agentId)}
                  style={{
                    opacity: isRevealed ? 1 : 0.15,
                    transform: isRevealed ? 'translateY(0)' : 'translateY(8px)',
                    transition: 'all 0.4s ease-out',
                    background: 'white',
                    border: `1px solid ${isRevealed ? agent.color + '40' : '#E2E8F0'}`,
                    borderRadius: '6px',
                    padding: '10px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: isRevealed ? 'pointer' : 'default',
                    boxShadow: isExpanded ? `0 2px 8px ${agent.color}20` : 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (isRevealed) {
                      e.currentTarget.style.borderColor = agent.color + '60';
                      e.currentTarget.style.boxShadow = `0 2px 8px ${agent.color}20`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (isRevealed && !isExpanded) {
                      e.currentTarget.style.borderColor = agent.color + '40';
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                >
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: isRevealed ? agent.color : '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '10px', fontWeight: '700', flexShrink: 0 }}>{agent.id}</div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '11px', fontWeight: '600', color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{agent.name}</div>
                    <div style={{ fontSize: '9px', color: '#6B7280', lineHeight: '1.3' }}>Lane {agent.lane}</div>
                  </div>
                  {isRevealed && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', marginLeft: 'auto', flexShrink: 0 }} />}
                </div>

                {/* Expanded Agent Details */}
                {isExpanded && isRevealed && (
                  <div style={{
                    marginTop: '8px',
                    padding: '10px 12px',
                    background: 'white',
                    border: `1px solid ${agent.color}30`,
                    borderRadius: '6px',
                    animation: 'fadeSlideUp 0.3s ease-out',
                    fontSize: '9px',
                    color: '#1e293b',
                  }}>
                    <div style={{ fontWeight: '600', marginBottom: '4px', color: agent.color }}>Details</div>
                    <div style={{ fontSize: '8px', color: '#6B7280', marginBottom: '2px' }}>{getAgentDetails(agentId).role}</div>
                    <div style={{ fontSize: '8px', color: '#6B7280' }}>{getAgentDetails(agentId).currentTask}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Summary */}
        {showSummary && (
          <div style={{ marginBottom: '16px', padding: '12px 16px', background: '#ECFDF5', border: '1px solid #10B98140', borderRadius: '6px', animation: 'fadeSlideUp 0.4s ease-out' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="8" fill="#10B981"/><path d="M5 8l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#065F46' }}>All 7 agents active and synchronised</span>
            </div>
            <div style={{ fontSize: '10px', color: '#047857', marginTop: '4px' }}>Ready to run coordinated triage across hangars, component pools, outstations, and contracts.</div>
          </div>
        )}

        {/* Network Health */}
        {showNetworkHealth && (
          <div style={{ padding: '12px 16px', background: '#F0F9FF', border: '1px solid #3B82F640', borderRadius: '6px', animation: 'fadeSlideUp 0.4s ease-out', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: '600', color: '#1e40af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Network Health</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                {agentOrder.map((id) => (
                  <div
                    key={id}
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#10B981',
                      boxShadow: '0 0 4px rgba(16,185,129,0.4)',
                    }}
                    title={MRO_AGENT_CONFIG[id].name}
                  />
                ))}
              </div>
            </div>
            <div style={{ fontSize: '10px', color: '#1e40af' }}>All agents operational • Network latency: &lt;50ms</div>
          </div>
        )}

        {/* Agent Logs Panel */}
        {showAgentLogs && (
          <div style={{ padding: '12px 16px', background: '#F3F4F6', border: '1px solid #D1D5DB', borderRadius: '6px', animation: 'fadeSlideUp 0.4s ease-out', marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: '600', color: '#374151', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Agent Activity Logs</div>
            <div style={{ background: 'white', borderRadius: '4px', padding: '10px', fontSize: '10px', fontFamily: 'monospace', color: '#1F2937', maxHeight: '200px', overflowY: 'auto', lineHeight: '1.6' }}>
              {['14:23:45 [OO] Initializing orchestration network...', '14:23:46 [MP] Maintenance planning subsystem active', '14:23:47 [CS] Component sourcing agent ready', '14:23:48 [WE] Warehouse execution started', '14:23:49 [SC] Supply chain monitor online', '14:23:50 [RA] Resource allocation module live', '14:23:51 [OR] Operations routing configured', '14:23:52 [OO] Network synchronization complete • 7/7 agents connected', '14:23:53 [NETWORK] All lanes operational • Confidence: 99.8%'].map((log, idx) => (
                <div key={idx}>{log}</div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer with Continue Button */}
      {animationComplete && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderTop: '1px solid #2D3748',
          background: 'rgba(26,26,46,0.95)',
          gap: '12px',
          animation: 'fadeIn 0.3s ease-out',
        }}>
          <button
            onClick={() => onBack?.()}
            style={{
              padding: '8px 16px',
              background: 'transparent',
              border: '1px solid #4A5568',
              borderRadius: '6px',
              color: '#94A3B8',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            ← Back
          </button>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => {
                setShowAgentLogs(!showAgentLogs);
                if (!showAgentLogs) {
                  onStageAction?.('View agent network activity logs');
                }
              }}
              style={{
                padding: '10px 16px',
                background: showAgentLogs ? '#A100FF' : 'transparent',
                border: `1px solid ${showAgentLogs ? '#A100FF' : '#94A3B8'}`,
                borderRadius: '6px',
                color: showAgentLogs ? 'white' : '#94A3B8',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!showAgentLogs) {
                  e.currentTarget.style.borderColor = '#A100FF';
                  e.currentTarget.style.color = '#A100FF';
                }
              }}
              onMouseLeave={(e) => {
                if (!showAgentLogs) {
                  e.currentTarget.style.borderColor = '#94A3B8';
                  e.currentTarget.style.color = '#94A3B8';
                }
              }}
            >
              {showAgentLogs ? '✓ Logs Visible' : 'View Agent Logs'}
            </button>
          </div>
          <button
            onClick={() => onComplete?.()}
            style={{
              padding: '10px 24px',
              background: '#A100FF',
              border: 'none',
              borderRadius: '6px',
              color: 'white',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(161,0,255,0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#8B00E0';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#A100FF';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Continue to Control Tower →
          </button>
        </div>
      )}
    </div>
  );
}
