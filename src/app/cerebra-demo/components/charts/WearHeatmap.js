"use client";

import React, { useState } from 'react';
import { ResponsiveHeatMap } from '@nivo/heatmap';

// Wear pattern data across liner zones over time
const data = [
  {
    id: "Week 1",
    data: [
      { x: "A", y: 15 },
      { x: "B", y: 22 },
      { x: "C", y: 18 },
      { x: "D", y: 12 },
      { x: "E", y: 8 },
    ]
  },
  {
    id: "Week 2",
    data: [
      { x: "A", y: 25 },
      { x: "B", y: 35 },
      { x: "C", y: 28 },
      { x: "D", y: 20 },
      { x: "E", y: 15 },
    ]
  },
  {
    id: "Week 3",
    data: [
      { x: "A", y: 38 },
      { x: "B", y: 52 },
      { x: "C", y: 42 },
      { x: "D", y: 32 },
      { x: "E", y: 22 },
    ]
  },
  {
    id: "Week 4",
    data: [
      { x: "A", y: 55 },
      { x: "B", y: 72 },
      { x: "C", y: 58 },
      { x: "D", y: 45 },
      { x: "E", y: 30 },
    ]
  },
  {
    id: "Current",
    data: [
      { x: "A", y: 68 },
      { x: "B", y: 85 },
      { x: "C", y: 72 },
      { x: "D", y: 55 },
      { x: "E", y: 38 },
    ]
  }
];

// Custom color scale: Low wear = Green, High wear = Red
const getColor = (value) => {
  if (value >= 70) return '#DC2626'; // Red - Critical
  if (value >= 50) return '#F97316'; // Orange - High
  if (value >= 30) return '#FBBF24'; // Yellow - Medium
  return '#22C55E'; // Green - Low
};

export default function WearHeatmap() {
  const [hoveredCell, setHoveredCell] = useState(null);

  return (
    <div style={{
      background: 'white',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      padding: '20px',
      marginBottom: '16px',
    }}>
      {/* Header - clean, no subtitle */}
      <div style={{
        fontSize: '13px',
        fontWeight: '600',
        color: '#1a1a2e',
        marginBottom: '20px',
      }}>
        Liner Wear Intensity by Zone
      </div>
      
      {/* Chart container with proper spacing */}
      <div style={{ height: '200px', position: 'relative' }}>
        <ResponsiveHeatMap
          data={data}
          margin={{ top: 0, right: 20, bottom: 40, left: 70 }}
          valueFormat=">-.0f"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 0,
            tickPadding: 8,
            tickRotation: 0,
            legend: '',
            legendPosition: 'middle',
            legendOffset: 30,
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 8,
            tickRotation: 0,
            legend: '',
            legendPosition: 'middle',
            legendOffset: -55,
          }}
          colors={(cell) => getColor(cell.value)}
          emptyColor="#f0f0f0"
          borderColor="#ffffff"
          borderWidth={3}
          borderRadius={4}
          labelTextColor="#ffffff"
          label={(cell) => `${cell.value}%`}
          legends={[]}
          annotations={[]}
          animate={true}
          motionConfig="gentle"
          hoverTarget="cell"
          cellOpacity={1}
          cellHoverOpacity={0.85}
          cellHoverOthersOpacity={0.5}
          onMouseEnter={(cell) => setHoveredCell(cell)}
          onMouseLeave={() => setHoveredCell(null)}
        />
      </div>

      {/* Zone labels under chart */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        marginLeft: '70px',
        marginRight: '20px',
        marginTop: '4px',
        fontSize: '10px',
        color: '#6B7280',
      }}>
        <span>Zone A</span>
        <span>Zone B</span>
        <span>Zone C</span>
        <span>Zone D</span>
        <span>Zone E</span>
      </div>

      {/* Clean Legend */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '20px',
        marginTop: '20px',
        paddingTop: '12px',
        borderTop: '1px solid #f0f0f0',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#22C55E' }} />
          <span style={{ fontSize: '10px', color: '#6B7280' }}>Low (&lt;30%)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#FBBF24' }} />
          <span style={{ fontSize: '10px', color: '#6B7280' }}>Medium (30-49%)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#F97316' }} />
          <span style={{ fontSize: '10px', color: '#6B7280' }}>High (50-69%)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#DC2626' }} />
          <span style={{ fontSize: '10px', color: '#6B7280' }}>Critical (70%+)</span>
        </div>
      </div>

      {/* Insight - clean professional display */}
      <div style={{
        marginTop: '16px',
        padding: '12px 16px',
        background: '#FAFAFA',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: '#DC2626',
          flexShrink: 0,
        }} />
        <span style={{ fontSize: '12px', color: '#4B5563', lineHeight: '1.4' }}>
          Zone B at 85% degradation requires immediate attention. Replacement threshold exceeded.
        </span>
      </div>
    </div>
  );
}
