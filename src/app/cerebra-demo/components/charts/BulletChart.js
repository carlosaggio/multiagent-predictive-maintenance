"use client";

import React from 'react';
import { ResponsiveBullet } from '@nivo/bullet';

const data = [
  {
    id: "Crusher Efficiency",
    ranges: [0, 70, 85, 100],
    measures: [82],
    markers: [89],
  },
  {
    id: "Throughput",
    ranges: [0, 70, 85, 100],
    measures: [78],
    markers: [85],
  },
  {
    id: "Availability",
    ranges: [0, 70, 85, 100],
    measures: [88],
    markers: [95],
  }
];

export default function BulletChart() {
  return (
    <div style={{
      background: 'white',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      padding: '16px',
      marginBottom: '16px',
    }}>
      <div style={{
        fontSize: '13px',
        fontWeight: '600',
        color: '#1a1a2e',
        marginBottom: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#E67E22">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
        </svg>
        Equipment Performance Indicators
      </div>
      
      <div style={{ height: '180px' }}>
        <ResponsiveBullet
          data={data}
          margin={{ top: 20, right: 30, bottom: 30, left: 100 }}
          spacing={40}
          titleAlign="start"
          titleOffsetX={-80}
          measureSize={0.3}
          rangeColors={['#fee2e2', '#fef3c7', '#d1fae5']}
          measureColors={['#4b5563']}
          markerColors={['#EF4444']}
          animate={true}
          motionConfig="gentle"
        />
      </div>
      
      {/* Legend */}
      <div style={{
        display: 'flex',
        gap: '20px',
        justifyContent: 'center',
        marginTop: '12px',
        paddingTop: '12px',
        borderTop: '1px solid #f0f0f0',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#718096' }}>
          <span style={{ width: '12px', height: '12px', background: '#4b5563', borderRadius: '2px' }} />
          Actual
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#718096' }}>
          <span style={{ width: '12px', height: '3px', background: '#EF4444' }} />
          Target
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#718096' }}>
          <span style={{ width: '12px', height: '12px', background: '#fee2e2', borderRadius: '2px' }} />
          Poor
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#718096' }}>
          <span style={{ width: '12px', height: '12px', background: '#fef3c7', borderRadius: '2px' }} />
          Fair
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#718096' }}>
          <span style={{ width: '12px', height: '12px', background: '#d1fae5', borderRadius: '2px' }} />
          Good
        </div>
      </div>
    </div>
  );
}

