"use client";

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import GradeTraceSankey from '../../charts/GradeTraceSankey';
import DeviationWaterfall from '../../charts/DeviationWaterfall';
import { waioDeviationTrace } from '../../../data/waio/waioScenarioContext';
import { useSectionLoader, LoadingSpinner, progressiveLoaderStyles } from '../../../utils/progressiveLoader';

// Dynamic import for Nivo HeatMap
const ResponsiveHeatMap = dynamic(
  () => import('@nivo/heatmap').then(mod => mod.ResponsiveHeatMap),
  { ssr: false, loading: () => <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF' }}>Loading heatmap...</div> }
);

/**
 * WAIO Deviation Trace Stage Component
 * 
 * Enhanced version with professional heatmap visualization and better screen utilization.
 */

// Grade deviation heatmap data - shows grade readings across locations and time
const gradeHeatmapData = [
  {
    id: "06:00",
    data: [
      { x: "Pit 1", y: 62.5 },
      { x: "Pit 2", y: 61.8 },
      { x: "Pit 3", y: 61.2 },
      { x: "SP-1", y: 62.2 },
      { x: "SP-2", y: 62.8 },
      { x: "SP-3", y: 61.5 },
      { x: "Train", y: 61.4 },
    ]
  },
  {
    id: "08:00",
    data: [
      { x: "Pit 1", y: 62.6 },
      { x: "Pit 2", y: 61.5 },
      { x: "Pit 3", y: 60.9 },
      { x: "SP-1", y: 62.1 },
      { x: "SP-2", y: 62.9 },
      { x: "SP-3", y: 61.3 },
      { x: "Train", y: 61.2 },
    ]
  },
  {
    id: "10:00",
    data: [
      { x: "Pit 1", y: 62.4 },
      { x: "Pit 2", y: 61.6 },
      { x: "Pit 3", y: 60.8 },
      { x: "SP-1", y: 62.0 },
      { x: "SP-2", y: 62.7 },
      { x: "SP-3", y: 61.1 },
      { x: "Train", y: 61.0 },
    ]
  },
  {
    id: "12:00",
    data: [
      { x: "Pit 1", y: 62.3 },
      { x: "Pit 2", y: 61.4 },
      { x: "Pit 3", y: 60.5 },
      { x: "SP-1", y: 61.9 },
      { x: "SP-2", y: 62.6 },
      { x: "SP-3", y: 60.9 },
      { x: "Train", y: 60.8 },
    ]
  },
  {
    id: "14:00",
    data: [
      { x: "Pit 1", y: 62.5 },
      { x: "Pit 2", y: 61.7 },
      { x: "Pit 3", y: 60.6 },
      { x: "SP-1", y: 62.1 },
      { x: "SP-2", y: 62.8 },
      { x: "SP-3", y: 61.0 },
      { x: "Train", y: 61.2 },
    ]
  },
];

// Custom color scale for grade deviation
const getGradeColor = (value) => {
  if (value >= 62.5) return '#059669'; // Dark green - Excellent
  if (value >= 62.0) return '#10B981'; // Green - On spec
  if (value >= 61.5) return '#FBBF24'; // Yellow - Warning
  if (value >= 61.0) return '#F97316'; // Orange - At risk
  return '#DC2626'; // Red - Critical
};

// Tab component
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
        transition: 'all 0.2s ease',
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

// KPI Mini Card
function KPIMini({ label, value, status, suffix = '' }) {
  const colors = {
    good: { bg: '#ECFDF5', text: '#059669', border: '#10B981' },
    warning: { bg: '#FFFBEB', text: '#B45309', border: '#F59E0B' },
    critical: { bg: '#FEF2F2', text: '#DC2626', border: '#EF4444' },
  };
  const c = colors[status] || colors.warning;
  
  return (
    <div style={{
      padding: '12px 16px',
      background: c.bg,
      borderRadius: '8px',
      borderLeft: `4px solid ${c.border}`,
      minWidth: '120px',
    }}>
      <div style={{ fontSize: '10px', color: '#6B7280', marginBottom: '4px', textTransform: 'uppercase' }}>
        {label}
      </div>
      <div style={{ fontSize: '20px', fontWeight: '700', color: c.text }}>
        {value}{suffix}
      </div>
    </div>
  );
}

// Grade Heatmap Component
function GradeDeviationHeatmap({ onCellClick }) {
  const [hoveredCell, setHoveredCell] = useState(null);
  
  return (
    <div style={{
      background: 'white',
      borderRadius: '8px',
      border: '1px solid #E2E8F0',
      padding: '16px',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
      }}>
        <div>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#1A1A2E' }}>
            Grade Deviation Heatmap
          </div>
          <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>
            Fe% readings across value chain over time — Spec: ≥62.0%
          </div>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          background: '#FEF2F2',
          borderRadius: '6px',
        }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444' }} />
          <span style={{ fontSize: '10px', color: '#991B1B', fontWeight: '600' }}>3 Below Spec</span>
        </div>
      </div>
      
      <div style={{ height: '220px' }}>
        <ResponsiveHeatMap
          data={gradeHeatmapData}
          margin={{ top: 10, right: 30, bottom: 40, left: 60 }}
          valueFormat=">-.1f"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 0,
            tickPadding: 10,
            tickRotation: 0,
            legend: 'Value Chain Location',
            legendPosition: 'middle',
            legendOffset: 32,
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 10,
            tickRotation: 0,
            legend: 'Time',
            legendPosition: 'middle',
            legendOffset: -50,
          }}
          colors={(cell) => getGradeColor(cell.value)}
          emptyColor="#f5f5f5"
          borderColor="#ffffff"
          borderWidth={3}
          borderRadius={4}
          labelTextColor="#ffffff"
          label={(cell) => `${cell.value.toFixed(1)}`}
          legends={[]}
          annotations={[]}
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
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '16px',
        marginTop: '16px',
        paddingTop: '12px',
        borderTop: '1px solid #F0F0F0',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '14px', height: '14px', borderRadius: '3px', background: '#059669' }} />
          <span style={{ fontSize: '10px', color: '#6B7280' }}>≥62.5% Excellent</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '14px', height: '14px', borderRadius: '3px', background: '#10B981' }} />
          <span style={{ fontSize: '10px', color: '#6B7280' }}>≥62.0% On Spec</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '14px', height: '14px', borderRadius: '3px', background: '#FBBF24' }} />
          <span style={{ fontSize: '10px', color: '#6B7280' }}>61.5-62% Warning</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '14px', height: '14px', borderRadius: '3px', background: '#F97316' }} />
          <span style={{ fontSize: '10px', color: '#6B7280' }}>61-61.5% At Risk</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '14px', height: '14px', borderRadius: '3px', background: '#DC2626' }} />
          <span style={{ fontSize: '10px', color: '#6B7280' }}>&lt;61% Critical</span>
        </div>
      </div>

      {/* Insight */}
      {hoveredCell && (
        <div style={{
          marginTop: '12px',
          padding: '10px 14px',
          background: '#F9FAFB',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <div style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: getGradeColor(hoveredCell.value),
          }} />
          <span style={{ fontSize: '12px', color: '#4B5563' }}>
            <strong>{hoveredCell.serieId}</strong> at <strong>{hoveredCell.data.x}</strong>: {hoveredCell.value.toFixed(1)}% Fe
            {hoveredCell.value < 62.0 && <span style={{ color: '#DC2626' }}> — Below spec by {(62.0 - hoveredCell.value).toFixed(1)}%</span>}
          </span>
        </div>
      )}
    </div>
  );
}

// Deviation Sources Panel (compact)
function DeviationSourcesPanel({ sources }) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '8px',
      border: '1px solid #E2E8F0',
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '12px 16px',
        background: '#F9FAFB',
        borderBottom: '1px solid #E2E8F0',
      }}>
        <div style={{ fontSize: '12px', fontWeight: '600', color: '#1A1A2E' }}>
          Deviation Entry Points
        </div>
        <div style={{ fontSize: '10px', color: '#6B7280', marginTop: '2px' }}>
          Ranked by confidence
        </div>
      </div>
      
      <div style={{ padding: '8px' }}>
        {sources
          .sort((a, b) => b.confidence - a.confidence)
          .map((source, idx) => (
          <div
            key={source.id}
            style={{
              padding: '12px',
              background: idx === 0 ? '#FEF2F2' : (idx % 2 === 0 ? '#FAFAFA' : 'white'),
              borderRadius: '6px',
              marginBottom: '6px',
              borderLeft: `4px solid ${idx === 0 ? '#EF4444' : idx === 1 ? '#F59E0B' : '#10B981'}`,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
              <div>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#1A1A2E' }}>
                  {source.location}
                </span>
                {idx === 0 && (
                  <span style={{
                    marginLeft: '8px',
                    padding: '2px 6px',
                    background: '#EF4444',
                    color: 'white',
                    borderRadius: '3px',
                    fontSize: '8px',
                    fontWeight: '700',
                  }}>
                    PRIMARY
                  </span>
                )}
              </div>
              <span style={{
                fontSize: '12px',
                fontWeight: '700',
                color: '#EF4444',
              }}>
                {source.impact >= 0 ? '+' : ''}{source.impact.toFixed(2)}%
              </span>
            </div>
            
            <div style={{ fontSize: '10px', color: '#6B7280', marginBottom: '8px' }}>
              {source.evidence}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{
                  width: '50px',
                  height: '4px',
                  background: '#E5E7EB',
                  borderRadius: '2px',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    width: `${source.confidence * 100}%`,
                    height: '100%',
                    background: source.confidence >= 0.7 ? '#10B981' : '#F59E0B',
                  }} />
                </div>
                <span style={{ fontSize: '10px', fontWeight: '600', color: '#6B7280' }}>
                  {Math.round(source.confidence * 100)}%
                </span>
              </div>
              <span style={{
                fontSize: '9px',
                padding: '2px 6px',
                background: '#ECFDF5',
                color: '#059669',
                borderRadius: '3px',
                fontWeight: '500',
              }}>
                {source.recommendation}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Icons
const Icons = {
  heatmap: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  flow: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
  chart: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  table: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/></svg>,
};

// Processing step indicator
function ProcessingStepIndicator({ steps, currentStep }) {
  return (
    <div style={{
      padding: '32px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px',
    }}>
      <LoadingSpinner size={32} />
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '14px', fontWeight: '600', color: '#1A1A2E', marginBottom: '6px' }}>
          Analyzing Grade Deviation
        </div>
        <div style={{ fontSize: '12px', color: '#6B7280' }}>
          {steps[currentStep]}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
        {steps.map((step, idx) => (
          <div
            key={idx}
            style={{
              width: '40px',
              height: '4px',
              borderRadius: '2px',
              background: idx <= currentStep ? '#A100FF' : '#E2E8F0',
              transition: 'background 0.3s ease',
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function WAIODeviationTraceStage({ data, onComplete, onNodeSelect }) {
  const [activeTab, setActiveTab] = useState('heatmap');
  const [selectedNode, setSelectedNode] = useState(null);
  const hasCompletedRef = useRef(false);

  const traceData = data || waioDeviationTrace;
  
  // Progressive loading states
  const [loadingStep, setLoadingStep] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [showHeader, setShowHeader] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showTabs, setShowTabs] = useState(false);
  const [showTabContent, setShowTabContent] = useState(false);
  
  const loadingSteps = [
    'Querying value chain data...',
    'Tracing grade through pit → stockpile → train...',
    'Identifying deviation sources...',
    'Calculating confidence scores...',
    'Generating visualizations...',
  ];

  // Progressive loading sequence
  useEffect(() => {
    const timers = [
      setTimeout(() => setLoadingStep(1), 500),
      setTimeout(() => setLoadingStep(2), 900),
      setTimeout(() => setLoadingStep(3), 1300),
      setTimeout(() => setLoadingStep(4), 1700),
      setTimeout(() => { setShowContent(true); setShowHeader(true); }, 2100),
      setTimeout(() => setShowBanner(true), 2400),
      setTimeout(() => setShowTabs(true), 2700),
      setTimeout(() => setShowTabContent(true), 3000),
    ];
    
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  // Completion trigger
  useEffect(() => {
    if (showTabContent && !hasCompletedRef.current) {
      hasCompletedRef.current = true;
      setTimeout(() => onComplete?.(), 800);
    }
  }, [showTabContent, onComplete]);

  const handleNodeSelect = (nodeId) => {
    setSelectedNode(nodeId);
    onNodeSelect?.(nodeId);
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '8px',
      border: '1px solid #E2E8F0',
      overflow: 'hidden',
    }}>
      {/* Initial loading state */}
      {!showContent && (
        <ProcessingStepIndicator steps={loadingSteps} currentStep={loadingStep} />
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
                  <div style={{ 
                    fontSize: '15px', 
                    fontWeight: '700', 
                    color: 'white',
                    marginBottom: '4px',
                  }}>
                    End-to-End Deviation Analysis
                  </div>
                  <div style={{ fontSize: '11px', color: '#9CA3AF' }}>
                    Tracing grade drift across pit → stockpile → train → port
                  </div>
                </div>
                
                {/* Quick Stats */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{
                    padding: '6px 12px',
                    background: 'rgba(239, 68, 68, 0.2)',
                    borderRadius: '6px',
                    textAlign: 'center',
                    animation: 'scaleIn 0.3s ease-out 0.2s both',
                  }}>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#FCA5A5' }}>
                      -{(traceData.targetGrade - traceData.predictedGrade).toFixed(1)}%
                    </div>
                    <div style={{ fontSize: '9px', color: '#FCA5A5' }}>Total Dev.</div>
                  </div>
                  <div style={{
                    padding: '6px 12px',
                    background: 'rgba(161, 0, 255, 0.2)',
                    borderRadius: '6px',
                    textAlign: 'center',
                    animation: 'scaleIn 0.3s ease-out 0.3s both',
                  }}>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#D8B4FE' }}>
                      {traceData.deviationSources.length}
                    </div>
                    <div style={{ fontSize: '9px', color: '#D8B4FE' }}>Sources</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Key Finding Banner */}
          {showBanner && (
            <div style={{
              padding: '12px 20px',
              background: 'linear-gradient(90deg, #FEF2F2 0%, #FFF7ED 100%)',
              borderBottom: '1px solid #FECACA',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              animation: 'fadeSlideUp 0.4s ease-out',
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#EF4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#991B1B', marginBottom: '2px' }}>
                  PRIMARY DEVIATION SOURCE IDENTIFIED
                </div>
                <div style={{ fontSize: '12px', color: '#7F1D1D' }}>
                  SP-3 Reclaim → Train Loadout: Blend ratio misconfigured due to 6h assay lag + unrecorded dozer rehandle
                </div>
              </div>
            </div>
          )}

          {/* Tab Navigation */}
          {showTabs && (
            <div style={{
              padding: '10px 20px',
              background: '#FAFAFA',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              gap: '8px',
              animation: 'fadeIn 0.3s ease-out',
            }}>
              <Tab label="Grade Heatmap" isActive={activeTab === 'heatmap'} onClick={() => setActiveTab('heatmap')} icon={Icons.heatmap} />
              <Tab label="Flow Diagram" isActive={activeTab === 'flow'} onClick={() => setActiveTab('flow')} icon={Icons.flow} />
              <Tab label="Impact Chart" isActive={activeTab === 'waterfall'} onClick={() => setActiveTab('waterfall')} icon={Icons.chart} />
              <Tab label="Evidence" isActive={activeTab === 'evidence'} onClick={() => setActiveTab('evidence')} icon={Icons.table} />
            </div>
          )}

          {/* Content */}
          {showTabContent && (
            <div style={{ padding: '16px 20px', animation: 'fadeSlideUp 0.4s ease-out' }}>
              {activeTab === 'heatmap' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '16px' }}>
                  <GradeDeviationHeatmap onCellClick={(cell) => console.log('Cell clicked:', cell)} />
                  <DeviationSourcesPanel sources={traceData.deviationSources} />
                </div>
              )}

              {activeTab === 'flow' && (
                <GradeTraceSankey
                  nodes={traceData.traceNodes}
                  links={traceData.traceLinks}
                  onSelectNode={handleNodeSelect}
                  title="Grade Flow: Pit to Ship"
                  subtitle="Click nodes to view grade details and confidence levels"
                />
              )}

              {activeTab === 'waterfall' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '16px' }}>
                  <DeviationWaterfall
                    data={{
                      targetGrade: traceData.targetGrade,
                      predictedGrade: traceData.predictedGrade,
                      deviationSources: traceData.deviationSources,
                    }}
                    title="Grade Deviation Breakdown"
                    showEvidence={false}
                  />
                  <DeviationSourcesPanel sources={traceData.deviationSources} />
                </div>
              )}

              {activeTab === 'evidence' && (
                <div style={{
                  background: '#F9FAFB',
                  borderRadius: '8px',
                  overflow: 'hidden',
                }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#A100FF' }}>
                        <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '10px', color: 'white', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '700' }}>
                          Location
                        </th>
                        <th style={{ textAlign: 'center', padding: '12px 16px', fontSize: '10px', color: 'white', textTransform: 'uppercase', fontWeight: '700' }}>
                          Type
                        </th>
                        <th style={{ textAlign: 'center', padding: '12px 16px', fontSize: '10px', color: 'white', textTransform: 'uppercase', fontWeight: '700' }}>
                          Impact
                        </th>
                        <th style={{ textAlign: 'center', padding: '12px 16px', fontSize: '10px', color: 'white', textTransform: 'uppercase', fontWeight: '700' }}>
                          Confidence
                        </th>
                        <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '10px', color: 'white', textTransform: 'uppercase', fontWeight: '700' }}>
                          Evidence
                        </th>
                        <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '10px', color: 'white', textTransform: 'uppercase', fontWeight: '700' }}>
                          Recommendation
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {traceData.deviationSources
                        .sort((a, b) => b.confidence - a.confidence)
                        .map((source, idx) => (
                        <tr 
                          key={source.id}
                          style={{ 
                            borderBottom: '1px solid #E2E8F0',
                            background: idx === 0 ? '#FEF2F2' : idx % 2 === 0 ? '#FAFAFA' : 'white',
                          }}
                        >
                          <td style={{ padding: '14px 16px', fontSize: '12px', fontWeight: '600', color: '#1A1A2E' }}>
                            {source.location}
                            {idx === 0 && (
                              <span style={{ marginLeft: '8px', padding: '2px 6px', background: '#EF4444', color: 'white', borderRadius: '4px', fontSize: '9px', fontWeight: '600' }}>
                                PRIMARY
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '14px 16px', fontSize: '11px', color: '#6B7280', textAlign: 'center' }}>
                            <span style={{ padding: '4px 8px', background: '#EEF2FF', borderRadius: '4px', color: '#4338CA', fontWeight: '500' }}>
                              {source.type.replace('_', ' ')}
                            </span>
                          </td>
                          <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '700', color: '#EF4444', textAlign: 'center' }}>
                            {source.impact >= 0 ? '+' : ''}{source.impact.toFixed(2)}%
                          </td>
                          <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                              <div style={{ width: '50px', height: '6px', background: '#E5E7EB', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{ width: `${source.confidence * 100}%`, height: '100%', background: source.confidence >= 0.7 ? '#10B981' : '#F59E0B', borderRadius: '3px' }} />
                              </div>
                              <span style={{ fontSize: '11px', fontWeight: '600', color: source.confidence >= 0.7 ? '#10B981' : '#F59E0B' }}>
                                {Math.round(source.confidence * 100)}%
                              </span>
                            </div>
                          </td>
                          <td style={{ padding: '14px 16px', fontSize: '11px', color: '#4B5563' }}>
                            {source.evidence}
                          </td>
                          <td style={{ padding: '14px 16px', fontSize: '11px', color: '#059669', fontWeight: '500' }}>
                            {source.recommendation}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </>
      )}
      
      <style jsx>{progressiveLoaderStyles}</style>
    </div>
  );
}

export { Tab, GradeDeviationHeatmap, DeviationSourcesPanel };
