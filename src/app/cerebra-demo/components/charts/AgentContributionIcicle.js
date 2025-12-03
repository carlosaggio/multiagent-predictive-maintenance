"use client";

import React from 'react';
import { ResponsiveIcicle } from '@nivo/icicle';

// Hierarchical data showing Super Agent → Agents → Contributions
const icicleData = {
  name: "Super Agent Analysis",
  color: "#A100FF",
  children: [
    {
      name: "RO",
      fullName: "Resource Orchestration",
      color: "#F59E0B",
      children: [
        { name: "Crew Assignment", value: 95, detail: "James Morrison (95% match)" },
        { name: "Schedule", value: 100, detail: "Dec 9, 06:00 - Shutdown window" }
      ]
    },
    {
      name: "TA",
      fullName: "Timeseries Analysis",
      color: "#EF4444",
      children: [
        { name: "Efficiency Trend", value: 92, detail: "-7% over 4 weeks" },
        { name: "Correlation", value: 92, detail: "0.92 with liner age" }
      ]
    },
    {
      name: "MI",
      fullName: "Maintenance Intelligence",
      color: "#8B5CF6",
      children: [
        { name: "Weibull Analysis", value: 87, detail: "β=2.1, 38% failure prob" },
        { name: "Lifecycle", value: 87, detail: "25% overrun detected" }
      ]
    },
    {
      name: "IL",
      fullName: "Inventory & Logistics",
      color: "#10B981",
      children: [
        { name: "Parts Check", value: 100, detail: "All 12 segments available" },
        { name: "Supplier", value: 100, detail: "Backup: 5 days lead time" }
      ]
    },
    {
      name: "LD",
      fullName: "Liner Diagnostics",
      color: "#3B82F6",
      children: [
        { name: "Wear Assessment", value: 85, detail: "Zone B: 85% degradation" },
        { name: "Remaining Life", value: 85, detail: "5-7 days at current load" }
      ]
    }
  ]
};

export default function AgentContributionIcicle() {
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
        Agent Analysis Contribution Map
      </div>
      <div style={{ 
        fontSize: '10px', 
        color: '#6b7280',
        marginBottom: '12px'
      }}>
        Cerebra orchestration breakdown by agent and task
      </div>
      
      <div style={{ height: '200px' }}>
        <ResponsiveIcicle
          data={icicleData}
          identity="name"
          value="value"
          valueFormat=" >-.0f"
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          colors={(node) => node.data.color || '#6366F1'}
          borderWidth={1}
          borderColor={{ from: 'color', modifiers: [['darker', 0.3]] }}
          enableLabels={true}
          labelsSkipWidth={40}
          labelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
          orientLabel={false}
          theme={{
            labels: {
              text: {
                fontSize: 10,
                fontWeight: 500
              }
            },
            tooltip: {
              container: {
                background: '#1a1a2e',
                color: 'white',
                fontSize: 11,
                borderRadius: 4,
                padding: '8px 12px'
              }
            }
          }}
          tooltip={({ id, data }) => (
            <div>
              <strong>{data.fullName || id}</strong>
              {data.detail && <div style={{ marginTop: '4px', opacity: 0.8 }}>{data.detail}</div>}
            </div>
          )}
        />
      </div>

      {/* Probabilistic Metrics Summary */}
      <div style={{
        marginTop: '16px',
        paddingTop: '16px',
        borderTop: '1px solid #f0f0f0'
      }}>
        <div style={{ fontSize: '10px', fontWeight: '600', color: '#374151', marginBottom: '10px' }}>
          Analysis Metrics
        </div>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '12px' 
        }}>
          {[
            { label: 'Confidence', value: '87%', color: '#10B981' },
            { label: 'RPN Score', value: '432', color: '#EF4444' },
            { label: 'P(Failure)', value: '38%', color: '#F59E0B' },
            { label: 'TTF Est.', value: '5-7d', color: '#8B5CF6' }
          ].map((metric, i) => (
            <div key={i} style={{
              textAlign: 'center',
              padding: '8px',
              background: `${metric.color}08`,
              borderRadius: '6px',
              borderBottom: `2px solid ${metric.color}`
            }}>
              <div style={{ fontSize: '16px', fontWeight: '700', color: metric.color }}>
                {metric.value}
              </div>
              <div style={{ fontSize: '9px', color: '#6b7280', marginTop: '2px' }}>
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

