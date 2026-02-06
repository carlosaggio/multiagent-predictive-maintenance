"use client";

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  p2cOntologySchema,
  entityTypes,
  relationshipTypes,
  ENTITY_COLORS,
  p2cGraphNodes,
  p2cGraphEdges,
  highlightPaths,
  getNodeById,
  getEdgesForNode,
  searchNodes,
  lineageSystems,
  lineageEdges,
  lineagePaths,
  agentRuns,
  toolCalls,
  recommendations,
  getDecisionTraceForEntity,
  getUpstreamNodes,
  getDownstreamNodes,
  findPaths,
  getNodeTypes,
  getRelationshipTypes,
} from '../../data/waio/ontology';

/**
 * P2C Ontology Graph Modal
 * 
 * A comprehensive modal for exploring the P2C ontology, instance graph,
 * system lineage, and agent decision traces.
 */

// ============================================================================
// TAB DEFINITIONS
// ============================================================================

const TABS = [
  { id: 'ontology', label: 'Ontology', icon: 'schema' },
  { id: 'instance', label: 'Instance Graph', icon: 'graph' },
  { id: 'lineage', label: 'System Lineage', icon: 'flow' },
  { id: 'decision', label: 'Decision Trace', icon: 'brain' },
];

// ============================================================================
// ICON COMPONENTS
// ============================================================================

const Icons = {
  close: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  search: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  schema: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7"/>
      <rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  graph: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="18" cy="5" r="3"/>
      <circle cx="6" cy="12" r="3"/>
      <circle cx="18" cy="19" r="3"/>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
    </svg>
  ),
  flow: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="16 3 21 3 21 8"/>
      <line x1="4" y1="20" x2="21" y2="3"/>
      <polyline points="21 16 21 21 16 21"/>
      <line x1="15" y1="15" x2="21" y2="21"/>
      <line x1="4" y1="4" x2="9" y2="9"/>
    </svg>
  ),
  brain: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2a4 4 0 0 1 4 4c0 1.5-.8 2.8-2 3.5v1l3 3v2.5a4 4 0 0 1-4 4"/>
      <path d="M12 2a4 4 0 0 0-4 4c0 1.5.8 2.8 2 3.5v1l-3 3v2.5a4 4 0 0 0 4 4"/>
      <line x1="12" y1="22" x2="12" y2="16"/>
    </svg>
  ),
  chevronRight: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  path: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="5" cy="5" r="3"/>
      <circle cx="19" cy="19" r="3"/>
      <path d="M5 8v4a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8"/>
    </svg>
  ),
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

// Tab button component
function TabButton({ tab, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '10px 16px',
        background: isActive ? '#A100FF' : 'transparent',
        color: isActive ? 'white' : '#6B7280',
        border: 'none',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        transition: 'all 0.2s ease',
      }}
    >
      {Icons[tab.icon]}
      {tab.label}
    </button>
  );
}

// Search input component
function SearchInput({ value, onChange, placeholder }) {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
    }}>
      <div style={{
        position: 'absolute',
        left: '10px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#9CA3AF',
      }}>
        {Icons.search}
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '10px 10px 10px 36px',
          border: '1px solid #E2E8F0',
          borderRadius: '6px',
          fontSize: '13px',
          outline: 'none',
        }}
      />
    </div>
  );
}

// Entity type badge
function EntityBadge({ type, small = false }) {
  const color = ENTITY_COLORS[type] || '#64748B';
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: small ? '2px 6px' : '4px 8px',
      background: `${color}20`,
      color: color,
      borderRadius: '4px',
      fontSize: small ? '10px' : '11px',
      fontWeight: '600',
    }}>
      <span style={{
        width: small ? '6px' : '8px',
        height: small ? '6px' : '8px',
        borderRadius: '50%',
        background: color,
      }} />
      {type}
    </span>
  );
}

// Node card for lists
function NodeCard({ node, isSelected, onClick, onContextMenu }) {
  const color = ENTITY_COLORS[node.type] || '#64748B';
  
  // Get confidence value if it exists
  const confidence = node.attrs?.confidence;
  const getConfidenceColor = (conf) => {
    if (!conf) return null;
    if (conf >= 0.85) return '#10B981';
    if (conf >= 0.6) return '#F59E0B';
    return '#EF4444';
  };
  const confidenceColor = getConfidenceColor(confidence);
  
  return (
    <div
      onClick={onClick}
      onContextMenu={onContextMenu}
      style={{
        padding: '10px 12px',
        background: isSelected ? `${color}10` : 'white',
        border: `1px solid ${isSelected ? color : '#E2E8F0'}`,
        borderRadius: '6px',
        cursor: 'pointer',
        marginBottom: '8px',
        transition: 'all 0.2s ease',
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
        <span style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: color,
        }} />
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#1A1A2E', flex: 1 }}>
          {node.label}
        </span>
        {/* Confidence indicator */}
        {confidenceColor && (
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: confidenceColor,
            border: '1px solid white',
            boxShadow: `0 0 0 1px ${confidenceColor}40`,
          }} title={`Confidence: ${Math.round(confidence * 100)}%`} />
        )}
      </div>
      <div style={{ fontSize: '10px', color: '#6B7280' }}>
        {node.type} • {node.id}
      </div>
    </div>
  );
}

// Relationship card
function RelationshipCard({ edge, direction }) {
  const targetNode = direction === 'outgoing' 
    ? getNodeById(edge.target) 
    : getNodeById(edge.source);
  const color = targetNode ? ENTITY_COLORS[targetNode.type] : '#64748B';
  
  return (
    <div style={{
      padding: '8px 10px',
      background: '#F9FAFB',
      borderRadius: '4px',
      marginBottom: '6px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    }}>
      <span style={{ fontSize: '10px', color: '#6B7280', minWidth: '80px' }}>
        {edge.label || edge.type}
      </span>
      {Icons.chevronRight}
      <span style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '11px',
        color: color,
        fontWeight: '500',
      }}>
        <span style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: color,
        }} />
        {targetNode?.label || edge.target || edge.source}
      </span>
    </div>
  );
}

// Highlight path button
function PathButton({ path, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 12px',
        background: isActive ? path.color : 'white',
        color: isActive ? 'white' : '#4B5563',
        border: `1px solid ${isActive ? path.color : '#E2E8F0'}`,
        borderRadius: '6px',
        fontSize: '11px',
        fontWeight: '500',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        transition: 'all 0.2s ease',
      }}
    >
      {Icons.path}
      {path.label}
    </button>
  );
}

// Node detail drawer with quick actions
function NodeDetailDrawer({ node, onClose, onShowUpstream, onShowDownstream, onFindPath }) {
  if (!node) return null;
  
  const edges = getEdgesForNode(node.id);
  const color = ENTITY_COLORS[node.type] || '#64748B';
  
  // Confidence indicator
  const confidence = node.attrs?.confidence;
  const getConfidenceLevel = (conf) => {
    if (!conf) return null;
    if (conf >= 0.85) return { label: 'High', color: '#10B981', bg: '#D1FAE5' };
    if (conf >= 0.6) return { label: 'Medium', color: '#F59E0B', bg: '#FEF3C7' };
    return { label: 'Low', color: '#EF4444', bg: '#FEE2E2' };
  };
  const confidenceLevel = getConfidenceLevel(confidence);
  
  return (
    <div style={{
      width: '320px',
      borderLeft: '1px solid #E2E8F0',
      background: 'white',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid #E2E8F0',
        background: `${color}10`,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <EntityBadge type={node.type} />
              {/* Confidence badge */}
              {confidenceLevel && (
                <span style={{
                  fontSize: '9px',
                  fontWeight: '600',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: confidenceLevel.bg,
                  color: confidenceLevel.color,
                }}>
                  {Math.round(confidence * 100)}% conf
                </span>
              )}
            </div>
            <h3 style={{ margin: '8px 0 4px', fontSize: '16px', fontWeight: '700', color: '#1A1A2E' }}>
              {node.label}
            </h3>
            <div style={{ fontSize: '11px', color: '#6B7280' }}>{node.id}</div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#6B7280',
              padding: '4px',
            }}
          >
            {Icons.close}
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
        {/* Quick Actions */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ fontSize: '11px', fontWeight: '600', color: '#6B7280', marginBottom: '8px', textTransform: 'uppercase' }}>
            Quick Actions
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            <button
              onClick={onShowUpstream}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 10px',
                background: '#3B82F610',
                border: '1px solid #3B82F6',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '10px',
                fontWeight: '500',
                color: '#3B82F6',
              }}
            >
              ↑ Upstream
            </button>
            <button
              onClick={onShowDownstream}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 10px',
                background: '#10B98110',
                border: '1px solid #10B981',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '10px',
                fontWeight: '500',
                color: '#10B981',
              }}
            >
              ↓ Downstream
            </button>
            <button
              onClick={onFindPath}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 10px',
                background: '#A100FF10',
                border: '1px solid #A100FF',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '10px',
                fontWeight: '500',
                color: '#A100FF',
              }}
            >
              ⤳ Find Path
            </button>
          </div>
        </div>
        
        {/* Attributes */}
        {node.attrs && Object.keys(node.attrs).length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '11px', fontWeight: '600', color: '#6B7280', marginBottom: '8px', textTransform: 'uppercase' }}>
              Attributes
            </h4>
            <div style={{ background: '#F9FAFB', borderRadius: '6px', padding: '10px' }}>
              {Object.entries(node.attrs).map(([key, value]) => {
                // Special rendering for confidence
                const isConfidence = key === 'confidence';
                const displayValue = isConfidence 
                  ? `${Math.round(value * 100)}%`
                  : typeof value === 'object' ? JSON.stringify(value) : String(value);
                
                return (
                  <div key={key} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    padding: '4px 0', 
                    borderBottom: '1px solid #E2E8F0',
                    alignItems: 'center',
                  }}>
                    <span style={{ fontSize: '11px', color: '#6B7280' }}>{key}</span>
                    <span style={{ 
                      fontSize: '11px', 
                      fontWeight: '600', 
                      color: isConfidence && confidenceLevel ? confidenceLevel.color : '#1A1A2E',
                    }}>
                      {displayValue}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Outgoing relationships */}
        {edges.outgoing.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '11px', fontWeight: '600', color: '#6B7280', marginBottom: '8px', textTransform: 'uppercase' }}>
              Outgoing ({edges.outgoing.length})
            </h4>
            {edges.outgoing.map(edge => (
              <RelationshipCard key={edge.id} edge={edge} direction="outgoing" />
            ))}
          </div>
        )}

        {/* Incoming relationships */}
        {edges.incoming.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '11px', fontWeight: '600', color: '#6B7280', marginBottom: '8px', textTransform: 'uppercase' }}>
              Incoming ({edges.incoming.length})
            </h4>
            {edges.incoming.map(edge => (
              <RelationshipCard key={edge.id} edge={edge} direction="incoming" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// TAB CONTENT COMPONENTS
// ============================================================================

// Ontology Tab - Schema view
function OntologyTab({ searchQuery }) {
  const categories = useMemo(() => {
    const cats = {};
    entityTypes.forEach(et => {
      if (!cats[et.category]) cats[et.category] = [];
      cats[et.category].push(et);
    });
    return cats;
  }, []);

  const filteredCategories = useMemo(() => {
    if (!searchQuery) return categories;
    const result = {};
    Object.entries(categories).forEach(([cat, types]) => {
      const filtered = types.filter(t => 
        t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.label.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (filtered.length > 0) result[cat] = filtered;
    });
    return result;
  }, [categories, searchQuery]);

  return (
    <div style={{ display: 'flex', gap: '24px', height: '100%' }}>
      {/* Entity Types */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#1A1A2E', marginBottom: '16px' }}>
          Entity Types ({entityTypes.length})
        </h3>
        {Object.entries(filteredCategories).map(([category, types]) => (
          <div key={category} style={{ marginBottom: '20px' }}>
            <h4 style={{ 
              fontSize: '11px', 
              fontWeight: '600', 
              color: '#6B7280', 
              textTransform: 'uppercase',
              marginBottom: '8px',
              letterSpacing: '0.5px',
            }}>
              {category}
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {types.map(type => (
                <EntityBadge key={type.id} type={type.id} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Relationship Types */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#1A1A2E', marginBottom: '16px' }}>
          Relationship Types ({relationshipTypes.length})
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {relationshipTypes.slice(0, 25).map(rel => (
            <div key={rel.id} style={{
              padding: '8px 10px',
              background: '#F9FAFB',
              borderRadius: '4px',
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <EntityBadge type={rel.from} small />
              <span style={{ color: '#6B7280' }}>—{rel.label}→</span>
              <EntityBadge type={rel.to} small />
            </div>
          ))}
          {relationshipTypes.length > 25 && (
            <div style={{ fontSize: '11px', color: '#6B7280', textAlign: 'center', padding: '8px' }}>
              +{relationshipTypes.length - 25} more relationships
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// INTERACTIVE GRAPH VISUALIZATION (Neo4j-style)
// ============================================================================

// Force-directed layout simulation with proper spacing
function calculateNodePositions(nodes, edges) {
  const positions = {};
  const width = 900;
  const height = 550;
  
  // Use predefined positions if available, otherwise calculate
  nodes.forEach((node, idx) => {
    if (node.position) {
      // Scale predefined positions to fit the viewport
      positions[node.id] = {
        x: 50 + (node.position.x / 950) * (width - 100),
        y: 40 + (node.position.y / 600) * (height - 80),
      };
    }
  });
  
  // For nodes without positions, place them based on type clustering
  const typeGroups = {};
  nodes.forEach(node => {
    if (!positions[node.id]) {
      if (!typeGroups[node.type]) typeGroups[node.type] = [];
      typeGroups[node.type].push(node);
    }
  });
  
  const types = Object.keys(typeGroups);
  types.forEach((type, typeIdx) => {
    const typeNodes = typeGroups[type];
    const baseAngle = (typeIdx / types.length) * 2 * Math.PI;
    const radius = 150 + (typeIdx % 3) * 50;
    
    typeNodes.forEach((node, nodeIdx) => {
      const spread = Math.min(0.4, 1.5 / typeNodes.length);
      const nodeAngle = baseAngle + (nodeIdx - typeNodes.length / 2) * spread;
      positions[node.id] = {
        x: width / 2 + Math.cos(nodeAngle) * radius,
        y: height / 2 + Math.sin(nodeAngle) * radius,
      };
    });
  });
  
  return positions;
}

// Calculate edge path with proper curve for Neo4j style
function calculateEdgePath(fromPos, toPos, edgeIndex, totalEdgesBetweenNodes) {
  const dx = toPos.x - fromPos.x;
  const dy = toPos.y - fromPos.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  
  // Normalize
  const nx = dx / dist;
  const ny = dy / dist;
  
  // Offset start and end points to account for node radius
  const nodeRadius = 14;
  const startX = fromPos.x + nx * nodeRadius;
  const startY = fromPos.y + ny * nodeRadius;
  const endX = toPos.x - nx * (nodeRadius + 8); // Extra space for arrow
  const endY = toPos.y - ny * (nodeRadius + 8);
  
  // Calculate curve offset (perpendicular to line)
  const curveOffset = (edgeIndex - (totalEdgesBetweenNodes - 1) / 2) * 25;
  const perpX = -ny * curveOffset;
  const perpY = nx * curveOffset;
  
  // Control point at midpoint + perpendicular offset
  const midX = (startX + endX) / 2 + perpX;
  const midY = (startY + endY) / 2 + perpY;
  
  return {
    path: `M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`,
    labelPos: { x: midX, y: midY },
    angle: Math.atan2(endY - midY, endX - midX) * 180 / Math.PI,
  };
}

// Interactive Graph View Component - Neo4j Style with Impact Analysis
function InteractiveGraphView({ 
  nodes, 
  edges, 
  highlightedNodeIds, 
  selectedNode, 
  onNodeClick, 
  onNodeContextMenu,
  activePath,
  impactMode,
  impactNodes = { upstream: new Set(), downstream: new Set() },
}) {
  const [hoveredNode, setHoveredNode] = useState(null);
  const [hoveredEdge, setHoveredEdge] = useState(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const svgRef = useRef(null);
  
  // Calculate positions with edges for better layout
  const positions = useMemo(() => calculateNodePositions(nodes, edges), [nodes, edges]);
  
  // Get visible nodes (limit for performance)
  const visibleNodes = useMemo(() => 
    nodes.filter(n => positions[n.id]).slice(0, 52),
  [nodes, positions]);
  
  const visibleNodeIds = useMemo(() => new Set(visibleNodes.map(n => n.id)), [visibleNodes]);
  
  // Process edges - map source/target to from/to and filter visible
  const visibleEdges = useMemo(() => {
    // Count edges between same pair of nodes for proper curve offset
    const edgeCounts = {};
    edges.forEach(e => {
      const key = [e.source, e.target].sort().join('-');
      edgeCounts[key] = (edgeCounts[key] || 0) + 1;
    });
    
    const edgeIndices = {};
    return edges
      .filter(e => visibleNodeIds.has(e.source) && visibleNodeIds.has(e.target))
      .map(e => {
        const key = [e.source, e.target].sort().join('-');
        edgeIndices[key] = (edgeIndices[key] || 0);
        const idx = edgeIndices[key]++;
        return { ...e, curveIndex: idx, totalCurves: edgeCounts[key] };
      });
  }, [edges, visibleNodeIds]);
  
  // Get node color with impact mode support
  const getNodeColor = (node) => {
    if (selectedNode?.id === node.id) return '#A100FF';
    
    // Impact mode coloring
    if (impactMode) {
      const isUpstream = impactNodes.upstream.has(node.id);
      const isDownstream = impactNodes.downstream.has(node.id);
      if (isUpstream && isDownstream) return '#A100FF'; // Both
      if (isUpstream) return '#3B82F6'; // Blue for upstream
      if (isDownstream) return '#10B981'; // Green for downstream
    }
    
    if (highlightedNodeIds.has(node.id)) {
      return activePath ? (highlightPaths[activePath]?.color || '#10B981') : '#10B981';
    }
    return ENTITY_COLORS[node.type] || '#6B7280';
  };
  
  const getNodeSize = (node) => {
    if (selectedNode?.id === node.id) return 16;
    if (highlightedNodeIds.has(node.id)) return 14;
    if (hoveredNode?.id === node.id) return 14;
    return 12;
  };
  
  // Get confidence color for node
  const getConfidenceRing = (node) => {
    const confidence = node.attrs?.confidence;
    if (!confidence) return null;
    if (confidence >= 0.85) return '#10B981';
    if (confidence >= 0.6) return '#F59E0B';
    return '#EF4444';
  };
  
  const isEdgeHighlighted = (edge) => {
    return highlightedNodeIds.has(edge.source) && highlightedNodeIds.has(edge.target);
  };
  
  // Pan handlers
  const handleMouseDown = (e) => {
    if (e.target.tagName === 'svg' || e.target.tagName === 'rect') {
      setIsDragging(true);
      setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
    }
  };
  
  const handleMouseMove = (e) => {
    if (isDragging) {
      setTransform(prev => ({
        ...prev,
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      }));
    }
  };
  
  const handleMouseUp = () => setIsDragging(false);
  
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setTransform(prev => ({
      ...prev,
      scale: Math.max(0.3, Math.min(3.0, prev.scale * delta)),
    }));
  };
  
  // Zoom control functions
  const handleZoomIn = () => {
    setTransform(prev => ({
      ...prev,
      scale: Math.min(3.0, prev.scale * 1.25),
    }));
  };
  
  const handleZoomOut = () => {
    setTransform(prev => ({
      ...prev,
      scale: Math.max(0.3, prev.scale * 0.8),
    }));
  };
  
  const handleZoomReset = () => {
    setTransform({ x: 0, y: 0, scale: 1 });
  };
  
  const handleZoomFit = () => {
    // Center and fit content
    setTransform({ x: 50, y: 25, scale: 0.85 });
  };
  
  // Calculate scale-dependent sizes for better clarity at different zoom levels
  const getScaledFontSize = (baseSize) => {
    // At higher zoom, we can use slightly smaller relative fonts since they'll be bigger on screen
    // At lower zoom, we need larger relative fonts to remain readable
    if (transform.scale >= 2) return baseSize * 0.85;
    if (transform.scale >= 1.5) return baseSize * 0.9;
    if (transform.scale <= 0.5) return baseSize * 1.3;
    if (transform.scale <= 0.7) return baseSize * 1.15;
    return baseSize;
  };
  
  const getScaledStrokeWidth = (baseWidth) => {
    // Thinner strokes at high zoom, thicker at low zoom
    if (transform.scale >= 2) return baseWidth * 0.7;
    if (transform.scale >= 1.5) return baseWidth * 0.85;
    if (transform.scale <= 0.5) return baseWidth * 1.4;
    return baseWidth;
  };
  
  // Calculate spacing that improves with zoom
  const labelOffset = transform.scale >= 1.5 ? 12 : 10;
  const nodeFontSize = getScaledFontSize(9);
  const labelFontSize = getScaledFontSize(8);
  const edgeLabelFontSize = getScaledFontSize(8);
  
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Zoom Controls */}
      <div style={{
        position: 'absolute',
        top: '12px',
        right: '130px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        zIndex: 10,
      }}>
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            border: '1px solid #E2E8F0',
            background: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            fontWeight: '300',
            color: '#374151',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#F3F4F6'; e.currentTarget.style.borderColor = '#A100FF'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = '#E2E8F0'; }}
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            border: '1px solid #E2E8F0',
            background: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            fontWeight: '300',
            color: '#374151',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#F3F4F6'; e.currentTarget.style.borderColor = '#A100FF'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = '#E2E8F0'; }}
        >
          −
        </button>
        <button
          onClick={handleZoomReset}
          title="Reset View (100%)"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            border: '1px solid #E2E8F0',
            background: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            fontWeight: '600',
            color: '#374151',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#F3F4F6'; e.currentTarget.style.borderColor = '#A100FF'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = '#E2E8F0'; }}
        >
          1:1
        </button>
        <button
          onClick={handleZoomFit}
          title="Fit All"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            border: '1px solid #E2E8F0',
            background: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            color: '#374151',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#F3F4F6'; e.currentTarget.style.borderColor = '#A100FF'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = '#E2E8F0'; }}
        >
          ⊡
        </button>
      </div>
      
      {/* Zoom Level Indicator */}
      <div style={{
        position: 'absolute',
        bottom: '36px',
        right: '12px',
        background: 'white',
        borderRadius: '4px',
        padding: '4px 8px',
        fontSize: '10px',
        fontWeight: '500',
        color: '#6B7280',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        zIndex: 10,
      }}>
        {Math.round(transform.scale * 100)}%
      </div>
      
      <svg 
        ref={svgRef}
        width="100%" 
        height="100%" 
        viewBox="0 0 900 550"
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
      <defs>
        {/* Arrow markers for different states */}
        <marker id="arrow-default" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#94A3B8" />
        </marker>
        <marker id="arrow-highlighted" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill={activePath ? highlightPaths[activePath]?.color : '#A100FF'} />
        </marker>
        <marker id="arrow-hover" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#1A1A2E" />
        </marker>
        
        {/* Glow filter */}
        <filter id="glow-effect" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        {/* Drop shadow for labels */}
        <filter id="label-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.15"/>
        </filter>
      </defs>
      
      {/* Background with subtle grid */}
      <rect width="100%" height="100%" fill="#FAFBFC" />
      <pattern id="neo4j-grid" width="30" height="30" patternUnits="userSpaceOnUse">
        <circle cx="15" cy="15" r="0.5" fill="#E2E8F0" />
      </pattern>
      <rect width="100%" height="100%" fill="url(#neo4j-grid)" />
      
      {/* Transform group for pan/zoom */}
      <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}>
        
        {/* Edges - rendered first (behind nodes) */}
        <g className="edges">
          {visibleEdges.map((edge, idx) => {
            const fromPos = positions[edge.source];
            const toPos = positions[edge.target];
            if (!fromPos || !toPos) return null;
            
            const highlighted = isEdgeHighlighted(edge);
            const hovered = hoveredEdge === edge.id;
            const { path, labelPos } = calculateEdgePath(fromPos, toPos, edge.curveIndex, edge.totalCurves);
            
            const strokeColor = highlighted 
              ? (highlightPaths[activePath]?.color || '#A100FF')
              : hovered ? '#1A1A2E' : '#CBD5E1';
            const strokeWidth = getScaledStrokeWidth(highlighted ? 2.5 : hovered ? 2 : 1.5);
            const markerEnd = highlighted 
              ? 'url(#arrow-highlighted)' 
              : hovered ? 'url(#arrow-hover)' : 'url(#arrow-default)';
            
            return (
              <g key={edge.id || `${edge.source}-${edge.target}-${idx}`}>
                {/* Invisible wider path for easier hover */}
                <path
                  d={path}
                  fill="none"
                  stroke="transparent"
                  strokeWidth={15}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredEdge(edge.id)}
                  onMouseLeave={() => setHoveredEdge(null)}
                />
                
                {/* Visible edge path */}
                <path
                  d={path}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeOpacity={highlighted ? 1 : hovered ? 1 : 0.6}
                  markerEnd={markerEnd}
                  style={{ 
                    transition: 'all 0.15s ease',
                    pointerEvents: 'none',
                  }}
                />
                
                {/* Edge label - shown on hover or when highlighted */}
                {(hovered || highlighted) && edge.label && (
                  <g transform={`translate(${labelPos.x}, ${labelPos.y})`}>
                    <rect
                      x={-40}
                      y={-10}
                      width={80}
                      height={20}
                      fill="white"
                      rx={10}
                      stroke={strokeColor}
                      strokeWidth={getScaledStrokeWidth(1)}
                      filter="url(#label-shadow)"
                    />
                    <text
                      textAnchor="middle"
                      dy="4"
                      fontSize={edgeLabelFontSize}
                      fontWeight="500"
                      fill={highlighted ? strokeColor : '#4B5563'}
                      style={{ pointerEvents: 'none', letterSpacing: '0.02em' }}
                    >
                      {edge.label.length > 14 ? edge.label.substring(0, 14) + '…' : edge.label}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </g>
        
        {/* Nodes */}
        <g className="nodes">
          {visibleNodes.map(node => {
            const pos = positions[node.id];
            if (!pos) return null;
            
            const isSelected = selectedNode?.id === node.id;
            const isHighlighted = highlightedNodeIds.has(node.id);
            const isHovered = hoveredNode?.id === node.id;
            const color = getNodeColor(node);
            const size = getNodeSize(node);
            const confidenceRing = getConfidenceRing(node);
            
            return (
              <g 
                key={node.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                style={{ cursor: 'pointer' }}
                onClick={(e) => { e.stopPropagation(); onNodeClick(node); }}
                onContextMenu={(e) => { e.preventDefault(); onNodeContextMenu?.(e, node); }}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Confidence ring (outermost) */}
                {confidenceRing && (
                  <circle
                    r={size + 12}
                    fill="none"
                    stroke={confidenceRing}
                    strokeWidth={2}
                    strokeDasharray="3 2"
                    opacity={0.6}
                  />
                )}
                
                {/* Outer ring for selected/highlighted */}
                {(isSelected || isHighlighted) && (
                  <circle
                    r={size + 8}
                    fill="none"
                    stroke={color}
                    strokeWidth={2}
                    strokeDasharray={isSelected ? 'none' : '4 2'}
                    opacity={0.4}
                  />
                )}
                
                {/* Glow effect */}
                {(isSelected || isHovered) && (
                  <circle
                    r={size + 4}
                    fill={color}
                    opacity={0.15}
                    filter="url(#glow-effect)"
                  />
                )}
                
                {/* Main node circle - Neo4j style with gradient-like effect */}
                <circle
                  r={size}
                  fill={color}
                  stroke="white"
                  strokeWidth={getScaledStrokeWidth(2.5)}
                  style={{ transition: 'all 0.15s ease' }}
                />
                
                {/* Inner highlight for 3D effect */}
                <circle
                  r={size * 0.6}
                  fill="white"
                  opacity={0.15}
                  cx={-size * 0.2}
                  cy={-size * 0.2}
                />
                
                {/* Type indicator letter */}
                <text
                  textAnchor="middle"
                  dy="4"
                  fontSize={nodeFontSize}
                  fontWeight="700"
                  fill="white"
                  style={{ pointerEvents: 'none' }}
                >
                  {node.type?.charAt(0) || '?'}
                </text>
                
                {/* Always show label for better navigation */}
                <g transform={`translate(0, ${size + labelOffset})`}>
                  <rect
                    x={-50}
                    y={-9}
                    width={100}
                    height={18}
                    fill="white"
                    rx={5}
                    opacity={isHovered || isSelected || isHighlighted ? 1 : 0.9}
                    filter="url(#label-shadow)"
                  />
                  <text
                    textAnchor="middle"
                    dy="4"
                    fontSize={labelFontSize}
                    fontWeight={isSelected || isHighlighted ? '600' : '500'}
                    fill={isSelected || isHighlighted ? color : '#374151'}
                    style={{ 
                      pointerEvents: 'none',
                      letterSpacing: '0.01em',
                    }}
                  >
                    {(node.label || node.id).length > 16 
                      ? (node.label || node.id).substring(0, 16) + '…' 
                      : (node.label || node.id)}
                  </text>
                </g>
              </g>
            );
          })}
        </g>
      </g>
      
      {/* Stats overlay - moved to account for zoom controls */}
      <g transform="translate(785, 50)">
        <rect x="0" y="0" width="105" height="28" fill="white" rx="6" filter="url(#label-shadow)" />
        <text x="52" y="18" textAnchor="middle" fontSize="10" fill="#6B7280">
          {visibleNodes.length} nodes • {visibleEdges.length} edges
        </text>
      </g>
      
      {/* Zoom controls hint */}
      <text x="10" y="540" fontSize="9" fill="#9CA3AF">
        Use +/- buttons or scroll to zoom • Drag to pan • Click nodes for details
      </text>
    </svg>
    </div>
  );
}

// Filter Toggle Button Component
function FilterToggle({ label, isActive, onClick, color }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '10px',
        fontWeight: '500',
        cursor: 'pointer',
        border: `1px solid ${isActive ? (color || '#A100FF') : '#E2E8F0'}`,
        background: isActive ? `${color || '#A100FF'}15` : 'white',
        color: isActive ? (color || '#A100FF') : '#6B7280',
        transition: 'all 0.15s ease',
      }}
    >
      {label}
    </button>
  );
}

// Impact Mode Toggle Component
function ImpactModeToggle({ mode, setMode }) {
  return (
    <div style={{ display: 'flex', gap: '4px', background: '#F3F4F6', borderRadius: '6px', padding: '3px' }}>
      {[
        { id: null, label: 'Off' },
        { id: 'upstream', label: 'Upstream', color: '#3B82F6' },
        { id: 'downstream', label: 'Downstream', color: '#10B981' },
        { id: 'both', label: 'Both', color: '#A100FF' },
      ].map(opt => (
        <button
          key={opt.id || 'off'}
          onClick={() => setMode(opt.id)}
          style={{
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '10px',
            fontWeight: '500',
            cursor: 'pointer',
            border: 'none',
            background: mode === opt.id ? (opt.color || '#6B7280') : 'transparent',
            color: mode === opt.id ? 'white' : '#6B7280',
            transition: 'all 0.15s ease',
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// Context Menu Component
function ContextMenu({ x, y, node, onClose, onAction }) {
  const menuRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);
  
  const menuItems = [
    { id: 'focus', label: 'Focus on this node', icon: '◎' },
    { id: 'upstream', label: 'Show upstream only', icon: '↑' },
    { id: 'downstream', label: 'Show downstream only', icon: '↓' },
    { id: 'path', label: 'Find path to...', icon: '⤳' },
    { id: 'copy', label: 'Copy node ID', icon: '⎘' },
  ];
  
  return (
    <div
      ref={menuRef}
      style={{
        position: 'fixed',
        left: x,
        top: y,
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        border: '1px solid #E2E8F0',
        padding: '6px 0',
        zIndex: 1001,
        minWidth: '180px',
      }}
    >
      <div style={{ padding: '8px 12px', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ fontSize: '11px', fontWeight: '600', color: '#1A1A2E' }}>{node.label}</div>
        <div style={{ fontSize: '10px', color: '#6B7280' }}>{node.type}</div>
      </div>
      {menuItems.map(item => (
        <button
          key={item.id}
          onClick={() => { onAction(item.id); onClose(); }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            width: '100%',
            padding: '8px 12px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '11px',
            color: '#374151',
            textAlign: 'left',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#F3F4F6'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
        >
          <span style={{ fontSize: '12px', width: '16px' }}>{item.icon}</span>
          {item.label}
        </button>
      ))}
    </div>
  );
}

// Path Finder Modal Component
function PathFinderModal({ fromNode, nodes, onClose, onFindPath }) {
  const [toNodeId, setToNodeId] = useState('');
  const [results, setResults] = useState(null);
  
  const handleFind = () => {
    if (toNodeId && fromNode) {
      const paths = findPaths(fromNode.id, toNodeId);
      setResults(paths);
    }
  };
  
  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 8px 40px rgba(0,0,0,0.2)',
      padding: '20px',
      zIndex: 1002,
      width: '400px',
      maxHeight: '500px',
      overflow: 'auto',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#1A1A2E', margin: 0 }}>Find Path</h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}>✕</button>
      </div>
      
      <div style={{ marginBottom: '12px' }}>
        <label style={{ fontSize: '11px', color: '#6B7280', display: 'block', marginBottom: '4px' }}>From</label>
        <div style={{ padding: '8px 12px', background: '#F3F4F6', borderRadius: '6px', fontSize: '12px' }}>
          {fromNode?.label || 'Select a node first'}
        </div>
      </div>
      
      <div style={{ marginBottom: '16px' }}>
        <label style={{ fontSize: '11px', color: '#6B7280', display: 'block', marginBottom: '4px' }}>To</label>
        <select
          value={toNodeId}
          onChange={(e) => setToNodeId(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid #E2E8F0',
            fontSize: '12px',
          }}
        >
          <option value="">Select destination node...</option>
          {nodes.filter(n => n.id !== fromNode?.id).map(n => (
            <option key={n.id} value={n.id}>{n.label} ({n.type})</option>
          ))}
        </select>
      </div>
      
      <button
        onClick={handleFind}
        disabled={!toNodeId}
        style={{
          width: '100%',
          padding: '10px',
          background: toNodeId ? '#A100FF' : '#E2E8F0',
          color: toNodeId ? 'white' : '#9CA3AF',
          border: 'none',
          borderRadius: '6px',
          fontSize: '12px',
          fontWeight: '600',
          cursor: toNodeId ? 'pointer' : 'not-allowed',
          marginBottom: '16px',
        }}
      >
        Find Paths
      </button>
      
      {results !== null && (
        <div>
          <div style={{ fontSize: '11px', fontWeight: '600', color: '#6B7280', marginBottom: '8px' }}>
            {results.length > 0 ? `Found ${results.length} path(s)` : 'No paths found'}
          </div>
          {results.map((path, idx) => (
            <div
              key={idx}
              onClick={() => onFindPath(path)}
              style={{
                padding: '10px',
                background: '#F9FAFB',
                borderRadius: '6px',
                marginBottom: '8px',
                cursor: 'pointer',
                border: '1px solid #E2E8F0',
              }}
            >
              <div style={{ fontSize: '10px', color: '#6B7280', marginBottom: '4px' }}>
                Path {idx + 1} ({path.length} nodes)
              </div>
              <div style={{ fontSize: '11px', color: '#374151' }}>
                {path.map((nodeId, i) => {
                  const node = getNodeById(nodeId);
                  return (
                    <span key={nodeId}>
                      {node?.label || nodeId}
                      {i < path.length - 1 && <span style={{ color: '#A100FF' }}> → </span>}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Instance Tab - Node/Edge graph with enhanced features
function InstanceTab({ searchQuery, selectedNode, setSelectedNode, activePath, setActivePath }) {
  // State for new features
  const [impactMode, setImpactMode] = useState(null); // null | 'upstream' | 'downstream' | 'both'
  const [visibleNodeTypes, setVisibleNodeTypes] = useState(() => new Set(getNodeTypes()));
  const [visibleRelTypes, setVisibleRelTypes] = useState(() => new Set(getRelationshipTypes()));
  const [showFilters, setShowFilters] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  const [pathFinderOpen, setPathFinderOpen] = useState(false);
  const [customPathNodes, setCustomPathNodes] = useState(null);
  
  // Get all node and relationship types
  const allNodeTypes = useMemo(() => getNodeTypes(), []);
  const allRelTypes = useMemo(() => getRelationshipTypes(), []);
  
  // Calculate impact nodes when in impact mode
  const impactNodes = useMemo(() => {
    if (!selectedNode || !impactMode) return { upstream: new Set(), downstream: new Set() };
    
    const upstream = impactMode === 'upstream' || impactMode === 'both' 
      ? getUpstreamNodes(selectedNode.id) 
      : new Set();
    const downstream = impactMode === 'downstream' || impactMode === 'both'
      ? getDownstreamNodes(selectedNode.id)
      : new Set();
    
    return { upstream, downstream };
  }, [selectedNode, impactMode]);
  
  // Filter nodes by type and search
  const filteredNodes = useMemo(() => {
    let nodes = p2cGraphNodes;
    
    // Filter by search query
    if (searchQuery) {
      nodes = searchNodes(searchQuery);
    }
    
    // Filter by visible types
    nodes = nodes.filter(n => visibleNodeTypes.has(n.type));
    
    return nodes;
  }, [searchQuery, visibleNodeTypes]);
  
  // Filter edges by visible relationship types and nodes
  const filteredEdges = useMemo(() => {
    const nodeIds = new Set(filteredNodes.map(n => n.id));
    return p2cGraphEdges.filter(e => 
      visibleRelTypes.has(e.type) &&
      nodeIds.has(e.source) &&
      nodeIds.has(e.target)
    );
  }, [filteredNodes, visibleRelTypes]);

  const groupedNodes = useMemo(() => {
    const groups = {};
    filteredNodes.forEach(node => {
      if (!groups[node.type]) groups[node.type] = [];
      groups[node.type].push(node);
    });
    return groups;
  }, [filteredNodes]);

  // Calculate highlighted node IDs based on path or impact mode
  const highlightedNodeIds = useMemo(() => {
    // Custom path highlight
    if (customPathNodes) {
      return new Set(customPathNodes);
    }
    
    // Impact mode highlight
    if (impactMode && selectedNode) {
      const highlighted = new Set([selectedNode.id]);
      impactNodes.upstream.forEach(id => highlighted.add(id));
      impactNodes.downstream.forEach(id => highlighted.add(id));
      return highlighted;
    }
    
    // Standard path highlight
    if (activePath) {
      return new Set(highlightPaths[activePath]?.nodeIds || []);
    }
    
    return new Set();
  }, [activePath, impactMode, selectedNode, impactNodes, customPathNodes]);
  
  // Handle context menu actions
  const handleContextAction = (action) => {
    if (!contextMenu?.node) return;
    
    switch (action) {
      case 'focus':
        setSelectedNode(contextMenu.node);
        break;
      case 'upstream':
        setSelectedNode(contextMenu.node);
        setImpactMode('upstream');
        break;
      case 'downstream':
        setSelectedNode(contextMenu.node);
        setImpactMode('downstream');
        break;
      case 'path':
        setSelectedNode(contextMenu.node);
        setPathFinderOpen(true);
        break;
      case 'copy':
        navigator.clipboard.writeText(contextMenu.node.id);
        break;
    }
  };
  
  // Handle right-click on nodes
  const handleNodeContextMenu = (e, node) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, node });
  };
  
  // Handle path selection
  const handlePathSelect = (path) => {
    setCustomPathNodes(path);
    setPathFinderOpen(false);
    setActivePath(null);
    setImpactMode(null);
  };
  
  // Toggle node type visibility
  const toggleNodeType = (type) => {
    const newTypes = new Set(visibleNodeTypes);
    if (newTypes.has(type)) {
      newTypes.delete(type);
    } else {
      newTypes.add(type);
    }
    setVisibleNodeTypes(newTypes);
  };
  
  // Toggle relationship type visibility
  const toggleRelType = (type) => {
    const newTypes = new Set(visibleRelTypes);
    if (newTypes.has(type)) {
      newTypes.delete(type);
    } else {
      newTypes.add(type);
    }
    setVisibleRelTypes(newTypes);
  };
  
  // Clear all highlights
  const clearHighlights = () => {
    setActivePath(null);
    setImpactMode(null);
    setCustomPathNodes(null);
  };

  return (
    <div style={{ display: 'flex', height: '100%', gap: '16px' }}>
      {/* Left: Controls and Node list */}
      <div style={{ width: '280px', overflow: 'auto', borderRight: '1px solid #E2E8F0', paddingRight: '16px' }}>
        {/* Impact Analysis Mode */}
        <div style={{ marginBottom: '16px' }}>
          <h4 style={{ fontSize: '11px', fontWeight: '600', color: '#6B7280', marginBottom: '8px', textTransform: 'uppercase' }}>
            Impact Analysis
          </h4>
          <ImpactModeToggle mode={impactMode} setMode={setImpactMode} />
          {impactMode && selectedNode && (
            <div style={{ marginTop: '8px', fontSize: '10px', color: '#6B7280' }}>
              {impactMode === 'upstream' && `${impactNodes.upstream.size} upstream nodes`}
              {impactMode === 'downstream' && `${impactNodes.downstream.size} downstream nodes`}
              {impactMode === 'both' && `${impactNodes.upstream.size} up • ${impactNodes.downstream.size} down`}
            </div>
          )}
        </div>
        
        {/* Filters Toggle */}
        <div style={{ marginBottom: '16px' }}>
          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '8px 10px',
              background: showFilters ? '#A100FF10' : '#F3F4F6',
              border: showFilters ? '1px solid #A100FF' : '1px solid transparent',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: '600',
              color: showFilters ? '#A100FF' : '#374151',
            }}
          >
            <span>Filters</span>
            <span>{showFilters ? '▲' : '▼'}</span>
          </button>
          
          {showFilters && (
            <div style={{ marginTop: '10px', padding: '10px', background: '#F9FAFB', borderRadius: '6px' }}>
              {/* Node Type Filters */}
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '600', color: '#6B7280', marginBottom: '6px' }}>
                  Node Types
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {allNodeTypes.map(type => (
                    <FilterToggle
                      key={type}
                      label={type}
                      isActive={visibleNodeTypes.has(type)}
                      onClick={() => toggleNodeType(type)}
                      color={ENTITY_COLORS[type]}
                    />
                  ))}
                </div>
              </div>
              
              {/* Relationship Type Filters */}
              <div>
                <div style={{ fontSize: '10px', fontWeight: '600', color: '#6B7280', marginBottom: '6px' }}>
                  Relationships
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {allRelTypes.slice(0, 10).map(type => (
                    <FilterToggle
                      key={type}
                      label={type.replace(/_/g, ' ')}
                      isActive={visibleRelTypes.has(type)}
                      onClick={() => toggleRelType(type)}
                    />
                  ))}
                </div>
                {allRelTypes.length > 10 && (
                  <div style={{ fontSize: '9px', color: '#9CA3AF', marginTop: '4px' }}>
                    +{allRelTypes.length - 10} more types
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Highlight paths */}
        <div style={{ marginBottom: '16px' }}>
          <h4 style={{ fontSize: '11px', fontWeight: '600', color: '#6B7280', marginBottom: '8px', textTransform: 'uppercase' }}>
            Highlight Paths
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {Object.entries(highlightPaths).map(([key, path]) => (
              <PathButton
                key={key}
                path={path}
                isActive={activePath === key}
                onClick={() => {
                  setActivePath(activePath === key ? null : key);
                  setImpactMode(null);
                  setCustomPathNodes(null);
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Path Finder Button */}
        <div style={{ marginBottom: '16px' }}>
          <button
            onClick={() => setPathFinderOpen(true)}
            disabled={!selectedNode}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              width: '100%',
              padding: '8px 10px',
              background: selectedNode ? '#10B98115' : '#F3F4F6',
              border: selectedNode ? '1px solid #10B981' : '1px solid #E2E8F0',
              borderRadius: '6px',
              cursor: selectedNode ? 'pointer' : 'not-allowed',
              fontSize: '11px',
              fontWeight: '500',
              color: selectedNode ? '#10B981' : '#9CA3AF',
            }}
          >
            <span>⤳</span>
            Find Path from Selected Node
          </button>
        </div>
        
        {/* Clear Highlights */}
        {(activePath || impactMode || customPathNodes) && (
          <button
            onClick={clearHighlights}
            style={{
              width: '100%',
              padding: '6px 10px',
              background: 'none',
              border: '1px solid #E2E8F0',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '10px',
              color: '#6B7280',
              marginBottom: '16px',
            }}
          >
            Clear All Highlights
          </button>
        )}

        {/* Node list */}
        <h4 style={{ fontSize: '11px', fontWeight: '600', color: '#6B7280', marginBottom: '8px', textTransform: 'uppercase' }}>
          Nodes ({filteredNodes.length})
        </h4>
        {Object.entries(groupedNodes).map(([type, nodes]) => (
          <div key={type} style={{ marginBottom: '16px' }}>
            <div style={{ 
              fontSize: '10px', 
              color: '#9CA3AF', 
              marginBottom: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <div style={{ 
                width: '8px', 
                height: '8px', 
                borderRadius: '50%', 
                background: ENTITY_COLORS[type] || '#6B7280' 
              }} />
              {type} ({nodes.length})
            </div>
            {nodes.slice(0, 5).map(node => (
              <NodeCard
                key={node.id}
                node={node}
                isSelected={selectedNode?.id === node.id || highlightedNodeIds.has(node.id)}
                onClick={() => setSelectedNode(node)}
                onContextMenu={(e) => handleNodeContextMenu(e, node)}
              />
            ))}
            {nodes.length > 5 && (
              <div style={{ fontSize: '10px', color: '#6B7280', textAlign: 'center' }}>
                +{nodes.length - 5} more
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Center: Interactive Graph visualization */}
      <div style={{ flex: 1, background: '#F9FAFB', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
        <InteractiveGraphView 
          nodes={filteredNodes}
          edges={filteredEdges}
          highlightedNodeIds={highlightedNodeIds}
          selectedNode={selectedNode}
          onNodeClick={setSelectedNode}
          onNodeContextMenu={handleNodeContextMenu}
          activePath={activePath}
          impactMode={impactMode}
          impactNodes={impactNodes}
        />
        
        {/* Legend */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          background: 'white',
          borderRadius: '6px',
          padding: '10px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          fontSize: '10px',
        }}>
          <div style={{ fontWeight: '600', marginBottom: '6px', color: '#374151' }}>Entity Types</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {['Pit', 'Stockpile', 'Train', 'Equipment'].map(type => (
              <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ 
                  width: '10px', 
                  height: '10px', 
                  borderRadius: '50%', 
                  background: ENTITY_COLORS[type] || '#6B7280' 
                }} />
                <span style={{ color: '#6B7280' }}>{type}</span>
              </div>
            ))}
          </div>
          {impactMode && (
            <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #E2E8F0' }}>
              <div style={{ fontWeight: '600', marginBottom: '4px', color: '#374151' }}>Impact</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {(impactMode === 'upstream' || impactMode === 'both') && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#3B82F6' }} />
                    <span style={{ color: '#6B7280' }}>Upstream</span>
                  </div>
                )}
                {(impactMode === 'downstream' || impactMode === 'both') && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981' }} />
                    <span style={{ color: '#6B7280' }}>Downstream</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Active path/mode indicator */}
        {(activePath || impactMode || customPathNodes) && (
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            background: customPathNodes 
              ? '#10B981' 
              : impactMode 
                ? (impactMode === 'upstream' ? '#3B82F6' : impactMode === 'downstream' ? '#10B981' : '#A100FF')
                : highlightPaths[activePath]?.color || '#A100FF',
            color: 'white',
            borderRadius: '6px',
            padding: '8px 12px',
            fontSize: '11px',
            fontWeight: '600',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}>
            {customPathNodes 
              ? `Path: ${customPathNodes.length} nodes`
              : impactMode 
                ? `Impact: ${impactMode}` 
                : highlightPaths[activePath]?.label}
          </div>
        )}
        
        {/* Stats */}
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: 'white',
          borderRadius: '6px',
          padding: '8px 12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          fontSize: '11px',
          color: '#6B7280',
        }}>
          {filteredNodes.length} nodes • {filteredEdges.length} edges
        </div>
      </div>

      {/* Right: Detail drawer */}
      {selectedNode && (
        <NodeDetailDrawer 
          node={selectedNode} 
          onClose={() => setSelectedNode(null)}
          onShowUpstream={() => setImpactMode('upstream')}
          onShowDownstream={() => setImpactMode('downstream')}
          onFindPath={() => setPathFinderOpen(true)}
        />
      )}
      
      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          node={contextMenu.node}
          onClose={() => setContextMenu(null)}
          onAction={handleContextAction}
        />
      )}
      
      {/* Path Finder Modal */}
      {pathFinderOpen && (
        <>
          <div 
            onClick={() => setPathFinderOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.3)',
              zIndex: 1001,
            }}
          />
          <PathFinderModal
            fromNode={selectedNode}
            nodes={p2cGraphNodes}
            onClose={() => setPathFinderOpen(false)}
            onFindPath={handlePathSelect}
          />
        </>
      )}
    </div>
  );
}

// Lineage Tab - System flows
// System category colors for lineage graph
const SYSTEM_COLORS = {
  planning: '#A100FF',
  geological: '#F59E0B',
  dispatch: '#3B82F6',
  plant: '#10B981',
  tracking: '#6366F1',
  laboratory: '#EC4899',
  reconciliation: '#14B8A6',
};

// Lineage Graph Visual Component
function LineageGraphView({ systems, edges, selectedSystem, onSystemClick }) {
  const [hoveredSystem, setHoveredSystem] = useState(null);
  const [hoveredEdge, setHoveredEdge] = useState(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Calculate positions in a left-to-right flow
  const positions = useMemo(() => {
    const pos = {};
    const categories = ['planning', 'geological', 'dispatch', 'plant', 'tracking', 'laboratory', 'reconciliation'];
    const categoryX = {};
    const categoryCount = {};
    
    // Assign X positions by category (left to right flow)
    categories.forEach((cat, idx) => {
      categoryX[cat] = 80 + idx * 110;
      categoryCount[cat] = 0;
    });
    
    // Position systems
    systems.forEach(sys => {
      const cat = sys.type || sys.category || 'other';
      const x = categoryX[cat] || 450;
      const count = categoryCount[cat] || 0;
      categoryCount[cat] = count + 1;
      
      pos[sys.id] = {
        x,
        y: 80 + count * 80,
      };
    });
    
    return pos;
  }, [systems]);
  
  // Get highlighted system IDs based on selection
  const highlightedIds = useMemo(() => {
    if (!selectedSystem) return new Set();
    const ids = new Set([selectedSystem.id]);
    edges.forEach(e => {
      if (e.source === selectedSystem.id) ids.add(e.target);
      if (e.target === selectedSystem.id) ids.add(e.source);
    });
    return ids;
  }, [selectedSystem, edges]);
  
  const handleMouseDown = (e) => {
    if (e.target.tagName === 'svg' || e.target.tagName === 'rect') {
      setIsDragging(true);
      setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
    }
  };
  
  const handleMouseMove = (e) => {
    if (isDragging) {
      setTransform(prev => ({
        ...prev,
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      }));
    }
  };
  
  const handleMouseUp = () => setIsDragging(false);
  
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setTransform(prev => ({
      ...prev,
      scale: Math.max(0.4, Math.min(2, prev.scale * delta)),
    }));
  };
  
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 900 450"
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      <defs>
        <marker id="lineage-arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#94A3B8" />
        </marker>
        <marker id="lineage-arrow-highlight" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#A100FF" />
        </marker>
        <filter id="lineage-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15"/>
        </filter>
      </defs>
      
      <rect width="100%" height="100%" fill="#FAFBFC" />
      
      <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}>
        {/* Edges */}
        <g>
          {edges.map((edge, idx) => {
            const fromPos = positions[edge.source];
            const toPos = positions[edge.target];
            if (!fromPos || !toPos) return null;
            
            const isHighlighted = selectedSystem && 
              (edge.source === selectedSystem.id || edge.target === selectedSystem.id);
            const isHovered = hoveredEdge === edge.id;
            
            // Calculate curved path
            const dx = toPos.x - fromPos.x;
            const dy = toPos.y - fromPos.y;
            const midX = (fromPos.x + toPos.x) / 2;
            const midY = (fromPos.y + toPos.y) / 2;
            const curveFactor = Math.abs(dy) < 50 ? 0.3 : 0.15;
            const perpX = -dy * curveFactor;
            const perpY = dx * curveFactor;
            
            const startX = fromPos.x + 30;
            const endX = toPos.x - 35;
            const path = `M ${startX} ${fromPos.y} Q ${midX + perpX} ${midY + perpY} ${endX} ${toPos.y}`;
            
            return (
              <g key={edge.id || idx}>
                <path
                  d={path}
                  fill="none"
                  stroke="transparent"
                  strokeWidth={12}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredEdge(edge.id)}
                  onMouseLeave={() => setHoveredEdge(null)}
                />
                <path
                  d={path}
                  fill="none"
                  stroke={isHighlighted || isHovered ? '#A100FF' : '#CBD5E1'}
                  strokeWidth={isHighlighted || isHovered ? 2.5 : 1.5}
                  strokeOpacity={isHighlighted || isHovered ? 1 : 0.5}
                  markerEnd={isHighlighted || isHovered ? 'url(#lineage-arrow-highlight)' : 'url(#lineage-arrow)'}
                  style={{ transition: 'all 0.15s ease', pointerEvents: 'none' }}
                />
                {(isHovered || isHighlighted) && (
                  <g transform={`translate(${midX + perpX}, ${midY + perpY})`}>
                    <rect
                      x={-30}
                      y={-10}
                      width={60}
                      height={20}
                      fill="white"
                      rx={4}
                      stroke="#A100FF"
                      strokeWidth={1}
                    />
                    <text
                      textAnchor="middle"
                      dy="4"
                      fontSize="9"
                      fontWeight="500"
                      fill="#A100FF"
                    >
                      {edge.type}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </g>
        
        {/* System Nodes */}
        <g>
          {systems.map(system => {
            const pos = positions[system.id];
            if (!pos) return null;
            
            const isSelected = selectedSystem?.id === system.id;
            const isHighlighted = highlightedIds.has(system.id);
            const isHovered = hoveredSystem?.id === system.id;
            const color = SYSTEM_COLORS[system.type || system.category] || '#6B7280';
            
            return (
              <g
                key={system.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                style={{ cursor: 'pointer' }}
                onClick={() => onSystemClick(system)}
                onMouseEnter={() => setHoveredSystem(system)}
                onMouseLeave={() => setHoveredSystem(null)}
              >
                {/* Highlight ring */}
                {(isSelected || isHighlighted) && (
                  <rect
                    x={-35}
                    y={-25}
                    width={70}
                    height={50}
                    rx={10}
                    fill="none"
                    stroke={color}
                    strokeWidth={2}
                    strokeDasharray={isSelected ? 'none' : '4 2'}
                    opacity={0.4}
                  />
                )}
                
                {/* System box */}
                <rect
                  x={-30}
                  y={-20}
                  width={60}
                  height={40}
                  rx={8}
                  fill={isSelected || isHovered ? color : 'white'}
                  stroke={color}
                  strokeWidth={2}
                  filter="url(#lineage-shadow)"
                  style={{ transition: 'all 0.15s ease' }}
                />
                
                {/* System name */}
                <text
                  textAnchor="middle"
                  dy="-2"
                  fontSize="9"
                  fontWeight="600"
                  fill={isSelected || isHovered ? 'white' : '#1A1A2E'}
                >
                  {system.name.length > 10 ? system.name.substring(0, 10) : system.name}
                </text>
                
                {/* System type */}
                <text
                  textAnchor="middle"
                  dy="10"
                  fontSize="7"
                  fill={isSelected || isHovered ? 'white' : '#6B7280'}
                  opacity={0.8}
                >
                  {system.type || system.category}
                </text>
              </g>
            );
          })}
        </g>
      </g>
      
      {/* Stats */}
      <g transform="translate(785, 10)">
        <rect x="0" y="0" width="105" height="28" fill="white" rx="6" filter="url(#lineage-shadow)" />
        <text x="52" y="18" textAnchor="middle" fontSize="10" fill="#6B7280">
          {systems.length} systems • {edges.length} flows
        </text>
      </g>
      
      <text x="10" y="440" fontSize="9" fill="#9CA3AF">
        Scroll to zoom • Drag to pan • Click systems for details
      </text>
    </svg>
  );
}

// System Detail Drawer
function SystemDetailDrawer({ system, edges, systems, onClose }) {
  if (!system) return null;
  
  const color = SYSTEM_COLORS[system.type || system.category] || '#6B7280';
  const incomingEdges = edges.filter(e => e.target === system.id);
  const outgoingEdges = edges.filter(e => e.source === system.id);
  
  return (
    <div style={{
      width: '300px',
      borderLeft: '1px solid #E2E8F0',
      background: 'white',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    }}>
      <div style={{ padding: '16px', borderBottom: '1px solid #E2E8F0', background: `${color}10` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span style={{
              fontSize: '10px',
              fontWeight: '600',
              padding: '2px 8px',
              borderRadius: '4px',
              background: color,
              color: 'white',
            }}>
              {system.type || system.category}
            </span>
            <h3 style={{ margin: '8px 0 4px', fontSize: '16px', fontWeight: '700', color: '#1A1A2E' }}>
              {system.name}
            </h3>
            <div style={{ fontSize: '11px', color: '#6B7280' }}>{system.description}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}>
            {Icons.close}
          </button>
        </div>
      </div>
      
      <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
        {/* Incoming flows */}
        {incomingEdges.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '11px', fontWeight: '600', color: '#6B7280', marginBottom: '8px', textTransform: 'uppercase' }}>
              Incoming ({incomingEdges.length})
            </h4>
            {incomingEdges.map(edge => {
              const source = systems.find(s => s.id === edge.source);
              return (
                <div key={edge.id} style={{
                  padding: '8px 10px',
                  background: '#F9FAFB',
                  borderRadius: '6px',
                  marginBottom: '6px',
                  fontSize: '11px',
                }}>
                  <div style={{ fontWeight: '600', color: '#1A1A2E' }}>{source?.name}</div>
                  <div style={{ color: '#6B7280', marginTop: '2px' }}>
                    <span style={{ color: '#A100FF' }}>{edge.type}</span> — {edge.label}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {/* Outgoing flows */}
        {outgoingEdges.length > 0 && (
          <div>
            <h4 style={{ fontSize: '11px', fontWeight: '600', color: '#6B7280', marginBottom: '8px', textTransform: 'uppercase' }}>
              Outgoing ({outgoingEdges.length})
            </h4>
            {outgoingEdges.map(edge => {
              const target = systems.find(s => s.id === edge.target);
              return (
                <div key={edge.id} style={{
                  padding: '8px 10px',
                  background: '#F9FAFB',
                  borderRadius: '6px',
                  marginBottom: '6px',
                  fontSize: '11px',
                }}>
                  <div style={{ fontWeight: '600', color: '#1A1A2E' }}>{target?.name}</div>
                  <div style={{ color: '#6B7280', marginTop: '2px' }}>
                    <span style={{ color: '#A100FF' }}>{edge.type}</span> — {edge.label}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// Lineage Tab - Visual System Graph
function LineageTab({ searchQuery }) {
  const [selectedSystem, setSelectedSystem] = useState(null);
  
  const filteredSystems = useMemo(() => {
    if (!searchQuery) return lineageSystems;
    return lineageSystems.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.type || s.category || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);
  
  // Filter edges to only include those between visible systems
  const filteredEdges = useMemo(() => {
    const systemIds = new Set(filteredSystems.map(s => s.id));
    return lineageEdges.filter(e => systemIds.has(e.source) && systemIds.has(e.target));
  }, [filteredSystems]);

  return (
    <div style={{ display: 'flex', height: '100%', gap: '16px' }}>
      {/* Left: Systems list */}
      <div style={{ width: '200px', overflow: 'auto', borderRight: '1px solid #E2E8F0', paddingRight: '16px' }}>
        <h4 style={{ fontSize: '11px', fontWeight: '600', color: '#6B7280', marginBottom: '12px', textTransform: 'uppercase' }}>
          Systems ({filteredSystems.length})
        </h4>
        {filteredSystems.map(system => {
          const color = SYSTEM_COLORS[system.type || system.category] || '#6B7280';
          return (
            <div
              key={system.id}
              onClick={() => setSelectedSystem(system)}
              style={{
                padding: '10px',
                background: selectedSystem?.id === system.id ? `${color}10` : 'white',
                borderTop: `1px solid ${selectedSystem?.id === system.id ? color : '#E2E8F0'}`,
                borderRight: `1px solid ${selectedSystem?.id === system.id ? color : '#E2E8F0'}`,
                borderBottom: `1px solid ${selectedSystem?.id === system.id ? color : '#E2E8F0'}`,
                borderLeft: `3px solid ${color}`,
                borderRadius: '6px',
                marginBottom: '8px',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#1A1A2E' }}>{system.name}</div>
              <div style={{ fontSize: '9px', color: '#6B7280', marginTop: '2px' }}>{system.type || system.category}</div>
            </div>
          );
        })}
      </div>

      {/* Center: Visual Lineage Graph */}
      <div style={{ flex: 1, background: '#F9FAFB', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
        <LineageGraphView
          systems={filteredSystems}
          edges={filteredEdges}
          selectedSystem={selectedSystem}
          onSystemClick={setSelectedSystem}
        />
        
        {/* Legend */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          background: 'white',
          borderRadius: '6px',
          padding: '10px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          fontSize: '10px',
        }}>
          <div style={{ fontWeight: '600', marginBottom: '6px', color: '#374151' }}>System Types</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {Object.entries(SYSTEM_COLORS).slice(0, 4).map(([type, color]) => (
              <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: color }} />
                <span style={{ color: '#6B7280', textTransform: 'capitalize' }}>{type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Detail drawer */}
      {selectedSystem && (
        <SystemDetailDrawer
          system={selectedSystem}
          edges={lineageEdges}
          systems={lineageSystems}
          onClose={() => setSelectedSystem(null)}
        />
      )}
    </div>
  );
}

// Decision Tab - Agent traces
function DecisionTab({ searchQuery, initialFocusId }) {
  const [selectedRun, setSelectedRun] = useState(null);

  const filteredRuns = useMemo(() => {
    if (!searchQuery) return agentRuns;
    return agentRuns.filter(r => 
      r.agentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.summary.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const runToolCalls = useMemo(() => {
    if (!selectedRun) return [];
    return toolCalls.filter(tc => tc.agentRunId === selectedRun.id);
  }, [selectedRun]);

  const runRecommendations = useMemo(() => {
    if (!selectedRun) return [];
    return recommendations.filter(r => r.agentRunId === selectedRun.id);
  }, [selectedRun]);

  return (
    <div style={{ display: 'flex', height: '100%', gap: '16px' }}>
      {/* Agent runs list */}
      <div style={{ width: '320px', overflow: 'auto', borderRight: '1px solid #E2E8F0', paddingRight: '16px' }}>
        <h4 style={{ fontSize: '11px', fontWeight: '600', color: '#6B7280', marginBottom: '12px', textTransform: 'uppercase' }}>
          Agent Runs ({filteredRuns.length})
        </h4>
        {filteredRuns.map(run => (
          <div
            key={run.id}
            onClick={() => setSelectedRun(run)}
            style={{
              padding: '12px',
              background: selectedRun?.id === run.id ? '#A100FF10' : 'white',
              border: `1px solid ${selectedRun?.id === run.id ? '#A100FF' : '#E2E8F0'}`,
              borderRadius: '6px',
              marginBottom: '8px',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ 
                fontSize: '10px', 
                fontWeight: '600', 
                color: '#A100FF',
                background: '#A100FF10',
                padding: '2px 6px',
                borderRadius: '4px',
              }}>
                {run.agentId}
              </span>
              <span style={{ fontSize: '10px', color: '#6B7280' }}>
                {new Date(run.startTime).toLocaleTimeString()}
              </span>
            </div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#1A1A2E', marginBottom: '4px' }}>
              {run.agentName}
            </div>
            <div style={{ fontSize: '11px', color: '#4B5563', lineHeight: '1.4' }}>
              {run.summary}
            </div>
          </div>
        ))}
      </div>

      {/* Run details */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {selectedRun ? (
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1A1A2E', marginBottom: '4px' }}>
              {selectedRun.agentName}
            </h3>
            <p style={{ fontSize: '12px', color: '#6B7280', marginBottom: '16px' }}>
              Trigger: {selectedRun.trigger}
            </p>

            {/* Tool calls */}
            <h4 style={{ fontSize: '11px', fontWeight: '600', color: '#6B7280', marginBottom: '8px', textTransform: 'uppercase' }}>
              Tool Calls ({runToolCalls.length})
            </h4>
            {runToolCalls.map(tc => (
              <div key={tc.id} style={{
                padding: '12px',
                background: '#F9FAFB',
                borderRadius: '6px',
                marginBottom: '8px',
                borderLeft: '3px solid #A100FF',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#A100FF' }}>{tc.tool}</span>
                  <span style={{ fontSize: '10px', color: '#6B7280' }}>{tc.duration}</span>
                </div>
                <div style={{ fontSize: '11px', color: '#4B5563', marginBottom: '6px' }}>
                  Args: <code style={{ background: '#E2E8F0', padding: '1px 4px', borderRadius: '2px' }}>
                    {JSON.stringify(tc.args)}
                  </code>
                </div>
                <div style={{ fontSize: '11px', color: '#059669' }}>
                  Result: {tc.result}
                </div>
              </div>
            ))}

            {/* Recommendations */}
            {runRecommendations.length > 0 && (
              <>
                <h4 style={{ fontSize: '11px', fontWeight: '600', color: '#6B7280', marginBottom: '8px', marginTop: '16px', textTransform: 'uppercase' }}>
                  Recommendations ({runRecommendations.length})
                </h4>
                {runRecommendations.map(rec => (
                  <div key={rec.id} style={{
                    padding: '12px',
                    background: rec.type === 'action' ? '#ECFDF5' : '#EEF2FF',
                    borderRadius: '6px',
                    marginBottom: '8px',
                    borderLeft: `3px solid ${rec.type === 'action' ? '#10B981' : '#6366F1'}`,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '600', color: '#1A1A2E' }}>{rec.title}</span>
                      <span style={{ fontSize: '10px', color: '#6B7280' }}>
                        {Math.round(rec.confidence * 100)}% confidence
                      </span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#4B5563' }}>{rec.summary}</div>
                    {rec.expectedImpact && (
                      <div style={{ fontSize: '11px', color: '#059669', marginTop: '4px' }}>
                        Expected impact: {rec.expectedImpact}
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        ) : (
          <div style={{ 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: '#6B7280',
          }}>
            <div style={{ textAlign: 'center' }}>
              {Icons.brain}
              <div style={{ marginTop: '12px', fontSize: '14px' }}>
                Select an agent run to view details
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// MAIN MODAL COMPONENT
// ============================================================================

export default function P2COntologyGraphModal({
  isOpen,
  onClose,
  initialFocusId = null,
  mode = 'instance',
}) {
  const [activeTab, setActiveTab] = useState(mode);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNode, setSelectedNode] = useState(null);
  const [activePath, setActivePath] = useState(null);

  // Focus on initial node if provided
  useEffect(() => {
    if (isOpen && initialFocusId) {
      const node = getNodeById(initialFocusId);
      if (node) {
        setSelectedNode(node);
        setActiveTab('instance');
      }
    }
  }, [isOpen, initialFocusId]);

  // Reset state when closing
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setSelectedNode(null);
      setActivePath(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
    }}>
      <div style={{
        width: '95vw',
        maxWidth: '1400px',
        height: '85vh',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2D44 100%)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: 'white' }}>
                P2C Ontology Explorer
              </h2>
              <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#9CA3AF' }}>
                Pit-to-Customer knowledge graph and decision traceability
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Tabs */}
            <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.1)', padding: '4px', borderRadius: '8px' }}>
              {TABS.map(tab => (
                <TabButton
                  key={tab.id}
                  tab={tab}
                  isActive={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                />
              ))}
            </div>
            {/* Close */}
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: '6px',
                padding: '8px',
                cursor: 'pointer',
                color: 'white',
              }}
            >
              {Icons.close}
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div style={{ padding: '12px 20px', borderBottom: '1px solid #E2E8F0' }}>
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={`Search ${activeTab === 'ontology' ? 'entity types' : activeTab === 'instance' ? 'nodes' : activeTab === 'lineage' ? 'systems' : 'agent runs'}...`}
          />
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: '20px', overflow: 'hidden' }}>
          {activeTab === 'ontology' && (
            <OntologyTab searchQuery={searchQuery} />
          )}
          {activeTab === 'instance' && (
            <InstanceTab
              searchQuery={searchQuery}
              selectedNode={selectedNode}
              setSelectedNode={setSelectedNode}
              activePath={activePath}
              setActivePath={setActivePath}
            />
          )}
          {activeTab === 'lineage' && (
            <LineageTab searchQuery={searchQuery} />
          )}
          {activeTab === 'decision' && (
            <DecisionTab searchQuery={searchQuery} initialFocusId={initialFocusId} />
          )}
        </div>
      </div>
    </div>
  );
}

export { EntityBadge, NodeCard, PathButton };
