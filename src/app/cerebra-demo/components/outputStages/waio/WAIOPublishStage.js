"use client";

import React, { useState, useEffect, useRef } from 'react';
import ShiftBriefPreview from '../../waio/ShiftBriefPreview';
import { waioPublishedPlan } from '../../../data/waio/waioScenarioContext';

/**
 * WAIO Publish Stage Component
 * 
 * Shows confirmation of publish and shift brief preview.
 */

// Confirmation banner component
function ConfirmationBanner({ status, message }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '16px 20px',
      background: status === 'success' ? '#ECFDF5' : '#FEF2F2',
      borderRadius: '8px',
      border: `1px solid ${status === 'success' ? '#10B981' : '#EF4444'}30`,
      marginBottom: '20px',
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: status === 'success' ? '#10B981' : '#EF4444',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        {status === 'success' ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        )}
      </div>
      <div>
        <div style={{ 
          fontSize: '14px', 
          fontWeight: '700', 
          color: status === 'success' ? '#065F46' : '#991B1B',
          marginBottom: '4px',
        }}>
          {status === 'success' ? 'Plan Published Successfully' : 'Publication Failed'}
        </div>
        <div style={{ 
          fontSize: '12px', 
          color: status === 'success' ? '#059669' : '#DC2626',
        }}>
          {message}
        </div>
      </div>
    </div>
  );
}

// Dispatch confirmation component
function DispatchConfirmation({ confirmed }) {
  return (
    <div style={{
      padding: '14px 16px',
      background: confirmed ? '#EEF2FF' : '#F9FAFB',
      borderRadius: '8px',
      border: `1px solid ${confirmed ? '#6366F1' : '#E2E8F0'}`,
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    }}>
      <div style={{
        width: '32px',
        height: '32px',
        borderRadius: '6px',
        background: confirmed ? '#6366F1' : '#E5E7EB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={confirmed ? 'white' : '#9CA3AF'} strokeWidth="2">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
          <line x1="8" y1="21" x2="16" y2="21"/>
          <line x1="12" y1="17" x2="12" y2="21"/>
        </svg>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ 
          fontSize: '12px', 
          fontWeight: '600', 
          color: confirmed ? '#4338CA' : '#6B7280',
          marginBottom: '2px',
        }}>
          Dispatch System
        </div>
        <div style={{ 
          fontSize: '11px', 
          color: confirmed ? '#6366F1' : '#9CA3AF',
        }}>
          {confirmed ? 'Plan received and acknowledged' : 'Waiting for confirmation...'}
        </div>
      </div>
      <div style={{
        padding: '4px 10px',
        background: confirmed ? '#C7D2FE' : '#F3F4F6',
        borderRadius: '12px',
        fontSize: '10px',
        fontWeight: '600',
        color: confirmed ? '#4338CA' : '#9CA3AF',
        textTransform: 'uppercase',
      }}>
        {confirmed ? 'Confirmed' : 'Pending'}
      </div>
    </div>
  );
}

export default function WAIOPublishStage({ onComplete }) {
  const [publishStatus, setPublishStatus] = useState('publishing');
  const [dispatchConfirmed, setDispatchConfirmed] = useState(false);
  const hasCompletedRef = useRef(false);

  const plan = waioPublishedPlan;

  // Simulate publishing process - only run once
  useEffect(() => {
    if (hasCompletedRef.current) return;
    
    const timers = [];

    // Step 1: Publishing complete
    timers.push(setTimeout(() => {
      setPublishStatus('success');
    }, 1000));

    // Step 2: Dispatch confirmation
    timers.push(setTimeout(() => {
      setDispatchConfirmed(true);
    }, 2000));

    // Step 3: Complete
    timers.push(setTimeout(() => {
      if (!hasCompletedRef.current) {
        hasCompletedRef.current = true;
        onComplete?.();
      }
    }, 3000));

    return () => timers.forEach(t => clearTimeout(t));
  }, []); // Empty dependency array

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
        background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
      }}>
        <div style={{ 
          fontSize: '16px', 
          fontWeight: '700', 
          color: 'white',
          marginBottom: '8px',
        }}>
          Plan Published
        </div>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>
          Shift brief generated and dispatch system updated
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '20px' }}>
        {/* Confirmation banner */}
        <ConfirmationBanner
          status={publishStatus === 'success' ? 'success' : 'pending'}
          message={publishStatus === 'success' 
            ? `Plan ${plan.planId} published at ${new Date(plan.publishedAt).toLocaleTimeString()} by ${plan.publishedBy}`
            : 'Publishing plan to dispatch system...'
          }
        />

        {/* Dispatch confirmation */}
        <DispatchConfirmation confirmed={dispatchConfirmed} />

        {/* Shift brief preview */}
        <div style={{ marginTop: '20px' }}>
          <div style={{ 
            fontSize: '14px', 
            fontWeight: '600', 
            color: '#1A1A2E',
            marginBottom: '16px',
          }}>
            Shift Brief Preview
          </div>
          <ShiftBriefPreview
            shiftId={plan.planId.replace('PLAN-', 'SHIFT-2025-01-15-DAY-')}
            planName={plan.planName}
            generatedAt={plan.publishedAt}
          />
        </div>
      </div>
    </div>
  );
}

export { ConfirmationBanner, DispatchConfirmation };
