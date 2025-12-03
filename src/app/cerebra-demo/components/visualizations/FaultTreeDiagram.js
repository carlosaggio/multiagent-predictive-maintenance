"use client";

import React, { useState, useEffect } from 'react';
import { faultTreeData, getProbabilityColor, severityColors } from '../../data/faultTreeData';

// Custom Fault Tree without external library for better control
export default function FaultTreeDiagram({ onSelectScenario, isAnimating = true }) {
  const [visibleNodes, setVisibleNodes] = useState(0);
  const [selectedNode, setSelectedNode] = useState(null);
  const [expandedNode, setExpandedNode] = useState(null);

  // Get top fault modes from categories
  const faultModes = faultTreeData.children.flatMap(category =>
    category.children.map(item => ({
      id: item.id,
      label: item.name,
      probability: item.probability,
      color: getProbabilityColor(item.probability),
      evidence: item.evidence?.[0] || '',
      category: category.name,
      severity: item.severity,
      recommendation: item.recommendation,
      allEvidence: item.evidence || [],
      riskPriorityNumber: item.riskPriorityNumber,
    }))
  ).sort((a, b) => b.probability - a.probability).slice(0, 4);

  useEffect(() => {
    if (isAnimating) {
      // Animate nodes appearing one by one
      const timer = setInterval(() => {
        setVisibleNodes(prev => {
          if (prev >= faultModes.length) {
            clearInterval(timer);
            return prev;
          }
          return prev + 1;
        });
      }, 600);
      return () => clearInterval(timer);
    } else {
      setVisibleNodes(faultModes.length);
    }
  }, [isAnimating]);

  const handleNodeClick = (mode) => {
    setSelectedNode(mode.id);
    if (onSelectScenario) {
      onSelectScenario(mode);
    }
  };

  return (
    <div style={{ 
      background: 'white', 
      borderRadius: '8px', 
      padding: '16px',
      border: '1px solid #e2e8f0'
    }}>
      {/* Root Node */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{
          background: '#1a1a2e',
          color: 'white',
          padding: '8px 20px',
          borderRadius: '6px',
          fontSize: '11px',
          fontWeight: '600',
          textAlign: 'center',
          marginBottom: '6px'
        }}>
          Primary Crusher <span style={{ color: '#EF4444', marginLeft: '8px' }}>89% → 82%</span>
        </div>

        {/* Connector line */}
        <div style={{ width: '1px', height: '16px', background: '#d1d5db' }} />

        {/* OR Gate */}
        <div style={{
          background: '#f9fafb',
          border: '1px solid #d1d5db',
          borderRadius: '3px',
          padding: '2px 10px',
          fontSize: '9px',
          fontWeight: '600',
          color: '#6b7280',
          marginBottom: '6px'
        }}>
          OR
        </div>

        {/* Connector lines to children */}
        <div style={{ 
          width: '85%', 
          height: '1px', 
          background: '#d1d5db',
          position: 'relative'
        }}>
          {/* Vertical lines down */}
          <div style={{ position: 'absolute', left: '0%', top: '0', width: '1px', height: '14px', background: '#d1d5db' }} />
          <div style={{ position: 'absolute', left: '33%', top: '0', width: '1px', height: '14px', background: '#d1d5db' }} />
          <div style={{ position: 'absolute', left: '66%', top: '0', width: '1px', height: '14px', background: '#d1d5db' }} />
          <div style={{ position: 'absolute', left: '100%', top: '0', width: '1px', height: '14px', background: '#d1d5db' }} />
        </div>

        {/* Fault Mode Nodes */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '10px', 
          width: '100%',
          marginTop: '14px'
        }}>
          {faultModes.map((mode, index) => (
            <div
              key={mode.id}
              onClick={() => handleNodeClick(mode)}
              style={{
                opacity: index < visibleNodes ? 1 : 0,
                transform: index < visibleNodes ? 'translateY(0)' : 'translateY(-8px)',
                transition: 'all 0.3s ease-out',
                cursor: 'pointer',
                background: selectedNode === mode.id ? `${mode.color}08` : 'white',
                border: `1px solid ${selectedNode === mode.id ? mode.color : '#e5e7eb'}`,
                borderRadius: '6px',
                padding: '10px 8px',
                textAlign: 'center',
              }}
            >
              {/* Probability circle */}
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: `${mode.color}15`,
                border: `2px solid ${mode.color}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 6px',
                fontSize: '11px',
                fontWeight: '700',
                color: mode.color
              }}>
                {mode.probability}%
              </div>
              
              <div style={{ 
                fontSize: '10px', 
                fontWeight: '600', 
                color: '#1a1a2e',
                lineHeight: '1.2'
              }}>
                {mode.label}
              </div>

              {/* Probability bar */}
              <div style={{
                height: '3px',
                background: '#E5E7EB',
                borderRadius: '2px',
                marginTop: '6px',
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  width: `${mode.probability}%`,
                  background: mode.color,
                  borderRadius: '2px',
                  transition: 'width 0.4s ease',
                }} />
              </div>

              {selectedNode === mode.id && (
                <div style={{
                  marginTop: '6px',
                  fontSize: '8px',
                  color: mode.color,
                  fontWeight: '600',
                  letterSpacing: '0.3px'
                }}>
                  SELECTED
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Compact Detail Panel */}
      {selectedNode && (
        <div style={{
          marginTop: '12px',
          padding: '12px 16px',
          background: 'white',
          borderRadius: '6px',
          border: `1px solid ${faultModes.find(m => m.id === selectedNode)?.color || '#E2E8F0'}`,
          borderLeft: `3px solid ${faultModes.find(m => m.id === selectedNode)?.color || '#E2E8F0'}`,
        }}>
          {(() => {
            const mode = faultModes.find(m => m.id === selectedNode);
            if (!mode) return null;
            return (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#1A1A2E', marginBottom: '2px' }}>
                    {mode.label}
                  </div>
                  <div style={{ fontSize: '10px', color: '#6B7280' }}>
                    {mode.recommendation} • RPN: {mode.riskPriorityNumber}
                  </div>
                </div>
                <div style={{
                  padding: '4px 10px',
                  background: mode.severity === 'critical' ? '#FEE2E2' : mode.severity === 'high' ? '#FEF3C7' : '#D1FAE5',
                  color: mode.severity === 'critical' ? '#991B1B' : mode.severity === 'high' ? '#92400E' : '#065F46',
                  fontSize: '9px',
                  fontWeight: '600',
                  borderRadius: '12px',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                }}>
                  {mode.severity}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Legend - inline */}
      <div style={{ 
        marginTop: '12px', 
        display: 'flex',
        justifyContent: 'center',
        gap: '12px',
        fontSize: '9px',
        color: '#9ca3af'
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#EF4444' }} />
          Critical
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F59E0B' }} />
          High
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FBBF24' }} />
          Medium
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} />
          Low
        </span>
      </div>
    </div>
  );
}

