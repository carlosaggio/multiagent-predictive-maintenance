'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  MiniMap,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import ELK from 'elkjs/lib/elk.bundled.js';
import {
  MRO_ENTITY_TYPES,
  mroGraphNodes,
  mroGraphEdges,
  getMRONodeById,
  getMROEdgesForNode,
  searchMRONodes,
  getMROUpstreamNodes,
  getMRODownstreamNodes,
} from '../../data/mro/mroOntologyData';

// ============================================================================
// ICON COMPONENTS
// ============================================================================

const Icons = {
  close: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  search: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  schema: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  graph: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  ),
  brain: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2a4 4 0 0 1 4 4c0 1.5-.8 2.8-2 3.5v1l3 3v2.5a4 4 0 0 1-4 4" />
      <path d="M12 2a4 4 0 0 0-4 4c0 1.5.8 2.8 2 3.5v1l-3 3v2.5a4 4 0 0 0 4 4" />
      <line x1="12" y1="22" x2="12" y2="16" />
    </svg>
  ),
  chevronRight: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
};

const TABS = [
  { id: 'schema', label: 'Schema View', icon: 'schema' },
  { id: 'instance', label: 'Instance Graph', icon: 'graph' },
  { id: 'decision', label: 'Decision Trace', icon: 'brain' },
];

// ============================================================================
// CATEGORY COLORS
// ============================================================================

const CATEGORY_COLORS = {
  'Assets': '#3B82F6',      // Blue
  'Operations': '#10B981',   // Green
  'Supply': '#F59E0B',       // Amber
  'Finance': '#A100FF',      // Purple
  'People': '#EC4899',       // Pink
};

// ============================================================================
// CUSTOM NODE COMPONENTS
// ============================================================================

function SchemaNode({ data }) {
  const bgColor = data.color || '#E5E7EB';
  const textColor = '#1A1A2E';

  return (
    <div
      style={{
        padding: '12px 16px',
        borderRadius: '8px',
        background: bgColor,
        border: '2px solid ' + bgColor,
        minWidth: '140px',
        textAlign: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <div
        style={{
          fontSize: '13px',
          fontWeight: '700',
          color: textColor,
          marginBottom: '4px',
        }}
      >
        {data.label}
      </div>
      <div
        style={{
          fontSize: '11px',
          color: textColor,
          opacity: 0.7,
        }}
      >
        {data.attributeCount || 0} attrs
      </div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

function InstanceNode({ data, selected }) {
  const config = MRO_ENTITY_TYPES[data.type];
  const bgColor = config?.color || '#64748B';
  const isHighlighted = selected;

  return (
    <div
      style={{
        padding: '10px 14px',
        borderRadius: '6px',
        background: bgColor,
        border: isHighlighted ? '3px solid #FFD700' : '2px solid ' + bgColor,
        minWidth: '120px',
        textAlign: 'center',
        boxShadow: isHighlighted
          ? '0 0 12px rgba(255, 215, 0, 0.6)'
          : '0 2px 6px rgba(0,0,0,0.15)',
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          fontSize: '12px',
          fontWeight: '700',
          color: 'white',
          marginBottom: '2px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {data.label}
      </div>
      <div
        style={{
          fontSize: '10px',
          color: 'rgba(255,255,255,0.8)',
        }}
      >
        {data.type}
      </div>
      {data.status && (
        <div
          style={{
            fontSize: '9px',
            marginTop: '4px',
            padding: '2px 4px',
            background: 'rgba(0,0,0,0.2)',
            borderRadius: '3px',
            color: 'rgba(255,255,255,0.9)',
          }}
        >
          {data.status}
        </div>
      )}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

// ============================================================================
// TAB BUTTON
// ============================================================================

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

// ============================================================================
// SEARCH INPUT
// ============================================================================

function SearchInput({ value, onChange, placeholder }) {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div
        style={{
          position: 'absolute',
          left: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#9CA3AF',
        }}
      >
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
          border: '1px solid #444',
          borderRadius: '6px',
          fontSize: '13px',
          outline: 'none',
          background: '#2a2a3e',
          color: '#F1F5F9',
        }}
      />
    </div>
  );
}

// ============================================================================
// NODE DETAIL DRAWER
// ============================================================================

function NodeDetailDrawer({ node, onClose, onShowUpstream, onShowDownstream }) {
  if (!node) return null;

  const edges = getMROEdgesForNode(node.id);
  const config = MRO_ENTITY_TYPES[node.type];
  const color = config?.color || '#64748B';

  return (
    <div
      style={{
        width: '300px',
        borderLeft: '1px solid #3a3a4e',
        background: '#1a1a2e',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px',
          borderBottom: '1px solid #3a3a4e',
          background: `${color}20`,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px',
                background: `${color}40`,
                color: color,
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: '600',
                marginBottom: '8px',
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: color,
                }}
              />
              {node.type}
            </div>
            <h3 style={{ margin: '8px 0 4px', fontSize: '16px', fontWeight: '700', color: '#F1F5F9' }}>
              {node.label}
            </h3>
            <div style={{ fontSize: '11px', color: '#9CA3AF' }}>{node.id}</div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#9CA3AF',
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
          <h4
            style={{
              fontSize: '11px',
              fontWeight: '600',
              color: '#9CA3AF',
              marginBottom: '8px',
              textTransform: 'uppercase',
            }}
          >
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
          </div>
        </div>

        {/* Attributes */}
        {node.data && Object.keys(node.data).length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h4
              style={{
                fontSize: '11px',
                fontWeight: '600',
                color: '#9CA3AF',
                marginBottom: '8px',
                textTransform: 'uppercase',
              }}
            >
              Attributes
            </h4>
            <div style={{ background: '#2a2a3e', borderRadius: '6px', padding: '10px' }}>
              {Object.entries(node.data).map(([key, value]) => (
                <div
                  key={key}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '4px 0',
                    borderBottom: '1px solid #3a3a4e',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontSize: '11px', color: '#9CA3AF' }}>{key}</span>
                  <span style={{ fontSize: '11px', fontWeight: '600', color: '#F1F5F9' }}>
                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Outgoing relationships */}
        {edges.outgoing.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h4
              style={{
                fontSize: '11px',
                fontWeight: '600',
                color: '#9CA3AF',
                marginBottom: '8px',
                textTransform: 'uppercase',
              }}
            >
              Outgoing ({edges.outgoing.length})
            </h4>
            {edges.outgoing.map((edge) => {
              const targetNode = getMRONodeById(edge.target);
              const targetConfig = targetNode ? MRO_ENTITY_TYPES[targetNode.type] : null;
              const targetColor = targetConfig?.color || '#64748B';
              return (
                <div
                  key={edge.id}
                  style={{
                    padding: '8px 10px',
                    background: '#2a2a3e',
                    borderRadius: '4px',
                    marginBottom: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span style={{ fontSize: '10px', color: '#9CA3AF', minWidth: '80px' }}>
                    {edge.label || edge.type}
                  </span>
                  {Icons.chevronRight}
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '11px',
                      color: targetColor,
                      fontWeight: '500',
                    }}
                  >
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: targetColor }} />
                    {targetNode?.label || edge.target}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Incoming relationships */}
        {edges.incoming.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h4
              style={{
                fontSize: '11px',
                fontWeight: '600',
                color: '#9CA3AF',
                marginBottom: '8px',
                textTransform: 'uppercase',
              }}
            >
              Incoming ({edges.incoming.length})
            </h4>
            {edges.incoming.map((edge) => {
              const sourceNode = getMRONodeById(edge.source);
              const sourceConfig = sourceNode ? MRO_ENTITY_TYPES[sourceNode.type] : null;
              const sourceColor = sourceConfig?.color || '#64748B';
              return (
                <div
                  key={edge.id}
                  style={{
                    padding: '8px 10px',
                    background: '#2a2a3e',
                    borderRadius: '4px',
                    marginBottom: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '11px',
                      color: sourceColor,
                      fontWeight: '500',
                    }}
                  >
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: sourceColor }} />
                    {sourceNode?.label || edge.source}
                  </span>
                  {Icons.chevronRight}
                  <span style={{ fontSize: '10px', color: '#9CA3AF' }}>
                    {edge.label || edge.type}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// SCHEMA VIEW TAB
// ============================================================================

function SchemaViewTab() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    const buildSchemaGraph = async () => {
      const elk = new ELK();

      // Create nodes for entity types
      const schemaNodes = Object.entries(MRO_ENTITY_TYPES).map(([id, config]) => ({
        id,
        data: {
          label: config.label,
          color: config.color,
          attributeCount: config.fields?.length || 0,
        },
        position: { x: 0, y: 0 },
        type: 'default',
      }));

      // Create edges for basic relationships
      const schemaEdges = [];
      // Add some meaningful edges based on data structure
      const relationshipMap = {
        'Aircraft': ['CheckEvent', 'Alert'],
        'CheckEvent': ['WorkPackage'],
        'WorkPackage': ['TaskCard', 'PurchaseOrder'],
        'TaskCard': ['Part', 'PartDemand'],
        'Part': ['ComponentSerial', 'PartDemand', 'InventoryPosition', 'PurchaseOrder'],
        'ComponentSerial': ['ComponentPool', 'RepairOrder'],
        'RepairOrder': ['Shipment'],
        'ContractMBH': ['FlyingHoursReport'],
        'FlyingHoursReport': ['BillingLine'],
        'Alert': ['Action'],
        'Action': ['ApprovalTask'],
      };

      Object.entries(relationshipMap).forEach(([source, targets]) => {
        targets.forEach((target) => {
          schemaEdges.push({
            id: `e-${source}-${target}`,
            source,
            target,
            animated: false,
          });
        });
      });

      const graph = {
        id: 'root',
        layoutOptions: {
          'elk.algorithm': 'layered',
          'elk.direction': 'DOWN',
          'elk.layered.spacing.nodeNodeBetweenLayers': '100',
          'elk.spacing.nodeNode': '80',
        },
        children: schemaNodes.map(node => ({
          id: node.id,
          width: 160,
          height: 80,
        })),
        edges: schemaEdges.map(edge => ({
          id: edge.id,
          sources: [edge.source],
          targets: [edge.target],
        })),
      };

      try {
        const layout = await elk.layout(graph);
        const layoutedNodes = schemaNodes.map(node => {
          const layoutNode = layout.children?.find(n => n.id === node.id);
          return {
            ...node,
            position: { x: layoutNode?.x || 0, y: layoutNode?.y || 0 },
          };
        });

        setNodes(layoutedNodes);
        setEdges(schemaEdges);
      } catch (e) {
        console.error('Layout error:', e);
        setNodes(schemaNodes);
        setEdges(schemaEdges);
      }
    };

    buildSchemaGraph();
  }, [setNodes, setEdges]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}>
        <Background color="#2a2a3e" gap={16} />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}

// ============================================================================
// INSTANCE GRAPH TAB
// ============================================================================

function InstanceGraphTab({ searchQuery, selectedNode, setSelectedNode }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [filteredNodeIds, setFilteredNodeIds] = useState(new Set());

  // Filter nodes based on search
  const graphNodesToShow = useMemo(() => {
    if (!searchQuery) return mroGraphNodes;
    return searchMRONodes(searchQuery);
  }, [searchQuery]);

  const graphNodeIds = useMemo(() => new Set(graphNodesToShow.map(n => n.id)), [graphNodesToShow]);

  // Filter edges to only show those connecting visible nodes
  const graphEdgesToShow = useMemo(() => {
    return mroGraphEdges.filter(
      edge => graphNodeIds.has(edge.source) && graphNodeIds.has(edge.target)
    );
  }, [graphNodeIds]);

  // Highlight upstream/downstream
  const highlightedIds = useMemo(() => {
    if (!selectedNode) return new Set();
    const ids = new Set([selectedNode.id]);
    const upstream = getMROUpstreamNodes(selectedNode.id);
    const downstream = getMRODownstreamNodes(selectedNode.id);
    upstream.forEach(n => ids.add(n.id));
    downstream.forEach(n => ids.add(n.id));
    return ids;
  }, [selectedNode]);

  // Layout with ELK
  useEffect(() => {
    const layoutGraph = async () => {
      const elk = new ELK();

      const layoutNodes = graphNodesToShow.map(node => ({
        id: node.id,
        data: {
          label: node.label,
          type: node.type,
          status: node.data?.status,
        },
        position: { x: 0, y: 0 },
        type: 'default',
      }));

      const graph = {
        id: 'root',
        layoutOptions: {
          'elk.algorithm': 'org.eclipse.elk.mrtree',
          'elk.direction': 'DOWN',
          'elk.spacing.nodeNode': '60',
        },
        children: layoutNodes.map(node => ({
          id: node.id,
          width: 120,
          height: 80,
        })),
        edges: graphEdgesToShow.map(edge => ({
          id: edge.id,
          sources: [edge.source],
          targets: [edge.target],
        })),
      };

      try {
        const layout = await elk.layout(graph);
        const layoutedNodes = layoutNodes.map(node => {
          const layoutNode = layout.children?.find(n => n.id === node.id);
          return {
            ...node,
            position: { x: layoutNode?.x || 0, y: layoutNode?.y || 0 },
          };
        });

        setNodes(layoutedNodes);
        setEdges(
          graphEdgesToShow.map(edge => ({
            id: edge.id,
            source: edge.source,
            target: edge.target,
            label: edge.label,
            animated: highlightedIds.has(edge.source) && highlightedIds.has(edge.target),
          }))
        );
      } catch (e) {
        console.error('Layout error:', e);
        setNodes(layoutNodes);
        setEdges(graphEdgesToShow);
      }
    };

    layoutGraph();
  }, [graphNodesToShow, graphEdgesToShow, setNodes, setEdges, highlightedIds]);

  const onNodeClick = useCallback(
    (event, node) => {
      const mroNode = getMRONodeById(node.id);
      if (mroNode) {
        setSelectedNode(mroNode);
      }
    },
    [setSelectedNode]
  );

  return (
    <div style={{ display: 'flex', height: '100%', width: '100%', gap: '12px' }}>
      {/* Left panel - Node list */}
      <div
        style={{
          width: '280px',
          overflow: 'auto',
          borderRight: '1px solid #3a3a4e',
          padding: '12px',
          background: '#1a1a2e',
        }}
      >
        <h3
          style={{
            fontSize: '12px',
            fontWeight: '700',
            color: '#F1F5F9',
            marginBottom: '12px',
          }}
        >
          Nodes ({graphNodesToShow.length})
        </h3>
        {graphNodesToShow.map((node) => {
          const config = MRO_ENTITY_TYPES[node.type];
          const color = config?.color || '#64748B';
          const isSelected = selectedNode?.id === node.id;

          return (
            <div
              key={node.id}
              onClick={() => setSelectedNode(node)}
              style={{
                padding: '10px 12px',
                background: isSelected ? `${color}20` : '#2a2a3e',
                border: `1px solid ${isSelected ? color : '#3a3a4e'}`,
                borderRadius: '6px',
                cursor: 'pointer',
                marginBottom: '8px',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }} />
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#F1F5F9', flex: 1 }}>
                  {node.label}
                </span>
              </div>
              <div style={{ fontSize: '10px', color: '#9CA3AF' }}>
                {node.type} • {node.id}
              </div>
            </div>
          );
        })}
      </div>

      {/* Middle - Graph */}
      <div style={{ flex: 1, width: 0 }}>
        <ReactFlow
          nodes={nodes.map(node => ({
            ...node,
            selected: node.id === selectedNode?.id,
          }))}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
        >
          <Background color="#2a2a3e" gap={16} />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>

      {/* Right panel - Details */}
      <NodeDetailDrawer
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
        onShowUpstream={() => {
          const upstream = getMROUpstreamNodes(selectedNode.id);
          if (upstream.length > 0) setSelectedNode(upstream[0]);
        }}
        onShowDownstream={() => {
          const downstream = getMRODownstreamNodes(selectedNode.id);
          if (downstream.length > 0) setSelectedNode(downstream[0]);
        }}
      />
    </div>
  );
}

// ============================================================================
// DECISION TRACE TAB
// ============================================================================

function DecisionTraceTab({ searchQuery }) {
  const sampleDecisions = [
    {
      id: 'DEC-001',
      timestamp: '2026-02-06T14:32:00Z',
      agent: 'MRO Planning Agent',
      action: 'Scheduled C-Check for AC-042',
      entity: 'CE-001',
      confidence: 0.95,
      reasoning: 'Aircraft exceeded 42K flying hours threshold',
    },
    {
      id: 'DEC-002',
      timestamp: '2026-02-05T09:15:00Z',
      agent: 'Part Availability Agent',
      action: 'Flagged critical part shortage',
      entity: 'PN-8837',
      confidence: 0.87,
      reasoning: 'Demand exceeds on-hand inventory by 150%',
    },
    {
      id: 'DEC-003',
      timestamp: '2026-02-04T16:45:00Z',
      agent: 'Commercial Agent',
      action: 'Generated billing line for Jan FH accrual',
      entity: 'BL-INV-8421',
      confidence: 0.92,
      reasoning: 'MBH contract terms and flying hours verified',
    },
  ];

  const filteredDecisions = useMemo(
    () =>
      searchQuery
        ? sampleDecisions.filter((d) =>
            JSON.stringify(d).toLowerCase().includes(searchQuery.toLowerCase())
          )
        : sampleDecisions,
    [searchQuery]
  );

  return (
    <div style={{ overflow: 'auto', padding: '16px', background: '#1a1a2e' }}>
      <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#F1F5F9', marginBottom: '16px' }}>
        Agent Decision Audit Trail ({filteredDecisions.length})
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredDecisions.map((decision, idx) => {
          const confidenceColor =
            decision.confidence >= 0.85
              ? '#10B981'
              : decision.confidence >= 0.6
              ? '#F59E0B'
              : '#EF4444';

          return (
            <div key={decision.id}>
              {/* Timeline connector */}
              {idx > 0 && (
                <div
                  style={{
                    height: '20px',
                    marginLeft: '24px',
                    borderLeft: '2px solid #3a3a4e',
                  }}
                />
              )}

              <div
                style={{
                  padding: '12px',
                  background: '#2a2a3e',
                  border: '1px solid #3a3a4e',
                  borderRadius: '8px',
                  display: 'flex',
                  gap: '12px',
                }}
              >
                {/* Timeline dot */}
                <div
                  style={{
                    minWidth: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: confidenceColor,
                    marginTop: '2px',
                  }}
                />

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: '#F1F5F9' }}>
                        {decision.action}
                      </div>
                      <div style={{ fontSize: '10px', color: '#9CA3AF', marginTop: '2px' }}>
                        {decision.agent} • {new Date(decision.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: '600',
                        padding: '4px 8px',
                        background: `${confidenceColor}20`,
                        color: confidenceColor,
                        borderRadius: '4px',
                      }}
                    >
                      {Math.round(decision.confidence * 100)}%
                    </span>
                  </div>

                  <div style={{ fontSize: '10px', color: '#9CA3AF', marginBottom: '8px' }}>
                    <strong>Reasoning:</strong> {decision.reasoning}
                  </div>

                  <div
                    style={{
                      padding: '6px 8px',
                      background: '#3a3a4e',
                      borderRadius: '4px',
                      fontSize: '10px',
                      color: '#9CA3AF',
                    }}
                  >
                    <strong>Entity:</strong> {decision.entity}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// MAIN MODAL COMPONENT
// ============================================================================

export default function MROOntologyGraphModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('schema');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNode, setSelectedNode] = useState(null);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          width: '95vw',
          height: '90vh',
          background: '#1a1a2e',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden',
          border: '1px solid #3a3a4e',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #3a3a4e',
            background: '#0f0f1e',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '700', margin: 0, marginBottom: '4px', color: '#F1F5F9' }}>
              MRO Ontology Explorer
            </h2>
            <p style={{ fontSize: '12px', color: '#9CA3AF', margin: 0 }}>
              Palantir-style ontology drill-down for Aviation MRO domain
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Tabs */}
            <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '8px' }}>
              {TABS.map((tab) => (
                <TabButton
                  key={tab.id}
                  tab={tab}
                  isActive={activeTab === tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSearchQuery('');
                    setSelectedNode(null);
                  }}
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
                color: '#F1F5F9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {Icons.close}
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div style={{ padding: '12px 20px', borderBottom: '1px solid #3a3a4e', background: '#15151f' }}>
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={`Search ${
              activeTab === 'schema'
                ? 'entity types'
                : activeTab === 'instance'
                ? 'nodes'
                : 'decisions'
            }...`}
          />
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
          {activeTab === 'schema' && <SchemaViewTab />}
          {activeTab === 'instance' && (
            <InstanceGraphTab
              searchQuery={searchQuery}
              selectedNode={selectedNode}
              setSelectedNode={setSelectedNode}
            />
          )}
          {activeTab === 'decision' && <DecisionTraceTab searchQuery={searchQuery} />}
        </div>
      </div>
    </div>
  );
}
