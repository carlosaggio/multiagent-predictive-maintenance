"use client";

import React from 'react';
import { ResponsiveScatterPlot } from '@nivo/scatterplot';

// RPN Risk Matrix Data - aligned with scenarioContext.js
// X-axis: Occurrence (1-10), Y-axis: Severity (1-10), Size: RPN
const riskMatrixData = [
  {
    id: "Critical",
    data: [
      { 
        x: 6,  // Occurrence
        y: 8,  // Severity
        size: 432, // RPN (8×6×9=432)
        label: "Liner Wear",
        detection: 9,
        status: "Active"
      }
    ]
  },
  {
    id: "High",
    data: [
      { 
        x: 5,  // Occurrence
        y: 7,  // Severity
        size: 280, // RPN
        label: "Hard Ore Feed",
        detection: 8,
        status: "Monitoring"
      },
      { 
        x: 4,  // Occurrence
        y: 7,  // Severity
        size: 224, // RPN
        label: "Bearing Degradation",
        detection: 8,
        status: "Monitoring"
      }
    ]
  },
  {
    id: "Medium",
    data: [
      { 
        x: 3,  // Occurrence
        y: 6,  // Severity
        size: 144, // RPN
        label: "Motor Overload",
        detection: 8,
        status: "Watch"
      }
    ]
  }
];

// Custom tooltip
const CustomTooltip = ({ node }) => {
  const data = node.data;
  return (
    <div style={{
      background: 'white',
      padding: '10px 14px',
      borderRadius: '6px',
      boxShadow: '0 3px 12px rgba(0,0,0,0.15)',
      fontSize: '11px',
      minWidth: '160px'
    }}>
      <div style={{ fontWeight: '600', marginBottom: '6px', color: '#1a1a2e' }}>
        {data.label}
      </div>
      <div style={{ display: 'grid', gap: '3px', color: '#4b5563' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>RPN:</span>
          <span style={{ fontWeight: '600', color: node.serieId === 'Critical' ? '#dc2626' : '#f59e0b' }}>
            {data.size}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Severity (S):</span>
          <span>{data.y}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Occurrence (O):</span>
          <span>{data.x}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Detection (D):</span>
          <span>{data.detection}</span>
        </div>
        <div style={{ 
          marginTop: '4px', 
          paddingTop: '4px', 
          borderTop: '1px solid #e5e7eb',
          display: 'flex', 
          justifyContent: 'space-between' 
        }}>
          <span>Status:</span>
          <span style={{ 
            fontWeight: '500',
            color: data.status === 'Active' ? '#dc2626' : data.status === 'Monitoring' ? '#f59e0b' : '#10b981'
          }}>
            {data.status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default function FailureModeAreaBump() {
  return (
    <div style={{
      background: 'white',
      borderRadius: '8px',
      padding: '16px',
      border: '1px solid #e2e8f0'
    }}>
      <div style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '12px'
      }}>
        <div>
          <div style={{ 
            fontSize: '12px', 
            fontWeight: '600', 
            color: '#374151',
            marginBottom: '2px'
          }}>
            FMEA Risk Priority Matrix
          </div>
          <div style={{ 
            fontSize: '10px', 
            color: '#6b7280'
          }}>
            Severity × Occurrence × Detection = RPN
          </div>
        </div>
        <div style={{ 
          display: 'flex', 
          gap: '8px',
          fontSize: '9px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#dc2626' }} />
            <span style={{ color: '#6b7280' }}>Critical</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} />
            <span style={{ color: '#6b7280' }}>High</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fbbf24' }} />
            <span style={{ color: '#6b7280' }}>Medium</span>
          </div>
        </div>
      </div>
      
      <div style={{ height: '180px' }}>
        <ResponsiveScatterPlot
          data={riskMatrixData}
          margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
          xScale={{ type: 'linear', min: 0, max: 10 }}
          yScale={{ type: 'linear', min: 0, max: 10 }}
          nodeSize={node => Math.sqrt(node.data.size) * 1.5}
          colors={['#dc2626', '#f59e0b', '#fbbf24']}
          blendMode="normal"
          enableGridX={true}
          enableGridY={true}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            orient: 'bottom',
            tickSize: 5,
            tickPadding: 5,
            tickValues: [0, 2, 4, 6, 8, 10],
            legend: 'Occurrence (O)',
            legendPosition: 'middle',
            legendOffset: 36
          }}
          axisLeft={{
            orient: 'left',
            tickSize: 5,
            tickPadding: 5,
            tickValues: [0, 2, 4, 6, 8, 10],
            legend: 'Severity (S)',
            legendPosition: 'middle',
            legendOffset: -46
          }}
          tooltip={CustomTooltip}
          theme={{
            fontSize: 10,
            axis: {
              ticks: {
                text: { fill: '#6b7280' }
              },
              legend: {
                text: { 
                  fill: '#374151',
                  fontSize: 10,
                  fontWeight: 500
                }
              }
            },
            grid: {
              line: {
                stroke: '#f0f0f0',
                strokeWidth: 1
              }
            }
          }}
          annotations={[
            {
              type: 'rect',
              match: { serieId: 'Critical' },
              noteX: 20,
              noteY: -10,
              note: 'Liner Wear',
              noteTextOffset: 4
            }
          ]}
        />
      </div>

      {/* Risk Zone Indicator */}
      <div style={{
        marginTop: '8px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '8px',
        fontSize: '10px'
      }}>
        <div style={{ 
          padding: '6px 8px',
          background: 'rgba(220, 38, 38, 0.08)',
          borderRadius: '4px',
          borderLeft: '3px solid #dc2626'
        }}>
          <div style={{ fontWeight: '600', color: '#dc2626' }}>Liner Wear</div>
          <div style={{ color: '#6b7280' }}>RPN 432 • Action Required</div>
        </div>
        <div style={{ 
          padding: '6px 8px',
          background: 'rgba(245, 158, 11, 0.08)',
          borderRadius: '4px',
          borderLeft: '3px solid #f59e0b'
        }}>
          <div style={{ fontWeight: '600', color: '#f59e0b' }}>Hard Ore Feed</div>
          <div style={{ color: '#6b7280' }}>RPN 280 • Monitor</div>
        </div>
        <div style={{ 
          padding: '6px 8px',
          background: 'rgba(251, 191, 36, 0.08)',
          borderRadius: '4px',
          borderLeft: '3px solid #fbbf24'
        }}>
          <div style={{ fontWeight: '600', color: '#d97706' }}>Bearing</div>
          <div style={{ color: '#6b7280' }}>RPN 224 • Watch</div>
        </div>
      </div>
    </div>
  );
}
