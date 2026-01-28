"use client";

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamic import for Nivo Bar
const ResponsiveBar = dynamic(
  () => import('@nivo/bar').then(mod => mod.ResponsiveBar),
  { ssr: false, loading: () => <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading chart...</div> }
);

/**
 * Deviation Waterfall Chart Component
 * 
 * Shows additive impacts on predicted grade.
 * Start at target grade → subtract impacts → arrive at predicted grade.
 */

// Transform data for waterfall visualization
function transformToWaterfall(data) {
  const { targetGrade, deviationSources, predictedGrade } = data;
  
  let runningTotal = targetGrade;
  const bars = [
    {
      label: 'Target Grade',
      value: targetGrade,
      type: 'total',
      runningTotal: targetGrade,
      color: '#A100FF',
    },
  ];

  // Add each deviation source
  deviationSources.forEach(source => {
    runningTotal += source.impact; // impact is negative
    bars.push({
      label: source.location,
      value: source.impact,
      type: source.impact >= 0 ? 'increase' : 'decrease',
      runningTotal,
      confidence: source.confidence,
      evidence: source.evidence,
      color: source.impact >= 0 ? '#10B981' : '#EF4444',
    });
  });

  // Add predicted grade
  bars.push({
    label: 'Predicted Grade',
    value: predictedGrade,
    type: 'total',
    runningTotal: predictedGrade,
    color: predictedGrade >= 62.0 ? '#10B981' : '#EF4444',
  });

  return bars;
}

// Custom bar component with running total line
function CustomBar({ bar, data }) {
  const isTotal = data.type === 'total';
  const startY = isTotal ? bar.y + bar.height : bar.y;
  
  return (
    <g>
      {/* Bar */}
      <rect
        x={bar.x}
        y={bar.y}
        width={bar.width}
        height={bar.height}
        fill={data.color}
        rx={4}
        opacity={0.9}
      />
      
      {/* Value label */}
      <text
        x={bar.x + bar.width / 2}
        y={bar.y - 8}
        textAnchor="middle"
        fontSize={11}
        fontWeight={600}
        fill={data.color}
      >
        {isTotal ? data.value.toFixed(2) + '%' : (data.value >= 0 ? '+' : '') + data.value.toFixed(2) + '%'}
      </text>
    </g>
  );
}

// Evidence panel component
function EvidencePanel({ sources }) {
  return (
    <div style={{
      background: '#F9FAFB',
      borderRadius: '6px',
      padding: '12px',
      marginTop: '12px',
    }}>
      <div style={{ 
        fontSize: '11px', 
        fontWeight: '600', 
        color: '#6B7280',
        marginBottom: '8px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
      }}>
        Deviation Entry Points (Ranked by Confidence)
      </div>
      
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ 
              textAlign: 'left', 
              padding: '6px 8px', 
              fontSize: '10px', 
              color: '#9CA3AF',
              borderBottom: '1px solid #E2E8F0',
            }}>
              Location
            </th>
            <th style={{ 
              textAlign: 'center', 
              padding: '6px 8px', 
              fontSize: '10px', 
              color: '#9CA3AF',
              borderBottom: '1px solid #E2E8F0',
            }}>
              Impact
            </th>
            <th style={{ 
              textAlign: 'center', 
              padding: '6px 8px', 
              fontSize: '10px', 
              color: '#9CA3AF',
              borderBottom: '1px solid #E2E8F0',
            }}>
              Confidence
            </th>
            <th style={{ 
              textAlign: 'left', 
              padding: '6px 8px', 
              fontSize: '10px', 
              color: '#9CA3AF',
              borderBottom: '1px solid #E2E8F0',
            }}>
              Evidence
            </th>
          </tr>
        </thead>
        <tbody>
          {sources
            .sort((a, b) => b.confidence - a.confidence)
            .map((source, idx) => (
            <tr key={idx}>
              <td style={{ 
                padding: '8px', 
                fontSize: '11px', 
                color: '#1A1A2E',
                fontWeight: '500',
              }}>
                {source.location}
              </td>
              <td style={{ 
                padding: '8px', 
                fontSize: '11px', 
                color: source.impact < 0 ? '#EF4444' : '#10B981',
                fontWeight: '600',
                textAlign: 'center',
              }}>
                {source.impact >= 0 ? '+' : ''}{source.impact.toFixed(2)}%
              </td>
              <td style={{ 
                padding: '8px', 
                textAlign: 'center',
              }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}>
                  <div style={{
                    width: '40px',
                    height: '4px',
                    background: '#E5E7EB',
                    borderRadius: '2px',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      width: `${source.confidence * 100}%`,
                      height: '100%',
                      background: source.confidence >= 0.7 ? '#10B981' : '#F59E0B',
                      borderRadius: '2px',
                    }} />
                  </div>
                  <span style={{ fontSize: '10px', color: '#6B7280' }}>
                    {Math.round(source.confidence * 100)}%
                  </span>
                </div>
              </td>
              <td style={{ 
                padding: '8px', 
                fontSize: '11px', 
                color: '#4B5563',
              }}>
                {source.evidence}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function DeviationWaterfall({ 
  data,
  title = 'Grade Deviation Waterfall',
  showEvidence = true,
}) {
  // Default data
  const defaultData = {
    targetGrade: 62.4,
    predictedGrade: 61.2,
    deviationSources: [
      {
        id: 'DEV-01',
        location: 'Pit 3 Zone B',
        type: 'ore_source',
        impact: -0.5,
        confidence: 0.75,
        evidence: 'Lower Fe pocket in BIF-Hard zone',
      },
      {
        id: 'DEV-02',
        location: 'SP-3 Reclaim',
        type: 'blend_drift',
        impact: -0.4,
        confidence: 0.68,
        evidence: 'Unrecorded dozer rehandle mixed grades',
      },
      {
        id: 'DEV-03',
        location: 'Assay Lag',
        type: 'data_lag',
        impact: -0.3,
        confidence: 0.82,
        evidence: '6h assay lag on Pit 3 Zone B samples',
      },
    ],
  };

  const chartData = data || defaultData;
  const waterfallData = transformToWaterfall(chartData);

  // Calculate spec line position
  const specGrade = 62.0;
  const maxValue = Math.max(...waterfallData.map(d => d.type === 'total' ? d.value : d.runningTotal));
  const minValue = Math.min(chartData.predictedGrade - 0.2, 61.0);

  return (
    <div style={{
      background: 'white',
      borderRadius: '8px',
      border: '1px solid #E2E8F0',
      padding: '16px',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '14px', fontWeight: '600', color: '#1A1A2E' }}>
          {title}
        </div>
        <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>
          Impact breakdown: Target {chartData.targetGrade.toFixed(1)}% Fe → Predicted {chartData.predictedGrade.toFixed(1)}% Fe
        </div>
      </div>

      {/* Key takeaways */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '16px',
      }}>
        <div style={{
          flex: 1,
          padding: '10px 12px',
          background: '#FEF2F2',
          borderRadius: '6px',
          borderLeft: '3px solid #EF4444',
        }}>
          <div style={{ fontSize: '10px', color: '#991B1B', marginBottom: '4px' }}>
            Total Deviation
          </div>
          <div style={{ fontSize: '18px', fontWeight: '700', color: '#DC2626' }}>
            -{(chartData.targetGrade - chartData.predictedGrade).toFixed(2)}%
          </div>
        </div>
        <div style={{
          flex: 1,
          padding: '10px 12px',
          background: chartData.predictedGrade >= specGrade ? '#ECFDF5' : '#FEF2F2',
          borderRadius: '6px',
          borderLeft: `3px solid ${chartData.predictedGrade >= specGrade ? '#10B981' : '#EF4444'}`,
        }}>
          <div style={{ 
            fontSize: '10px', 
            color: chartData.predictedGrade >= specGrade ? '#065F46' : '#991B1B', 
            marginBottom: '4px',
          }}>
            Spec Compliance
          </div>
          <div style={{ 
            fontSize: '18px', 
            fontWeight: '700', 
            color: chartData.predictedGrade >= specGrade ? '#059669' : '#DC2626',
          }}>
            {chartData.predictedGrade >= specGrade ? '✓ Met' : '✗ Under-spec'}
          </div>
        </div>
      </div>

      {/* Waterfall chart (simplified visual representation) */}
      <div style={{
        padding: '20px',
        background: '#F9FAFB',
        borderRadius: '8px',
        marginBottom: showEvidence ? '0' : '0',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-around',
          height: '200px',
          position: 'relative',
        }}>
          {/* Spec line */}
          <div style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: `${((specGrade - minValue) / (maxValue - minValue)) * 100}%`,
            borderTop: '2px dashed #6B7280',
            zIndex: 1,
          }}>
            <span style={{
              position: 'absolute',
              right: '8px',
              top: '-16px',
              fontSize: '10px',
              color: '#6B7280',
              background: '#F9FAFB',
              padding: '0 4px',
            }}>
              Spec: {specGrade}%
            </span>
          </div>

          {/* Bars */}
          {waterfallData.map((item, idx) => {
            const isTotal = item.type === 'total';
            const height = isTotal 
              ? ((item.value - minValue) / (maxValue - minValue)) * 100
              : Math.abs(item.value) / (maxValue - minValue) * 100;
            
            const bottom = isTotal
              ? 0
              : ((item.runningTotal - Math.abs(item.value) - minValue) / (maxValue - minValue)) * 100;

            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: `${100 / (waterfallData.length + 1)}%`,
                  position: 'relative',
                }}
              >
                {/* Value label */}
                <div style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  color: item.color,
                  marginBottom: '4px',
                }}>
                  {isTotal ? item.value.toFixed(2) + '%' : (item.value >= 0 ? '+' : '') + item.value.toFixed(1) + '%'}
                </div>
                
                {/* Bar */}
                <div
                  style={{
                    width: '60%',
                    minHeight: '20px',
                    height: `${height}%`,
                    background: item.color,
                    borderRadius: '4px',
                    position: 'absolute',
                    bottom: `${Math.max(bottom, 0)}%`,
                    transition: 'all 0.3s ease',
                  }}
                />
                
                {/* Label */}
                <div style={{
                  position: 'absolute',
                  bottom: '-40px',
                  fontSize: '10px',
                  color: '#6B7280',
                  textAlign: 'center',
                  width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Evidence table */}
      {showEvidence && chartData.deviationSources && (
        <EvidencePanel sources={chartData.deviationSources} />
      )}
    </div>
  );
}

export { EvidencePanel, transformToWaterfall };
