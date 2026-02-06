"use client";

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { waioReconciliation } from '../../../data/waio/waioScenarioContext';
import { LoadingSpinner, progressiveLoaderStyles } from '../../../utils/progressiveLoader';

// Dynamic imports for Nivo charts
const ResponsiveHeatMap = dynamic(
  () => import('@nivo/heatmap').then(mod => mod.ResponsiveHeatMap),
  { ssr: false, loading: () => <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF' }}>Loading heatmap...</div> }
);

const ResponsiveBar = dynamic(
  () => import('@nivo/bar').then(mod => mod.ResponsiveBar),
  { ssr: false, loading: () => <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF' }}>Loading chart...</div> }
);

/**
 * WAIO Reconciliation Stage Component
 * 
 * Enhanced version with professional Nivo heatmap visualization.
 */

// Icons
const Icons = {
  table: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/></svg>,
  heatmap: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  trend: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  alert: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
};

// Heatmap data formatted for Nivo
const complianceHeatmapData = [
  { id: "Day 1", data: [{ x: "Pit→SP", y: 92 }, { x: "SP→Train", y: 88 }, { x: "Train→Port", y: 95 }, { x: "Port Load", y: 91 }] },
  { id: "Day 2", data: [{ x: "Pit→SP", y: 85 }, { x: "SP→Train", y: 82 }, { x: "Train→Port", y: 90 }, { x: "Port Load", y: 88 }] },
  { id: "Day 3", data: [{ x: "Pit→SP", y: 78 }, { x: "SP→Train", y: 75 }, { x: "Train→Port", y: 85 }, { x: "Port Load", y: 82 }] },
  { id: "Day 4", data: [{ x: "Pit→SP", y: 88 }, { x: "SP→Train", y: 85 }, { x: "Train→Port", y: 92 }, { x: "Port Load", y: 90 }] },
  { id: "Day 5", data: [{ x: "Pit→SP", y: 82 }, { x: "SP→Train", y: 79 }, { x: "Train→Port", y: 88 }, { x: "Port Load", y: 85 }] },
  { id: "Day 6", data: [{ x: "Pit→SP", y: 90 }, { x: "SP→Train", y: 87 }, { x: "Train→Port", y: 93 }, { x: "Port Load", y: 91 }] },
  { id: "Day 7", data: [{ x: "Pit→SP", y: 85 }, { x: "SP→Train", y: 83 }, { x: "Train→Port", y: 89 }, { x: "Port Load", y: 87 }] },
];

// Deviation frequency data for Nivo
const deviationFrequencyData = [
  { id: "06:00", data: [{ x: "Blend Drift", y: 2 }, { x: "Assay Lag", y: 1 }, { x: "Equipment", y: 0 }, { x: "Dispatch", y: 1 }, { x: "Weather", y: 0 }] },
  { id: "10:00", data: [{ x: "Blend Drift", y: 3 }, { x: "Assay Lag", y: 2 }, { x: "Equipment", y: 1 }, { x: "Dispatch", y: 0 }, { x: "Weather", y: 0 }] },
  { id: "14:00", data: [{ x: "Blend Drift", y: 4 }, { x: "Assay Lag", y: 3 }, { x: "Equipment", y: 2 }, { x: "Dispatch", y: 1 }, { x: "Weather", y: 1 }] },
  { id: "18:00", data: [{ x: "Blend Drift", y: 2 }, { x: "Assay Lag", y: 2 }, { x: "Equipment", y: 1 }, { x: "Dispatch", y: 2 }, { x: "Weather", y: 0 }] },
  { id: "22:00", data: [{ x: "Blend Drift", y: 1 }, { x: "Assay Lag", y: 1 }, { x: "Equipment", y: 0 }, { x: "Dispatch", y: 1 }, { x: "Weather", y: 0 }] },
];

// Color scales
const getComplianceColor = (value) => {
  if (value >= 90) return '#059669';
  if (value >= 85) return '#10B981';
  if (value >= 80) return '#FBBF24';
  if (value >= 75) return '#F97316';
  return '#DC2626';
};

const getDeviationColor = (value) => {
  if (value === 0) return '#F0FDF4';
  if (value === 1) return '#FEF3C7';
  if (value === 2) return '#FBBF24';
  if (value === 3) return '#F97316';
  return '#DC2626';
};

// Tab button component
function Tab({ label, isActive, onClick, icon }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 14px',
        background: isActive ? '#A100FF' : 'transparent',
        color: isActive ? 'white' : '#6B7280',
        border: isActive ? 'none' : '1px solid #E2E8F0',
        borderRadius: '6px',
        fontSize: '11px',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}
    >
      {icon}
      {label}
    </button>
  );
}

// Plan vs Actual visualization panel with dynamic charts
// Uses Nivo Bullet and Bar charts similar to maintenance workflows
function PlanVsActualPanel({ data }) {
  if (!data || data.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>
        No plan vs actual data available
      </div>
    );
  }
  // Transform data for Grouped Bar Chart (better for small percentage differences)
  const gradeData = data
    .filter(row => row.unit === '%' && row.metric.includes('Grade'))
    .map(row => ({
      id: row.metric.replace(' Fe Grade', ''),
      planned: row.planned,
      actual: row.actual,
      variance: row.variance,
      status: row.status,
    }));

  // Prepare data for grouped bar chart
  const groupedBarData = gradeData.map(item => ({
    metric: item.id,
    'Planned': item.planned,
    'Actual': item.actual,
  }));

  // Transform data for Bar Chart (variance visualization)
  // Use full metric names but prepare for better label handling
  const barData = data.map(row => {
    const variancePercent = row.unit === '%' 
      ? row.variance 
      : row.planned > 0 
        ? ((row.variance / row.planned) * 100) 
        : 0;
    
    return {
      metric: row.metric, // Keep full name for tooltip
      metricShort: row.metric.length > 15 ? row.metric.substring(0, 15) + '...' : row.metric, // Short for axis
      variance: variancePercent,
      status: row.status,
      fullData: row, // Keep reference to original data
    };
  });

  // Calculate summary stats
  const totalVariance = data.reduce((sum, row) => {
    if (row.unit === 't') {
      return sum + (row.actual - row.planned);
    }
    return sum;
  }, 0);

  const onTargetCount = data.filter(row => row.status === 'good').length;
  const warningCount = data.filter(row => row.status === 'warning').length;
  const criticalCount = data.filter(row => row.status === 'critical').length;

  return (
    <div>
      {/* Summary Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: '12px', 
        marginBottom: '20px' 
      }}>
        <div style={{ 
          padding: '12px', 
          background: 'white', 
          borderRadius: '8px', 
          border: '1px solid #E2E8F0',
        }}>
          <div style={{ fontSize: '10px', color: '#6B7280', marginBottom: '4px' }}>Total Variance</div>
          <div style={{ fontSize: '18px', fontWeight: '700', color: totalVariance < 0 ? '#EF4444' : '#10B981' }}>
            {totalVariance > 0 ? '+' : ''}{totalVariance.toLocaleString()}t
          </div>
        </div>
        <div style={{ 
          padding: '12px', 
          background: 'white', 
          borderRadius: '8px', 
          border: '1px solid #E2E8F0',
        }}>
          <div style={{ fontSize: '10px', color: '#6B7280', marginBottom: '4px' }}>On Target</div>
          <div style={{ fontSize: '18px', fontWeight: '700', color: '#10B981' }}>{onTargetCount}</div>
        </div>
        <div style={{ 
          padding: '12px', 
          background: 'white', 
          borderRadius: '8px', 
          border: '1px solid #E2E8F0',
        }}>
          <div style={{ fontSize: '10px', color: '#6B7280', marginBottom: '4px' }}>Warnings</div>
          <div style={{ fontSize: '18px', fontWeight: '700', color: '#F59E0B' }}>{warningCount}</div>
        </div>
        <div style={{ 
          padding: '12px', 
          background: 'white', 
          borderRadius: '8px', 
          border: '1px solid #E2E8F0',
        }}>
          <div style={{ fontSize: '10px', color: '#6B7280', marginBottom: '4px' }}>Critical</div>
          <div style={{ fontSize: '18px', fontWeight: '700', color: '#EF4444' }}>{criticalCount}</div>
        </div>
      </div>

      {/* Grade Metrics - Grouped Bar Chart (better for small differences) */}
      {gradeData.length > 0 && (
        <div style={{
          background: 'white',
          borderRadius: '8px',
          border: '1px solid #E2E8F0',
          padding: '16px',
          marginBottom: '20px',
        }}>
          <div style={{
            fontSize: '13px',
            fontWeight: '600',
            color: '#1A1A2E',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
              <line x1="12" y1="20" x2="12" y2="10"/>
              <line x1="18" y1="20" x2="18" y2="4"/>
              <line x1="6" y1="20" x2="6" y2="16"/>
            </svg>
            Fe Grade Performance (Plan vs Actual)
          </div>
          
          <div style={{ height: '220px' }}>
            <ResponsiveBar
              data={groupedBarData}
              keys={['Planned', 'Actual']}
              indexBy="metric"
              margin={{ top: 20, right: 30, bottom: 50, left: 60 }}
              padding={0.3}
              groupMode="grouped"
              valueScale={{ type: 'linear', min: Math.min(...gradeData.map(d => Math.min(d.planned, d.actual))) - 0.5, max: Math.max(...gradeData.map(d => Math.max(d.planned, d.actual))) + 0.5 }}
              indexScale={{ type: 'band', round: true }}
              colors={['#A100FF', '#3B82F6']}
              borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Train',
                legendPosition: 'middle',
                legendOffset: 40,
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Fe Grade (%)',
                legendPosition: 'middle',
                legendOffset: -45,
                format: (value) => value.toFixed(2),
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor="#ffffff"
              animate={true}
              motionConfig="gentle"
              tooltip={({ id, value, indexValue }) => {
                const gradeItem = gradeData.find(d => d.id === indexValue);
                return (
                  <div style={{
                    background: 'white',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    fontSize: '11px',
                  }}>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>{indexValue}</div>
                    <div>{id}: {value.toFixed(2)}%</div>
                    {gradeItem && (
                      <div style={{ color: '#6B7280', marginTop: '2px', fontSize: '10px' }}>
                        Variance: {gradeItem.variance > 0 ? '+' : ''}{gradeItem.variance.toFixed(2)}pp
                      </div>
                    )}
                  </div>
                );
              }}
            />
          </div>
          
          {/* Comparison Table for Exact Values */}
          <div style={{
            marginTop: '16px',
            padding: '12px',
            background: '#F9FAFB',
            borderRadius: '6px',
            border: '1px solid #E2E8F0',
          }}>
            <div style={{ fontSize: '11px', fontWeight: '600', color: '#6B7280', marginBottom: '8px', textTransform: 'uppercase' }}>
              Detailed Comparison
            </div>
            {gradeData.map((item, idx) => (
              <div key={idx} style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr 1fr 1fr',
                gap: '12px',
                padding: '8px 0',
                borderBottom: idx < gradeData.length - 1 ? '1px solid #E2E8F0' : 'none',
                fontSize: '12px',
              }}>
                <div style={{ fontWeight: '600', color: '#1A1A2E' }}>{item.id}</div>
                <div>
                  <div style={{ fontSize: '10px', color: '#6B7280' }}>Planned</div>
                  <div style={{ fontWeight: '600', color: '#A100FF' }}>{item.planned.toFixed(2)}%</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: '#6B7280' }}>Actual</div>
                  <div style={{ fontWeight: '600', color: '#3B82F6' }}>{item.actual.toFixed(2)}%</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: '#6B7280' }}>Variance</div>
                  <div style={{ 
                    fontWeight: '600', 
                    color: item.variance === 0 ? '#6B7280' : item.variance > 0 ? '#10B981' : '#EF4444'
                  }}>
                    {item.variance > 0 ? '+' : ''}{item.variance.toFixed(2)}pp
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            marginTop: '12px',
            paddingTop: '12px',
            borderTop: '1px solid #F0F0F0',
            fontSize: '11px',
            color: '#6B7280',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '12px', background: '#A100FF', borderRadius: '2px' }} />
              Planned
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '12px', background: '#3B82F6', borderRadius: '2px' }} />
              Actual
            </div>
          </div>
        </div>
      )}

      {/* Variance Bar Chart */}
      <div style={{
        background: 'white',
        borderRadius: '8px',
        border: '1px solid #E2E8F0',
        padding: '16px',
        marginBottom: '20px',
      }}>
        <div style={{
          fontSize: '13px',
          fontWeight: '600',
          color: '#1A1A2E',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2">
            <polyline points="22 6 13.5 14.5 8.5 9.5 2 18"/>
            <polyline points="16 6 22 6 22 12"/>
          </svg>
          Variance Analysis (% Deviation from Plan)
        </div>
        
        <div style={{ height: '320px' }}>
          <ResponsiveBar
            data={barData}
            keys={['variance']}
            indexBy="metricShort"
            margin={{ top: 20, right: 30, bottom: 100, left: 70 }}
            padding={0.5}
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            colors={(d) => {
              const item = barData.find(b => b.metricShort === d.indexValue);
              const status = item?.status;
              return status === 'good' ? '#10B981' : status === 'warning' ? '#F59E0B' : '#EF4444';
            }}
            borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 8,
              tickRotation: -45,
              legend: 'Metric',
              legendPosition: 'middle',
              legendOffset: 80,
              format: (value) => {
                // Ensure labels don't overflow
                const item = barData.find(b => b.metricShort === value);
                return item?.metricShort || value;
              },
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Variance (%)',
              legendPosition: 'middle',
              legendOffset: -50,
              format: (value) => {
                // Format small percentages better
                if (Math.abs(value) < 1) {
                  return value.toFixed(3);
                }
                return value.toFixed(1);
              },
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor="#ffffff"
            animate={true}
            motionConfig="gentle"
            tooltip={({ value, indexValue }) => {
              const item = barData.find(b => b.metricShort === indexValue);
              const row = item?.fullData;
              return (
                <div style={{
                  background: 'white',
                  padding: '10px 14px',
                  borderRadius: '6px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  fontSize: '11px',
                  maxWidth: '300px',
                }}>
                  <div style={{ fontWeight: '600', marginBottom: '6px', color: '#1A1A2E' }}>
                    {row?.metric || indexValue}
                  </div>
                  <div style={{ marginBottom: '4px' }}>
                    <span style={{ color: '#6B7280' }}>Variance: </span>
                    <span style={{ fontWeight: '600', color: value > 0 ? '#10B981' : value < 0 ? '#EF4444' : '#6B7280' }}>
                      {value > 0 ? '+' : ''}{value.toFixed(2)}%
                    </span>
                  </div>
                  {row && (
                    <div style={{ color: '#6B7280', marginTop: '4px', paddingTop: '4px', borderTop: '1px solid #F0F0F0', fontSize: '10px' }}>
                      <div>Planned: <strong>{typeof row.planned === 'number' ? row.planned.toLocaleString() : row.planned}{row.unit || ''}</strong></div>
                      <div>Actual: <strong>{typeof row.actual === 'number' ? row.actual.toLocaleString() : row.actual}{row.unit || ''}</strong></div>
                    </div>
                  )}
                </div>
              );
            }}
          />
        </div>
        
        {/* Full metric names below chart for reference */}
        <div style={{
          marginTop: '12px',
          padding: '10px',
          background: '#F9FAFB',
          borderRadius: '6px',
          fontSize: '10px',
          color: '#6B7280',
        }}>
          <div style={{ fontWeight: '600', marginBottom: '6px', color: '#4B5563' }}>Full Metric Names:</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {barData.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ 
                  width: '8px', 
                  height: '8px', 
                  borderRadius: '2px',
                  background: item.status === 'good' ? '#10B981' : item.status === 'warning' ? '#F59E0B' : '#EF4444',
                }} />
                <span>{item.metric}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Table View (Compact) */}
      <div style={{
        background: 'white',
        borderRadius: '8px',
        border: '1px solid #E2E8F0',
        overflow: 'hidden',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 100px 100px 90px',
          gap: '12px',
          padding: '10px 16px',
          background: '#F9FAFB',
          borderBottom: '1px solid #E2E8F0',
          fontSize: '10px',
          fontWeight: '700',
          color: '#6B7280',
          textTransform: 'uppercase',
        }}>
          <span>Metric</span>
          <span style={{ textAlign: 'right' }}>Planned</span>
          <span style={{ textAlign: 'right' }}>Actual</span>
          <span style={{ textAlign: 'center' }}>Variance</span>
        </div>
        {data.map((row, idx) => {
          const statusColors = { good: '#10B981', warning: '#F59E0B', critical: '#EF4444' };
          const color = statusColors[row.status] || '#6B7280';
          const varianceDisplay = row.variance > 0 ? `+${row.variance.toFixed(1)}` : row.variance.toFixed(1);
          const formatValue = (val) => typeof val === 'number' ? val.toLocaleString() : val;

          return (
            <div
              key={idx}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 100px 100px 90px',
                gap: '12px',
                padding: '10px 16px',
                background: idx % 2 === 0 ? 'white' : '#FAFAFA',
                borderBottom: idx < data.length - 1 ? '1px solid #F0F0F0' : 'none',
                alignItems: 'center',
                fontSize: '12px',
              }}
            >
              <span style={{ fontWeight: '500', color: '#1A1A2E' }}>{row.metric}</span>
              <span style={{ color: '#6B7280', textAlign: 'right' }}>
                {formatValue(row.planned)}{row.unit ? ` ${row.unit}` : ''}
              </span>
              <span style={{ fontWeight: '600', color: color, textAlign: 'right' }}>
                {formatValue(row.actual)}{row.unit ? ` ${row.unit}` : ''}
              </span>
              <span style={{
                fontSize: '10px',
                fontWeight: '700',
                color: 'white',
                background: color,
                padding: '3px 8px',
                borderRadius: '4px',
                textAlign: 'center',
              }}>
                {varianceDisplay}{row.unit === '%' ? 'pp' : '%'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Compliance Heatmap Component using Nivo
function ComplianceHeatmapPanel({ onCellClick }) {
  const [hoveredCell, setHoveredCell] = useState(null);
  
  return (
    <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #E2E8F0', padding: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#1A1A2E' }}>Compliance by Boundary Point</div>
          <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>7-day rolling compliance % at each transition</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: '#FEF2F2', borderRadius: '6px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444' }} />
          <span style={{ fontSize: '10px', color: '#991B1B', fontWeight: '600' }}>2 Below Target</span>
        </div>
      </div>
      
      <div style={{ height: '220px' }}>
        <ResponsiveHeatMap
          data={complianceHeatmapData}
          margin={{ top: 10, right: 30, bottom: 50, left: 60 }}
          valueFormat=">-.0f"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 0,
            tickPadding: 10,
            tickRotation: -30,
            legend: 'Boundary Point',
            legendPosition: 'middle',
            legendOffset: 40,
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 10,
            tickRotation: 0,
            legend: '',
            legendPosition: 'middle',
            legendOffset: -50,
          }}
          colors={(cell) => getComplianceColor(cell.value)}
          emptyColor="#f5f5f5"
          borderColor="#ffffff"
          borderWidth={3}
          borderRadius={4}
          labelTextColor="#ffffff"
          label={(cell) => `${cell.value}%`}
          legends={[]}
          animate={true}
          motionConfig="gentle"
          hoverTarget="cell"
          cellOpacity={1}
          cellHoverOpacity={0.85}
          cellHoverOthersOpacity={0.5}
          onMouseEnter={(cell) => setHoveredCell(cell)}
          onMouseLeave={() => setHoveredCell(null)}
          onClick={(cell) => onCellClick?.(cell)}
        />
      </div>
      
      {/* Legend */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #F0F0F0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '14px', height: '14px', borderRadius: '3px', background: '#059669' }} />
          <span style={{ fontSize: '10px', color: '#6B7280' }}>≥90% Excellent</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '14px', height: '14px', borderRadius: '3px', background: '#10B981' }} />
          <span style={{ fontSize: '10px', color: '#6B7280' }}>85-89% Good</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '14px', height: '14px', borderRadius: '3px', background: '#FBBF24' }} />
          <span style={{ fontSize: '10px', color: '#6B7280' }}>80-84% Warning</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '14px', height: '14px', borderRadius: '3px', background: '#F97316' }} />
          <span style={{ fontSize: '10px', color: '#6B7280' }}>75-79% At Risk</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '14px', height: '14px', borderRadius: '3px', background: '#DC2626' }} />
          <span style={{ fontSize: '10px', color: '#6B7280' }}>&lt;75% Critical</span>
        </div>
      </div>

      {hoveredCell && (
        <div style={{ marginTop: '12px', padding: '10px 14px', background: '#F9FAFB', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: getComplianceColor(hoveredCell.value) }} />
          <span style={{ fontSize: '12px', color: '#4B5563' }}>
            <strong>{hoveredCell.serieId}</strong> at <strong>{hoveredCell.data.x}</strong>: {hoveredCell.value}% compliance
            {hoveredCell.value < 85 && <span style={{ color: '#DC2626' }}> — Below target</span>}
          </span>
        </div>
      )}
    </div>
  );
}

// Deviation Frequency Heatmap Component
function DeviationFrequencyPanel() {
  const [hoveredCell, setHoveredCell] = useState(null);
  
  return (
    <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #E2E8F0', padding: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#1A1A2E' }}>Deviation Frequency by Time</div>
          <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>Occurrences per cause category (last 14 days)</div>
        </div>
      </div>
      
      <div style={{ height: '200px' }}>
        <ResponsiveHeatMap
          data={deviationFrequencyData}
          margin={{ top: 10, right: 20, bottom: 50, left: 60 }}
          valueFormat=">-.0f"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 0,
            tickPadding: 10,
            tickRotation: -30,
            legend: 'Cause Category',
            legendPosition: 'middle',
            legendOffset: 40,
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 10,
            tickRotation: 0,
          }}
          colors={(cell) => getDeviationColor(cell.value)}
          emptyColor="#F0FDF4"
          borderColor="#ffffff"
          borderWidth={3}
          borderRadius={4}
          labelTextColor={(cell) => cell.value >= 3 ? '#ffffff' : '#374151'}
          label={(cell) => cell.value > 0 ? cell.value : ''}
          legends={[]}
          animate={true}
          motionConfig="gentle"
          hoverTarget="cell"
          cellOpacity={1}
          cellHoverOpacity={0.85}
          onMouseEnter={(cell) => setHoveredCell(cell)}
          onMouseLeave={() => setHoveredCell(null)}
        />
      </div>
      
      {/* Legend */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #F0F0F0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '14px', height: '14px', borderRadius: '3px', background: '#F0FDF4', border: '1px solid #E2E8F0' }} />
          <span style={{ fontSize: '10px', color: '#6B7280' }}>0 None</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '14px', height: '14px', borderRadius: '3px', background: '#FEF3C7' }} />
          <span style={{ fontSize: '10px', color: '#6B7280' }}>1 Low</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '14px', height: '14px', borderRadius: '3px', background: '#FBBF24' }} />
          <span style={{ fontSize: '10px', color: '#6B7280' }}>2 Medium</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '14px', height: '14px', borderRadius: '3px', background: '#F97316' }} />
          <span style={{ fontSize: '10px', color: '#6B7280' }}>3 High</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '14px', height: '14px', borderRadius: '3px', background: '#DC2626' }} />
          <span style={{ fontSize: '10px', color: '#6B7280' }}>4+ Critical</span>
        </div>
      </div>

      {hoveredCell && (
        <div style={{ marginTop: '12px', padding: '10px 14px', background: '#F9FAFB', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: getDeviationColor(hoveredCell.value) }} />
          <span style={{ fontSize: '12px', color: '#4B5563' }}>
            <strong>{hoveredCell.serieId}</strong> — <strong>{hoveredCell.data.x}</strong>: {hoveredCell.value} occurrence{hoveredCell.value !== 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  );
}

// Repeat driver card - enhanced
function RepeatDriverCard({ driver, rank }) {
  // Subtle, professional color scheme
  const impactBorderColors = { 
    High: '#DC2626',      // Subtle red
    Medium: '#D97706',    // Subtle orange
    Low: '#059669'        // Subtle green
  };
  
  const impactBadgeColors = {
    High: { bg: '#FEF2F2', text: '#991B1B', border: '#FECACA' },
    Medium: { bg: '#FFFBEB', text: '#92400E', border: '#FDE68A' },
    Low: { bg: '#F0FDF4', text: '#166534', border: '#BBF7D0' }
  };

  const badgeStyle = impactBadgeColors[driver.impact] || impactBadgeColors.Medium;
  const borderColor = impactBorderColors[driver.impact] || '#6B7280';

  return (
    <div style={{
      padding: '14px 16px',
      background: 'white',
      border: '1px solid #E2E8F0',
      borderLeft: `3px solid ${borderColor}`,
      borderRadius: '8px',
      marginBottom: '10px',
      transition: 'all 0.2s ease',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            width: '24px',
            height: '24px',
            borderRadius: '4px',
            background: '#F9FAFB',
            border: '1px solid #E2E8F0',
            color: '#1A1A2E',
            fontSize: '11px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            #{rank}
          </span>
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#1A1A2E' }}>{driver.pattern}</span>
        </div>
        <span style={{
          fontSize: '10px',
          fontWeight: '600',
          padding: '4px 10px',
          borderRadius: '4px',
          background: badgeStyle.bg,
          color: badgeStyle.text,
          border: `1px solid ${badgeStyle.border}`,
        }}>
          {driver.impact} Impact
        </span>
      </div>
      
      <div style={{ display: 'flex', gap: '16px', marginBottom: '12px', fontSize: '11px', flexWrap: 'wrap' }}>
        <span style={{ color: '#6B7280' }}>
          Frequency: <strong style={{ color: '#1A1A2E' }}>{driver.frequency}</strong>
        </span>
        <span style={{ color: '#6B7280' }}>
          Trend: <strong style={{ 
            color: driver.trend === 'increasing' ? '#DC2626' : driver.trend === 'decreasing' ? '#059669' : '#6B7280'
          }}>
            {driver.trend || 'stable'}
          </strong>
        </span>
      </div>
      
      <div style={{ 
        fontSize: '12px', 
        color: '#4B5563', 
        marginBottom: '12px', 
        lineHeight: '1.5',
        paddingLeft: '4px',
      }}>
        <span style={{ fontWeight: '600', color: '#1A1A2E' }}>Root cause:</span> {driver.rootCause}
      </div>
      
      <div style={{ 
        fontSize: '12px', 
        color: '#1A1A2E', 
        background: '#F9FAFB', 
        border: '1px solid #E2E8F0',
        padding: '12px 14px', 
        borderRadius: '6px',
        borderLeft: '3px solid #6366F1',
      }}>
        <span style={{ fontWeight: '600', color: '#4B5563', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Recommendation:
        </span>
        <div style={{ marginTop: '4px', color: '#1A1A2E', lineHeight: '1.5' }}>
          {driver.recommendation}
        </div>
      </div>
    </div>
  );
}

// Professional insight card - clean, minimal design
function InsightCard({ text, type = 'info', index }) {
  // Parse insight text to extract key metrics and structure
  const parseInsight = (text) => {
    // Extract dollar amounts
    const dollarMatch = text.match(/\$[\d.]+k?/i);
    const dollarValue = dollarMatch ? dollarMatch[0] : null;
    
    // Extract percentages
    const percentMatches = text.match(/(\d+)%/g);
    const percentages = percentMatches || [];
    
    // Determine category from keywords
    let category = 'insight';
    let icon = Icons.trend;
    let borderColor = '#6366F1';
    
    if (text.toLowerCase().includes('risk avoided') || text.toLowerCase().includes('penalty avoided') || dollarValue) {
      category = 'success';
      icon = (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      );
      borderColor = '#10B981';
    } else if (text.toLowerCase().includes('recommendation') || text.toLowerCase().includes('retrofit')) {
      category = 'action';
      icon = (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
      );
      borderColor = '#A100FF';
    } else if (text.toLowerCase().includes('pattern') || text.toLowerCase().includes('repeat')) {
      category = 'pattern';
      icon = (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
      );
      borderColor = '#8B5CF6';
    } else if (text.toLowerCase().includes('driven by') || percentages.length > 0) {
      category = 'analysis';
      icon = (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="20" x2="12" y2="10"/>
          <line x1="18" y1="20" x2="18" y2="4"/>
          <line x1="6" y1="20" x2="6" y2="16"/>
        </svg>
      );
      borderColor = '#3B82F6';
    }

    return { dollarValue, percentages, category, icon, borderColor };
  };

  const parsed = parseInsight(text);

  return (
    <div style={{
      padding: '10px 12px',
      background: 'white',
      borderRadius: '6px',
      marginBottom: '6px',
      border: '1px solid #E2E8F0',
      borderLeft: `3px solid ${parsed.borderColor}`,
      display: 'flex',
      alignItems: 'flex-start',
      gap: '10px',
      transition: 'all 0.2s ease',
    }}>
      <div style={{ 
        marginTop: '1px',
        color: parsed.borderColor,
        flexShrink: 0,
      }}>
        {parsed.icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ 
          fontSize: '12px', 
          color: '#1A1A2E', 
          lineHeight: '1.5',
        }}>
          {text.split(/(\$[\d.]+k?|\d+%)/gi).map((part, i) => {
            if (part.match(/\$[\d.]+k?/i)) {
              return (
                <span key={i} style={{ 
                  fontWeight: '600', 
                  color: '#10B981',
                  background: '#ECFDF5',
                  padding: '2px 5px',
                  borderRadius: '3px',
                  margin: '0 2px',
                }}>
                  {part}
                </span>
              );
            }
            if (part.match(/\d+%/)) {
              return (
                <span key={i} style={{ 
                  fontWeight: '600', 
                  color: '#3B82F6',
                }}>
                  {part}
                </span>
              );
            }
            return <span key={i}>{part}</span>;
          })}
        </div>
      </div>
    </div>
  );
}

// Reconciliation loading indicator
function ReconciliationLoadingIndicator({ step }) {
  const steps = [
    'Loading shift data...',
    'Comparing plan vs actual...',
    'Analyzing compliance metrics...',
    'Identifying repeat patterns...',
    'Generating insights...',
  ];
  
  return (
    <div style={{
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px',
    }}>
      <LoadingSpinner size={32} />
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '14px', fontWeight: '600', color: '#1A1A2E', marginBottom: '6px' }}>
          Reconciling Shift Performance
        </div>
        <div style={{ fontSize: '12px', color: '#6B7280' }}>
          {steps[step] || steps[0]}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        {steps.map((_, idx) => (
          <div
            key={idx}
            style={{
              width: '32px',
              height: '4px',
              borderRadius: '2px',
              background: idx <= step ? '#A100FF' : '#E2E8F0',
              transition: 'background 0.3s ease',
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function WAIOReconciliationStage({ onComplete, onOpenGraph }) {
  const [activeTab, setActiveTab] = useState('heatmap');
  const hasCompletedRef = useRef(false);

  const data = waioReconciliation;
  
  // Progressive loading states
  const [loadingStep, setLoadingStep] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [showHeader, setShowHeader] = useState(false);
  const [showKPIs, setShowKPIs] = useState(false);
  const [showTabs, setShowTabs] = useState(false);
  const [showTabContent, setShowTabContent] = useState(false);
  const [showInsights, setShowInsights] = useState(false);

  // Progressive loading sequence
  useEffect(() => {
    const timers = [
      setTimeout(() => setLoadingStep(1), 400),
      setTimeout(() => setLoadingStep(2), 800),
      setTimeout(() => setLoadingStep(3), 1200),
      setTimeout(() => setLoadingStep(4), 1600),
      setTimeout(() => { setShowContent(true); setShowHeader(true); }, 2000),
      setTimeout(() => setShowKPIs(true), 2300),
      setTimeout(() => setShowTabs(true), 2600),
      setTimeout(() => setShowTabContent(true), 2900),
      setTimeout(() => setShowInsights(true), 3200),
    ];
    
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  // Completion trigger
  useEffect(() => {
    if (showInsights && !hasCompletedRef.current) {
      hasCompletedRef.current = true;
      setTimeout(() => onComplete?.(), 500);
    }
  }, [showInsights, onComplete]);

  const tabs = [
    { id: 'heatmap', label: 'Compliance Heatmap', icon: Icons.heatmap },
    { id: 'planVsActual', label: 'Plan vs Actual', icon: Icons.table },
    { id: 'drivers', label: 'Repeat Drivers', icon: Icons.alert },
  ];

  return (
    <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
      {/* Initial loading state */}
      {!showContent && (
        <ReconciliationLoadingIndicator step={loadingStep} />
      )}
      
      {/* Main content */}
      {showContent && (
        <>
          {/* Header */}
          {showHeader && (
            <div style={{ 
              padding: '16px 20px', 
              background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2D44 100%)',
              animation: 'fadeIn 0.4s ease-out',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: 'white', marginBottom: '4px' }}>Shift Reconciliation Analysis</div>
                  <div style={{ fontSize: '11px', color: '#9CA3AF' }}>Plan vs Actual comparison and repeat deviation pattern identification</div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ 
                    padding: '6px 12px', 
                    background: data.summary.planCompliance >= 0.85 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', 
                    borderRadius: '6px', 
                    textAlign: 'center',
                    animation: 'scaleIn 0.3s ease-out 0.2s both',
                  }}>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: data.summary.planCompliance >= 0.85 ? '#6EE7B7' : '#FCA5A5' }}>{Math.round(data.summary.planCompliance * 100)}%</div>
                    <div style={{ fontSize: '9px', color: data.summary.planCompliance >= 0.85 ? '#6EE7B7' : '#FCA5A5' }}>Compliance</div>
                  </div>
                  <div style={{ 
                    padding: '6px 12px', 
                    background: 'rgba(161, 0, 255, 0.2)', 
                    borderRadius: '6px', 
                    textAlign: 'center',
                    animation: 'scaleIn 0.3s ease-out 0.3s both',
                  }}>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#D8B4FE' }}>${(data.summary.valueProtected / 1000).toFixed(0)}k</div>
                    <div style={{ fontSize: '9px', color: '#D8B4FE' }}>Protected</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Summary KPIs */}
          {showKPIs && (
            <div style={{ 
              padding: '12px 20px', 
              background: '#FAFAFA', 
              borderBottom: '1px solid #E2E8F0', 
              display: 'grid', 
              gridTemplateColumns: 'repeat(4, 1fr)', 
              gap: '12px',
              animation: 'fadeSlideUp 0.4s ease-out',
            }}>
              <div style={{ padding: '10px', background: 'white', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '10px', color: '#6B7280', marginBottom: '2px' }}>Plan Compliance</div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: data.summary.planCompliance < 0.85 ? '#EF4444' : '#059669' }}>{Math.round(data.summary.planCompliance * 100)}%</div>
                <div style={{ fontSize: '9px', color: '#6B7280' }}>Target: {Math.round(data.summary.complianceTarget * 100)}%</div>
              </div>
              <div style={{ padding: '10px', background: 'white', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '10px', color: '#6B7280', marginBottom: '2px' }}>Tonnage Variance</div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#F59E0B' }}>{data.summary.tonnageVariance > 0 ? '-' : '+'}{Math.abs(data.summary.tonnageVariance).toLocaleString()}t</div>
                <div style={{ fontSize: '9px', color: '#6B7280' }}>vs {data.summary.tonnageTarget.toLocaleString()}t</div>
              </div>
              <div style={{ padding: '10px', background: 'white', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '10px', color: '#6B7280', marginBottom: '2px' }}>Value Protected</div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#059669' }}>${(data.summary.valueProtected / 1000).toFixed(0)}k</div>
                <div style={{ fontSize: '9px', color: '#6B7280' }}>Penalty avoided</div>
              </div>
              <div style={{ padding: '10px', background: 'white', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '10px', color: '#6B7280', marginBottom: '2px' }}>Residual Risk</div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#F59E0B' }}>${(data.summary.valueAtRiskFinal / 1000).toFixed(0)}k</div>
                <div style={{ fontSize: '9px', color: '#6B7280' }}>↓ from ${(data.summary.valueAtRiskOriginal / 1000).toFixed(0)}k</div>
              </div>
            </div>
          )}

          {/* Tabs */}
          {showTabs && (
            <div style={{ 
              padding: '10px 20px', 
              borderBottom: '1px solid #E2E8F0', 
              display: 'flex', 
              gap: '8px', 
              background: 'white',
              animation: 'fadeIn 0.3s ease-out',
            }}>
              {tabs.map(tab => (
                <Tab key={tab.id} label={tab.label} isActive={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} icon={tab.icon} />
              ))}
            </div>
          )}

          {/* Tab content */}
          {showTabContent && (
            <div style={{ padding: '16px 20px', animation: 'fadeSlideUp 0.4s ease-out' }}>
              {activeTab === 'heatmap' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <ComplianceHeatmapPanel onCellClick={(cell) => console.log('Cell clicked:', cell)} />
                  <DeviationFrequencyPanel />
                </div>
              )}

              {activeTab === 'planVsActual' && (
                <PlanVsActualPanel data={data.planVsActual} />
              )}

              {activeTab === 'drivers' && (
                <div>
                  <div style={{ 
                    fontSize: '12px', 
                    fontWeight: '600', 
                    color: '#1A1A2E', 
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                      <line x1="12" y1="9" x2="12" y2="13"/>
                      <line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                    Recurring Deviation Patterns (Ranked by Impact)
                  </div>
                  {data.repeatDrivers.map((driver, idx) => (
                    <RepeatDriverCard key={driver.id} driver={driver} rank={idx + 1} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Insights - Professional, compact design - appears on all tabs */}
          {showInsights && (
            <div style={{ 
              padding: '12px 20px', 
              background: 'white', 
              borderTop: '1px solid #E2E8F0',
              animation: 'fadeSlideUp 0.4s ease-out',
            }}>
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '8px',
              }}>
                <div style={{ 
                  fontSize: '11px', 
                  fontWeight: '600', 
                  color: '#1A1A2E', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.5px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="16" x2="12" y2="12"/>
                    <line x1="12" y1="8" x2="12.01" y2="8"/>
                  </svg>
                  Key Insights
                </div>
                <div style={{ 
                  fontSize: '10px', 
                  color: '#6B7280',
                  fontWeight: '500',
                }}>
                  {data.insights.length} findings
                </div>
              </div>
              <div style={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}>
                {data.insights.map((insight, idx) => (
                  <InsightCard key={idx} text={insight} index={idx} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
      
      <style jsx>{progressiveLoaderStyles}</style>
    </div>
  );
}

export { PlanVsActualPanel, RepeatDriverCard, InsightCard, ComplianceHeatmapPanel, DeviationFrequencyPanel };
