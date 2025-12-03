"use client";

import React from 'react';
import { ResponsiveLine } from '@nivo/line';

// Weibull distribution data (β=2.1, η=6 months)
// F(t) = 1 - exp(-(t/η)^β)
const generateWeibullData = () => {
  const beta = 2.1;
  const eta = 6;
  const points = [];
  
  for (let t = 0; t <= 10; t += 0.5) {
    const probability = 1 - Math.exp(-Math.pow(t / eta, beta));
    points.push({ x: t, y: probability * 100 });
  }
  return points;
};

const weibullData = [
  {
    id: "Failure Probability",
    data: generateWeibullData()
  }
];

// Current position marker (8 months since May 2024 replacement)
const currentTime = 8;
const currentProbability = (1 - Math.exp(-Math.pow(currentTime / 6, 2.1))) * 100;

export default function WeibullChart() {
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
        marginBottom: '4px'
      }}>
        Weibull Reliability Analysis
      </div>
      <div style={{ 
        fontSize: '10px', 
        color: '#6b7280',
        marginBottom: '12px'
      }}>
        β = 2.1 (wear-out failure) | η = 6 months
      </div>
      
      <div style={{ height: '180px' }}>
        <ResponsiveLine
          data={weibullData}
          margin={{ top: 20, right: 20, bottom: 45, left: 55 }}
          xScale={{ type: 'linear', min: 0, max: 10 }}
          yScale={{ type: 'linear', min: 0, max: 100 }}
          curve="natural"
          axisBottom={{
            tickSize: 0,
            tickPadding: 10,
            tickValues: [0, 2, 4, 6, 8, 10],
            legend: 'Time (months)',
            legendOffset: 35,
            legendPosition: 'middle'
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 10,
            tickValues: [0, 25, 50, 75, 100],
            format: v => `${v}%`,
            legend: 'Failure Probability',
            legendOffset: -45,
            legendPosition: 'middle'
          }}
          colors={['#8B5CF6']}
          lineWidth={3}
          enableArea={true}
          areaOpacity={0.15}
          enablePoints={false}
          enableGridX={false}
          enableGridY={true}
          useMesh={true}
          markers={[
            {
              axis: 'x',
              value: currentTime,
              lineStyle: { stroke: '#EF4444', strokeWidth: 2, strokeDasharray: '6 4' },
              legend: 'Current',
              legendPosition: 'top',
              textStyle: { fill: '#EF4444', fontSize: 10, fontWeight: 600 }
            },
            {
              axis: 'y',
              value: currentProbability,
              lineStyle: { stroke: '#EF4444', strokeWidth: 1, strokeDasharray: '3 3' },
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
            },
            crosshair: {
              line: { stroke: '#8B5CF6', strokeWidth: 1 }
            }
          }}
          tooltip={({ point }) => (
            <div style={{
              background: '#1a1a2e',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '4px',
              fontSize: '11px'
            }}>
              <strong>{point.data.x} months</strong>: {point.data.y.toFixed(1)}% probability
            </div>
          )}
        />
      </div>

      {/* Current Status Indicator */}
      <div style={{
        marginTop: '12px',
        padding: '10px 12px',
        background: '#FEF2F2',
        borderRadius: '6px',
        borderLeft: '3px solid #EF4444'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '10px', color: '#991B1B', fontWeight: '600' }}>
              Current: 8 months (133% of 6-month lifecycle)
            </div>
            <div style={{ fontSize: '11px', color: '#7F1D1D', marginTop: '2px' }}>
              Cumulative failure probability: <strong>{currentProbability.toFixed(1)}%</strong>
            </div>
          </div>
          <div style={{
            background: '#EF4444',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '10px',
            fontWeight: '600'
          }}>
            CRITICAL
          </div>
        </div>
      </div>
    </div>
  );
}

