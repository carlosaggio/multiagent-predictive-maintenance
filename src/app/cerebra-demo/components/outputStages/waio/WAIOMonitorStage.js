"use client";

import React, { useState, useEffect, useRef } from 'react';
import EventFeed from '../../waio/EventFeed';
import PlanDeltaSummary from '../../waio/PlanDeltaSummary';
import { waioEvents } from '../../../data/waio/waioScenarioContext';

/**
 * WAIO Monitor Stage Component
 * 
 * Shows continuous monitoring with plan vs actual and replanning on events.
 */

// Plan vs Actual timeline (simplified)
function PlanVsActualTimeline({ planned, actual }) {
  const hours = ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00'];
  
  // Generate demo data
  const plannedData = [0, 25000, 55000, 90000, 120000, 145000, 155000];
  const actualData = [0, 23000, 52000, 82000, 110000, 145327, null];
  const plannedGrade = [62.4, 62.3, 62.2, 62.1, 62.05, 62.05, 62.05];
  const actualGrade = [62.3, 62.1, 61.9, 61.5, 62.05, null, null];

  return (
    <div style={{
      background: '#F9FAFB',
      borderRadius: '8px',
      padding: '16px',
    }}>
      <div style={{ 
        fontSize: '12px', 
        fontWeight: '600', 
        color: '#1A1A2E',
        marginBottom: '16px',
      }}>
        Plan vs Actual Tracking
      </div>

      {/* Tonnes chart */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ 
          fontSize: '10px', 
          color: '#6B7280',
          marginBottom: '8px',
        }}>
          Cumulative Tonnes
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          height: '100px',
          gap: '4px',
          padding: '0 10px',
          borderBottom: '1px solid #E2E8F0',
        }}>
          {hours.map((hour, idx) => {
            const plannedHeight = (plannedData[idx] / 155000) * 100;
            const actualHeight = actualData[idx] !== null ? (actualData[idx] / 155000) * 100 : 0;
            const hasActual = actualData[idx] !== null;
            
            return (
              <div key={hour} style={{ 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
              }}>
                <div style={{ 
                  display: 'flex', 
                  gap: '2px', 
                  alignItems: 'flex-end',
                  height: '80px',
                }}>
                  <div style={{
                    width: '8px',
                    height: `${plannedHeight}%`,
                    background: '#E2E8F0',
                    borderRadius: '2px 2px 0 0',
                  }} />
                  {hasActual && (
                    <div style={{
                      width: '8px',
                      height: `${actualHeight}%`,
                      background: actualData[idx] >= plannedData[idx] ? '#10B981' : '#F59E0B',
                      borderRadius: '2px 2px 0 0',
                    }} />
                  )}
                </div>
                <span style={{ fontSize: '9px', color: '#9CA3AF' }}>{hour}</span>
              </div>
            );
          })}
        </div>
        <div style={{ 
          display: 'flex', 
          gap: '16px', 
          marginTop: '8px',
          justifyContent: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '12px', height: '8px', background: '#E2E8F0', borderRadius: '2px' }} />
            <span style={{ fontSize: '10px', color: '#6B7280' }}>Planned</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '12px', height: '8px', background: '#10B981', borderRadius: '2px' }} />
            <span style={{ fontSize: '10px', color: '#6B7280' }}>Actual</span>
          </div>
        </div>
      </div>

      {/* KPI summary */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px',
      }}>
        <div style={{
          padding: '10px',
          background: 'white',
          borderRadius: '6px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '9px', color: '#6B7280', marginBottom: '4px' }}>Tonnes</div>
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#10B981' }}>145.3k</div>
          <div style={{ fontSize: '9px', color: '#10B981' }}>94% of plan</div>
        </div>
        <div style={{
          padding: '10px',
          background: 'white',
          borderRadius: '6px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '9px', color: '#6B7280', marginBottom: '4px' }}>Avg Grade</div>
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#10B981' }}>62.05%</div>
          <div style={{ fontSize: '9px', color: '#10B981' }}>On target</div>
        </div>
        <div style={{
          padding: '10px',
          background: 'white',
          borderRadius: '6px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '9px', color: '#6B7280', marginBottom: '4px' }}>Compliance</div>
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#10B981' }}>88%</div>
          <div style={{ fontSize: '9px', color: '#10B981' }}>+4% vs start</div>
        </div>
        <div style={{
          padding: '10px',
          background: 'white',
          borderRadius: '6px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '9px', color: '#6B7280', marginBottom: '4px' }}>Replans</div>
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#F59E0B' }}>2</div>
          <div style={{ fontSize: '9px', color: '#F59E0B' }}>This shift</div>
        </div>
      </div>
    </div>
  );
}

export default function WAIOMonitorStage({ onComplete }) {
  const [events, setEvents] = useState(waioEvents);
  const [showReplan, setShowReplan] = useState(false);
  const [replanTrigger, setReplanTrigger] = useState(null);
  const hasCompletedRef = useRef(false);

  // Simulate a new event arriving
  useEffect(() => {
    const timer = setTimeout(() => {
      const newEvent = {
        id: 'EVT-005',
        timestamp: new Date().toISOString(),
        type: 'equipment_breakdown',
        severity: 'critical',
        title: 'Truck TRK-12 repair complete',
        description: 'TRK-12 back online. Recommend reactivation and route optimization.',
        impact: 'positive',
        resolved: false,
      };
      
      setEvents(prev => [newEvent, ...prev]);
      setReplanTrigger('TRK-12 back online');
      setShowReplan(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Trigger completion - only once
  useEffect(() => {
    if (hasCompletedRef.current) return;
    
    const timer = setTimeout(() => {
      if (!hasCompletedRef.current) {
        hasCompletedRef.current = true;
        onComplete?.();
      }
    }, 8000);
    return () => clearTimeout(timer);
  }, []); // Empty dependency array

  const handleReplan = (event) => {
    setReplanTrigger(event.title);
    setShowReplan(true);
  };

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
            Continuous Monitoring
          </div>
          <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
            Real-time plan vs actual tracking with auto-replan on disruptions
          </div>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 12px',
          background: '#10B98120',
          borderRadius: '20px',
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#10B981',
            animation: 'pulse 1.5s infinite',
          }} />
          <span style={{ fontSize: '11px', fontWeight: '600', color: '#10B981' }}>
            Live
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '20px' }}>
        {/* Plan vs Actual */}
        <PlanVsActualTimeline />

        {/* Two column layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: showReplan ? '1fr 1fr' : '1fr',
          gap: '20px',
          marginTop: '20px',
        }}>
          {/* Event feed */}
          <EventFeed
            events={events}
            title="Event Feed"
            onReplan={handleReplan}
            maxHeight="350px"
          />

          {/* Plan delta summary (when replan triggered) */}
          {showReplan && (
            <PlanDeltaSummary
              trigger={replanTrigger}
              changes={[
                {
                  type: 'modified',
                  task: 'Haul Route Optimization',
                  description: 'TRK-12 reactivated on Pit 3 routes',
                  impact: '+8% haul capacity restored',
                },
                {
                  type: 'shifted',
                  task: 'TRK-08 Assignment',
                  description: 'Returned to standby as backup',
                  impact: 'Operational flexibility restored',
                },
              ]}
              kpiChanges={{
                planCompliance: { before: 0.88, after: 0.92, isPositive: true },
                underSpecRisk: { before: 0.28, after: 0.22, isPositive: true },
                tonnes: { before: 145327, after: 152000, isPositive: true },
                valueAtRisk: { before: 580000, after: 420000, isPositive: true },
              }}
            />
          )}
        </div>
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

export { PlanVsActualTimeline };
