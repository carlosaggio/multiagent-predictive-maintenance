"use client";

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamic import for Icicle chart
const ResponsiveIcicle = dynamic(
  () => import('@nivo/icicle').then(mod => mod.ResponsiveIcicle),
  { ssr: false }
);

// Icicle data showing Cerebra → Agents → Contributions
// Using short labels to prevent truncation
const icicleData = {
  name: 'Super Agent',
  color: '#A100FF',
  children: [
    {
      name: 'RO',
      fullName: 'Resource Orchestration',
      color: '#F59E0B',
      children: [
        { name: 'WO History', fullName: 'Work Order History', value: 24, detail: '24 WOs retrieved' },
        { name: 'Crew', fullName: 'Crew Assignment', value: 18, detail: 'Team A (4 fitters)' },
        { name: 'Schedule', fullName: 'Schedule Validation', value: 12, detail: 'Window confirmed' },
      ]
    },
    {
      name: 'TA',
      fullName: 'Timeseries Analysis',
      color: '#EF4444',
      children: [
        { name: 'Trend', fullName: 'Efficiency Trend', value: 30, detail: '720 readings' },
        { name: 'Correl.', fullName: 'Correlation Analysis', value: 25, detail: 'r=0.92' },
        { name: 'Anomaly', fullName: 'Anomaly Detection', value: 15, detail: '3 anomalies' },
      ]
    },
    {
      name: 'MI',
      fullName: 'Maintenance Intel',
      color: '#8B5CF6',
      children: [
        { name: 'Weibull', fullName: 'Weibull Analysis', value: 28, detail: 'β=2.1' },
        { name: 'RPN', fullName: 'RPN Calculation', value: 22, detail: 'RPN=432' },
        { name: 'Lifecycle', fullName: 'Lifecycle Assessment', value: 18, detail: '133% overrun' },
      ]
    },
    {
      name: 'IL',
      fullName: 'Inventory & Logistics',
      color: '#10B981',
      children: [
        { name: 'Parts', fullName: 'Parts Query', value: 20, detail: '4 units available' },
        { name: 'Lead Time', fullName: 'Lead Time Check', value: 10, detail: '0 days delay' },
      ]
    },
    {
      name: 'LD',
      fullName: 'Liner Diagnostics',
      color: '#3B82F6',
      children: [
        { name: 'Wear', fullName: 'Wear Analysis', value: 35, detail: '85% degradation' },
        { name: 'Pattern', fullName: 'Pattern Recognition', value: 20, detail: 'Zone B critical' },
        { name: 'RUL', fullName: 'RUL Estimation', value: 15, detail: '5-7 days' },
      ]
    },
  ]
};

// Probabilistic metrics from the analysis
const probabilisticMetrics = [
  { label: 'RPN', value: '432', subtext: 'Risk Priority', color: '#EF4444' },
  { label: 'P(F)', value: '38%', subtext: 'Failure Prob.', color: '#F59E0B' },
  { label: 'TTF', value: '5-7d', subtext: 'Time to Failure', color: '#8B5CF6' },
  { label: 'β', value: '2.1', subtext: 'Weibull Shape', color: '#3B82F6' },
];

export default function HuddleSummaryChart() {
  return (
    <div style={{ 
      background: 'white',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      padding: '16px',
      marginTop: '16px',
    }}>
      {/* Header */}
      <div style={{ 
        fontSize: '12px', 
        fontWeight: '600', 
        color: '#1a1a2e',
        marginBottom: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A100FF" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
          Analysis Summary
        </div>
        <span style={{ fontSize: '9px', color: '#6b7280', fontWeight: '400' }}>
          Huddle completed in 44s
        </span>
      </div>
      
      {/* Probabilistic Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '8px',
        marginBottom: '16px',
      }}>
        {probabilisticMetrics.map((metric, i) => (
          <div key={i} style={{
            background: '#fafafa',
            borderRadius: '6px',
            padding: '10px 8px',
            textAlign: 'center',
            border: '1px solid #f0f0f0',
          }}>
            <div style={{ 
              fontSize: '18px', 
              fontWeight: '700', 
              color: metric.color,
              lineHeight: '1'
            }}>
              {metric.value}
            </div>
            <div style={{ fontSize: '9px', color: '#6b7280', marginTop: '4px' }}>
              {metric.subtext}
            </div>
          </div>
        ))}
      </div>

      {/* Icicle Chart - Agent Contribution Hierarchy */}
      <div style={{
        background: '#fafafa',
        borderRadius: '6px',
        padding: '12px',
        border: '1px solid #f0f0f0',
      }}>
        <div style={{ 
          fontSize: '10px', 
          fontWeight: '600', 
          color: '#6b7280',
          marginBottom: '8px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          Agent Contribution Flow
        </div>
        
        <div style={{ height: '160px' }}>
          <ResponsiveIcicle
            data={icicleData}
            identity="name"
            value="value"
            valueFormat=" >-.0f"
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            colors={(node) => {
              if (node.data.color) return node.data.color;
              // Inherit from parent with lighter shade
              return node.depth === 2 ? `${node.parent?.data?.color}99` : '#A100FF';
            }}
            borderWidth={1}
            borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
            enableLabels={true}
            labelsSkipWidth={36}
            label={node => node.data.name}
            labelTextColor="white"
            animate={true}
            motionConfig="gentle"
            theme={{
              labels: {
                text: {
                  fontSize: 9,
                  fontWeight: 600,
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                }
              }
            }}
            tooltip={({ data }) => (
              <div style={{
                background: 'white',
                padding: '8px 12px',
                borderRadius: '4px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                fontSize: '11px',
              }}>
                <strong>{data.fullName || data.name}</strong>
                {data.detail && (
                  <div style={{ color: '#6b7280', marginTop: '2px' }}>{data.detail}</div>
                )}
              </div>
            )}
          />
        </div>
      </div>

      {/* Primary Finding */}
      <div style={{
        marginTop: '12px',
        padding: '10px 12px',
        background: 'white',
        borderRadius: '6px',
        border: '1px solid #e2e8f0',
        borderLeft: '3px solid #A100FF',
      }}>
        <div style={{ 
          fontSize: '11px', 
          color: '#374151',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span>
            <strong>Primary Finding:</strong> Liner wear degradation (85% probability)
          </span>
          <span style={{ 
            fontSize: '9px', 
            background: '#FEE2E2', 
            color: '#991B1B',
            padding: '2px 8px',
            borderRadius: '10px',
            fontWeight: '600'
          }}>
            Action Required
          </span>
        </div>
      </div>
    </div>
  );
}
