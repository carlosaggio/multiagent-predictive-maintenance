"use client";

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { waioReconciliation } from '../../../data/waio/waioScenarioContext';

// Dynamic import for Nivo HeatMap
const ResponsiveHeatMap = dynamic(
  () => import('@nivo/heatmap').then(mod => mod.ResponsiveHeatMap),
  { ssr: false, loading: () => <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF' }}>Loading heatmap...</div> }
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

// Metric row for plan vs actual table - enhanced
function MetricRow({ metric, planned, actual, variance, unit, status }) {
  const statusColors = { good: '#10B981', warning: '#F59E0B', critical: '#EF4444' };
  const color = statusColors[status] || '#6B7280';
  const varianceDisplay = variance > 0 ? `+${variance.toFixed(1)}` : variance.toFixed(1);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 100px 100px 90px',
      gap: '12px',
      padding: '12px 16px',
      background: status === 'warning' ? '#FFFBEB' : status === 'critical' ? '#FEF2F2' : 'white',
      borderRadius: '8px',
      marginBottom: '8px',
      alignItems: 'center',
      border: `1px solid ${status === 'critical' ? '#FECACA' : status === 'warning' ? '#FDE68A' : '#E2E8F0'}`,
      borderLeft: `4px solid ${color}`,
    }}>
      <span style={{ fontSize: '13px', fontWeight: '600', color: '#1A1A2E' }}>{metric}</span>
      <span style={{ fontSize: '12px', color: '#6B7280', textAlign: 'right' }}>{typeof planned === 'number' ? planned.toLocaleString() : planned}{unit ? ` ${unit}` : ''}</span>
      <span style={{ fontSize: '13px', fontWeight: '700', color: color, textAlign: 'right' }}>{typeof actual === 'number' ? actual.toLocaleString() : actual}{unit ? ` ${unit}` : ''}</span>
      <span style={{ 
        fontSize: '11px', 
        fontWeight: '700', 
        color: 'white',
        background: color,
        padding: '4px 10px',
        borderRadius: '4px',
        textAlign: 'center',
      }}>
        {varianceDisplay}{unit === '%' ? 'pp' : '%'}
      </span>
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
  const impactColors = { High: '#EF4444', Medium: '#F59E0B', Low: '#10B981' };

  return (
    <div style={{
      padding: '14px 16px',
      background: rank === 1 ? '#FEF2F2' : 'white',
      border: `1px solid ${rank === 1 ? '#FECACA' : '#E2E8F0'}`,
      borderLeft: `4px solid ${impactColors[driver.impact] || '#6B7280'}`,
      borderRadius: '8px',
      marginBottom: '10px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            width: '22px',
            height: '22px',
            borderRadius: '50%',
            background: impactColors[driver.impact],
            color: 'white',
            fontSize: '10px',
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
          fontWeight: '700',
          padding: '3px 8px',
          borderRadius: '4px',
          background: impactColors[driver.impact],
          color: 'white',
        }}>
          {driver.impact} Impact
        </span>
      </div>
      
      <div style={{ display: 'flex', gap: '16px', marginBottom: '10px', fontSize: '11px' }}>
        <span style={{ color: '#6B7280' }}>Frequency: <strong style={{ color: '#1A1A2E' }}>{driver.frequency}</strong></span>
        <span style={{ color: '#6B7280' }}>Trend: <strong style={{ color: driver.trend === 'increasing' ? '#EF4444' : '#10B981' }}>{driver.trend || 'stable'}</strong></span>
      </div>
      
      <div style={{ fontSize: '12px', color: '#4B5563', marginBottom: '10px', lineHeight: '1.5' }}>
        <strong>Root cause:</strong> {driver.rootCause}
      </div>
      
      <div style={{ fontSize: '11px', color: '#059669', background: '#ECFDF5', padding: '10px 12px', borderRadius: '6px' }}>
        <strong>Recommendation:</strong> {driver.recommendation}
      </div>
    </div>
  );
}

// Insight card - enhanced
function InsightCard({ text, type = 'info' }) {
  const typeConfig = {
    info: { bg: '#EEF2FF', border: '#6366F1', color: '#4338CA' },
    success: { bg: '#ECFDF5', border: '#10B981', color: '#059669' },
    warning: { bg: '#FFFBEB', border: '#F59E0B', color: '#B45309' },
  };
  const config = typeConfig[type] || typeConfig.info;

  return (
    <div style={{
      padding: '12px 14px',
      background: config.bg,
      borderRadius: '6px',
      marginBottom: '8px',
      borderLeft: `4px solid ${config.border}`,
      display: 'flex',
      alignItems: 'flex-start',
      gap: '10px',
    }}>
      <div style={{ marginTop: '2px' }}>{Icons.trend}</div>
      <span style={{ fontSize: '12px', color: config.color, lineHeight: '1.5' }}>{text}</span>
    </div>
  );
}

export default function WAIOReconciliationStage({ onComplete, onOpenGraph }) {
  const [activeTab, setActiveTab] = useState('heatmap');
  const hasCompletedRef = useRef(false);

  const data = waioReconciliation;

  // Trigger completion after animation - only once
  useEffect(() => {
    if (hasCompletedRef.current) return;
    const timer = setTimeout(() => {
      if (!hasCompletedRef.current) {
        hasCompletedRef.current = true;
        onComplete?.();
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const tabs = [
    { id: 'heatmap', label: 'Compliance Heatmap', icon: Icons.heatmap },
    { id: 'planVsActual', label: 'Plan vs Actual', icon: Icons.table },
    { id: 'drivers', label: 'Repeat Drivers', icon: Icons.alert },
  ];

  return (
    <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2D44 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: '700', color: 'white', marginBottom: '4px' }}>Shift Reconciliation Analysis</div>
            <div style={{ fontSize: '11px', color: '#9CA3AF' }}>Plan vs Actual comparison and repeat deviation pattern identification</div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ padding: '6px 12px', background: data.summary.planCompliance >= 0.85 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '16px', fontWeight: '700', color: data.summary.planCompliance >= 0.85 ? '#6EE7B7' : '#FCA5A5' }}>{Math.round(data.summary.planCompliance * 100)}%</div>
              <div style={{ fontSize: '9px', color: data.summary.planCompliance >= 0.85 ? '#6EE7B7' : '#FCA5A5' }}>Compliance</div>
            </div>
            <div style={{ padding: '6px 12px', background: 'rgba(161, 0, 255, 0.2)', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#D8B4FE' }}>${(data.summary.valueProtected / 1000).toFixed(0)}k</div>
              <div style={{ fontSize: '9px', color: '#D8B4FE' }}>Protected</div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary KPIs */}
      <div style={{ padding: '12px 20px', background: '#FAFAFA', borderBottom: '1px solid #E2E8F0', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
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

      {/* Tabs */}
      <div style={{ padding: '10px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', gap: '8px', background: 'white' }}>
        {tabs.map(tab => (
          <Tab key={tab.id} label={tab.label} isActive={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} icon={tab.icon} />
        ))}
      </div>

      {/* Tab content */}
      <div style={{ padding: '16px 20px' }}>
        {activeTab === 'heatmap' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <ComplianceHeatmapPanel onCellClick={(cell) => console.log('Cell clicked:', cell)} />
            <DeviationFrequencyPanel />
          </div>
        )}

        {activeTab === 'planVsActual' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 100px 90px', gap: '12px', padding: '10px 16px', marginBottom: '8px', background: '#A100FF', borderRadius: '8px' }}>
              <span style={{ fontSize: '10px', fontWeight: '700', color: 'white', textTransform: 'uppercase' }}>Metric</span>
              <span style={{ fontSize: '10px', fontWeight: '700', color: 'white', textTransform: 'uppercase', textAlign: 'right' }}>Planned</span>
              <span style={{ fontSize: '10px', fontWeight: '700', color: 'white', textTransform: 'uppercase', textAlign: 'right' }}>Actual</span>
              <span style={{ fontSize: '10px', fontWeight: '700', color: 'white', textTransform: 'uppercase', textAlign: 'center' }}>Variance</span>
            </div>
            {data.planVsActual.map((row, idx) => (
              <MetricRow key={idx} {...row} />
            ))}
          </div>
        )}

        {activeTab === 'drivers' && (
          <div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#1A1A2E', marginBottom: '12px' }}>
              Recurring Deviation Patterns (Ranked by Impact)
            </div>
            {data.repeatDrivers.map((driver, idx) => (
              <RepeatDriverCard key={driver.id} driver={driver} rank={idx + 1} />
            ))}
          </div>
        )}
      </div>

      {/* Insights */}
      <div style={{ padding: '16px 20px', background: '#F9FAFB', borderTop: '1px solid #E2E8F0' }}>
        <div style={{ fontSize: '11px', fontWeight: '700', color: '#1A1A2E', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Key Insights
        </div>
        {data.insights.map((insight, idx) => (
          <InsightCard key={idx} text={insight} type={idx === 0 ? 'warning' : idx === 1 ? 'success' : 'info'} />
        ))}
      </div>
    </div>
  );
}

export { MetricRow, RepeatDriverCard, InsightCard, ComplianceHeatmapPanel, DeviationFrequencyPanel };
