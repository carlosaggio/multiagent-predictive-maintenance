"use client";

import React, { useState, useEffect } from 'react';

/**
 * Constraint Lane Board Component
 * 
 * Shows parallel constraint-clearing lanes with status and findings.
 */

// Lane status colors
const STATUS_COLORS = {
  cleared: { bg: '#ECFDF5', border: '#10B981', text: '#065F46' },
  needs_action: { bg: '#FFFBEB', border: '#F59E0B', text: '#92400E' },
  blocked: { bg: '#FEF2F2', border: '#EF4444', text: '#991B1B' },
  running: { bg: '#EEF2FF', border: '#6366F1', text: '#4338CA' },
  pending: { bg: '#F9FAFB', border: '#D1D5DB', text: '#6B7280' },
};

// Agent badge component
function AgentBadge({ agentId, color, isActive }) {
  return (
    <div style={{
      width: '32px',
      height: '32px',
      borderRadius: '6px',
      background: isActive ? color : `${color}20`,
      border: `2px solid ${color}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '11px',
      fontWeight: '700',
      color: isActive ? 'white' : color,
      transition: 'all 0.3s ease',
      boxShadow: isActive ? `0 0 0 3px ${color}25` : 'none',
    }}>
      {agentId}
    </div>
  );
}

// Progress bar component
function ProgressBar({ progress, color }) {
  return (
    <div style={{
      width: '60px',
      height: '4px',
      background: '#E5E7EB',
      borderRadius: '2px',
      overflow: 'hidden',
    }}>
      <div style={{
        width: `${progress * 100}%`,
        height: '100%',
        background: color,
        borderRadius: '2px',
        transition: 'width 0.3s ease',
      }} />
    </div>
  );
}

// Status chip component
function StatusChip({ status }) {
  const colors = STATUS_COLORS[status] || STATUS_COLORS.pending;
  const labels = {
    cleared: 'Cleared',
    needs_action: 'Needs Action',
    blocked: 'Blocked',
    running: 'Running',
    pending: 'Pending',
  };

  return (
    <div style={{
      padding: '4px 10px',
      borderRadius: '12px',
      fontSize: '10px',
      fontWeight: '600',
      background: colors.bg,
      color: colors.text,
      border: `1px solid ${colors.border}`,
      textTransform: 'uppercase',
      letterSpacing: '0.3px',
      whiteSpace: 'nowrap',
    }}>
      {labels[status] || status}
    </div>
  );
}

// Action chip component
function ActionChip({ label, severity, onClick }) {
  const colors = {
    critical: { bg: '#FEE2E2', text: '#991B1B' },
    warning: { bg: '#FEF3C7', text: '#92400E' },
    info: { bg: '#DBEAFE', text: '#1E40AF' },
    success: { bg: '#D1FAE5', text: '#065F46' },
  };
  const colorSet = colors[severity] || colors.info;

  return (
    <button
      onClick={onClick}
      style={{
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '10px',
        fontWeight: '500',
        background: colorSet.bg,
        color: colorSet.text,
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        transition: 'opacity 0.2s ease',
      }}
    >
      {label}
    </button>
  );
}

// Individual lane row component
function LaneRow({ lane, isExpanded, onExpand, agentConfig, onLaneClick }) {
  const agent = agentConfig?.[lane.agentId] || {};
  const isRunning = lane.progress > 0 && lane.progress < 1;
  const isComplete = lane.progress >= 1;

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    if (onLaneClick && isComplete) {
      onLaneClick(lane);
    }
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '8px',
      border: `1px solid ${isExpanded ? '#A100FF' : '#E2E8F0'}`,
      marginBottom: '8px',
      overflow: 'hidden',
      transition: 'all 0.2s ease',
    }}
    onDoubleClick={handleDoubleClick}
    >
      {/* Main row */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: '180px 80px 100px 1fr auto auto',
          alignItems: 'center',
          gap: '16px',
          padding: '12px 16px',
          cursor: 'pointer',
        }}
        onClick={() => onExpand(lane.id)}
      >
        {/* Lane title + agent badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <AgentBadge 
            agentId={lane.agentId} 
            color={agent.color || '#6B7280'} 
            isActive={isRunning || isComplete}
          />
          <div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#1A1A2E' }}>
              {lane.title}
            </div>
            <div style={{ fontSize: '10px', color: '#6B7280' }}>
              Lane {lane.order}
            </div>
          </div>
        </div>

        {/* Progress */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <ProgressBar progress={lane.progress} color={agent.color || '#A100FF'} />
          <span style={{ fontSize: '10px', color: '#9CA3AF' }}>
            {Math.round(lane.progress * 100)}%
          </span>
        </div>

        {/* Status */}
        <StatusChip status={lane.status} />

        {/* Key finding */}
        <div style={{ 
          fontSize: '12px', 
          color: '#4B5563',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {lane.finding}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {lane.actions?.slice(0, 2).map((action, idx) => (
            <ActionChip 
              key={idx}
              label={action.label}
              severity={action.severity}
              onClick={(e) => {
                e.stopPropagation();
                // Handle action
              }}
            />
          ))}
        </div>

        {/* Expand caret */}
        <div style={{
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s ease',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div style={{
          borderTop: '1px solid #E2E8F0',
          padding: '16px',
          background: '#FAFAFA',
          animation: 'fadeIn 0.2s ease-out',
        }}>
          {/* Evidence bullets */}
          {lane.steps && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ 
                fontSize: '11px', 
                fontWeight: '600', 
                color: '#6B7280',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                Analysis Steps
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {lane.steps.map((step, idx) => (
                  <div 
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                      padding: '6px 10px',
                      background: step.type === 'finding' ? `${agent.color}10` : 'white',
                      borderRadius: '4px',
                      borderLeft: `3px solid ${
                        step.type === 'tool' ? '#3B82F6' :
                        step.type === 'result' ? '#6B7280' :
                        step.type === 'finding' ? agent.color || '#A100FF' :
                        '#E2E8F0'
                      }`,
                    }}
                  >
                    <span style={{ 
                      fontSize: '9px', 
                      fontWeight: '600', 
                      color: '#9CA3AF',
                      textTransform: 'uppercase',
                      minWidth: '50px',
                    }}>
                      {step.type}
                    </span>
                    <span style={{ 
                      fontSize: '11px', 
                      color: step.type === 'finding' ? '#1A1A2E' : '#4B5563',
                      fontWeight: step.type === 'finding' ? '600' : '400',
                    }}>
                      {step.type === 'tool' ? (
                        <code style={{ 
                          background: '#F3F4F6', 
                          padding: '2px 6px', 
                          borderRadius: '3px',
                          fontSize: '10px',
                        }}>
                          {step.name}({step.params})
                        </code>
                      ) : step.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Exhibit placeholder */}
          {lane.exhibits?.length > 0 && (
            <div style={{
              background: 'white',
              borderRadius: '6px',
              border: '1px solid #E2E8F0',
              padding: '16px',
            }}>
              <div style={{ 
                fontSize: '11px', 
                fontWeight: '600', 
                color: '#6B7280',
                marginBottom: '12px',
              }}>
                {lane.exhibits[0].title}
              </div>
              <div style={{
                height: '120px',
                background: '#F9FAFB',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#9CA3AF',
                fontSize: '12px',
              }}>
                {lane.exhibits[0].component} Chart
              </div>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default function ConstraintLaneBoard({ 
  lanes = [], 
  agentConfig = {},
  onExpandLane,
  onLaneClick,
  animateProgress = true,
}) {
  const [expandedLane, setExpandedLane] = useState(null);
  const [animatedLanes, setAnimatedLanes] = useState(lanes);

  // Animate lane progress
  useEffect(() => {
    if (!animateProgress) {
      setAnimatedLanes(lanes);
      return;
    }

    // Simulate progressive lane completion
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex >= lanes.length) {
        clearInterval(interval);
        return;
      }

      setAnimatedLanes(prev => prev.map((lane, idx) => {
        if (idx === currentIndex) {
          return { ...lane, progress: 1, status: lane.status === 'pending' ? 'cleared' : lane.status };
        }
        if (idx === currentIndex + 1) {
          return { ...lane, progress: 0.5, status: 'running' };
        }
        return lane;
      }));

      currentIndex++;
    }, 2000);

    return () => clearInterval(interval);
  }, [lanes, animateProgress]);

  const handleExpand = (laneId) => {
    setExpandedLane(expandedLane === laneId ? null : laneId);
    onExpandLane?.(laneId);
  };

  return (
    <div style={{
      background: '#F9FAFB',
      borderRadius: '8px',
      padding: '16px',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
      }}>
        <div>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#1A1A2E' }}>
            Parallel Constraint-Clearing Engine
          </div>
          <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>
            6 lanes processing simultaneously
          </div>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#10B981',
            animation: 'pulse 1.5s infinite',
          }} />
          <span style={{ fontSize: '11px', color: '#10B981', fontWeight: '500' }}>
            Processing
          </span>
        </div>
      </div>

      {/* Lane rows - Double-click any completed lane for detailed analysis */}
      {animatedLanes.map(lane => (
        <LaneRow
          key={lane.id}
          lane={lane}
          isExpanded={expandedLane === lane.id}
          onExpand={handleExpand}
          agentConfig={agentConfig}
          onLaneClick={onLaneClick}
        />
      ))}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}

export { LaneRow, AgentBadge, StatusChip, ActionChip };
