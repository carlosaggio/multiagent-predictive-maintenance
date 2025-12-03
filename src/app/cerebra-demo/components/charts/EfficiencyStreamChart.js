"use client";

import React from 'react';
import { ResponsiveStream } from '@nivo/stream';

// Stream chart data showing multiple metrics over time
const streamData = [
  { "Efficiency": 89, "Vibration": 12, "Temperature": 45 },
  { "Efficiency": 88, "Vibration": 14, "Temperature": 47 },
  { "Efficiency": 87, "Vibration": 15, "Temperature": 48 },
  { "Efficiency": 86, "Vibration": 17, "Temperature": 50 },
  { "Efficiency": 85, "Vibration": 18, "Temperature": 52 },
  { "Efficiency": 84, "Vibration": 20, "Temperature": 55 },
  { "Efficiency": 83, "Vibration": 21, "Temperature": 56 },
  { "Efficiency": 82, "Vibration": 22, "Temperature": 58 },
];

export default function EfficiencyStreamChart() {
  return (
    <div style={{
      background: 'white',
      borderRadius: '8px',
      padding: '16px',
      border: '1px solid #e2e8f0'
    }}>
      <div style={{ 
        fontSize: '12px', 
        fontWeight: '600', 
        color: '#374151',
        marginBottom: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <span>Multi-Metric Trend Analysis</span>
        <span style={{ 
          fontSize: '10px', 
          color: '#6b7280',
          fontWeight: '400'
        }}>
          Last 4 weeks
        </span>
      </div>
      
      <div style={{ height: '180px' }}>
        <ResponsiveStream
          data={streamData}
          keys={['Efficiency', 'Vibration', 'Temperature']}
          margin={{ top: 20, right: 20, bottom: 40, left: 50 }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 0,
            tickPadding: 10,
            format: (i) => `W${i + 1}`,
            legend: 'Week',
            legendOffset: 30,
            legendPosition: 'middle'
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 10,
            tickValues: 5,
            legend: 'Normalized Value',
            legendOffset: -40,
            legendPosition: 'middle'
          }}
          offsetType="diverging"
          colors={['#EF4444', '#F59E0B', '#3B82F6']}
          fillOpacity={0.85}
          borderWidth={1}
          borderColor={{ from: 'color', modifiers: [['darker', 0.3]] }}
          enableGridX={false}
          enableGridY={true}
          curve="monotoneX"
          dotSize={0}
          legends={[
            {
              anchor: 'top',
              direction: 'row',
              translateY: -20,
              itemWidth: 90,
              itemHeight: 12,
              itemTextColor: '#6b7280',
              symbolSize: 10,
              symbolShape: 'circle'
            }
          ]}
          theme={{
            fontSize: 10,
            axis: {
              ticks: {
                text: { fill: '#6b7280' }
              },
              legend: {
                text: { fill: '#374151', fontSize: 10 }
              }
            },
            grid: {
              line: { stroke: '#f0f0f0' }
            }
          }}
        />
      </div>

      {/* Key Insights - Bullet format */}
      <div style={{
        marginTop: '12px',
        paddingTop: '12px',
        borderTop: '1px solid #f0f0f0'
      }}>
        <div style={{ fontSize: '10px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
          Key Findings
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {[
            '7% efficiency decline over 4 weeks',
            'Vibration increased 83% (correlates with wear)',
            'Temperature rise 29% indicates friction'
          ].map((point, i) => (
            <div key={i} style={{ 
              fontSize: '11px', 
              color: '#4b5563',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '6px'
            }}>
              <span style={{ color: '#EF4444', fontWeight: '600' }}>•</span>
              {point}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

