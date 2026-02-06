"use client";

import React, { useState, useEffect, useRef } from 'react';
import { waioPlanStack, waioRetrofitChangeSet } from '../../../data/waio/waioScenarioContext';
import { LoadingSpinner, progressiveLoaderStyles } from '../../../utils/progressiveLoader';

/**
 * WAIO Mine Plan Retrofit Stage Component
 * 
 * Enhanced version with history, versions, evidence drill-down, and connected ontology graph.
 * Includes progressive loading for a more dynamic feel.
 */

// Icons
const Icons = {
  chevronDown: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>,
  graph: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
  history: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  evidence: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  version: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
  close: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  send: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  compare: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
};

// Change history data
const changeHistory = [
  { id: 'CS-2024-089', date: '2024-01-28 14:30', status: 'current', changes: 4, author: 'AI Agent', compliance: '+8%' },
  { id: 'CS-2024-088', date: '2024-01-28 06:15', status: 'applied', changes: 2, author: 'J. Martinez', compliance: '+3%' },
  { id: 'CS-2024-087', date: '2024-01-27 18:45', status: 'applied', changes: 3, author: 'AI Agent', compliance: '+5%' },
  { id: 'CS-2024-086', date: '2024-01-27 10:20', status: 'rejected', changes: 1, author: 'AI Agent', compliance: '+2%' },
  { id: 'CS-2024-085', date: '2024-01-26 22:10', status: 'applied', changes: 5, author: 'K. Thompson', compliance: '+6%' },
];

// Version comparison data
const versionComparison = {
  baseline: { version: 'v2.3.1', date: '2024-01-26', compliance: 72 },
  proposed: { version: 'v2.4.0', date: '2024-01-28', compliance: 85 },
  changes: [
    { field: 'Blast Sequence', baseline: 'P3-B → P1-A', proposed: 'P1-A → P3-B', impact: '+4%' },
    { field: 'Stockpile Buffer', baseline: '40kt', proposed: '65kt', impact: '+2%' },
    { field: 'Sampling Freq.', baseline: '4hr', proposed: '2hr', impact: '+1%' },
    { field: 'Train Loading', baseline: 'Sequential', proposed: 'Grade-optimized', impact: '+1%' },
  ],
};

// Evidence data
const evidenceData = [
  {
    id: 'EVD-001',
    type: 'sensor',
    title: 'Grade Sensor Readings - Pit 3 Zone B',
    timestamp: '2024-01-28 12:45',
    summary: 'Consistent Fe readings 0.3-0.5% below predicted model values over 72hr window',
    confidence: 0.92,
    dataPoints: 847,
    source: 'SCADA / OnSite Analytics',
    details: [
      { metric: 'Avg Fe%', value: '61.2%', expected: '61.7%', variance: '-0.5%' },
      { metric: 'Silica%', value: '4.8%', expected: '4.5%', variance: '+0.3%' },
      { metric: 'Sample Count', value: '847', expected: '720', variance: '+17%' },
    ],
  },
  {
    id: 'EVD-002',
    type: 'model',
    title: 'Predictive Model Deviation Analysis',
    timestamp: '2024-01-28 13:00',
    summary: 'ML model confidence dropped below threshold due to assay lag exceeding 6 hours',
    confidence: 0.88,
    dataPoints: 156,
    source: 'Cerebra ML Engine',
    details: [
      { metric: 'Model Accuracy', value: '78%', expected: '92%', variance: '-14%' },
      { metric: 'Assay Lag', value: '6.2hr', expected: '<4hr', variance: '+55%' },
      { metric: 'Drift Index', value: '0.34', expected: '<0.15', variance: '+127%' },
    ],
  },
  {
    id: 'EVD-003',
    type: 'operational',
    title: 'Unrecorded Dozer Rehandle Event',
    timestamp: '2024-01-28 08:20',
    summary: 'Dispatch log shows SP-3 rehandle activity not reflected in blend calculations',
    confidence: 0.85,
    dataPoints: 12,
    source: 'Dispatch / Operator Logs',
    details: [
      { metric: 'Rehandle Vol.', value: '8,200t', expected: '0t', variance: 'Unplanned' },
      { metric: 'Blend Impact', value: 'Mixed grades', expected: 'Segregated', variance: 'Critical' },
      { metric: 'Time Window', value: '04:00-06:30', expected: 'N/A', variance: '2.5hr' },
    ],
  },
];

// Plan stack rung component
function PlanRung({ plan, isExpanded, onToggle }) {
  const signalColors = { green: '#10B981', amber: '#F59E0B', red: '#EF4444' };
  const signalColor = signalColors[plan.deviationSignal] || '#6B7280';

  return (
    <div style={{
      border: `1px solid ${plan.deviationSignal === 'red' ? '#FCA5A5' : '#E2E8F0'}`,
      borderLeft: `4px solid ${signalColor}`,
      borderRadius: '8px',
      marginBottom: '8px',
      overflow: 'hidden',
      background: plan.deviationSignal === 'red' ? '#FEF2F2' : 'white',
    }}>
      <div onClick={onToggle} style={{ padding: '12px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: `${signalColor}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: signalColor, fontWeight: '700', fontSize: '12px' }}>
            {plan.horizon}
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#1A1A2E' }}>{plan.id} <span style={{ fontWeight: '400', color: '#6B7280' }}>({plan.version})</span></div>
            <div style={{ fontSize: '11px', color: '#6B7280' }}>Owner: {plan.owner}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: signalColor }}>{Math.round(plan.kpis.actualCompliance * 100)}%</div>
            <div style={{ fontSize: '10px', color: '#6B7280' }}>Compliance</div>
          </div>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: signalColor }} />
          <div style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>{Icons.chevronDown}</div>
        </div>
      </div>
      
      {isExpanded && (
        <div style={{ padding: '12px 16px', borderTop: '1px solid #E2E8F0', background: '#F9FAFB' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '12px' }}>
            <div><div style={{ fontSize: '10px', color: '#6B7280' }}>Progress</div><div style={{ fontSize: '14px', fontWeight: '600', color: '#1A1A2E' }}>{Math.round(plan.kpis.progress * 100)}%</div></div>
            <div><div style={{ fontSize: '10px', color: '#6B7280' }}>Tonnage (Actual)</div><div style={{ fontSize: '14px', fontWeight: '600', color: '#1A1A2E' }}>{(plan.kpis.actualTonnage / 1000).toFixed(0)}k t</div></div>
            <div><div style={{ fontSize: '10px', color: '#6B7280' }}>Target</div><div style={{ fontSize: '14px', fontWeight: '600', color: '#6B7280' }}>{(plan.kpis.targetTonnage / 1000).toFixed(0)}k t</div></div>
          </div>
          {plan.deviationReason && (
            <div style={{ fontSize: '11px', color: signalColor === '#EF4444' ? '#991B1B' : '#92400E', background: signalColor === '#EF4444' ? '#FEE2E2' : '#FEF3C7', padding: '8px 10px', borderRadius: '4px', marginBottom: '8px' }}>{plan.deviationReason}</div>
          )}
          <div style={{ fontSize: '10px', color: '#6B7280' }}><strong>Constraints:</strong> {plan.topConstraints.join(' • ')}</div>
        </div>
      )}
    </div>
  );
}

// Enhanced Change item card with drill-down
function ChangeItemCard({ change, onViewGraph, onViewEvidence, isSelected, onSelect }) {
  const typeLabels = { sequence_edit: 'SEQ', buffer_policy: 'BUF', blast_timing: 'BLT', sampling_regime: 'SMP' };
  const typeColors = { sequence_edit: '#4338CA', buffer_policy: '#0891B2', blast_timing: '#DC2626', sampling_regime: '#7C3AED' };

  return (
    <div 
      onClick={() => onSelect?.(change.id)}
      style={{
        padding: '14px 16px',
        background: isSelected ? '#F5F3FF' : 'white',
        border: `1px solid ${isSelected ? '#A100FF' : '#E2E8F0'}`,
        borderLeft: `4px solid ${typeColors[change.type] || '#A100FF'}`,
        borderRadius: '8px',
        marginBottom: '10px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '10px', fontWeight: '700', color: typeColors[change.type] || '#A100FF', background: `${typeColors[change.type] || '#A100FF'}15`, padding: '2px 6px', borderRadius: '3px' }}>
            {typeLabels[change.type] || 'CHG'}
          </span>
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#1A1A2E' }}>{change.title}</span>
        </div>
        <span style={{ fontSize: '10px', fontWeight: '600', padding: '3px 8px', borderRadius: '4px', background: change.confidence >= 0.8 ? '#D1FAE5' : '#FEF3C7', color: change.confidence >= 0.8 ? '#059669' : '#92400E' }}>
          {Math.round(change.confidence * 100)}% conf
        </span>
      </div>
      
      <div style={{ fontSize: '12px', color: '#4B5563', marginBottom: '10px', lineHeight: '1.5' }}>{change.description}</div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', padding: '4px 8px', background: '#ECFDF5', borderRadius: '4px' }}>
          <span style={{ color: '#059669', fontWeight: '700' }}>+{Math.round(change.expectedComplianceGain * 100)}%</span>
          <span style={{ color: '#6B7280' }}>compliance</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', padding: '4px 8px', background: '#FEF2F2', borderRadius: '4px' }}>
          <span style={{ color: '#DC2626', fontWeight: '700' }}>-{Math.round(change.expectedRiskReduction * 100)}%</span>
          <span style={{ color: '#6B7280' }}>risk</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={(e) => { e.stopPropagation(); onViewGraph?.({ focusId: change.graphLink, mode: 'instance' }); }}
          style={{ padding: '6px 12px', background: '#EEF2FF', border: 'none', borderRadius: '4px', fontSize: '11px', fontWeight: '500', color: '#4338CA', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          {Icons.graph} View in Ontology
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onViewEvidence?.(change.id); }}
          style={{ padding: '6px 12px', background: '#F3F4F6', border: 'none', borderRadius: '4px', fontSize: '11px', fontWeight: '500', color: '#4B5563', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          {Icons.evidence} View Evidence
        </button>
      </div>
    </div>
  );
}

// History Panel Component
function HistoryPanel({ onSelectVersion }) {
  return (
    <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
      <div style={{ padding: '12px 16px', background: '#F9FAFB', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '8px' }}>
        {Icons.history}
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#1A1A2E' }}>Change Set History</span>
      </div>
      <div style={{ maxHeight: '280px', overflow: 'auto' }}>
        {changeHistory.map((item, idx) => (
          <div 
            key={item.id}
            onClick={() => onSelectVersion?.(item.id)}
            style={{
              padding: '12px 16px',
              borderBottom: idx < changeHistory.length - 1 ? '1px solid #F3F4F6' : 'none',
              cursor: 'pointer',
              background: item.status === 'current' ? '#F5F3FF' : 'white',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#1A1A2E' }}>{item.id}</span>
              <span style={{
                fontSize: '9px',
                fontWeight: '600',
                padding: '2px 6px',
                borderRadius: '4px',
                textTransform: 'uppercase',
                background: item.status === 'current' ? '#A100FF' : item.status === 'applied' ? '#10B981' : '#EF4444',
                color: 'white',
              }}>
                {item.status}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#6B7280' }}>
              <span>{item.date}</span>
              <span>{item.changes} changes • <span style={{ color: '#059669', fontWeight: '600' }}>{item.compliance}</span></span>
            </div>
            <div style={{ fontSize: '10px', color: '#9CA3AF', marginTop: '2px' }}>By {item.author}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Version Comparison Panel
function VersionComparisonPanel() {
  return (
    <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
      <div style={{ padding: '12px 16px', background: '#F9FAFB', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '8px' }}>
        {Icons.compare}
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#1A1A2E' }}>Version Comparison</span>
      </div>
      <div style={{ padding: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '12px', marginBottom: '16px' }}>
          <div style={{ padding: '10px', background: '#FEF2F2', borderRadius: '6px', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: '#6B7280', marginBottom: '2px' }}>Baseline</div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#DC2626' }}>{versionComparison.baseline.version}</div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#DC2626' }}>{versionComparison.baseline.compliance}%</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', color: '#9CA3AF' }}>→</div>
          <div style={{ padding: '10px', background: '#ECFDF5', borderRadius: '6px', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: '#6B7280', marginBottom: '2px' }}>Proposed</div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#059669' }}>{versionComparison.proposed.version}</div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#059669' }}>{versionComparison.proposed.compliance}%</div>
          </div>
        </div>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
          <thead>
            <tr style={{ background: '#F9FAFB' }}>
              <th style={{ padding: '8px', textAlign: 'left', color: '#6B7280', fontWeight: '600' }}>Field</th>
              <th style={{ padding: '8px', textAlign: 'center', color: '#6B7280', fontWeight: '600' }}>Before</th>
              <th style={{ padding: '8px', textAlign: 'center', color: '#6B7280', fontWeight: '600' }}>After</th>
              <th style={{ padding: '8px', textAlign: 'right', color: '#6B7280', fontWeight: '600' }}>Impact</th>
            </tr>
          </thead>
          <tbody>
            {versionComparison.changes.map((row, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #F3F4F6' }}>
                <td style={{ padding: '8px', color: '#1A1A2E', fontWeight: '500' }}>{row.field}</td>
                <td style={{ padding: '8px', textAlign: 'center', color: '#DC2626' }}>{row.baseline}</td>
                <td style={{ padding: '8px', textAlign: 'center', color: '#059669', fontWeight: '600' }}>{row.proposed}</td>
                <td style={{ padding: '8px', textAlign: 'right', color: '#059669', fontWeight: '700' }}>{row.impact}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Evidence Drawer Component
function EvidenceDrawer({ isOpen, onClose, changeId }) {
  if (!isOpen) return null;
  
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.3)', zIndex: 1000 }} />
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '480px',
        height: '100%',
        background: 'white',
        boxShadow: '-4px 0 20px rgba(0,0,0,0.15)',
        zIndex: 1001,
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideInRight 0.3s ease',
      }}>
        <div style={{ padding: '16px 20px', background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2D44 100%)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: 'white' }}>Evidence Analysis</div>
            <div style={{ fontSize: '11px', color: '#9CA3AF' }}>Supporting data for proposed changes</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '4px' }}>{Icons.close}</button>
        </div>
        
        <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
          {evidenceData.map((evidence) => (
            <div key={evidence.id} style={{ marginBottom: '16px', padding: '16px', background: '#F9FAFB', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <span style={{
                    fontSize: '9px',
                    fontWeight: '700',
                    padding: '2px 6px',
                    borderRadius: '3px',
                    marginRight: '8px',
                    background: evidence.type === 'sensor' ? '#DBEAFE' : evidence.type === 'model' ? '#F3E8FF' : '#FEF3C7',
                    color: evidence.type === 'sensor' ? '#1D4ED8' : evidence.type === 'model' ? '#7C3AED' : '#92400E',
                    textTransform: 'uppercase',
                  }}>
                    {evidence.type}
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#1A1A2E' }}>{evidence.title}</span>
                </div>
                <span style={{
                  fontSize: '10px',
                  fontWeight: '600',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  background: evidence.confidence >= 0.9 ? '#D1FAE5' : '#FEF3C7',
                  color: evidence.confidence >= 0.9 ? '#059669' : '#92400E',
                }}>
                  {Math.round(evidence.confidence * 100)}% conf
                </span>
              </div>
              
              <div style={{ fontSize: '11px', color: '#4B5563', marginBottom: '12px', lineHeight: '1.5' }}>{evidence.summary}</div>
              
              <div style={{ display: 'flex', gap: '16px', marginBottom: '12px', fontSize: '10px', color: '#6B7280' }}>
                <span>{evidence.dataPoints} data points</span>
                <span>•</span>
                <span>{evidence.source}</span>
                <span>•</span>
                <span>{evidence.timestamp}</span>
              </div>
              
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                <thead>
                  <tr style={{ background: 'white' }}>
                    <th style={{ padding: '6px 8px', textAlign: 'left', color: '#6B7280', fontWeight: '600', borderBottom: '1px solid #E2E8F0' }}>Metric</th>
                    <th style={{ padding: '6px 8px', textAlign: 'center', color: '#6B7280', fontWeight: '600', borderBottom: '1px solid #E2E8F0' }}>Actual</th>
                    <th style={{ padding: '6px 8px', textAlign: 'center', color: '#6B7280', fontWeight: '600', borderBottom: '1px solid #E2E8F0' }}>Expected</th>
                    <th style={{ padding: '6px 8px', textAlign: 'right', color: '#6B7280', fontWeight: '600', borderBottom: '1px solid #E2E8F0' }}>Variance</th>
                  </tr>
                </thead>
                <tbody>
                  {evidence.details.map((row, idx) => (
                    <tr key={idx}>
                      <td style={{ padding: '6px 8px', color: '#1A1A2E', fontWeight: '500' }}>{row.metric}</td>
                      <td style={{ padding: '6px 8px', textAlign: 'center', color: '#1A1A2E' }}>{row.value}</td>
                      <td style={{ padding: '6px 8px', textAlign: 'center', color: '#6B7280' }}>{row.expected}</td>
                      <td style={{ padding: '6px 8px', textAlign: 'right', color: row.variance.includes('+') || row.variance === 'Critical' || row.variance === 'Unplanned' ? '#DC2626' : '#059669', fontWeight: '600' }}>{row.variance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
        
        <div style={{ padding: '16px', borderTop: '1px solid #E2E8F0', background: '#F9FAFB' }}>
          <div style={{ fontSize: '10px', color: '#6B7280', textAlign: 'center' }}>
            Evidence data collected from SCADA, ML models, and operational logs
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}

// Impact summary card
function ImpactSummaryCard({ impacts }) {
  return (
    <div style={{ padding: '16px', background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)', borderRadius: '8px', border: '1px solid #10B98130' }}>
      <div style={{ fontSize: '12px', fontWeight: '600', color: '#065F46', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        Expected Impact Summary
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
        <div style={{ padding: '10px', background: 'white', borderRadius: '6px' }}>
          <div style={{ fontSize: '10px', color: '#059669', marginBottom: '2px' }}>7-Day Compliance</div>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#059669' }}>{Math.round(impacts.compliance7D.current * 100)}% → {Math.round(impacts.compliance7D.projected * 100)}%</div>
          <div style={{ fontSize: '10px', color: '#059669', background: '#D1FAE5', display: 'inline-block', padding: '2px 6px', borderRadius: '3px', marginTop: '4px' }}>{impacts.compliance7D.change}</div>
        </div>
        <div style={{ padding: '10px', background: 'white', borderRadius: '6px' }}>
          <div style={{ fontSize: '10px', color: '#059669', marginBottom: '2px' }}>Under-Spec Risk</div>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#059669' }}>{Math.round(impacts.underSpecRisk.current * 100)}% → {Math.round(impacts.underSpecRisk.projected * 100)}%</div>
          <div style={{ fontSize: '10px', color: '#059669', background: '#D1FAE5', display: 'inline-block', padding: '2px 6px', borderRadius: '3px', marginTop: '4px' }}>{impacts.underSpecRisk.change}</div>
        </div>
        <div style={{ padding: '10px', background: 'white', borderRadius: '6px' }}>
          <div style={{ fontSize: '10px', color: '#059669', marginBottom: '2px' }}>Contract Risk</div>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#059669' }}>{impacts.contractRisk.current} → {impacts.contractRisk.projected}</div>
          <div style={{ fontSize: '10px', color: '#059669', background: '#D1FAE5', display: 'inline-block', padding: '2px 6px', borderRadius: '3px', marginTop: '4px' }}>{impacts.contractRisk.change}</div>
        </div>
        <div style={{ padding: '10px', background: 'white', borderRadius: '6px' }}>
          <div style={{ fontSize: '10px', color: '#F59E0B', marginBottom: '2px' }}>Tonnage Trade-off</div>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#F59E0B' }}>{impacts.tonnageImpact.change}</div>
          <div style={{ fontSize: '10px', color: '#92400E', marginTop: '4px' }}>{impacts.tonnageImpact.note}</div>
        </div>
      </div>
    </div>
  );
}

// Retrofit loading indicator
function RetrofitLoadingIndicator({ step }) {
  const steps = [
    'Loading plan hierarchy...',
    'Analyzing shift learnings...',
    'Generating change proposals...',
    'Calculating compliance impact...',
    'Preparing plan updates...',
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
          Preparing Mine Plan Retrofit
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

export default function WAIOMinePlanRetrofitStage({ onComplete, onOpenGraph, onPublish }) {
  const [expandedPlans, setExpandedPlans] = useState(['SHIFT']);
  const [activeTab, setActiveTab] = useState('changeset');
  const [selectedChangeId, setSelectedChangeId] = useState(null);
  const [showEvidence, setShowEvidence] = useState(false);
  const [showSidePanel, setShowSidePanel] = useState('history'); // 'history' | 'versions' | null
  const [isPublishing, setIsPublishing] = useState(false);
  const hasCompletedRef = useRef(false);

  const planStack = waioPlanStack;
  const changeSet = waioRetrofitChangeSet;
  
  // Progressive loading states
  const [loadingStep, setLoadingStep] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [showHeader, setShowHeader] = useState(false);
  const [showTabs, setShowTabs] = useState(false);
  const [showTabContent, setShowTabContent] = useState(false);
  const [showFooter, setShowFooter] = useState(false);

  // Progressive loading sequence
  useEffect(() => {
    const timers = [
      setTimeout(() => setLoadingStep(1), 400),
      setTimeout(() => setLoadingStep(2), 800),
      setTimeout(() => setLoadingStep(3), 1200),
      setTimeout(() => setLoadingStep(4), 1600),
      setTimeout(() => { setShowContent(true); setShowHeader(true); }, 2000),
      setTimeout(() => setShowTabs(true), 2300),
      setTimeout(() => setShowTabContent(true), 2600),
      setTimeout(() => setShowFooter(true), 2900),
    ];
    
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  // Completion trigger
  useEffect(() => {
    if (showFooter && !hasCompletedRef.current) {
      hasCompletedRef.current = true;
      setTimeout(() => onComplete?.(), 500);
    }
  }, [showFooter, onComplete]);

  const togglePlan = (horizon) => {
    setExpandedPlans(prev => prev.includes(horizon) ? prev.filter(h => h !== horizon) : [...prev, horizon]);
  };

  const handlePublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      onPublish?.();
    }, 1500);
  };

  const tabs = [
    { id: 'planstack', label: 'Plan Stack', icon: Icons.chevronDown },
    { id: 'changeset', label: 'Proposed Changes', icon: Icons.version },
    { id: 'blockmodel', label: 'Block Model', icon: Icons.graph },
  ];

  return (
    <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
      {/* Initial loading state */}
      {!showContent && (
        <RetrofitLoadingIndicator step={loadingStep} />
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
                  <div style={{ fontSize: '15px', fontWeight: '700', color: 'white', marginBottom: '4px' }}>Mine Plan Retrofit</div>
                  <div style={{ fontSize: '11px', color: '#9CA3AF' }}>Closing the loop: 7/30/90-day plan adjustments based on shift learnings</div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setShowSidePanel(showSidePanel === 'history' ? null : 'history')}
                    style={{ padding: '6px 10px', background: showSidePanel === 'history' ? '#A100FF' : 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '4px', color: 'white', fontSize: '10px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    {Icons.history} History
                  </button>
                  <button
                    onClick={() => setShowSidePanel(showSidePanel === 'versions' ? null : 'versions')}
                    style={{ padding: '6px 10px', background: showSidePanel === 'versions' ? '#A100FF' : 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '4px', color: 'white', fontSize: '10px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    {Icons.compare} Compare
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          {showTabs && (
            <div style={{ 
              padding: '10px 20px', 
              borderBottom: '1px solid #E2E8F0', 
              display: 'flex', 
              gap: '6px', 
              background: '#FAFAFA',
              animation: 'fadeIn 0.3s ease-out',
            }}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '8px 14px',
                    background: activeTab === tab.id ? '#A100FF' : 'transparent',
                    color: activeTab === tab.id ? 'white' : '#6B7280',
                    border: activeTab === tab.id ? 'none' : '1px solid #E2E8F0',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          {/* Main content area */}
          {showTabContent && (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: showSidePanel ? '1fr 300px' : '1fr', 
              gap: '0',
              animation: 'fadeSlideUp 0.4s ease-out',
            }}>
              {/* Tab content */}
              <div style={{ padding: '16px 20px', borderRight: showSidePanel ? '1px solid #E2E8F0' : 'none' }}>
          {activeTab === 'planstack' && (
            <div>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#1A1A2E', marginBottom: '12px' }}>Planning Horizon Ladder</div>
              {Object.entries(planStack).map(([horizon, plan]) => (
                <PlanRung key={horizon} plan={plan} isExpanded={expandedPlans.includes(horizon)} onToggle={() => togglePlan(horizon)} />
              ))}
            </div>
          )}

          {activeTab === 'changeset' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#1A1A2E' }}>Proposed Change Set #{changeSet.id}</div>
                  <div style={{ fontSize: '11px', color: '#6B7280' }}>Target: {changeSet.targetPlan} • {changeSet.changes.length} changes</div>
                </div>
                <span style={{ padding: '4px 10px', background: '#FEF3C7', color: '#92400E', borderRadius: '4px', fontSize: '10px', fontWeight: '600', textTransform: 'uppercase' }}>{changeSet.status}</span>
              </div>

              <div style={{ padding: '12px', background: '#F9FAFB', borderRadius: '6px', marginBottom: '16px', fontSize: '12px', color: '#4B5563', lineHeight: '1.5' }}>
                <strong>Rationale:</strong> {changeSet.rationale}
              </div>

              {changeSet.changes.map(change => (
                <ChangeItemCard 
                  key={change.id} 
                  change={change}
                  onViewGraph={onOpenGraph}
                  onViewEvidence={() => setShowEvidence(true)}
                  isSelected={selectedChangeId === change.id}
                  onSelect={setSelectedChangeId}
                />
              ))}

              <ImpactSummaryCard impacts={changeSet.expectedImpacts} />
            </div>
          )}

          {activeTab === 'blockmodel' && (
            <div>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#1A1A2E', marginBottom: '12px' }}>Block Model Factor Updates</div>
              <div style={{ background: '#F9FAFB', borderRadius: '8px', padding: '12px', marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', color: '#6B7280', marginBottom: '8px' }}>These updates will be pushed to Vulcan block model</div>
                {changeSet.blockModelUpdates.map((update, idx) => (
                  <div key={idx} style={{ padding: '10px', background: 'white', borderRadius: '4px', marginBottom: '6px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '600', color: '#1A1A2E' }}>{update.blockId}</span>
                      <span style={{ fontSize: '10px', color: '#A100FF' }}>{update.field}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '11px', color: '#EF4444' }}>{update.oldValue}</span>
                      <span style={{ fontSize: '11px', color: '#6B7280' }}>→</span>
                      <span style={{ fontSize: '11px', color: '#10B981', fontWeight: '600' }}>{update.newValue}</span>
                    </div>
                    <div style={{ fontSize: '10px', color: '#6B7280' }}>{update.reason}</div>
                  </div>
                ))}
              </div>

              <div style={{ fontSize: '12px', fontWeight: '600', color: '#1A1A2E', marginBottom: '12px' }}>Deswik Schedule Delta</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', padding: '12px', background: '#EEF2FF', borderRadius: '8px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#4338CA' }}>{changeSet.deswikScheduleDelta.sequenceEdits}</div>
                  <div style={{ fontSize: '10px', color: '#6B7280' }}>Sequence Edits</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#4338CA' }}>{changeSet.deswikScheduleDelta.targetAdjustments}</div>
                  <div style={{ fontSize: '10px', color: '#6B7280' }}>Target Adj.</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#4338CA' }}>{changeSet.deswikScheduleDelta.constraintChanges}</div>
                  <div style={{ fontSize: '10px', color: '#6B7280' }}>Constraints</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#4338CA' }}>{changeSet.deswikScheduleDelta.estimatedReplanTime}</div>
                  <div style={{ fontSize: '10px', color: '#6B7280' }}>Replan Time</div>
                </div>
              </div>
            </div>
          )}
        </div>

              {/* Side panel */}
              {showSidePanel && (
                <div style={{ padding: '16px', background: '#FAFAFA' }}>
                  {showSidePanel === 'history' && <HistoryPanel onSelectVersion={(id) => console.log('Selected version:', id)} />}
                  {showSidePanel === 'versions' && <VersionComparisonPanel />}
                </div>
              )}
            </div>
          )}

          {/* Publish action */}
          {showFooter && (
            <div style={{ 
              padding: '16px 20px', 
              background: '#F9FAFB', 
              borderTop: '1px solid #E2E8F0', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              animation: 'fadeIn 0.3s ease-out',
            }}>
              <div style={{ fontSize: '11px', color: '#6B7280' }}>
                Ready to publish change set to Deswik/Vulcan and downstream systems?
              </div>
              <button
                onClick={handlePublish}
                disabled={isPublishing}
                style={{
                  padding: '10px 20px',
                  background: isPublishing ? '#9CA3AF' : '#A100FF',
                  border: 'none',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: isPublishing ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                {isPublishing ? (
                  <>
                    <div style={{ width: '14px', height: '14px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    Publishing...
                  </>
                ) : (
                  <>
                    {Icons.send}
                    Publish Change Set
                  </>
                )}
              </button>
            </div>
          )}
        </>
      )}

      {/* Evidence Drawer */}
      <EvidenceDrawer isOpen={showEvidence} onClose={() => setShowEvidence(false)} changeId={selectedChangeId} />
      
      <style jsx>{`
        ${progressiveLoaderStyles}
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export { PlanRung, ChangeItemCard, ImpactSummaryCard, HistoryPanel, VersionComparisonPanel, EvidenceDrawer };
