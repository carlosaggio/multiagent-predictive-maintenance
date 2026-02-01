"use client";

import React, { useState, useEffect } from 'react';
import { waioPublishTargets } from '../../data/waio/waioPublishTargets';

/**
 * Integration Publish Drawer Component
 * 
 * Shows simulated system publish actions with progress and status.
 */

// Icons for different system types
const SystemIcons = {
  calendar: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  grid: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7"/>
      <rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  truck: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="1" y="3" width="15" height="13"/>
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
      <circle cx="5.5" cy="18.5" r="2.5"/>
      <circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  ),
  settings: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  cpu: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="4" width="16" height="16" rx="2" ry="2"/>
      <rect x="9" y="9" width="6" height="6"/>
      <line x1="9" y1="1" x2="9" y2="4"/>
      <line x1="15" y1="1" x2="15" y2="4"/>
      <line x1="9" y1="20" x2="9" y2="23"/>
      <line x1="15" y1="20" x2="15" y2="23"/>
      <line x1="20" y1="9" x2="23" y2="9"/>
      <line x1="20" y1="14" x2="23" y2="14"/>
      <line x1="1" y1="9" x2="4" y2="9"/>
      <line x1="1" y1="14" x2="4" y2="14"/>
    </svg>
  ),
  package: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  ),
  flask: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 22h12M9 2h6M12 2v8l-5 10h10L12 10V2"/>
    </svg>
  ),
  'check-circle': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  'bar-chart': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="20" x2="12" y2="10"/>
      <line x1="18" y1="20" x2="18" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="16"/>
    </svg>
  ),
};

// Spinner component
function Spinner() {
  return (
    <div style={{
      width: '16px',
      height: '16px',
      border: '2px solid #E2E8F0',
      borderTopColor: '#A100FF',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    }}>
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// Success check icon
function SuccessCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

// System publish row
function SystemPublishRow({ target, status, timestamp }) {
  const Icon = SystemIcons[target.icon] || SystemIcons['check-circle'];
  
  const statusDisplay = {
    pending: { text: 'Pending', color: '#6B7280', bg: '#F3F4F6' },
    publishing: { text: 'Publishing...', color: '#A100FF', bg: '#F3E8FF' },
    success: { text: 'Success', color: '#059669', bg: '#D1FAE5' },
    error: { text: 'Failed', color: '#DC2626', bg: '#FEE2E2' },
  };
  
  const display = statusDisplay[status] || statusDisplay.pending;

  return (
    <div style={{
      padding: '12px 16px',
      background: 'white',
      borderRadius: '8px',
      border: '1px solid #E2E8F0',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    }}>
      {/* Icon */}
      <div style={{
        width: '36px',
        height: '36px',
        borderRadius: '8px',
        background: status === 'success' ? '#D1FAE5' : status === 'publishing' ? '#F3E8FF' : '#F3F4F6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: status === 'success' ? '#059669' : status === 'publishing' ? '#A100FF' : '#6B7280',
        flexShrink: 0,
      }}>
        {Icon}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '13px', fontWeight: '600', color: '#1A1A2E', marginBottom: '2px' }}>
          {target.name}
        </div>
        <div style={{ fontSize: '11px', color: '#6B7280' }}>
          {target.payloadSummary.action}
        </div>
      </div>

      {/* Payload summary */}
      <div style={{ 
        fontSize: '10px', 
        color: '#6B7280',
        textAlign: 'right',
        minWidth: '80px',
      }}>
        {target.payloadSummary.recordCount} records
      </div>

      {/* Status */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        minWidth: '100px',
        justifyContent: 'flex-end',
      }}>
        {status === 'publishing' && <Spinner />}
        {status === 'success' && <SuccessCheck />}
        <span style={{
          fontSize: '10px',
          fontWeight: '600',
          padding: '3px 8px',
          borderRadius: '4px',
          background: display.bg,
          color: display.color,
        }}>
          {display.text}
        </span>
      </div>

      {/* Timestamp */}
      {timestamp && (
        <div style={{ fontSize: '10px', color: '#9CA3AF', minWidth: '60px', textAlign: 'right' }}>
          {timestamp}
        </div>
      )}
    </div>
  );
}

export default function IntegrationPublishDrawer({
  isOpen,
  onClose,
  publishType = 'changeset', // 'changeset' | 'dispatch' | 'all'
  onComplete,
}) {
  const [statuses, setStatuses] = useState({});
  const [timestamps, setTimestamps] = useState({});
  const [isComplete, setIsComplete] = useState(false);

  // Filter targets based on publish type
  const targets = publishType === 'all' 
    ? waioPublishTargets
    : publishType === 'dispatch'
      ? waioPublishTargets.filter(t => ['MINESTAR', 'MODULAR', 'SCADA', 'ORETRACKING'].includes(t.id))
      : waioPublishTargets;

  // Simulate publishing process
  useEffect(() => {
    if (!isOpen) {
      setStatuses({});
      setTimestamps({});
      setIsComplete(false);
      return;
    }

    const sortedTargets = [...targets].sort((a, b) => a.priority - b.priority);
    let currentDelay = 500;

    sortedTargets.forEach((target) => {
      // Start publishing
      setTimeout(() => {
        setStatuses(prev => ({ ...prev, [target.id]: 'publishing' }));
      }, currentDelay);

      // Complete publishing
      setTimeout(() => {
        const now = new Date();
        setStatuses(prev => ({ ...prev, [target.id]: 'success' }));
        setTimestamps(prev => ({ ...prev, [target.id]: now.toLocaleTimeString() }));
      }, currentDelay + target.estimatedTime);

      currentDelay += target.estimatedTime + 200;
    });

    // Mark complete
    setTimeout(() => {
      setIsComplete(true);
      onComplete?.();
    }, currentDelay);

  }, [isOpen, targets, onComplete]);

  if (!isOpen) return null;

  const completedCount = Object.values(statuses).filter(s => s === 'success').length;
  const progress = (completedCount / targets.length) * 100;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      width: '480px',
      background: 'white',
      boxShadow: '-4px 0 24px rgba(0,0,0,0.15)',
      zIndex: 10000,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid #E2E8F0',
        background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2D44 100%)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: 'white', marginBottom: '4px' }}>
              Publishing to Systems
            </div>
            <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
              {publishType === 'changeset' ? 'Plan change set' : publishType === 'dispatch' ? 'Dispatch instructions' : 'All systems'}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '6px',
              padding: '8px',
              cursor: 'pointer',
              color: 'white',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', color: '#9CA3AF' }}>Progress</span>
            <span style={{ fontSize: '11px', color: 'white', fontWeight: '600' }}>
              {completedCount}/{targets.length} systems
            </span>
          </div>
          <div style={{
            height: '6px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '3px',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${progress}%`,
              background: isComplete ? '#10B981' : '#A100FF',
              borderRadius: '3px',
              transition: 'width 0.3s ease',
            }} />
          </div>
        </div>
      </div>

      {/* System list */}
      <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
        {targets.map(target => (
          <SystemPublishRow
            key={target.id}
            target={target}
            status={statuses[target.id] || 'pending'}
            timestamp={timestamps[target.id]}
          />
        ))}
      </div>

      {/* Footer */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid #E2E8F0',
        background: isComplete ? '#ECFDF5' : '#F9FAFB',
      }}>
        {isComplete ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#10B981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#065F46' }}>
                Publishing Complete
              </div>
              <div style={{ fontSize: '12px', color: '#059669' }}>
                All {targets.length} systems updated successfully
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                marginLeft: 'auto',
                padding: '10px 20px',
                background: '#10B981',
                border: 'none',
                borderRadius: '6px',
                color: 'white',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Done
            </button>
          </div>
        ) : (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            color: '#6B7280',
            fontSize: '12px',
          }}>
            <Spinner />
            <span>Publishing in progress... Please wait</span>
          </div>
        )}
      </div>
    </div>
  );
}

export { SystemPublishRow, Spinner, SuccessCheck };
