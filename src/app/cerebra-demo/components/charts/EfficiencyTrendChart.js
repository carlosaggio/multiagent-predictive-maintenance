"use client";

import React from 'react';
import { ResponsiveLine } from '@nivo/line';

const efficiencyData = [{
  id: 'Crusher Efficiency',
  color: '#E67E22',
  data: [
    { x: 'Dec 1', y: 89 },
    { x: 'Dec 5', y: 89.2 },
    { x: 'Dec 10', y: 88.5 },
    { x: 'Dec 15', y: 87.8 },
    { x: 'Dec 18', y: 86.2 },
    { x: 'Dec 20', y: 84.5 },
    { x: 'Dec 22', y: 83.8 },
    { x: 'Dec 25', y: 83.2 },
    { x: 'Dec 28', y: 82.5 },
    { x: 'Dec 30', y: 82.0 },
  ]
}];

const customTheme = {
  background: 'transparent',
  textColor: '#4a5568',
  fontSize: 11,
  axis: {
    domain: {
      line: {
        stroke: '#e2e8f0',
        strokeWidth: 1
      }
    },
    ticks: {
      line: {
        stroke: '#e2e8f0',
        strokeWidth: 1
      },
      text: {
        fill: '#718096',
        fontSize: 10
      }
    },
    legend: {
      text: {
        fill: '#4a5568',
        fontSize: 11,
        fontWeight: 600
      }
    }
  },
  grid: {
    line: {
      stroke: '#f0f0f0',
      strokeWidth: 1
    }
  },
  crosshair: {
    line: {
      stroke: '#A100FF',
      strokeWidth: 1,
      strokeOpacity: 0.5
    }
  },
  tooltip: {
    container: {
      background: '#1a1a2e',
      color: 'white',
      fontSize: 11,
      borderRadius: 4,
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
    }
  }
};

export default function EfficiencyTrendChart() {
  return (
    <div style={{ 
      height: '280px', 
      background: 'white', 
      padding: '16px 16px 8px 8px',
      borderRadius: '8px',
      border: '1px solid #e2e8f0'
    }}>
      <div style={{ 
        fontSize: '13px', 
        fontWeight: '600', 
        color: '#1a1a2e',
        marginBottom: '8px',
        paddingLeft: '8px'
      }}>
        Efficiency Trend (Last 30 Days)
      </div>
      <ResponsiveLine
        data={efficiencyData}
        margin={{ top: 20, right: 20, bottom: 50, left: 55 }}
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear', min: 78, max: 92, stacked: false }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -30,
          legend: '',
          legendOffset: 36,
          legendPosition: 'middle'
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Efficiency (%)',
          legendOffset: -45,
          legendPosition: 'middle',
          tickValues: [80, 84, 88, 92]
        }}
        colors={['#E67E22']}
        lineWidth={3}
        pointSize={8}
        pointColor="#E67E22"
        pointBorderWidth={2}
        pointBorderColor="#ffffff"
        enablePointLabel={false}
        enableGridX={false}
        enableGridY={true}
        enableArea={true}
        areaOpacity={0.1}
        useMesh={true}
        theme={customTheme}
        markers={[
          {
            axis: 'y',
            value: 85,
            lineStyle: { 
              stroke: '#EF4444', 
              strokeWidth: 2, 
              strokeDasharray: '6 4' 
            },
            legend: 'Alert Threshold (85%)',
            legendPosition: 'right',
            textStyle: {
              fill: '#EF4444',
              fontSize: 10
            }
          }
        ]}
        legends={[]}
      />
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '24px',
        marginTop: '4px',
        fontSize: '10px',
        color: '#718096'
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '12px', height: '3px', background: '#E67E22', borderRadius: '2px' }}></span>
          Efficiency
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '12px', height: '3px', background: '#EF4444', borderRadius: '2px', borderStyle: 'dashed' }}></span>
          Alert Threshold
        </span>
      </div>
    </div>
  );
}

