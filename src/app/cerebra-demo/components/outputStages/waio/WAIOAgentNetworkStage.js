"use client";

import React, { useState, useEffect, useRef } from 'react';
import { WAIO_AGENT_CONFIG } from '../../../data/waio/waioAgents';
import { useProgressiveReveal, LoadingSpinner, progressiveLoaderStyles } from '../../../utils/progressiveLoader';

/**
 * WAIO Agent Network Stage Component
 * 
 * Displays the WAIO agent network with parallel constraint-clearing lanes.
 * Enhanced with progressive loading for a more dynamic, generated feel.
 */

// Agent tile component with animation support
function AgentTile({ agent, isActive, isRevealed = true, animationDelay = 0 }) {
  if (!isRevealed) return null;
  
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
      animation: `fadeSlideUp 0.4s ease-out ${animationDelay}ms both`,
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

// Lane row component with animation support
function LaneRow({ laneNumber, title, agentId, color, isRevealed = true, animationDelay = 0 }) {
  if (!isRevealed) return null;
  
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '8px 12px',
      background: '#F9FAFB',
      borderRadius: '6px',
      marginBottom: '6px',
      animation: `fadeSlideIn 0.3s ease-out ${animationDelay}ms both`,
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

// Processing indicator for initial load
function InitialProcessingIndicator({ currentStep }) {
  const steps = [
    'Initializing agent network...',
    'Loading constraint-clearing lanes...',
    'Configuring orchestrator...',
    'Activating parallel processing...',
  ];
  
  return (
    <div style={{
      padding: '32px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px',
    }}>
      <LoadingSpinner size={32} />
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '13px', fontWeight: '600', color: '#1A1A2E', marginBottom: '4px' }}>
          Preparing Agent Network
        </div>
        <div style={{ fontSize: '11px', color: '#6B7280' }}>
          {steps[currentStep] || steps[0]}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '6px' }}>
        {steps.map((_, idx) => (
          <div
            key={idx}
            style={{
              width: '24px',
              height: '4px',
              borderRadius: '2px',
              background: idx <= currentStep ? '#A100FF' : '#E2E8F0',
              transition: 'background 0.3s ease',
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function WAIOAgentNetworkStage({ onComplete }) {
  const agents = Object.values(WAIO_AGENT_CONFIG);
  const orchestrator = agents.find(a => a.lane === 'orchestrator');
  const laneAgents = agents.filter(a => a.lane !== 'orchestrator').sort((a, b) => a.lane - b.lane);
  
  const hasCompletedRef = useRef(false);
  
  // Progressive loading states
  const [loadingStep, setLoadingStep] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [showOrchestrator, setShowOrchestrator] = useState(false);
  const [showKeyTakeaways, setShowKeyTakeaways] = useState(false);
  const [showLaneSummary, setShowLaneSummary] = useState(false);
  
  // Progressive reveal for lane agents
  const { revealedItems: agentRevealed, isComplete: agentsComplete } = useProgressiveReveal(
    laneAgents.length,
    { baseDelay: 1800, stagger: 150, autoStart: true }
  );
  
  // Progressive reveal for lane rows - ensure all items are revealed
  const { revealedItems: laneRowsRevealed, isComplete: lanesComplete } = useProgressiveReveal(
    laneAgents.length,
    { baseDelay: 2800, stagger: 100, autoStart: true }
  );
  
  // Force reveal all lane rows after a reasonable delay to prevent truncation
  const [forceRevealAll, setForceRevealAll] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setForceRevealAll(true);
    }, 4000); // Force reveal after 4 seconds
    return () => clearTimeout(timer);
  }, []);

  // Initial processing simulation
  useEffect(() => {
    const stepTimers = [
      setTimeout(() => setLoadingStep(1), 400),
      setTimeout(() => setLoadingStep(2), 800),
      setTimeout(() => setLoadingStep(3), 1100),
      setTimeout(() => { setShowContent(true); setShowKeyTakeaways(true); }, 1400),
      setTimeout(() => setShowOrchestrator(true), 1600),
      setTimeout(() => setShowLaneSummary(true), 2600),
    ];
    
    return () => stepTimers.forEach(t => clearTimeout(t));
  }, []);

  // Completion trigger
  useEffect(() => {
    if (lanesComplete && !hasCompletedRef.current) {
      hasCompletedRef.current = true;
      setTimeout(() => onComplete?.(), 500);
    }
  }, [lanesComplete, onComplete]);

  return (
    <div style={{
      padding: '20px',
      background: 'white',
      borderRadius: '8px',
      border: '1px solid #E2E8F0',
      minHeight: 'fit-content',
      overflow: 'visible',
    }}>
      {/* Initial loading state */}
      {!showContent && (
        <InitialProcessingIndicator currentStep={loadingStep} />
      )}
      
      {/* Main content - revealed progressively */}
      {showContent && (
        <div style={{ minHeight: 'fit-content', overflow: 'visible' }}>
          {/* Header */}
          <div style={{ 
            marginBottom: '24px',
            animation: 'fadeSlideUp 0.4s ease-out',
          }}>
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

          {/* Key takeaways - revealed after header */}
          {showKeyTakeaways && (
            <div style={{
              background: '#F5F3FF',
              borderRadius: '8px',
              padding: '14px 16px',
              marginBottom: '24px',
              borderLeft: '4px solid #A100FF',
              animation: 'fadeSlideUp 0.4s ease-out',
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
          )}

          {/* Orchestrator - revealed separately */}
          {showOrchestrator && (
            <>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center',
                marginBottom: '24px',
              }}>
                <AgentTile agent={orchestrator} isActive={true} isRevealed={true} animationDelay={0} />
              </div>

              {/* Connection line */}
              <div style={{
                width: '2px',
                height: '24px',
                background: '#A100FF',
                margin: '0 auto 24px',
                animation: 'fadeIn 0.3s ease-out',
              }} />
            </>
          )}

          {/* Lane agents grid - revealed progressively */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '12px',
            marginBottom: '24px',
          }}>
            {laneAgents.map((agent, idx) => (
              <AgentTile 
                key={agent.id} 
                agent={agent} 
                isActive={false} 
                isRevealed={agentRevealed[idx]}
                animationDelay={0}
              />
            ))}
          </div>

          {/* Lane summary - revealed after agents */}
          {showLaneSummary && (
            <div style={{
              background: '#F9FAFB',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '0',
              animation: 'fadeSlideUp 0.4s ease-out',
              minHeight: 'fit-content',
              overflow: 'visible',
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
              {laneAgents.map((agent, idx) => (
                <LaneRow
                  key={agent.id}
                  laneNumber={agent.lane}
                  title={agent.role}
                  agentId={agent.id}
                  color={agent.color}
                  isRevealed={forceRevealAll || laneRowsRevealed[idx]}
                  animationDelay={0}
                />
              ))}
            </div>
          )}
        </div>
      )}
      
      <style jsx>{progressiveLoaderStyles}</style>
    </div>
  );
}

export { AgentTile, LaneRow };
