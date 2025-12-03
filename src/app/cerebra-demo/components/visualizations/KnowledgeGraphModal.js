"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { knowledgeGraphData, nodeTypes } from '../../data/knowledgeGraphData';

// Position nodes in a meaningful layout showing the reasoning flow
const positionNodes = (nodes, scale = 1, offsetX = 0, offsetY = 0) => {
  const positioned = {};
  const centerX = 350 * scale + offsetX;
  const centerY = 180 * scale + offsetY;
  
  nodes.forEach(node => {
    switch(node.type) {
      case 'central':
        positioned[node.id] = { ...node, x: centerX, y: centerY };
        break;
      case 'data':
        const dataIndex = nodes.filter(n => n.type === 'data').indexOf(node);
        positioned[node.id] = { ...node, x: 70 * scale + offsetX, y: (70 + dataIndex * 65) * scale + offsetY };
        break;
      case 'finding':
        const findingIndex = nodes.filter(n => n.type === 'finding').indexOf(node);
        const findingAngle = -Math.PI/4 + (findingIndex * Math.PI/3);
        positioned[node.id] = { 
          ...node, 
          x: centerX + 160 * scale * Math.cos(findingAngle), 
          y: centerY + 100 * scale * Math.sin(findingAngle) 
        };
        break;
      case 'factor':
        const factorIndex = nodes.filter(n => n.type === 'factor').indexOf(node);
        positioned[node.id] = { ...node, x: (260 + factorIndex * 90) * scale + offsetX, y: 320 * scale + offsetY };
        break;
      case 'conclusion':
        positioned[node.id] = { ...node, x: 560 * scale + offsetX, y: centerY };
        break;
      case 'recommendation':
        const recIndex = nodes.filter(n => n.type === 'recommendation').indexOf(node);
        positioned[node.id] = { ...node, x: 680 * scale + offsetX, y: (100 + recIndex * 75) * scale + offsetY };
        break;
      default:
        positioned[node.id] = { ...node, x: centerX, y: centerY };
    }
  });
  
  return positioned;
};

export default function KnowledgeGraphModal({ isOpen, onClose }) {
  const canvasRef = useRef(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  const positionedNodes = positionNodes(knowledgeGraphData.nodes, zoom, pan.x, pan.y);
  const nodesArray = Object.values(positionedNodes);

  const draw = useCallback(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw links
    knowledgeGraphData.links.forEach(link => {
      const source = positionedNodes[link.source];
      const target = positionedNodes[link.target];
      if (!source || !target) return;

      ctx.beginPath();
      ctx.moveTo(source.x, source.y);
      ctx.lineTo(target.x, target.y);
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Draw arrow
      const angle = Math.atan2(target.y - source.y, target.x - source.x);
      const arrowX = target.x - 18 * Math.cos(angle);
      const arrowY = target.y - 18 * Math.sin(angle);
      
      ctx.beginPath();
      ctx.moveTo(arrowX, arrowY);
      ctx.lineTo(arrowX - 6 * Math.cos(angle - Math.PI / 6), arrowY - 6 * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(arrowX - 6 * Math.cos(angle + Math.PI / 6), arrowY - 6 * Math.sin(angle + Math.PI / 6));
      ctx.closePath();
      ctx.fillStyle = '#CBD5E0';
      ctx.fill();
    });

    // Draw nodes
    nodesArray.forEach(node => {
      const isHovered = hoveredNode === node.id;
      const isSelected = selectedNode === node.id;
      const baseRadius = node.size || (node.type === 'central' ? 28 : node.type === 'conclusion' ? 24 : 18);
      const radius = baseRadius * zoom;

      // Glow for selected/hovered
      if (isHovered || isSelected) {
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 12;
      }

      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = isHovered || isSelected ? node.color : `${node.color}25`;
      ctx.fill();
      ctx.strokeStyle = node.color;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Label below
      ctx.fillStyle = '#4B5563';
      ctx.font = `${9 * zoom}px -apple-system, BlinkMacSystemFont, sans-serif`;
      ctx.textAlign = 'center';
      
      let label = node.label;
      if (ctx.measureText(label).width > radius * 2.5) {
        label = label.substring(0, 10) + '...';
      }
      ctx.fillText(label, node.x, node.y + radius + 10 * zoom);
      
      if (node.sublabel) {
        ctx.fillStyle = '#9CA3AF';
        ctx.font = `${7 * zoom}px -apple-system, BlinkMacSystemFont, sans-serif`;
        ctx.fillText(node.sublabel, node.x, node.y + radius + 18 * zoom);
      }
    });
  }, [hoveredNode, selectedNode, zoom, pan, positionedNodes, nodesArray]);

  useEffect(() => {
    if (isOpen) draw();
  }, [isOpen, draw]);

  const handleMouseMove = (e) => {
    if (!canvasRef.current) return;
    
    if (isPanning) {
      const dx = e.clientX - panStart.x;
      const dy = e.clientY - panStart.y;
      setPan({ x: pan.x + dx, y: pan.y + dy });
      setPanStart({ x: e.clientX, y: e.clientY });
      return;
    }

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const found = nodesArray.find(node => {
      const radius = (node.size || 18) * zoom;
      return Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2) < radius;
    });

    setHoveredNode(found ? found.id : null);
  };

  const handleMouseDown = (e) => {
    if (e.button === 1 || e.ctrlKey) { // Middle click or ctrl+click to pan
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => setIsPanning(false);

  const handleClick = (e) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const found = nodesArray.find(node => {
      const radius = (node.size || 18) * zoom;
      return Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2) < radius;
    });

    setSelectedNode(found ? found.id : null);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(prev => Math.max(0.5, Math.min(2, prev + delta)));
  };

  const handleZoomIn = () => setZoom(prev => Math.min(2, prev + 0.2));
  const handleZoomOut = () => setZoom(prev => Math.max(0.5, prev - 0.2));
  const handleReset = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  if (!isOpen) return null;

  const selectedNodeData = selectedNode ? positionedNodes[selectedNode] : null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.75)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        width: '1100px',
        maxWidth: '95vw',
        maxHeight: '90vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header - clean, no subtitle */}
        <div style={{ 
          padding: '16px 20px',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
        }}>
          <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a2e', margin: 0 }}>
            Knowledge Graph
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Zoom controls */}
            <button onClick={handleZoomOut} style={zoomBtnStyle}>−</button>
            <span style={{ fontSize: '11px', color: '#6B7280', minWidth: '40px', textAlign: 'center' }}>
              {Math.round(zoom * 100)}%
            </span>
            <button onClick={handleZoomIn} style={zoomBtnStyle}>+</button>
            <button onClick={handleReset} style={{ ...zoomBtnStyle, padding: '4px 10px', marginLeft: '4px' }}>
              Reset
            </button>
            <button 
              onClick={onClose} 
              style={{ 
                background: 'none', 
                border: 'none', 
                fontSize: '18px',
                cursor: 'pointer',
                color: '#9CA3AF',
                marginLeft: '12px',
              }}
            >
              ×
            </button>
          </div>
        </div>
        
        {/* Main content */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Graph */}
          <div style={{ 
            flex: 1,
            background: '#FAFAFA', 
            position: 'relative',
          }}>
            <canvas
              ref={canvasRef}
              width={selectedNodeData ? 720 : 900}
              height={420}
              onMouseMove={handleMouseMove}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onClick={handleClick}
              onWheel={handleWheel}
              style={{ cursor: hoveredNode ? 'pointer' : isPanning ? 'grabbing' : 'default' }}
            />
            
            {/* Flow direction labels */}
            <div style={{
              position: 'absolute',
              top: '10px',
              left: '20px',
              right: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              pointerEvents: 'none',
            }}>
              <span style={{ fontSize: '9px', color: '#9CA3AF', letterSpacing: '0.5px' }}>DATA SOURCES</span>
              <span style={{ fontSize: '9px', color: '#9CA3AF', letterSpacing: '0.5px' }}>ANALYSIS</span>
              <span style={{ fontSize: '9px', color: '#9CA3AF', letterSpacing: '0.5px' }}>FINDINGS</span>
              <span style={{ fontSize: '9px', color: '#9CA3AF', letterSpacing: '0.5px' }}>ACTIONS</span>
            </div>
          </div>

          {/* Detail Pane */}
          {selectedNodeData && (
            <div style={{
              width: '320px',
              borderLeft: '1px solid #E2E8F0',
              background: 'white',
              overflowY: 'auto',
            }}>
              <div style={{
                padding: '16px',
                borderBottom: '1px solid #E2E8F0',
                background: `${selectedNodeData.color}10`,
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px',
                  marginBottom: '8px',
                }}>
                  <span style={{
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    background: selectedNodeData.color,
                  }} />
                  <span style={{ 
                    fontSize: '10px', 
                    color: '#6B7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    {selectedNodeData.type}
                  </span>
                </div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#1A1A2E' }}>
                  {selectedNodeData.label}
                </div>
                {selectedNodeData.sublabel && (
                  <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
                    {selectedNodeData.sublabel}
                  </div>
                )}
              </div>

              {/* Node Details */}
              <div style={{ padding: '16px' }}>
                {selectedNodeData.details && typeof selectedNodeData.details === 'object' && (
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '10px', color: '#9CA3AF', marginBottom: '10px', letterSpacing: '0.5px' }}>
                      DETAILS
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {Object.entries(selectedNodeData.details).map(([key, value]) => {
                        // Format key for display
                        const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                        
                        // Handle array values
                        if (Array.isArray(value)) {
                          return (
                            <div key={key}>
                              <div style={{ fontSize: '10px', color: '#6B7280', marginBottom: '4px' }}>
                                {formattedKey}
                              </div>
                              <div style={{ 
                                fontSize: '11px', 
                                color: '#1A1A2E',
                                background: '#F8FAFC',
                                padding: '8px',
                                borderRadius: '4px',
                                borderLeft: `2px solid ${selectedNodeData.color}`,
                              }}>
                                {value.map((item, idx) => (
                                  <div key={idx} style={{ marginBottom: idx < value.length - 1 ? '4px' : 0 }}>
                                    {typeof item === 'string' ? `• ${item}` : item}
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        }
                        
                        return (
                          <div 
                            key={key}
                            style={{ 
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'flex-start',
                              padding: '6px 0',
                              borderBottom: '1px solid #F3F4F6',
                            }}
                          >
                            <span style={{ fontSize: '10px', color: '#6B7280', flex: '0 0 45%' }}>
                              {formattedKey}
                            </span>
                            <span style={{ 
                              fontSize: '11px', 
                              color: '#1A1A2E', 
                              fontWeight: '500',
                              textAlign: 'right',
                              flex: '0 0 52%',
                            }}>
                              {typeof value === 'number' ? value.toLocaleString() : String(value)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Connections */}
                <div>
                  <div style={{ fontSize: '10px', color: '#9CA3AF', marginBottom: '8px', letterSpacing: '0.5px' }}>
                    CONNECTIONS
                  </div>
                  {knowledgeGraphData.links
                    .filter(l => l.source === selectedNodeData.id || l.target === selectedNodeData.id)
                    .map((link, i) => {
                      const isSource = link.source === selectedNodeData.id;
                      const otherNodeId = isSource ? link.target : link.source;
                      const otherNode = positionedNodes[otherNodeId];
                      return (
                        <div 
                          key={i} 
                          onClick={() => setSelectedNode(otherNodeId)}
                          style={{ 
                            fontSize: '11px', 
                            color: '#4B5563', 
                            padding: '6px 8px',
                            background: '#FAFAFA',
                            borderRadius: '4px',
                            marginBottom: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            cursor: 'pointer',
                            transition: 'background 0.15s',
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#F3F4F6'}
                          onMouseLeave={(e) => e.currentTarget.style.background = '#FAFAFA'}
                        >
                          <span style={{ color: '#9CA3AF' }}>{isSource ? '->' : '<-'}</span>
                          <span style={{ color: otherNode?.color, fontWeight: '500' }}>{link.label}</span>
                          <span>{otherNode?.label}</span>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div style={{ 
          padding: '10px 20px',
          borderTop: '1px solid #E2E8F0',
          background: 'white',
          display: 'flex', 
          justifyContent: 'center', 
          gap: '20px',
        }}>
          {Object.entries(nodeTypes).map(([key, value]) => (
            <span key={key} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: '#6B7280' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: value.color }} />
              {value.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

const zoomBtnStyle = {
  width: '28px',
  height: '28px',
  background: '#F3F4F6',
  border: '1px solid #E2E8F0',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px',
  color: '#4B5563',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};
