"use client";

import React, { useState } from 'react';

/**
 * Grade Trace Flow Diagram Component
 * 
 * Custom visual flow showing pit → stockpile → train → ship grade flow.
 * Built with CSS for clean, readable labels without truncation.
 */

// Node type colors
const NODE_COLORS = {
  pit: '#6366F1',      // Indigo for pit blocks
  stockpile: '#F59E0B', // Amber for stockpiles
  train: '#A100FF',     // Purple for trains
  ship: '#10B981',      // Green for ships
};

// Risk colors for grades
const getGradeColor = (grade, spec = 62.0) => {
  if (grade >= spec + 0.3) return '#10B981'; // Good
  if (grade >= spec) return '#F59E0B'; // Warning
  return '#EF4444'; // Critical
};

const getRiskBadge = (risk) => {
  const styles = {
    high: { bg: '#FEE2E2', color: '#991B1B', text: 'HIGH' },
    medium: { bg: '#FEF3C7', color: '#92400E', text: 'MED' },
    low: { bg: '#D1FAE5', color: '#065F46', text: 'LOW' },
  };
  return styles[risk] || styles.low;
};

// Default demo data
const DEFAULT_FLOW_DATA = {
  pits: [
    { id: 'PIT3-ZB', name: 'Pit 3 Zone B', grade: 61.9, tonnes: 45000, confidence: 0.68, risk: 'high' },
    { id: 'PIT1-ZA', name: 'Pit 1 Zone A', grade: 62.6, tonnes: 75000, confidence: 0.85, risk: 'low' },
  ],
  stockpiles: [
    { id: 'SP-3', name: 'SP-3 (Blended)', grade: 62.1, tonnes: 80000, confidence: 0.72, risk: 'medium', sources: ['PIT3-ZB', 'PIT1-ZA'] },
    { id: 'SP-2', name: 'SP-2 (High Fe)', grade: 62.9, tonnes: 40000, confidence: 0.86, risk: 'low', sources: ['PIT1-ZA'] },
  ],
  trains: [
    { id: 'TRAIN-07', name: 'Train 07', grade: 61.2, tonnes: 28000, confidence: 0.65, risk: 'high', sources: ['SP-3', 'SP-2'] },
  ],
  ships: [
    { id: 'SHIP-PKS', name: 'MV Pacific Star', grade: 62.1, tonnes: 180000, confidence: 0.80, risk: 'low', sources: ['TRAIN-07'] },
  ],
};

// Flow Node Component
function FlowNode({ node, type, isSelected, onClick }) {
  const color = NODE_COLORS[type];
  const gradeColor = getGradeColor(node.grade);
  const riskBadge = getRiskBadge(node.risk);
  
  return (
    <div
      onClick={() => onClick?.(node)}
      style={{
        background: isSelected ? `${color}10` : 'white',
        border: `2px solid ${isSelected ? color : '#E2E8F0'}`,
        borderRadius: '10px',
        padding: '12px 14px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        minWidth: '140px',
        position: 'relative',
      }}
    >
      {/* Type indicator */}
      <div style={{
        position: 'absolute',
        top: '-8px',
        left: '12px',
        background: color,
        color: 'white',
        fontSize: '9px',
        fontWeight: '700',
        padding: '2px 8px',
        borderRadius: '10px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
      }}>
        {type}
      </div>
      
      {/* Node name */}
      <div style={{
        fontSize: '13px',
        fontWeight: '700',
        color: '#1A1A2E',
        marginTop: '4px',
        marginBottom: '8px',
      }}>
        {node.name}
      </div>
      
      {/* Grade */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '6px',
      }}>
        <span style={{ fontSize: '11px', color: '#6B7280' }}>Grade (Fe)</span>
        <span style={{
          fontSize: '14px',
          fontWeight: '700',
          color: gradeColor,
        }}>
          {node.grade.toFixed(1)}%
        </span>
      </div>
      
      {/* Tonnes */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '6px',
      }}>
        <span style={{ fontSize: '11px', color: '#6B7280' }}>Volume</span>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#374151' }}>
          {(node.tonnes / 1000).toFixed(0)}kt
        </span>
      </div>
      
      {/* Confidence bar */}
      <div style={{ marginBottom: '8px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '4px',
        }}>
          <span style={{ fontSize: '10px', color: '#6B7280' }}>Confidence</span>
          <span style={{ fontSize: '10px', fontWeight: '600', color: '#374151' }}>
            {Math.round(node.confidence * 100)}%
          </span>
        </div>
        <div style={{
          height: '4px',
          background: '#E5E7EB',
          borderRadius: '2px',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${node.confidence * 100}%`,
            background: node.confidence >= 0.8 ? '#10B981' : node.confidence >= 0.7 ? '#F59E0B' : '#EF4444',
            borderRadius: '2px',
            transition: 'width 0.3s ease',
          }} />
        </div>
      </div>
      
      {/* Risk badge */}
      <div style={{
        display: 'inline-block',
        background: riskBadge.bg,
        color: riskBadge.color,
        fontSize: '9px',
        fontWeight: '700',
        padding: '3px 8px',
        borderRadius: '4px',
        letterSpacing: '0.5px',
      }}>
        {riskBadge.text} RISK
      </div>
    </div>
  );
}

// Flow Arrow Component
function FlowArrow({ direction = 'right', label, impact }) {
  const isVertical = direction === 'down';
  const impactColor = impact < 0 ? '#EF4444' : impact > 0 ? '#10B981' : '#9CA3AF';
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: isVertical ? 'column' : 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isVertical ? '8px 0' : '0 8px',
      minWidth: isVertical ? 'auto' : '60px',
      minHeight: isVertical ? '40px' : 'auto',
    }}>
      {/* Arrow line */}
      <div style={{
        width: isVertical ? '2px' : '40px',
        height: isVertical ? '24px' : '2px',
        background: `linear-gradient(${isVertical ? 'to bottom' : 'to right'}, #D1D5DB, #9CA3AF)`,
      }} />
      
      {/* Arrow head */}
      <div style={{
        width: 0,
        height: 0,
        borderStyle: 'solid',
        borderWidth: isVertical ? '6px 5px 0 5px' : '5px 0 5px 6px',
        borderColor: isVertical 
          ? '#9CA3AF transparent transparent transparent'
          : 'transparent transparent transparent #9CA3AF',
      }} />
      
      {/* Impact label */}
      {impact !== undefined && impact !== 0 && (
        <div style={{
          position: 'absolute',
          fontSize: '9px',
          fontWeight: '600',
          color: impactColor,
          background: 'white',
          padding: '1px 4px',
          borderRadius: '3px',
          border: `1px solid ${impactColor}30`,
        }}>
          {impact > 0 ? '+' : ''}{impact.toFixed(1)}%
        </div>
      )}
    </div>
  );
}

// Column Header
function ColumnHeader({ title, icon, color }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      marginBottom: '16px',
      padding: '8px 16px',
      background: `${color}10`,
      borderRadius: '8px',
      border: `1px solid ${color}30`,
    }}>
      <div style={{
        width: '24px',
        height: '24px',
        borderRadius: '6px',
        background: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {icon}
      </div>
      <span style={{
        fontSize: '12px',
        fontWeight: '700',
        color: '#1A1A2E',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
      }}>
        {title}
      </span>
    </div>
  );
}

// Legend Component
function Legend() {
  const items = [
    { color: NODE_COLORS.pit, label: 'Pit Blocks' },
    { color: NODE_COLORS.stockpile, label: 'Stockpiles' },
    { color: NODE_COLORS.train, label: 'Trains' },
    { color: NODE_COLORS.ship, label: 'Ships' },
  ];

  return (
    <div style={{
      display: 'flex',
      gap: '20px',
      justifyContent: 'center',
      padding: '12px',
      borderTop: '1px solid #F0F0F0',
      marginTop: '16px',
    }}>
      {items.map(item => (
        <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '14px',
            height: '14px',
            borderRadius: '4px',
            background: item.color,
          }} />
          <span style={{ fontSize: '11px', color: '#4B5563', fontWeight: '500' }}>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

// Icons
const Icons = {
  pit: <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 18.5L4 16V9l8 4v7.5zm1-9L5 7.5 12 4l7 3.5-7 4z"/></svg>,
  stockpile: <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M12 3L2 8v8l10 5 10-5V8L12 3zm0 2.18l6.9 3.45L12 12.08 5.1 8.63 12 5.18zM4 15.09V9.91l7 3.5v5.18l-7-3.5zm9 3.5v-5.18l7-3.5v5.18l-7 3.5z"/></svg>,
  train: <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M12 2c-4 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h2.23l2-2H14l2 2h2v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-3.58-4-8-4zM7.5 17c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm3.5-7H6V6h5v4zm2 0V6h5v4h-5zm3.5 7c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>,
  ship: <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M20 21c-1.39 0-2.78-.47-4-1.32-2.44 1.71-5.56 1.71-8 0C6.78 20.53 5.39 21 4 21H2v2h2c1.38 0 2.74-.35 4-.99 2.52 1.29 5.48 1.29 8 0 1.26.65 2.62.99 4 .99h2v-2h-2zM3.95 19H4c1.6 0 3.02-.88 4-2 .98 1.12 2.4 2 4 2s3.02-.88 4-2c.98 1.12 2.4 2 4 2h.05l1.89-6.68c.08-.26.06-.54-.06-.78s-.34-.42-.6-.5L20 10.62V6c0-1.1-.9-2-2-2h-3V1H9v3H6c-1.1 0-2 .9-2 2v4.62l-1.29.42c-.26.08-.48.26-.6.5s-.15.52-.06.78L3.95 19zM6 6h12v3.97L12 8 6 9.97V6z"/></svg>,
};

export default function GradeTraceSankey({ 
  data = null,
  onSelectNode,
  title = 'Grade Flow: Pit to Ship',
  subtitle = 'Click nodes to view grade details and confidence levels',
}) {
  const [selectedNode, setSelectedNode] = useState(null);
  const flowData = data || DEFAULT_FLOW_DATA;

  const handleNodeClick = (node) => {
    setSelectedNode(selectedNode?.id === node.id ? null : node);
    onSelectNode?.(node.id);
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '8px',
      border: '1px solid #E2E8F0',
    }}>
      {/* Header */}
      <div style={{ padding: '16px 16px 0' }}>
        <div style={{ fontSize: '14px', fontWeight: '700', color: '#1A1A2E' }}>
          {title}
        </div>
        <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '4px' }}>
          {subtitle}
        </div>
      </div>

      {/* Flow Diagram */}
      <div style={{
        padding: '20px 16px',
        overflowX: 'auto',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px',
          minWidth: '700px',
        }}>
          {/* Pit Column */}
          <div>
            <ColumnHeader title="Pit Blocks" icon={Icons.pit} color={NODE_COLORS.pit} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {flowData.pits.map(pit => (
                <FlowNode
                  key={pit.id}
                  node={pit}
                  type="pit"
                  isSelected={selectedNode?.id === pit.id}
                  onClick={handleNodeClick}
                />
              ))}
            </div>
          </div>

          {/* Stockpile Column */}
          <div>
            <ColumnHeader title="Stockpiles" icon={Icons.stockpile} color={NODE_COLORS.stockpile} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {flowData.stockpiles.map(sp => (
                <FlowNode
                  key={sp.id}
                  node={sp}
                  type="stockpile"
                  isSelected={selectedNode?.id === sp.id}
                  onClick={handleNodeClick}
                />
              ))}
            </div>
          </div>

          {/* Train Column */}
          <div>
            <ColumnHeader title="Trains" icon={Icons.train} color={NODE_COLORS.train} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {flowData.trains.map(train => (
                <FlowNode
                  key={train.id}
                  node={train}
                  type="train"
                  isSelected={selectedNode?.id === train.id}
                  onClick={handleNodeClick}
                />
              ))}
            </div>
          </div>

          {/* Ship Column */}
          <div>
            <ColumnHeader title="Ships" icon={Icons.ship} color={NODE_COLORS.ship} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {flowData.ships.map(ship => (
                <FlowNode
                  key={ship.id}
                  node={ship}
                  type="ship"
                  isSelected={selectedNode?.id === ship.id}
                  onClick={handleNodeClick}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Connection Lines Overlay - Simplified visual */}
        <div style={{
          marginTop: '16px',
          padding: '12px',
          background: '#F9FAFB',
          borderRadius: '8px',
          border: '1px solid #E5E7EB',
        }}>
          <div style={{
            fontSize: '11px',
            fontWeight: '600',
            color: '#6B7280',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            Material Flow Summary
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
          }}>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: '10px', color: '#6B7280' }}>Total In</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: NODE_COLORS.pit }}>
                {(flowData.pits.reduce((sum, p) => sum + p.tonnes, 0) / 1000).toFixed(0)}kt
              </div>
            </div>
            <div style={{ color: '#D1D5DB' }}>→</div>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: '10px', color: '#6B7280' }}>Stockpiled</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: NODE_COLORS.stockpile }}>
                {(flowData.stockpiles.reduce((sum, s) => sum + s.tonnes, 0) / 1000).toFixed(0)}kt
              </div>
            </div>
            <div style={{ color: '#D1D5DB' }}>→</div>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: '10px', color: '#6B7280' }}>Loaded</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: NODE_COLORS.train }}>
                {(flowData.trains.reduce((sum, t) => sum + t.tonnes, 0) / 1000).toFixed(0)}kt
              </div>
            </div>
            <div style={{ color: '#D1D5DB' }}>→</div>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: '10px', color: '#6B7280' }}>To Ship</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: NODE_COLORS.ship }}>
                {(flowData.ships.reduce((sum, s) => sum + s.tonnes, 0) / 1000).toFixed(0)}kt
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <Legend />

      {/* Selected node detail panel */}
      {selectedNode && (
        <div style={{
          margin: '0 16px 16px',
          padding: '14px 16px',
          background: '#F5F3FF',
          borderRadius: '8px',
          border: '1px solid #A100FF20',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}>
            <div>
              <div style={{ fontSize: '10px', color: '#6B7280', marginBottom: '2px' }}>Selected</div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#1A1A2E' }}>
                {selectedNode.name}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '24px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '10px', color: '#6B7280' }}>Grade</div>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: getGradeColor(selectedNode.grade),
                }}>
                  {selectedNode.grade.toFixed(1)}%
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '10px', color: '#6B7280' }}>Confidence</div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#1A1A2E' }}>
                  {Math.round(selectedNode.confidence * 100)}%
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '10px', color: '#6B7280' }}>Volume</div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#1A1A2E' }}>
                  {(selectedNode.tonnes / 1000).toFixed(0)}kt
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { FlowNode, Legend, NODE_COLORS, getGradeColor };
