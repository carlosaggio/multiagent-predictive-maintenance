"use client";

import React from 'react';

/**
 * Event Feed Component
 * 
 * Chronological event cards for monitoring and replanning triggers.
 */

// Event type configurations
const EVENT_TYPES = {
  equipment_breakdown: {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="15" y1="9" x2="9" y2="15"/>
        <line x1="9" y1="9" x2="15" y2="15"/>
      </svg>
    ),
    color: '#EF4444',
    bgColor: '#FEF2F2',
    label: 'Equipment',
  },
  grade_drift: {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    ),
    color: '#F59E0B',
    bgColor: '#FFFBEB',
    label: 'Grade',
  },
  assay_update: {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
      </svg>
    ),
    color: '#3B82F6',
    bgColor: '#EFF6FF',
    label: 'Assay',
  },
  data_quality: {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
    color: '#F59E0B',
    bgColor: '#FFFBEB',
    label: 'Data',
  },
  schedule_change: {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
    color: '#8B5CF6',
    bgColor: '#F5F3FF',
    label: 'Schedule',
  },
  plan_update: {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="23 4 23 10 17 10"/>
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
      </svg>
    ),
    color: '#A100FF',
    bgColor: '#F5F0FF',
    label: 'Replan',
  },
};

// Format timestamp
function formatTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-AU', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false,
  });
}

// Event card component
function EventCard({ event, onReplan }) {
  const typeConfig = EVENT_TYPES[event.type] || EVENT_TYPES.plan_update;
  const isResolved = event.resolved;

  return (
    <div style={{
      background: 'white',
      borderRadius: '8px',
      border: `1px solid ${isResolved ? '#E2E8F0' : typeConfig.color}30`,
      borderLeft: `3px solid ${typeConfig.color}`,
      padding: '12px 14px',
      marginBottom: '8px',
      opacity: isResolved ? 0.7 : 1,
      transition: 'all 0.2s ease',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '12px',
        marginBottom: '8px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Icon */}
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            background: typeConfig.bgColor,
            color: typeConfig.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            {typeConfig.icon}
          </div>
          
          {/* Title & type */}
          <div>
            <div style={{ 
              fontSize: '12px', 
              fontWeight: '600', 
              color: '#1A1A2E',
            }}>
              {event.title}
            </div>
            <div style={{ 
              fontSize: '10px', 
              color: typeConfig.color,
              fontWeight: '500',
            }}>
              {typeConfig.label}
            </div>
          </div>
        </div>

        {/* Timestamp */}
        <div style={{
          fontSize: '10px',
          color: '#9CA3AF',
          fontWeight: '500',
          whiteSpace: 'nowrap',
        }}>
          {formatTime(event.timestamp)}
        </div>
      </div>

      {/* Description */}
      <div style={{
        fontSize: '11px',
        color: '#4B5563',
        lineHeight: '1.5',
        marginBottom: '10px',
        paddingLeft: '38px',
      }}>
        {event.description}
      </div>

      {/* Impact & actions */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: '38px',
      }}>
        {/* Impact badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <span style={{ 
            fontSize: '10px', 
            color: '#6B7280',
          }}>
            Impact:
          </span>
          <span style={{
            padding: '2px 8px',
            borderRadius: '10px',
            fontSize: '10px',
            fontWeight: '600',
            background: event.impact === 'positive' ? '#D1FAE5' : 
                       event.impact === 'negative' ? '#FEE2E2' : '#F3F4F6',
            color: event.impact === 'positive' ? '#065F46' : 
                   event.impact === 'negative' ? '#991B1B' : '#6B7280',
          }}>
            {event.impact === 'positive' ? '↑ Positive' : 
             event.impact === 'negative' ? '↓ Negative' : '→ Neutral'}
          </span>
        </div>

        {/* Actions */}
        {!isResolved && event.impact === 'negative' && (
          <button
            onClick={() => onReplan?.(event)}
            style={{
              padding: '4px 10px',
              background: '#A100FF',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '10px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 4 23 10 17 10"/>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
            Replan
          </button>
        )}

        {isResolved && (
          <span style={{
            fontSize: '10px',
            color: '#10B981',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Resolved
          </span>
        )}
      </div>
    </div>
  );
}

export default function EventFeed({ 
  events = [], 
  title = 'Event Feed',
  onReplan,
  maxHeight = '400px',
}) {
  // Sort events by timestamp (newest first)
  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  const unresolvedCount = events.filter(e => !e.resolved).length;

  return (
    <div style={{
      background: '#F9FAFB',
      borderRadius: '8px',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        background: 'white',
        borderBottom: '1px solid #E2E8F0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ 
            fontSize: '13px', 
            fontWeight: '600', 
            color: '#1A1A2E',
          }}>
            {title}
          </span>
          {unresolvedCount > 0 && (
            <span style={{
              padding: '2px 8px',
              borderRadius: '10px',
              fontSize: '10px',
              fontWeight: '600',
              background: '#FEE2E2',
              color: '#991B1B',
            }}>
              {unresolvedCount} active
            </span>
          )}
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}>
          <div style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#10B981',
            animation: 'pulse 2s infinite',
          }} />
          <span style={{ 
            fontSize: '10px', 
            color: '#10B981',
            fontWeight: '500',
          }}>
            Live
          </span>
        </div>
      </div>

      {/* Events list */}
      <div style={{
        padding: '12px',
        maxHeight,
        overflowY: 'auto',
      }}>
        {sortedEvents.length > 0 ? (
          sortedEvents.map(event => (
            <EventCard
              key={event.id}
              event={event}
              onReplan={onReplan}
            />
          ))
        ) : (
          <div style={{
            padding: '40px 20px',
            textAlign: 'center',
            color: '#9CA3AF',
            fontSize: '12px',
          }}>
            No events recorded
          </div>
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

export { EventCard, EVENT_TYPES };
