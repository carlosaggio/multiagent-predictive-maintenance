"use client";

import React, { useState, useEffect, useRef } from 'react';
import GradeTraceSankey from '../../charts/GradeTraceSankey';
import DeviationWaterfall from '../../charts/DeviationWaterfall';
import { waioDeviationTrace } from '../../../data/waio/waioScenarioContext';

/**
 * WAIO Deviation Trace Stage Component
 * 
 * Shows end-to-end grade trace and deviation entry points.
 */

// Tab component
function Tab({ label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '10px 20px',
        background: isActive ? '#A100FF' : 'transparent',
        color: isActive ? 'white' : '#6B7280',
        border: 'none',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
    >
      {label}
    </button>
  );
}

export default function WAIODeviationTraceStage({ data, onComplete, onNodeSelect }) {
  const [activeTab, setActiveTab] = useState('sankey');
  const [selectedNode, setSelectedNode] = useState(null);
  const hasCompletedRef = useRef(false);

  const traceData = data || waioDeviationTrace;

  // Simulate completion after animation - only call once
  useEffect(() => {
    if (hasCompletedRef.current) return;
    
    const timer = setTimeout(() => {
      if (!hasCompletedRef.current) {
        hasCompletedRef.current = true;
        onComplete?.();
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, []); // Empty dependency array - only run once on mount

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
      {/* Header */}
      <div style={{
        padding: '20px',
        background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2D44 100%)',
      }}>
        <div style={{ 
          fontSize: '16px', 
          fontWeight: '700', 
          color: 'white',
          marginBottom: '8px',
        }}>
          End-to-End Deviation Trace
        </div>
        <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
          Identifying where grade deviation is introduced across pit → stockpile → train → port
        </div>
      </div>

      {/* Key takeaways */}
      <div style={{
        padding: '16px 20px',
        background: '#FEF2F2',
        borderBottom: '1px solid #FEE2E2',
      }}>
        <div style={{ 
          fontSize: '11px', 
          fontWeight: '600', 
          color: '#991B1B',
          marginBottom: '8px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}>
          Key Finding
        </div>
        <div style={{ fontSize: '13px', color: '#991B1B', fontWeight: '500' }}>
          Deviation introduced between <strong>SP-3 Reclaim</strong> and <strong>Train Loadout</strong>: 
          blending window misconfigured due to assay lag (6h) + unrecorded dozer rehandle.
        </div>
      </div>

      {/* Tab navigation */}
      <div style={{
        padding: '12px 20px',
        background: '#F9FAFB',
        borderBottom: '1px solid #E2E8F0',
        display: 'flex',
        gap: '8px',
      }}>
        <Tab 
          label="Flow Diagram" 
          isActive={activeTab === 'sankey'}
          onClick={() => setActiveTab('sankey')}
        />
        <Tab 
          label="Impact Waterfall" 
          isActive={activeTab === 'waterfall'}
          onClick={() => setActiveTab('waterfall')}
        />
        <Tab 
          label="Evidence Table" 
          isActive={activeTab === 'evidence'}
          onClick={() => setActiveTab('evidence')}
        />
      </div>

      {/* Content */}
      <div style={{ padding: '20px' }}>
        {activeTab === 'sankey' && (
          <GradeTraceSankey
            nodes={traceData.traceNodes}
            links={traceData.traceLinks}
            onSelectNode={handleNodeSelect}
            title="Grade Flow: Pit to Ship"
            subtitle="Click nodes to view grade details and confidence levels"
          />
        )}

        {activeTab === 'waterfall' && (
          <DeviationWaterfall
            data={{
              targetGrade: traceData.targetGrade,
              predictedGrade: traceData.predictedGrade,
              deviationSources: traceData.deviationSources,
            }}
            title="Grade Deviation Breakdown"
            showEvidence={false}
          />
        )}

        {activeTab === 'evidence' && (
          <div>
            <div style={{ 
              fontSize: '14px', 
              fontWeight: '600', 
              color: '#1A1A2E',
              marginBottom: '16px',
            }}>
              Most Likely Deviation Entry Points
            </div>
            
            <div style={{
              background: '#F9FAFB',
              borderRadius: '8px',
              overflow: 'hidden',
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#F3F4F6' }}>
                    <th style={{ 
                      textAlign: 'left', 
                      padding: '12px 16px', 
                      fontSize: '10px', 
                      color: '#6B7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}>
                      Location
                    </th>
                    <th style={{ 
                      textAlign: 'center', 
                      padding: '12px 16px', 
                      fontSize: '10px', 
                      color: '#6B7280',
                      textTransform: 'uppercase',
                    }}>
                      Type
                    </th>
                    <th style={{ 
                      textAlign: 'center', 
                      padding: '12px 16px', 
                      fontSize: '10px', 
                      color: '#6B7280',
                      textTransform: 'uppercase',
                    }}>
                      Impact
                    </th>
                    <th style={{ 
                      textAlign: 'center', 
                      padding: '12px 16px', 
                      fontSize: '10px', 
                      color: '#6B7280',
                      textTransform: 'uppercase',
                    }}>
                      Confidence
                    </th>
                    <th style={{ 
                      textAlign: 'left', 
                      padding: '12px 16px', 
                      fontSize: '10px', 
                      color: '#6B7280',
                      textTransform: 'uppercase',
                    }}>
                      Evidence
                    </th>
                    <th style={{ 
                      textAlign: 'left', 
                      padding: '12px 16px', 
                      fontSize: '10px', 
                      color: '#6B7280',
                      textTransform: 'uppercase',
                    }}>
                      Recommended Fix
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
                        background: idx === 0 ? '#FEF2F2' : 'white',
                      }}
                    >
                      <td style={{ 
                        padding: '14px 16px', 
                        fontSize: '12px', 
                        fontWeight: '600',
                        color: '#1A1A2E',
                      }}>
                        {source.location}
                        {idx === 0 && (
                          <span style={{
                            marginLeft: '8px',
                            padding: '2px 6px',
                            background: '#EF4444',
                            color: 'white',
                            borderRadius: '4px',
                            fontSize: '9px',
                            fontWeight: '600',
                          }}>
                            PRIMARY
                          </span>
                        )}
                      </td>
                      <td style={{ 
                        padding: '14px 16px', 
                        fontSize: '11px', 
                        color: '#6B7280',
                        textAlign: 'center',
                      }}>
                        <span style={{
                          padding: '4px 8px',
                          background: '#EEF2FF',
                          borderRadius: '4px',
                          color: '#4338CA',
                          fontWeight: '500',
                        }}>
                          {source.type.replace('_', ' ')}
                        </span>
                      </td>
                      <td style={{ 
                        padding: '14px 16px', 
                        fontSize: '12px', 
                        fontWeight: '700',
                        color: '#EF4444',
                        textAlign: 'center',
                      }}>
                        {source.impact >= 0 ? '+' : ''}{source.impact.toFixed(2)}%
                      </td>
                      <td style={{ 
                        padding: '14px 16px', 
                        textAlign: 'center',
                      }}>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}>
                          <div style={{
                            width: '50px',
                            height: '6px',
                            background: '#E5E7EB',
                            borderRadius: '3px',
                            overflow: 'hidden',
                          }}>
                            <div style={{
                              width: `${source.confidence * 100}%`,
                              height: '100%',
                              background: source.confidence >= 0.7 ? '#10B981' : '#F59E0B',
                              borderRadius: '3px',
                            }} />
                          </div>
                          <span style={{ 
                            fontSize: '11px', 
                            fontWeight: '600',
                            color: source.confidence >= 0.7 ? '#10B981' : '#F59E0B',
                          }}>
                            {Math.round(source.confidence * 100)}%
                          </span>
                        </div>
                      </td>
                      <td style={{ 
                        padding: '14px 16px', 
                        fontSize: '11px', 
                        color: '#4B5563',
                      }}>
                        {source.evidence}
                      </td>
                      <td style={{ 
                        padding: '14px 16px', 
                        fontSize: '11px', 
                        color: '#059669',
                        fontWeight: '500',
                      }}>
                        {source.recommendation}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export { Tab };
