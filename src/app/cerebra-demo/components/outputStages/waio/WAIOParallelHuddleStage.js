"use client";

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import ConstraintLaneBoard from '../../waio/ConstraintLaneBoard';
import { WAIO_AGENT_CONFIG, WAIO_HUDDLE_LANES, WAIO_CURATED_RESPONSES } from '../../../data/waio/waioAgents';

// Dynamic imports for Nivo charts (avoid SSR issues)
const ResponsiveBar = dynamic(
  () => import('@nivo/bar').then(mod => mod.ResponsiveBar),
  { ssr: false, loading: () => <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', fontSize: '11px' }}>Loading chart...</div> }
);

const ResponsiveLine = dynamic(
  () => import('@nivo/line').then(mod => mod.ResponsiveLine),
  { ssr: false, loading: () => <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', fontSize: '11px' }}>Loading chart...</div> }
);

/**
 * WAIO Parallel Huddle Stage Component
 * 
 * Shows the parallel constraint-clearing engine in action.
 * Now with manual progression and lane detail expansion.
 */

// Progress phases
const PHASES = ['initializing', 'running', 'consolidating', 'complete'];

// Chart data for each lane
const LANE_CHART_DATA = {
  lane_grade: {
    type: 'bar',
    title: 'Grade Distribution by Source',
    data: [
      { source: 'Pit 1 ZA', fe: 62.8, target: 62.0 },
      { source: 'Pit 1 ZB', fe: 62.1, target: 62.0 },
      { source: 'Pit 3 ZB', fe: 61.2, target: 62.0 },
      { source: 'Pit 3 ZC', fe: 62.5, target: 62.0 },
      { source: 'SP-1', fe: 62.4, target: 62.0 },
      { source: 'SP-3', fe: 61.8, target: 62.0 },
    ],
    keys: ['fe', 'target'],
    indexBy: 'source',
    colors: ['#A100FF', '#E5E7EB'],
  },
  lane_stockpile: {
    type: 'bar',
    title: 'Stockpile Inventory & Confidence',
    data: [
      { stockpile: 'SP-1', inventory: 145, confidence: 92 },
      { stockpile: 'SP-2', inventory: 98, confidence: 85 },
      { stockpile: 'SP-3', inventory: 72, confidence: 72 },
      { stockpile: 'Emergency', inventory: 210, confidence: 95 },
    ],
    keys: ['inventory', 'confidence'],
    indexBy: 'stockpile',
    colors: ['#3B82F6', '#10B981'],
  },
  lane_fleet: {
    type: 'bar',
    title: 'Fleet Availability by Asset',
    data: [
      { asset: 'TRK-08', status: 100, target: 100 },
      { asset: 'TRK-10', status: 100, target: 100 },
      { asset: 'TRK-12', status: 0, target: 100 },
      { asset: 'TRK-14', status: 85, target: 100 },
      { asset: 'EX-03', status: 78, target: 100 },
      { asset: 'EX-05', status: 95, target: 100 },
    ],
    keys: ['status', 'target'],
    indexBy: 'asset',
    colors: ['#F59E0B', '#E5E7EB'],
  },
  lane_mine: {
    type: 'line',
    title: 'Fe Grade by Dig Block (Last 8 Hours)',
    data: [
      {
        id: 'Actual Fe',
        color: '#A100FF',
        data: [
          { x: '06:00', y: 62.4 },
          { x: '07:00', y: 62.1 },
          { x: '08:00', y: 61.8 },
          { x: '09:00', y: 61.5 },
          { x: '10:00', y: 61.2 },
          { x: '11:00', y: 61.4 },
          { x: '12:00', y: 61.9 },
          { x: '13:00', y: 61.2 },
        ],
      },
      {
        id: 'Target',
        color: '#E5E7EB',
        data: [
          { x: '06:00', y: 62.0 },
          { x: '07:00', y: 62.0 },
          { x: '08:00', y: 62.0 },
          { x: '09:00', y: 62.0 },
          { x: '10:00', y: 62.0 },
          { x: '11:00', y: 62.0 },
          { x: '12:00', y: 62.0 },
          { x: '13:00', y: 62.0 },
        ],
      },
    ],
  },
  lane_logistics: {
    type: 'bar',
    title: 'Train Loading Schedule',
    data: [
      { train: 'T-07', loaded: 85, remaining: 15 },
      { train: 'T-08', loaded: 0, remaining: 100 },
      { train: 'T-09', loaded: 45, remaining: 55 },
      { train: 'T-10', loaded: 100, remaining: 0 },
    ],
    keys: ['loaded', 'remaining'],
    indexBy: 'train',
    colors: ['#10B981', '#E5E7EB'],
  },
  lane_commercial: {
    type: 'bar',
    title: 'Value at Risk by Contract',
    data: [
      { contract: 'K-JP-A', risk: 1800, tolerance: 500 },
      { contract: 'K-CN-B', risk: 450, tolerance: 500 },
      { contract: 'K-KR-C', risk: 220, tolerance: 500 },
      { contract: 'Spot', risk: 80, tolerance: 500 },
    ],
    keys: ['risk', 'tolerance'],
    indexBy: 'contract',
    colors: ['#EF4444', '#E5E7EB'],
  },
};

// Nivo chart theme
const chartTheme = {
  fontSize: 10,
  axis: {
    ticks: { text: { fill: '#6B7280', fontSize: 9 } },
    legend: { text: { fill: '#374151', fontSize: 10 } },
  },
  grid: { line: { stroke: '#F3F4F6' } },
  legends: { text: { fontSize: 9 } },
};

// Detailed lane findings for expansion (keys match lane IDs from WAIO_HUDDLE_LANES)
const LANE_DETAILS = {
  lane_grade: {
    title: 'Grade & Compliance Analysis',
    metrics: [
      { label: 'Current Fe Grade', value: '61.2%', target: '≥62.0%', status: 'warning' },
      { label: 'Silica Content', value: '4.8%', target: '≤5.0%', status: 'ok' },
      { label: 'Alumina Content', value: '2.1%', target: '≤2.5%', status: 'ok' },
      { label: 'Under-spec Probability', value: '62%', target: '<20%', status: 'warning' },
    ],
    findings: [
      'Train-07 Fe forecast 61.2% vs spec ≥62.0% — HIGH under-spec risk',
      'Pit3 Zone B showing higher variability than modeled',
      'Blending ratio needs adjustment: increase Pit1 feed by 15%',
      'Grade sensors at CV-102 showing drift - recommend calibration',
    ],
    actions: ['Adjust blend recipe to recover Fe', 'Update grade model parameters', 'Flag sensor maintenance for CV-102'],
  },
  lane_stockpile: {
    title: 'Stockpile Traceability',
    metrics: [
      { label: 'SP-3 Inventory', value: '145kt', target: '120-180kt', status: 'ok' },
      { label: 'Assay Lag', value: '6h', target: '<2h', status: 'warning' },
      { label: 'Volume Reconciliation', value: '-2,400t', target: '±500t', status: 'warning' },
      { label: 'Data Confidence', value: '72%', target: '≥85%', status: 'warning' },
    ],
    findings: [
      'Deviation introduced at SP-3 reclaim: assay lag 6h + unrecorded dozer rehandle detected',
      'Volume reconciliation shows -2,400t unexplained movement',
      'SP-2 blend ratio data confidence degraded',
      'Emergency stockpile available as contingency',
    ],
    actions: ['Trigger fresh assay for SP-3', 'Investigate volume discrepancy', 'Update reclaim tracking'],
  },
  lane_fleet: {
    title: 'Fleet & Resources',
    metrics: [
      { label: 'Truck Availability', value: '87%', target: '≥90%', status: 'warning' },
      { label: 'Haul Capacity Impact', value: '-8%', target: '0%', status: 'warning' },
      { label: 'Cycle Time Impact', value: '+11%', target: '<5%', status: 'warning' },
      { label: 'Achievable Throughput', value: '13,500 tph', target: '15,000 tph', status: 'warning' },
    ],
    findings: [
      'Fleet constraint: TRK-12 down (transmission fault, 2h repair)',
      'Haul capacity reduced 8% due to TRK-12 downtime',
      'Cycle time impact +11% on Pit 3 routes',
      'Mitigation available: reallocate TRK-08 from Pit 1',
    ],
    actions: ['Reallocate TRK-08 to cover Pit 3', 'Expedite TRK-12 repair', 'Adjust dig plan to match fleet capacity'],
  },
  lane_mine: {
    title: 'Mine Plan Alignment',
    metrics: [
      { label: 'Plan Compliance', value: '78%', target: '≥85%', status: 'warning' },
      { label: 'Pit3 Zone B Fe', value: '61.9%', target: '62.4%', status: 'warning' },
      { label: 'Sequence Deviation', value: '2 blocks', target: '0', status: 'warning' },
      { label: 'Dig Rate', value: '94%', target: '≥95%', status: 'ok' },
    ],
    findings: [
      'Pit 3 Zone B showing low-Fe pocket (61.9% vs expected 62.4%)',
      'Recommend: shift to Pit 3 Zone C for 90min to recover Fe while Zone B blast window opens',
      'Block BL-247 skipped due to water ingress',
      'Current dig sequence deviating from 7-day plan',
    ],
    actions: ['Resequence to Zone C temporarily', 'Update Deswik/Vulcan schedule', 'Flag Zone B for blast prep'],
  },
  lane_logistics: {
    title: 'Logistics (Rail/Port)',
    metrics: [
      { label: 'Train-07 Slot', value: '12:40', target: 'Fixed', status: 'ok' },
      { label: 'Berth B2 Delay Risk', value: '>45min', target: '<15min', status: 'warning' },
      { label: 'Demurrage Rate', value: '$15k/h', target: '-', status: 'warning' },
      { label: 'Rail Transit', value: '2 trains', target: '≤3', status: 'ok' },
    ],
    findings: [
      'Train-07 slot fixed 12:40 — Delay >45min triggers Berth B2 knock-on risk',
      'MV-Koyo-Maru ETA 14:00, demurrage rate $15k/h',
      'Rail transit: 2 trains in network, capacity available',
      'Port berth 2 available from 18:00',
    ],
    actions: ['Prioritize Train-07 loading', 'Confirm berth allocation with port ops', 'Monitor knock-on effects'],
  },
  lane_commercial: {
    title: 'Commercial & Market',
    metrics: [
      { label: 'Contract Grade', value: '62.0%', target: '≥62.0%', status: 'warning' },
      { label: 'Penalty Multiplier', value: '1.5x', target: '-', status: 'warning' },
      { label: 'Value at Risk', value: '$1.8M', target: '$0', status: 'warning' },
      { label: 'Shipment Window', value: '48h', target: 'On track', status: 'ok' },
    ],
    findings: [
      'Customer priority: Contract K-JP-A (Japan Premium) has 1.5x penalty multiplier',
      'Current value-at-risk: $1.8M if under-spec',
      'Recommend: weight compliance ≥0.3 in objective function',
      'Shipment window in 48h — time to remediate',
    ],
    actions: ['Optimize blend for compliance', 'Prepare customer communication', 'Escalate if risk persists'],
  },
};

// Orchestrator message component
function OrchestratorMessage({ phase, message }) {
  const getIcon = () => {
    switch (phase) {
      case 'initializing':
        return '⚙️';
      case 'running':
        return '🔄';
      case 'consolidating':
        return '📊';
      case 'complete':
        return '✅';
      default:
        return '🤖';
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      padding: '14px 16px',
      background: 'linear-gradient(135deg, #A100FF10 0%, #7C3AED10 100%)',
      borderRadius: '8px',
      border: '1px solid #A100FF30',
      marginBottom: '16px',
    }}>
      <div style={{
        width: '36px',
        height: '36px',
        borderRadius: '8px',
        background: '#A100FF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        flexShrink: 0,
      }}>
        {getIcon()}
      </div>
      <div>
        <div style={{ 
          fontSize: '11px', 
          fontWeight: '600', 
          color: '#A100FF',
          marginBottom: '4px',
        }}>
          Shift Optimiser (SO)
        </div>
        <div style={{ 
          fontSize: '12px', 
          color: '#4B5563',
          lineHeight: '1.5',
        }}>
          {message}
        </div>
      </div>
    </div>
  );
}

// Lane Chart Component - renders the appropriate chart for each lane
function LaneChart({ laneId, agentColor }) {
  const chartConfig = LANE_CHART_DATA[laneId];
  if (!chartConfig) return null;

  if (chartConfig.type === 'line') {
    return (
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '12px', fontWeight: '600', color: '#1A1A2E', marginBottom: '12px' }}>
          {chartConfig.title}
        </div>
        <div style={{ 
          height: '180px', 
          background: '#FAFAFA', 
          borderRadius: '8px', 
          padding: '8px',
          border: '1px solid #E5E7EB',
        }}>
          <ResponsiveLine
            data={chartConfig.data}
            margin={{ top: 10, right: 20, bottom: 40, left: 45 }}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', min: 60.5, max: 63, stacked: false }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 0,
              tickPadding: 8,
              tickRotation: -30,
            }}
            axisLeft={{
              tickSize: 0,
              tickPadding: 8,
              tickValues: [61, 62, 63],
              legend: 'Fe %',
              legendOffset: -38,
              legendPosition: 'middle',
            }}
            colors={[agentColor || '#A100FF', '#D1D5DB']}
            lineWidth={2}
            pointSize={6}
            pointColor={{ from: 'color' }}
            pointBorderWidth={2}
            pointBorderColor="white"
            enableGridX={false}
            enableGridY={true}
            enableArea={false}
            useMesh={true}
            theme={chartTheme}
            markers={[
              {
                axis: 'y',
                value: 62.0,
                lineStyle: { stroke: '#EF4444', strokeWidth: 1.5, strokeDasharray: '4 3' },
                legend: 'Spec',
                legendPosition: 'right',
                textStyle: { fill: '#EF4444', fontSize: 9 },
              },
            ]}
            legends={[
              {
                anchor: 'bottom',
                direction: 'row',
                translateY: 36,
                itemWidth: 70,
                itemHeight: 12,
                itemTextColor: '#6B7280',
                symbolSize: 8,
                symbolShape: 'circle',
              },
            ]}
          />
        </div>
      </div>
    );
  }

  // Bar chart
  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{ fontSize: '12px', fontWeight: '600', color: '#1A1A2E', marginBottom: '12px' }}>
        {chartConfig.title}
      </div>
      <div style={{ 
        height: '180px', 
        background: '#FAFAFA', 
        borderRadius: '8px', 
        padding: '8px',
        border: '1px solid #E5E7EB',
      }}>
        <ResponsiveBar
          data={chartConfig.data}
          keys={chartConfig.keys}
          indexBy={chartConfig.indexBy}
          margin={{ top: 10, right: 10, bottom: 40, left: 60 }}
          padding={0.35}
          groupMode="grouped"
          layout="horizontal"
          valueScale={{ type: 'linear' }}
          indexScale={{ type: 'band', round: true }}
          colors={chartConfig.colors}
          borderRadius={2}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 0,
            tickPadding: 8,
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 8,
          }}
          enableGridX={true}
          enableGridY={false}
          labelSkipWidth={20}
          labelSkipHeight={12}
          labelTextColor="white"
          theme={chartTheme}
          legends={[
            {
              dataFrom: 'keys',
              anchor: 'bottom',
              direction: 'row',
              translateY: 36,
              itemWidth: 70,
              itemHeight: 12,
              itemTextColor: '#6B7280',
              symbolSize: 8,
              symbolShape: 'circle',
            },
          ]}
          tooltip={({ id, value, indexValue }) => (
            <div style={{
              background: '#1A1A2E',
              color: 'white',
              padding: '6px 10px',
              borderRadius: '4px',
              fontSize: '10px',
            }}>
              <strong>{indexValue}</strong>: {id} = {value}
            </div>
          )}
        />
      </div>
    </div>
  );
}

// Lane Detail Modal/Drawer Component
function LaneDetailDrawer({ lane, onClose }) {
  if (!lane) return null;
  
  const details = LANE_DETAILS[lane.id] || {};
  const agent = WAIO_AGENT_CONFIG[lane.agentId];
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      width: '420px',
      background: 'white',
      boxShadow: '-4px 0 20px rgba(0,0,0,0.15)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      animation: 'slideInRight 0.2s ease-out',
    }}>
      {/* Header */}
      <div style={{
        padding: '20px',
        background: agent?.color || '#A100FF',
        color: 'white',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '11px', opacity: 0.8, marginBottom: '4px' }}>
              {agent?.name || 'Agent'}
            </div>
            <div style={{ fontSize: '18px', fontWeight: '700' }}>
              {details.title || lane.title || lane.label}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '4px',
              padding: '8px',
              cursor: 'pointer',
              color: 'white',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '20px' }}>
        {/* Chart Section */}
        <LaneChart laneId={lane.id} agentColor={agent?.color} />
        
        {/* Metrics */}
        {details.metrics && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#1A1A2E', marginBottom: '12px' }}>
              Key Metrics
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {details.metrics.map((metric, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 12px',
                  background: metric.status === 'warning' ? '#FEF3C7' : '#F0FDF4',
                  borderRadius: '6px',
                  borderLeft: `3px solid ${metric.status === 'warning' ? '#F59E0B' : '#10B981'}`,
                }}>
                  <span style={{ fontSize: '12px', color: '#4B5563' }}>{metric.label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ 
                      fontSize: '14px', 
                      fontWeight: '700', 
                      color: metric.status === 'warning' ? '#B45309' : '#059669' 
                    }}>
                      {metric.value}
                    </span>
                    <span style={{ fontSize: '10px', color: '#6B7280' }}>
                      (target: {metric.target})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Findings */}
        {details.findings && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#1A1A2E', marginBottom: '12px' }}>
              Analysis Findings
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {details.findings.map((finding, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  gap: '10px',
                  padding: '10px 12px',
                  background: '#F9FAFB',
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: '#374151',
                  lineHeight: '1.5',
                }}>
                  <span style={{ color: agent?.color || '#A100FF', fontWeight: '600' }}>•</span>
                  {finding}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Recommended Actions */}
        {details.actions && (
          <div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#1A1A2E', marginBottom: '12px' }}>
              Recommended Actions
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {details.actions.map((action, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  background: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: '#374151',
                }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '4px',
                    background: '#F3E8FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    fontWeight: '700',
                    color: '#A100FF',
                  }}>
                    {idx + 1}
                  </div>
                  {action}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

// Consolidated findings component
function ConsolidatedFindings({ lanes, responses, onLaneClick }) {
  return (
    <div style={{
      background: '#F9FAFB',
      borderRadius: '8px',
      padding: '16px',
      marginTop: '20px',
    }}>
      <div style={{ 
        fontSize: '12px', 
        fontWeight: '600', 
        color: '#1A1A2E',
        marginBottom: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A100FF" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        Consolidated Findings
        <span style={{ fontSize: '10px', color: '#6B7280', fontWeight: '400', marginLeft: '8px' }}>
          Click any lane for detailed analysis
        </span>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {Object.entries(responses).map(([agentId, response]) => {
          if (agentId === 'SO') return null;
          const agent = WAIO_AGENT_CONFIG[agentId];
          if (!agent) return null;
          
          // Find the corresponding lane
          const lane = lanes.find(l => l.agentId === agentId);
          
          return (
            <div 
              key={agentId}
              onClick={() => lane && onLaneClick?.(lane)}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                padding: '10px 12px',
                background: 'white',
                borderRadius: '6px',
                borderLeft: `3px solid ${agent.color}`,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#F3F4F6';
                e.currentTarget.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '4px',
                background: agent.color,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: '700',
                flexShrink: 0,
              }}>
                {agentId}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  fontSize: '11px', 
                  fontWeight: '600', 
                  color: '#1A1A2E',
                  marginBottom: '2px',
                }}>
                  {agent.name}
                </div>
                <div style={{ 
                  fontSize: '11px', 
                  color: '#4B5563',
                  lineHeight: '1.4',
                }}>
                  {response.content}
                </div>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function WAIOParallelHuddleStage({ onComplete, selectedObjective }) {
  const [phase, setPhase] = useState('initializing');
  const [activeLanes, setActiveLanes] = useState([]);
  const [completedLanes, setCompletedLanes] = useState([]);
  const [selectedLane, setSelectedLane] = useState(null);
  const [userReady, setUserReady] = useState(false);
  const hasCompletedRef = useRef(false);
  const [orchestratorMessage, setOrchestratorMessage] = useState(
    'Initializing parallel constraint-clearing engine...'
  );

  // Initialize lanes with progress state
  const lanesWithProgress = WAIO_HUDDLE_LANES.map(lane => ({
    ...lane,
    progress: completedLanes.includes(lane.id) ? 1 : 
              activeLanes.includes(lane.id) ? 0.5 : 0,
    status: completedLanes.includes(lane.id) ? 'cleared' :
            activeLanes.includes(lane.id) ? 'running' : 'pending',
    finding: WAIO_CURATED_RESPONSES[lane.agentId]?.content?.substring(0, 80) + '...' || 'Analyzing...',
    actions: [
      { label: 'View details', severity: 'info' },
      { label: 'Apply fix', severity: 'success' },
    ],
  }));

  // Handle lane click for detailed view
  const handleLaneClick = (lane) => {
    setSelectedLane(lane);
  };

  // Handle "Generate Plan Options" button click
  const handleGeneratePlans = () => {
    if (!hasCompletedRef.current) {
      hasCompletedRef.current = true;
      setUserReady(true);
      onComplete?.();
    }
  };

  // Simulate parallel execution - NO auto-complete
  useEffect(() => {
    const timers = [];

    // Phase 1: Initialize
    timers.push(setTimeout(() => {
      setPhase('running');
      setOrchestratorMessage(
        `Running ${WAIO_HUDDLE_LANES.length} constraint-clearing lanes in parallel. Objective: ${selectedObjective || 'Balanced'}.`
      );
      setActiveLanes(WAIO_HUDDLE_LANES.map(l => l.id));
    }, 1000));

    // Phase 2: Complete lanes progressively
    WAIO_HUDDLE_LANES.forEach((lane, idx) => {
      timers.push(setTimeout(() => {
        setCompletedLanes(prev => [...prev, lane.id]);
      }, 2000 + idx * 800)); // Slower progression for visibility
    });

    // Phase 3: Consolidate - but DON'T auto-complete
    timers.push(setTimeout(() => {
      setPhase('consolidating');
      setOrchestratorMessage(
        'All lanes complete. Consolidating findings... Click any lane to view detailed analysis.'
      );
    }, 2000 + WAIO_HUDDLE_LANES.length * 800 + 500));

    // Phase 4: Ready state (user must click button)
    timers.push(setTimeout(() => {
      setPhase('complete');
      setOrchestratorMessage(
        'Analysis complete. Review lane findings above, then click "Generate Plan Options" when ready to proceed.'
      );
      // NOTE: We do NOT call onComplete here - user must click the button
    }, 2000 + WAIO_HUDDLE_LANES.length * 800 + 2000));

    return () => timers.forEach(t => clearTimeout(t));
  }, [selectedObjective]); // Removed onComplete from deps

  return (
    <div style={{
      background: 'white',
      borderRadius: '8px',
      border: '1px solid #E2E8F0',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '20px',
        background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2D44 100%)',
      }}>
        <div style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}>
          <div>
            <div style={{ 
              fontSize: '16px', 
              fontWeight: '700', 
              color: 'white',
              marginBottom: '8px',
            }}>
              Parallel Constraint-Clearing Engine
            </div>
            <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
              Running {WAIO_HUDDLE_LANES.length} lanes simultaneously to clear constraints and generate plan options
            </div>
          </div>
          
          {/* Status indicator */}
          <div style={{
            padding: '6px 12px',
            background: phase === 'complete' && !userReady ? '#10B98120' : 
                       userReady ? '#3B82F620' : '#A100FF20',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: phase === 'complete' && !userReady ? '#10B981' : 
                         userReady ? '#3B82F6' : '#A100FF',
              animation: phase !== 'complete' ? 'pulse 1.5s infinite' : 'none',
            }} />
            <span style={{ 
              fontSize: '11px', 
              fontWeight: '600', 
              color: phase === 'complete' && !userReady ? '#10B981' : 
                    userReady ? '#3B82F6' : '#A100FF',
              textTransform: 'capitalize',
            }}>
              {userReady ? 'generating plans' : phase}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '20px' }}>
        {/* Orchestrator message */}
        <OrchestratorMessage phase={phase} message={orchestratorMessage} />

        {/* Lane board - now clickable */}
        <ConstraintLaneBoard
          lanes={lanesWithProgress}
          agentConfig={WAIO_AGENT_CONFIG}
          animateProgress={false}
          onLaneClick={handleLaneClick}
        />

        {/* Consolidated findings (show when complete) */}
        {(phase === 'complete' || phase === 'consolidating') && (
          <ConsolidatedFindings 
            lanes={WAIO_HUDDLE_LANES}
            responses={WAIO_CURATED_RESPONSES}
            onLaneClick={handleLaneClick}
          />
        )}

        {/* Generate Plan Options Button - only show when analysis is complete */}
        {phase === 'complete' && !userReady && (
          <div style={{
            marginTop: '24px',
            display: 'flex',
            justifyContent: 'center',
          }}>
            <button
              onClick={handleGeneratePlans}
              style={{
                padding: '14px 32px',
                background: 'linear-gradient(135deg, #A100FF 0%, #7C3AED 100%)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 4px 14px rgba(161, 0, 255, 0.3)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(161, 0, 255, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(161, 0, 255, 0.3)';
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
              Generate Plan Options
            </button>
          </div>
        )}

        {/* Generating indicator */}
        {userReady && (
          <div style={{
            marginTop: '24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            padding: '20px',
            background: '#F0F9FF',
            borderRadius: '8px',
            border: '1px solid #BAE6FD',
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              border: '3px solid #E0F2FE',
              borderTopColor: '#3B82F6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }} />
            <div style={{ fontSize: '13px', color: '#0369A1', fontWeight: '500' }}>
              Generating 3 feasible plan options...
            </div>
          </div>
        )}
      </div>

      {/* Lane Detail Drawer */}
      {selectedLane && (
        <>
          {/* Backdrop */}
          <div 
            onClick={() => setSelectedLane(null)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.3)',
              zIndex: 999,
            }}
          />
          <LaneDetailDrawer 
            lane={selectedLane} 
            onClose={() => setSelectedLane(null)} 
          />
        </>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export { OrchestratorMessage, ConsolidatedFindings };
