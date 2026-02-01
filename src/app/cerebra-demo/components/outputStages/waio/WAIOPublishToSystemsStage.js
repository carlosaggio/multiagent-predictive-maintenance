"use client";

import React, { useState, useEffect, useRef } from 'react';
import { waioPublishTargets } from '../../../data/waio/waioPublishTargets';
import { waioRetrofitChangeSet } from '../../../data/waio/waioScenarioContext';

/**
 * WAIO Publish To Systems Stage Component
 * 
 * Final stage showing successful publishing to all planning and execution systems.
 */

// Status indicator dot
function StatusDot({ status, color }) {
  if (status === 'publishing') {
    return (
      <div style={{
        width: '14px',
        height: '14px',
        borderRadius: '50%',
        border: `2px solid ${color}`,
        borderTopColor: 'transparent',
        animation: 'spin 1s linear infinite',
      }} />
    );
  }
  return (
    <div style={{
      width: '14px',
      height: '14px',
      borderRadius: '50%',
      background: color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '10px',
      fontWeight: '700',
    }}>
      {status === 'success' ? '✓' : status === 'error' ? '✗' : ''}
    </div>
  );
}

// System status card
function SystemStatusCard({ target, status, timestamp }) {
  const statusConfig = {
    pending: { bg: '#F3F4F6', color: '#6B7280' },
    publishing: { bg: '#F3E8FF', color: '#A100FF' },
    success: { bg: '#D1FAE5', color: '#059669' },
    error: { bg: '#FEE2E2', color: '#DC2626' },
  };
  
  const config = statusConfig[status] || statusConfig.pending;

  return (
    <div style={{
      padding: '12px',
      background: config.bg,
      borderRadius: '8px',
      border: `1px solid ${config.color}30`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#1A1A2E' }}>{target.name}</span>
        <StatusDot status={status} color={config.color} />
      </div>
      <div style={{ fontSize: '10px', color: '#6B7280', marginBottom: '4px' }}>
        {target.payloadSummary.action}
      </div>
      <div style={{ fontSize: '10px', color: config.color, fontWeight: '500' }}>
        {target.payloadSummary.items.slice(0, 2).join(', ')}
      </div>
      {timestamp && (
        <div style={{ fontSize: '9px', color: '#9CA3AF', marginTop: '4px' }}>
          Completed: {timestamp}
        </div>
      )}
    </div>
  );
}

// Summary banner
function SummaryBanner({ changeSet }) {
  return (
    <div style={{
      padding: '16px',
      background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
      borderRadius: '8px',
      color: 'white',
      marginBottom: '16px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
        }}>
          ✓
        </div>
        <div>
          <div style={{ fontSize: '16px', fontWeight: '700' }}>Plan Changes Published Successfully</div>
          <div style={{ fontSize: '12px', opacity: 0.9 }}>
            Change Set #{changeSet.id} applied to all systems
          </div>
        </div>
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '12px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '6px',
        padding: '12px',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: '700' }}>{changeSet.changes.length}</div>
          <div style={{ fontSize: '10px', opacity: 0.8 }}>Plan Changes</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: '700' }}>{waioPublishTargets.length}</div>
          <div style={{ fontSize: '10px', opacity: 0.8 }}>Systems Updated</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: '700' }}>
            {changeSet.expectedImpacts.compliance7D.change}
          </div>
          <div style={{ fontSize: '10px', opacity: 0.8 }}>Compliance Gain</div>
        </div>
      </div>
    </div>
  );
}

// What changed summary
function WhatChangedSummary({ changeSet }) {
  return (
    <div style={{
      background: '#F9FAFB',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '16px',
    }}>
      <div style={{ fontSize: '12px', fontWeight: '600', color: '#1A1A2E', marginBottom: '12px' }}>
        What Changed
      </div>
      {changeSet.changes.map((change, idx) => (
        <div key={idx} style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
          padding: '8px 0',
          borderBottom: idx < changeSet.changes.length - 1 ? '1px solid #E2E8F0' : 'none',
        }}>
          <span style={{ 
            fontSize: '10px', 
            fontWeight: '600',
            padding: '2px 6px',
            background: '#A100FF15',
            color: '#A100FF',
            borderRadius: '4px',
          }}>
            #{idx + 1}
          </span>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '500', color: '#1A1A2E' }}>
              {change.title}
            </div>
            <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>
              Expected: +{Math.round(change.expectedComplianceGain * 100)}% compliance, -{Math.round(change.expectedRiskReduction * 100)}% risk
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function WAIOPublishToSystemsStage({ onComplete }) {
  const [statuses, setStatuses] = useState({});
  const [timestamps, setTimestamps] = useState({});
  const [isComplete, setIsComplete] = useState(false);
  const hasCompletedRef = useRef(false);

  const changeSet = waioRetrofitChangeSet;

  // Simulate publishing to all systems
  useEffect(() => {
    const sortedTargets = [...waioPublishTargets].sort((a, b) => a.priority - b.priority);
    let currentDelay = 800;

    sortedTargets.forEach((target) => {
      // Start publishing
      setTimeout(() => {
        setStatuses(prev => ({ ...prev, [target.id]: 'publishing' }));
      }, currentDelay);

      // Complete publishing (faster for demo)
      const completionDelay = Math.min(target.estimatedTime, 1500);
      setTimeout(() => {
        const now = new Date();
        setStatuses(prev => ({ ...prev, [target.id]: 'success' }));
        setTimestamps(prev => ({ ...prev, [target.id]: now.toLocaleTimeString() }));
      }, currentDelay + completionDelay);

      currentDelay += completionDelay + 300;
    });

    // Mark complete
    setTimeout(() => {
      setIsComplete(true);
    }, currentDelay);

  }, []);

  // Trigger completion callback - only once
  useEffect(() => {
    if (isComplete && !hasCompletedRef.current) {
      hasCompletedRef.current = true;
      setTimeout(() => {
        onComplete?.();
      }, 1000);
    }
  }, [isComplete, onComplete]);

  const completedCount = Object.values(statuses).filter(s => s === 'success').length;

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
        background: isComplete 
          ? 'linear-gradient(135deg, #059669 0%, #10B981 100%)'
          : 'linear-gradient(135deg, #1A1A2E 0%, #2D2D44 100%)',
      }}>
        <div style={{ 
          fontSize: '16px', 
          fontWeight: '700', 
          color: 'white',
          marginBottom: '8px',
        }}>
          {isComplete ? 'Publishing Complete' : 'Publishing to Planning & Execution Systems'}
        </div>
        <div style={{ fontSize: '12px', color: isComplete ? 'rgba(255,255,255,0.9)' : '#9CA3AF' }}>
          {isComplete 
            ? `All ${waioPublishTargets.length} systems updated successfully`
            : 'Closing the loop: syncing plan changes to Deswik, Vulcan, Dispatch, and downstream systems'
          }
        </div>
        
        {/* Progress */}
        {!isComplete && (
          <div style={{ marginTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', color: '#9CA3AF' }}>Progress</span>
              <span style={{ fontSize: '11px', color: 'white', fontWeight: '600' }}>
                {completedCount}/{waioPublishTargets.length}
              </span>
            </div>
            <div style={{
              height: '4px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '2px',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${(completedCount / waioPublishTargets.length) * 100}%`,
                background: '#A100FF',
                borderRadius: '2px',
                transition: 'width 0.3s ease',
              }} />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '20px' }}>
        {isComplete && <SummaryBanner changeSet={changeSet} />}
        {isComplete && <WhatChangedSummary changeSet={changeSet} />}

        {/* System grid */}
        <div style={{ 
          fontSize: '12px', 
          fontWeight: '600', 
          color: '#1A1A2E', 
          marginBottom: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span>Target Systems</span>
          {isComplete && (
            <span style={{ 
              fontSize: '10px', 
              fontWeight: '500', 
              color: '#059669',
              background: '#D1FAE5',
              padding: '4px 8px',
              borderRadius: '4px',
            }}>
              All Synced
            </span>
          )}
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px',
        }}>
          {waioPublishTargets.map(target => (
            <SystemStatusCard
              key={target.id}
              target={target}
              status={statuses[target.id] || 'pending'}
              timestamp={timestamps[target.id]}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      {isComplete && (
        <div style={{
          padding: '16px 20px',
          background: '#F9FAFB',
          borderTop: '1px solid #E2E8F0',
        }}>
          <div style={{ fontSize: '11px', color: '#6B7280', lineHeight: '1.5' }}>
            <strong>Next Steps:</strong> The updated 7-day plan will take effect from the next shift. 
            Monitor the dashboard for compliance improvements and continue to track deviation patterns.
          </div>
        </div>
      )}
      
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export { SystemStatusCard, SummaryBanner, WhatChangedSummary };
