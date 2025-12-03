"use client";

import React from 'react';

// Maintenance lifecycle phases with ranges (in months from May 2024)
const lifecyclePhases = [
  { 
    id: 'optimal',
    label: 'Optimal Performance',
    start: 0,
    end: 4,
    color: '#10B981',
    median: 2,
    q1: 1,
    q3: 3,
  },
  { 
    id: 'degrading',
    label: 'Degradation Phase',
    start: 4,
    end: 8,
    color: '#F59E0B',
    median: 6,
    q1: 5,
    q3: 7,
  },
  { 
    id: 'critical',
    label: 'Critical / Action Required',
    start: 8,
    end: 8.5,
    color: '#EF4444',
    median: 8.25,
    q1: 8,
    q3: 8.5,
  },
  { 
    id: 'forecast',
    label: 'Forecast Period',
    start: 8.5,
    end: 12,
    color: '#8B5CF6',
    median: 10,
    q1: 9,
    q3: 11,
  },
];

// Key events - minimal, no overlapping
const keyEvents = [
  { month: 0, type: 'corrective', abbrev: 'LR', tooltip: 'Liner Replaced - $16.1K' },
  { month: 2.5, type: 'inspection', abbrev: 'I1', tooltip: 'Inspection - 78% remaining' },
  { month: 4.5, type: 'preventive', abbrev: 'PM', tooltip: 'PM Complete - $2.4K' },
  { month: 6.5, type: 'inspection', abbrev: 'I2', tooltip: 'Thickness Check - 65%' },
  { month: 8, type: 'alert', abbrev: 'AI', tooltip: 'AI Alert - Efficiency drop 7%' },
  // This is NOT scheduled yet - it's a proposed action pending workflow decision
  { month: 10, type: 'forecast', abbrev: 'PR', tooltip: 'Proposed Replacement - Pending Decision' },
];

const typeColors = {
  corrective: '#EF4444',
  preventive: '#3B82F6',
  inspection: '#10B981',
  alert: '#F59E0B',
  forecast: '#8B5CF6',
};

export default function MaintenanceCalendar() {
  const chartWidth = 100; // percentage
  const barHeight = 24;
  const monthToPercent = (month) => (month / 12) * 100;
  
  return (
    <div style={{ 
      background: 'white',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      padding: '16px',
      marginBottom: '16px',
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '16px',
      }}>
        <div>
          <div style={{ 
            fontSize: '12px', 
            fontWeight: '600', 
            color: '#1a1a2e',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A100FF" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Maintenance Lifecycle Analysis
          </div>
          <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '2px' }}>
            CRUSHER-001 • Jaw Liner • 12-month view
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {lifecyclePhases.map(phase => (
            <div key={phase.id} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px',
              fontSize: '9px',
              color: '#6b7280'
            }}>
              <div style={{ 
                width: '12px', 
                height: '6px', 
                borderRadius: '2px', 
                background: phase.color,
                opacity: 0.7
              }} />
              {phase.label}
            </div>
          ))}
        </div>
      </div>

      {/* Box Plot Visualization */}
      <div style={{ 
        position: 'relative',
        height: '120px',
        marginBottom: '8px',
      }}>
        {/* Background grid */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 30,
          display: 'flex',
        }}>
          {[0, 2, 4, 6, 8, 10, 12].map((month, i) => (
            <div key={month} style={{
              position: 'absolute',
              left: `${monthToPercent(month)}%`,
              top: 0,
              bottom: 0,
              width: '1px',
              background: month === 8 ? '#F59E0B' : '#f0f0f0',
              opacity: month === 8 ? 0.5 : 1,
            }} />
          ))}
        </div>

        {/* Box Plot - Lifecycle Phases */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: 0,
          right: 0,
          height: `${barHeight}px`,
        }}>
          {lifecyclePhases.map(phase => (
            <div key={phase.id} style={{
              position: 'absolute',
              left: `${monthToPercent(phase.start)}%`,
              width: `${monthToPercent(phase.end - phase.start)}%`,
              height: '100%',
              display: 'flex',
              alignItems: 'center',
            }}>
              {/* Box (IQR) */}
              <div style={{
                position: 'absolute',
                left: `${((phase.q1 - phase.start) / (phase.end - phase.start)) * 100}%`,
                width: `${((phase.q3 - phase.q1) / (phase.end - phase.start)) * 100}%`,
                height: '100%',
                background: phase.color,
                borderRadius: '4px',
                opacity: 0.85,
              }} />
              
              {/* Whiskers */}
              <div style={{
                position: 'absolute',
                left: 0,
                width: `${((phase.q1 - phase.start) / (phase.end - phase.start)) * 100}%`,
                top: '50%',
                height: '2px',
                background: phase.color,
                opacity: 0.5,
              }} />
              <div style={{
                position: 'absolute',
                right: 0,
                width: `${((phase.end - phase.q3) / (phase.end - phase.start)) * 100}%`,
                top: '50%',
                height: '2px',
                background: phase.color,
                opacity: 0.5,
              }} />
              
              {/* Whisker end caps */}
              <div style={{
                position: 'absolute',
                left: 0,
                top: '25%',
                height: '50%',
                width: '2px',
                background: phase.color,
                opacity: 0.5,
              }} />
              <div style={{
                position: 'absolute',
                right: 0,
                top: '25%',
                height: '50%',
                width: '2px',
                background: phase.color,
                opacity: 0.5,
              }} />
              
              {/* Median line */}
              <div style={{
                position: 'absolute',
                left: `${((phase.median - phase.start) / (phase.end - phase.start)) * 100}%`,
                top: 0,
                height: '100%',
                width: '3px',
                background: 'white',
                borderRadius: '1px',
              }} />
            </div>
          ))}
        </div>

        {/* Event Markers */}
        <div style={{
          position: 'absolute',
          top: '55px',
          left: 0,
          right: 0,
          height: '24px',
        }}>
          {keyEvents.map((event, i) => (
            <div 
              key={i}
              style={{
                position: 'absolute',
                left: `${monthToPercent(event.month)}%`,
                transform: 'translateX(-50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
              title={event.tooltip}
            >
              {/* Connector line */}
              <div style={{
                width: '1px',
                height: '10px',
                background: typeColors[event.type],
                marginBottom: '2px',
              }} />
              {/* Event badge */}
              <div style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background: event.type === 'forecast' ? 'white' : typeColors[event.type],
                border: `2px solid ${typeColors[event.type]}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '8px',
                fontWeight: '700',
                color: event.type === 'forecast' ? typeColors[event.type] : 'white',
                boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
              }}>
                {event.abbrev}
              </div>
            </div>
          ))}
          
          {/* NOW indicator */}
          <div style={{
            position: 'absolute',
            left: `${monthToPercent(8)}%`,
            transform: 'translateX(-50%)',
            top: '-32px',
          }}>
            <div style={{
              background: '#F59E0B',
              color: 'white',
              fontSize: '8px',
              fontWeight: '700',
              padding: '2px 6px',
              borderRadius: '3px',
            }}>
              NOW
            </div>
          </div>
        </div>

        {/* X-Axis Labels */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'space-between',
        }}>
          {['May \'24', 'Jul', 'Sep', 'Nov', 'Jan \'25', 'Mar', 'May'].map((label, i) => (
            <div key={i} style={{ 
              fontSize: '9px', 
              color: i === 4 ? '#F59E0B' : '#9ca3af',
              fontWeight: i === 4 ? '600' : '400',
              width: '14.28%',
              textAlign: 'center',
            }}>
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Event Legend - Compact row */}
      <div style={{
        display: 'flex',
        gap: '16px',
        justifyContent: 'center',
        padding: '12px 0',
        borderTop: '1px solid #f0f0f0',
        borderBottom: '1px solid #f0f0f0',
        marginBottom: '12px',
        flexWrap: 'wrap',
      }}>
        {keyEvents.map((event, i) => (
          <div key={i} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '4px',
            fontSize: '9px',
            color: '#6b7280',
          }}>
            <div style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: event.type === 'forecast' ? 'white' : typeColors[event.type],
              border: `2px solid ${typeColors[event.type]}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '7px',
              fontWeight: '700',
              color: event.type === 'forecast' ? typeColors[event.type] : 'white',
            }}>
              {event.abbrev}
            </div>
            <span style={{ 
              maxWidth: '80px', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              color: event.type === 'forecast' ? '#8B5CF6' : '#6b7280',
              fontStyle: event.type === 'forecast' ? 'italic' : 'normal',
            }}>
              {event.tooltip.split(' - ')[0]}
              {event.type === 'forecast' && ' *'}
            </span>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '8px',
      }}>
        {[
          { label: 'Last Replace', value: 'May 15', color: '#EF4444', sub: '8 mo ago' },
          { label: 'Current Wear', value: '65%', color: '#F59E0B', sub: 'Critical zone' },
          { label: 'Avg Lifecycle', value: '4.2 mo', color: '#10B981', sub: 'Historical' },
          { label: 'Proposed Action', value: 'Pending', color: '#8B5CF6', sub: 'Awaiting decision' },
        ].map((stat, i) => (
          <div key={i} style={{ 
            textAlign: 'center',
            padding: '8px',
            background: '#fafafa',
            borderRadius: '6px',
          }}>
            <div style={{ fontSize: '14px', fontWeight: '700', color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: '9px', color: '#6b7280', fontWeight: '500' }}>{stat.label}</div>
            <div style={{ fontSize: '8px', color: '#9ca3af' }}>{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Note about proposed action */}
      <div style={{
        marginTop: '8px',
        fontSize: '9px',
        color: '#9ca3af',
        textAlign: 'center',
        fontStyle: 'italic',
      }}>
        * Proposed actions require workflow approval before scheduling
      </div>
    </div>
  );
}
