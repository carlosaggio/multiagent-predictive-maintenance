"use client";

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Handle,
  Position,
  MiniMap,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import ELK from 'elkjs/lib/elk.bundled.js';
import {
  MRO_ENTITY_TYPES,
  mroGraphNodes,
  mroGraphEdges,
  getMRONodeById,
  getMROEdgesForNode,
  getMROUpstreamNodes,
  getMRODownstreamNodes,
} from '../../data/mro/mroOntologyData';

// ── Custom Node Component ────────────────────────────────────────
function OntologyNode({ data, selected }) {
  const config = MRO_ENTITY_TYPES[data.type];
  const color = config?.color || '#64748B';
  const isHighlighted = selected || data.isHighlighted;

  return (
    <div
      style={{
        padding: '10px 14px',
        borderRadius: '8px',
        background: isHighlighted ? `${color}30` : `${color}18`,
        border: `2px solid ${isHighlighted ? '#FFD700' : color}`,
        minWidth: '130px',
        maxWidth: '160px',
        textAlign: 'center',
        boxShadow: isHighlighted
          ? `0 0 16px ${color}44, 0 0 4px rgba(255,215,0,0.4)`
          : `0 2px 8px rgba(0,0,0,0.3)`,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        fontFamily: "'Inter', -apple-system, sans-serif",
      }}
    >
      <div style={{
        fontSize: '8px', fontWeight: '700', color: color,
        textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px', opacity: 0.9,
      }}>
        {data.type}
      </div>
      <div style={{
        fontSize: '12px', fontWeight: '700', color: '#F1F5F9', lineHeight: '1.3', marginBottom: '3px',
      }}>
        {data.label}
      </div>
      {data.status && (
        <div style={{
          fontSize: '9px', padding: '2px 6px',
          background: data.status === 'at_risk' || data.status === 'critical' || data.status === 'delayed'
            ? 'rgba(239,68,68,0.25)'
            : data.status === 'in_check' || data.status === 'in_progress'
              ? 'rgba(245,158,11,0.25)'
              : 'rgba(16,185,129,0.2)',
          color: data.status === 'at_risk' || data.status === 'critical' || data.status === 'delayed'
            ? '#FCA5A5'
            : data.status === 'in_check' || data.status === 'in_progress'
              ? '#FCD34D'
              : '#6EE7B7',
          borderRadius: '3px', fontWeight: '600', display: 'inline-block',
        }}>
          {data.status}
        </div>
      )}
      <Handle type="target" position={Position.Top} style={{ background: color, width: 6, height: 6, border: 'none' }} />
      <Handle type="source" position={Position.Bottom} style={{ background: color, width: 6, height: 6, border: 'none' }} />
      <Handle type="target" position={Position.Left} id="left-in" style={{ background: color, width: 6, height: 6, border: 'none' }} />
      <Handle type="source" position={Position.Right} id="right-out" style={{ background: color, width: 6, height: 6, border: 'none' }} />
    </div>
  );
}

const nodeTypes = { ontologyNode: OntologyNode };

// ── Node Detail Panel ─────────────────────────────────────────────
function NodeDetailPanel({ node, onClose }) {
  if (!node) return null;
  const edges = getMROEdgesForNode(node.id);
  const config = MRO_ENTITY_TYPES[node.type];
  const color = config?.color || '#64748B';

  return (
    <div style={{
      position: 'absolute', top: '8px', right: '8px', width: '280px',
      maxHeight: 'calc(100% - 16px)', background: '#1a1a2e',
      border: `1px solid ${color}50`, borderRadius: '8px', zIndex: 20,
      overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        padding: '12px 14px', borderBottom: `1px solid ${color}30`,
        background: `${color}15`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      }}>
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 6px',
            background: `${color}30`, color: color, borderRadius: '3px', fontSize: '10px', fontWeight: '600', marginBottom: '6px',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: color }} />
            {node.type}
          </div>
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#F1F5F9' }}>{node.label}</div>
          <div style={{ fontSize: '10px', color: '#9CA3AF', marginTop: '2px' }}>{node.id}</div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: '2px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '10px 14px' }}>
        {node.data && Object.keys(node.data).length > 0 && (
          <div style={{ marginBottom: '14px' }}>
            <div style={{ fontSize: '10px', fontWeight: '600', color: '#9CA3AF', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Attributes</div>
            <div style={{ background: '#2a2a3e', borderRadius: '4px', padding: '8px' }}>
              {Object.entries(node.data).map(([key, value]) => (
                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', borderBottom: '1px solid #3a3a4e22', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', color: '#9CA3AF' }}>{key}</span>
                  <span style={{ fontSize: '10px', fontWeight: '600', color: '#F1F5F9' }}>
                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {edges.outgoing.length > 0 && (
          <div style={{ marginBottom: '14px' }}>
            <div style={{ fontSize: '10px', fontWeight: '600', color: '#9CA3AF', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Outgoing ({edges.outgoing.length})
            </div>
            {edges.outgoing.map((edge) => {
              const target = getMRONodeById(edge.target);
              const tColor = MRO_ENTITY_TYPES[target?.type]?.color || '#64748B';
              return (
                <div key={edge.id} style={{ padding: '6px 8px', background: '#2a2a3e', borderRadius: '4px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px' }}>
                  <span style={{ color: '#9CA3AF', minWidth: '60px' }}>{edge.label || edge.type}</span>
                  <span style={{ color: '#64748B' }}>→</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: tColor, fontWeight: '500' }}>
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: tColor }} />
                    {target?.label || edge.target}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {edges.incoming.length > 0 && (
          <div>
            <div style={{ fontSize: '10px', fontWeight: '600', color: '#9CA3AF', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Incoming ({edges.incoming.length})
            </div>
            {edges.incoming.map((edge) => {
              const source = getMRONodeById(edge.source);
              const sColor = MRO_ENTITY_TYPES[source?.type]?.color || '#64748B';
              return (
                <div key={edge.id} style={{ padding: '6px 8px', background: '#2a2a3e', borderRadius: '4px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: sColor, fontWeight: '500' }}>
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: sColor }} />
                    {source?.label || edge.source}
                  </span>
                  <span style={{ color: '#64748B' }}>→</span>
                  <span style={{ color: '#9CA3AF' }}>{edge.label || edge.type}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Legend ─────────────────────────────────────────────────────────
function OntologyLegend({ onExpand }) {
  const categories = [
    { label: 'Aircraft', color: '#3B82F6' },
    { label: 'Maintenance', color: '#A100FF' },
    { label: 'Material', color: '#10B981' },
    { label: 'Procurement', color: '#EF4444' },
    { label: 'Commercial', color: '#F97316' },
    { label: 'Logistics', color: '#EC4899' },
  ];

  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '8px 14px', background: 'rgba(26,26,46,0.95)', borderTop: '1px solid #2D3748',
    }}>
      <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
        {categories.map(c => (
          <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', color: '#94A3B8' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: c.color }} />
            {c.label}
          </div>
        ))}
      </div>
      {onExpand && (
        <button onClick={onExpand} style={{
          display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px',
          background: 'rgba(161,0,255,0.15)', border: '1px solid rgba(161,0,255,0.3)',
          borderRadius: '4px', color: '#A78BFA', fontSize: '10px', fontWeight: '600', cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(161,0,255,0.3)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(161,0,255,0.15)'; }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/>
            <line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
          </svg>
          Expand Full Ontology
        </button>
      )}
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────
export default function MROOperationsFlowDiagram({ onEquipmentClick }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [layoutReady, setLayoutReady] = useState(false);

  const highlightedIds = useMemo(() => {
    if (!selectedNode) return new Set();
    const ids = new Set([selectedNode.id]);
    getMROUpstreamNodes(selectedNode.id).forEach(n => ids.add(n.id));
    getMRODownstreamNodes(selectedNode.id).forEach(n => ids.add(n.id));
    return ids;
  }, [selectedNode]);

  // Run ELK layout on mount
  useEffect(() => {
    const doLayout = async () => {
      const elk = new ELK();

      const rfNodes = mroGraphNodes.map(node => ({
        id: node.id,
        type: 'ontologyNode',
        position: { x: 0, y: 0 },
        data: { label: node.label, type: node.type, status: node.data?.status },
      }));

      const graph = {
        id: 'root',
        layoutOptions: {
          'elk.algorithm': 'layered',
          'elk.direction': 'DOWN',
          'elk.spacing.nodeNode': '50',
          'elk.layered.spacing.nodeNodeBetweenLayers': '70',
          'elk.layered.spacing.edgeNodeBetweenLayers': '30',
          'elk.edgeRouting': 'SPLINES',
          'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',
          'elk.layered.crossingMinimization.strategy': 'LAYER_SWEEP',
          'elk.padding': '[top=30,left=30,bottom=30,right=30]',
        },
        children: rfNodes.map(node => ({ id: node.id, width: 150, height: 80 })),
        edges: mroGraphEdges.map(edge => ({ id: edge.id, sources: [edge.source], targets: [edge.target] })),
      };

      try {
        const layout = await elk.layout(graph);
        const layoutedNodes = rfNodes.map(node => {
          const laid = layout.children?.find(c => c.id === node.id);
          return { ...node, position: { x: laid?.x ?? 0, y: laid?.y ?? 0 } };
        });
        setNodes(layoutedNodes);
        setEdges(mroGraphEdges.map(edge => ({
          id: edge.id, source: edge.source, target: edge.target, label: edge.label,
          type: 'smoothstep', animated: false,
          style: {
            stroke: edge.type === 'financial' || edge.type === 'billing' || edge.type === 'contract' ? '#7C3AED' : '#A100FF',
            strokeWidth: 1.2, opacity: 0.6,
          },
          labelStyle: { fill: '#94A3B8', fontSize: 9, fontWeight: 500 },
          labelBgStyle: { fill: '#1a1a2e', fillOpacity: 0.85 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: edge.type === 'financial' || edge.type === 'billing' || edge.type === 'contract' ? '#7C3AED' : '#A100FF',
            width: 12, height: 12,
          },
        })));
        setLayoutReady(true);
      } catch (e) {
        console.error('ELK layout error:', e);
        const cols = 6;
        setNodes(rfNodes.map((node, i) => ({ ...node, position: { x: (i % cols) * 200, y: Math.floor(i / cols) * 120 } })));
        setEdges(mroGraphEdges.map(edge => ({
          id: edge.id, source: edge.source, target: edge.target, label: edge.label,
          type: 'smoothstep', style: { stroke: '#A100FF', strokeWidth: 1.2, opacity: 0.5 },
        })));
        setLayoutReady(true);
      }
    };

    doLayout();
  }, []);

  // Update edge highlights when selection changes
  useEffect(() => {
    if (!layoutReady) return;
    setEdges(eds => eds.map(edge => ({
      ...edge,
      animated: highlightedIds.size > 0 && highlightedIds.has(edge.source) && highlightedIds.has(edge.target),
      style: {
        ...edge.style,
        opacity: highlightedIds.size === 0 ? 0.6
          : (highlightedIds.has(edge.source) && highlightedIds.has(edge.target)) ? 1 : 0.15,
        strokeWidth: (highlightedIds.has(edge.source) && highlightedIds.has(edge.target)) ? 2 : 1.2,
      },
    })));
  }, [highlightedIds, layoutReady, setEdges]);

  // Update node opacity when selection changes
  useEffect(() => {
    if (!layoutReady) return;
    setNodes(nds => nds.map(node => ({
      ...node,
      data: { ...node.data, isHighlighted: highlightedIds.has(node.id) },
      style: highlightedIds.size > 0 && !highlightedIds.has(node.id) ? { opacity: 0.3 } : { opacity: 1 },
    })));
  }, [highlightedIds, layoutReady, setNodes]);

  const onNodeClick = useCallback((_, node) => {
    const mroNode = getMRONodeById(node.id);
    if (mroNode) {
      setSelectedNode(mroNode);
      if (onEquipmentClick) onEquipmentClick(node.id);
    }
  }, [onEquipmentClick]);

  const onPaneClick = useCallback(() => { setSelectedNode(null); }, []);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      background: '#1a1a2e', borderRadius: '8px', overflow: 'hidden', position: 'relative',
    }}>
      <div style={{ flex: 1, minHeight: '400px', position: 'relative' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.15, maxZoom: 1.0 }}
          proOptions={{ hideAttribution: true }}
          style={{ background: '#1a1a2e' }}
          minZoom={0.3}
          maxZoom={1.5}
          defaultEdgeOptions={{ type: 'smoothstep' }}
        >
          <Background color="#2D374822" gap={20} size={1} />
          <Controls showInteractive={false} style={{ background: '#2D3748', borderRadius: '6px', border: '1px solid #4A5568' }} />
          <MiniMap
            nodeColor={(n) => MRO_ENTITY_TYPES[n.data?.type]?.color || '#64748B'}
            style={{ background: '#2a2a3e', border: '1px solid #3a3a4e', borderRadius: '4px' }}
            maskColor="rgba(26,26,46,0.8)"
          />
        </ReactFlow>
        <NodeDetailPanel node={selectedNode} onClose={() => setSelectedNode(null)} />
      </div>
      <OntologyLegend onExpand={onEquipmentClick ? () => onEquipmentClick('__expand__') : null} />
    </div>
  );
}
