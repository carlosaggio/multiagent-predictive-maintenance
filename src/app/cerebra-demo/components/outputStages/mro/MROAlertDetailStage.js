'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { mroAlerts } from '../../../data/mro/mroAlertData';
import { mroKPITimeSeries } from '../../../data/mro/mroKPIData';

const ResponsiveLine = dynamic(() => import('@nivo/line').then(m => m.ResponsiveLine), { ssr: false });

export default function MROAlertDetailStage({ selectedAlertId, onBack, onStageAction, onComplete }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showHeader, setShowHeader] = useState(false);
  const [showTabs, setShowTabs] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [revealedItems, setRevealedItems] = useState([]);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [executingActions, setExecutingActions] = useState({});
  const [expandedPanels, setExpandedPanels] = useState({});
  const hasCompletedRef = useRef(false);

  // Find the alert by selectedAlertId or default to first alert
  const alert = selectedAlertId
    ? mroAlerts.find(a => a.id === selectedAlertId) || mroAlerts[0]
    : mroAlerts[0];
  const tabs = ['overview', 'timeline', 'explanation', 'parts', 'actions'];

  const tabLabels = {
    overview: 'Overview',
    timeline: 'Lifecycle',
    explanation: 'Root Cause',
    parts: 'Parts Timeline',
    actions: 'Actions',
  };

  // Enhanced alert lifecycle stages
  const lifecycleStages = [
    { stage: 'Detection', timestamp: '2025-01-15 06:15 UTC', status: 'completed', icon: '🔍' },
    { stage: 'Triage', timestamp: '2025-01-15 06:45 UTC', status: 'completed', icon: '⚕️' },
    { stage: 'Analysis', timestamp: '2025-01-15 07:30 UTC', status: 'in_progress', icon: '📊' },
    { stage: 'Mitigation', timestamp: 'Pending', status: 'pending', icon: '⚙️' },
  ];

  // Affected systems data
  const affectedSystems = {
    aircraft: 'AC-042',
    workPackage: 'WP-55',
    criticalParts: [
      { id: 'PO-8837', name: 'PO-8837', status: 'delayed', detail: 'Vendor delay by 5 days' },
      { id: 'SN-44821', name: 'SN-44821', status: 'tat_breach', detail: 'TAT breach by 3 days' },
      { id: 'PN-7742', name: 'PN-7742', status: 'approval', detail: 'Engineering approval pending' },
    ],
  };

  // Impact assessment metrics
  const impactMetrics = [
    { label: 'Revenue at Risk', value: '$1.2M', icon: '💰', color: '#EF4444' },
    { label: 'Schedule Impact', value: '3 days', icon: '📅', color: '#F59E0B' },
    { label: 'Fleet Availability', value: '-2%', icon: '✈️', color: '#EF4444' },
    { label: 'Customer Notifications', value: '3 pending', icon: '📧', color: '#3B82F6' },
  ];

  // Related alerts
  const relatedAlerts = mroAlerts.filter(a => a.id !== alert.id).slice(0, 3);

  useEffect(() => {
    setTimeout(() => setShowHeader(true), 200);
    setTimeout(() => setShowTabs(true), 400);
    setTimeout(() => setShowContent(true), 600);

    const itemCount = activeTab === 'timeline' ? 10 : 6;
    for (let i = 0; i < itemCount; i++) {
      setTimeout(() => {
        setRevealedItems(prev => [...prev, i]);
      }, 700 + i * 80);
    }

    setTimeout(() => {
      if (!hasCompletedRef.current) {
        hasCompletedRef.current = true;
        setAnimationComplete(true);
      }
    }, 700 + itemCount * 80 + 600);
  }, [activeTab]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return '#EF4444';
      case 'high': return '#F59E0B';
      default: return '#10B981';
    }
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'event': return '#3B82F6';
      case 'alert': return '#EF4444';
      case 'positive': return '#10B981';
      case 'deadline': return '#F59E0B';
      case 'milestone': return '#A100FF';
      default: return '#6B7280';
    }
  };

  const getPartStatusColor = (status) => {
    switch (status) {
      case 'delayed': return '#F59E0B';
      case 'tat_breach': return '#EF4444';
      case 'approval': return '#3B82F6';
      case 'complete': return '#10B981';
      default: return '#6B7280';
    }
  };

  const chartData = [
    {
      id: 'Expected Delivery',
      color: '#10B981',
      data: [
        { x: 'PO-8837', y: 20 },
        { x: 'SN-44821', y: 15 },
        { x: 'PN-7742', y: 18 },
      ],
    },
    {
      id: 'Actual Delivery',
      color: '#EF4444',
      data: [
        { x: 'PO-8837', y: 25 },
        { x: 'SN-44821', y: 18 },
        { x: 'PN-7742', y: 25 },
      ],
    },
  ];

  const handleNodeClick = (node) => {
    setSelectedNode(selectedNode?.id === node.id ? null : node);
  };

  const togglePanel = (panelId) => {
    setExpandedPanels(prev => ({
      ...prev,
      [panelId]: !prev[panelId],
    }));
  };

  const handleActionClick = (actionId) => {
    setExecutingActions(prev => ({
      ...prev,
      [actionId]: 'executing'
    }));
    setTimeout(() => {
      setExecutingActions(prev => ({
        ...prev,
        [actionId]: 'queued'
      }));
    }, 500);
  };

  return (
    <div style={{ padding: '0', display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#1a1a2e' }}>
      <style>{`
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideDown { from { opacity: 0; maxHeight: 0; } to { opacity: 1; maxHeight: 1000px; } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>

      {/* Header with Alert Summary */}
      {showHeader && (
        <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', padding: '20px', borderBottom: `3px solid ${getSeverityColor(alert.severity)}`, animation: 'fadeSlideUp 0.4s ease-out' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '14px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <span style={{ color: '#9CA3AF', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Alert ID</span>
                <span style={{ fontSize: '18px', fontWeight: '800', color: 'white' }}>{alert.id}</span>
              </div>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)', marginBottom: '8px', lineHeight: '1.5' }}>{alert.description}</div>
            </div>
            <div style={{ background: getSeverityColor(alert.severity), color: 'white', padding: '8px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
              {alert.severity}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
            <div><span style={{ fontWeight: '600', color: '#A100FF' }}>Owner:</span> {alert.owner}</div>
            <div><span style={{ fontWeight: '600', color: '#A100FF' }}>Location:</span> {alert.location}</div>
            <div><span style={{ fontWeight: '600', color: '#A100FF' }}>Impact:</span> {alert.impactValue >= 100000 ? `$${(alert.impactValue / 1000).toFixed(0)}K` : alert.impact}</div>
            <div><span style={{ fontWeight: '600', color: '#A100FF' }}>Status:</span> {alert.status}</div>
          </div>
        </div>
      )}

      <div style={{ padding: '20px', flex: 1, overflow: 'auto', background: '#1a1a2e' }}>
        {/* Tabs */}
        {showTabs && (
          <div style={{ marginBottom: '20px', animation: 'fadeSlideUp 0.4s ease-out', display: 'flex', gap: '0', borderBottom: '2px solid #2d2d3d' }}>
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setRevealedItems([]);
                  setSelectedNode(null);
                }}
                style={{
                  background: activeTab === tab ? 'rgba(161, 0, 255, 0.1)' : 'transparent',
                  color: activeTab === tab ? '#A100FF' : '#9CA3AF',
                  border: 'none',
                  borderBottom: activeTab === tab ? '3px solid #A100FF' : 'transparent',
                  padding: '14px 18px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== tab) {
                    e.currentTarget.style.color = '#E5E7EB';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== tab) {
                    e.currentTarget.style.color = '#9CA3AF';
                  }
                }}
              >
                {tabLabels[tab]}
              </button>
            ))}
          </div>
        )}

        {/* Tab Content */}
        {showContent && (
          <div style={{ animation: 'fadeSlideUp 0.4s ease-out' }}>
            {/* Overview Tab - Enhanced with Lifecycle, Systems, and Metrics */}
            {activeTab === 'overview' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Alert Lifecycle Timeline */}
                <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #2d2d3d', borderRadius: '8px', padding: '20px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#E5E7EB', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Alert Lifecycle
                  </div>
                  <div style={{ display: 'flex', alignItems: 'stretch', gap: '0', position: 'relative' }}>
                    {lifecycleStages.map((stage, idx) => {
                      const isRevealed = revealedItems.includes(idx);
                      const isCompleted = stage.status === 'completed';
                      const isActive = stage.status === 'in_progress';

                      return (
                        <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', opacity: isRevealed ? 1 : 0.3, transition: 'opacity 0.3s ease-out' }}>
                          {/* Connector line */}
                          {idx < lifecycleStages.length - 1 && (
                            <div style={{ position: 'absolute', top: '20px', left: '50%', width: '50%', height: '2px', background: isCompleted ? '#A100FF' : '#2d2d3d', zIndex: 0 }} />
                          )}

                          {/* Stage circle */}
                          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: isCompleted ? '#A100FF' : isActive ? 'rgba(161,0,255,0.3)' : '#2d2d3d', border: `2px solid ${isCompleted ? '#A100FF' : isActive ? '#A100FF' : '#404050'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', marginBottom: '12px', zIndex: 1, boxShadow: isActive ? '0 0 12px rgba(161,0,255,0.4)' : 'none' }}>
                            {stage.icon}
                          </div>

                          {/* Stage label */}
                          <div style={{ fontSize: '12px', fontWeight: '600', color: '#E5E7EB', marginBottom: '4px', textAlign: 'center' }}>
                            {stage.stage}
                          </div>
                          <div style={{ fontSize: '10px', color: '#9CA3AF', textAlign: 'center' }}>
                            {stage.timestamp}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Affected Systems Panel */}
                <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #2d2d3d', borderRadius: '8px', overflow: 'hidden' }}>
                  <div
                    onClick={() => togglePanel('affected-systems')}
                    style={{
                      padding: '16px 20px',
                      background: 'rgba(161,0,255,0.1)',
                      borderBottom: expandedPanels['affected-systems'] ? '1px solid #2d2d3d' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(161,0,255,0.15)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(161,0,255,0.1)'}
                  >
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#E5E7EB', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Affected Systems
                    </div>
                    <div style={{ fontSize: '12px', color: '#A100FF', fontWeight: '600' }}>
                      {expandedPanels['affected-systems'] ? '−' : '+'}
                    </div>
                  </div>

                  {expandedPanels['affected-systems'] && (
                    <div style={{ padding: '20px', animation: 'slideDown 0.3s ease-out' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '16px' }}>
                        {/* Aircraft */}
                        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #2d2d3d', borderRadius: '6px', padding: '12px', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = '#A100FF'} onMouseLeave={(e) => e.currentTarget.style.borderColor = '#2d2d3d'}>
                          <div style={{ fontSize: '10px', color: '#9CA3AF', marginBottom: '4px', textTransform: 'uppercase' }}>Aircraft</div>
                          <div style={{ fontSize: '14px', fontWeight: '700', color: '#A100FF' }}>{affectedSystems.aircraft}</div>
                        </div>

                        {/* Work Package */}
                        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #2d2d3d', borderRadius: '6px', padding: '12px', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = '#A100FF'} onMouseLeave={(e) => e.currentTarget.style.borderColor = '#2d2d3d'}>
                          <div style={{ fontSize: '10px', color: '#9CA3AF', marginBottom: '4px', textTransform: 'uppercase' }}>Work Package</div>
                          <div style={{ fontSize: '14px', fontWeight: '700', color: '#A100FF' }}>{affectedSystems.workPackage}</div>
                        </div>
                      </div>

                      {/* Critical Parts */}
                      <div style={{ marginTop: '16px', borderTop: '1px solid #2d2d3d', paddingTop: '16px' }}>
                        <div style={{ fontSize: '11px', fontWeight: '600', color: '#9CA3AF', marginBottom: '12px', textTransform: 'uppercase' }}>Critical Parts Status</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {affectedSystems.criticalParts.map((part, idx) => (
                            <div key={part.id} style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${getPartStatusColor(part.status)}33`, borderRadius: '4px', padding: '10px', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                              e.currentTarget.style.borderColor = getPartStatusColor(part.status);
                            }} onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                              e.currentTarget.style.borderColor = getPartStatusColor(part.status) + '33';
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                  <div style={{ fontSize: '11px', fontWeight: '600', color: '#E5E7EB' }}>{part.name}</div>
                                  <div style={{ fontSize: '10px', color: '#9CA3AF', marginTop: '2px' }}>{part.detail}</div>
                                </div>
                                <div style={{ fontSize: '10px', fontWeight: '700', color: getPartStatusColor(part.status), background: getPartStatusColor(part.status) + '25', padding: '3px 8px', borderRadius: '3px', textTransform: 'uppercase' }}>
                                  {part.status.replace('_', ' ')}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Impact Assessment Metrics */}
                <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #2d2d3d', borderRadius: '8px', padding: '20px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#E5E7EB', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Impact Assessment
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                    {impactMetrics.map((metric, idx) => {
                      const isRevealed = revealedItems.includes(idx + 4);
                      return (
                        <div
                          key={idx}
                          onClick={() => togglePanel(`metric-${idx}`)}
                          style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: `1px solid ${metric.color}33`,
                            borderRadius: '6px',
                            padding: '14px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            opacity: isRevealed ? 1 : 0.3,
                            transform: isRevealed ? 'scale(1)' : 'scale(0.95)',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                            e.currentTarget.style.borderColor = metric.color;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                            e.currentTarget.style.borderColor = metric.color + '33';
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <div style={{ fontSize: '10px', color: '#9CA3AF', textTransform: 'uppercase', fontWeight: '600' }}>{metric.label}</div>
                            <div style={{ fontSize: '16px' }}>{metric.icon}</div>
                          </div>
                          <div style={{ fontSize: '18px', fontWeight: '800', color: metric.color }}>{metric.value}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Related Alerts */}
                {relatedAlerts.length > 0 && (
                  <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #2d2d3d', borderRadius: '8px', padding: '20px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#E5E7EB', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Related Alerts
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {relatedAlerts.map((relAlert) => (
                        <div
                          key={relAlert.id}
                          onClick={() => togglePanel(`alert-${relAlert.id}`)}
                          style={{
                            background: 'rgba(255,255,255,0.02)',
                            border: `1px solid ${getSeverityColor(relAlert.severity)}33`,
                            borderRadius: '6px',
                            padding: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                            e.currentTarget.style.borderColor = getSeverityColor(relAlert.severity);
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                            e.currentTarget.style.borderColor = getSeverityColor(relAlert.severity) + '33';
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '12px', fontWeight: '600', color: '#E5E7EB' }}>{relAlert.id} - {relAlert.description.substring(0, 50)}...</div>
                            <div style={{ fontSize: '10px', color: '#9CA3AF', marginTop: '2px' }}>{relAlert.typeLabel}</div>
                          </div>
                          <div style={{ fontSize: '10px', fontWeight: '700', color: getSeverityColor(relAlert.severity), background: getSeverityColor(relAlert.severity) + '25', padding: '3px 8px', borderRadius: '3px', textTransform: 'uppercase' }}>
                            {relAlert.severity}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Timeline Tab */}
            {activeTab === 'timeline' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Timeline Events */}
                <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #2d2d3d', borderRadius: '8px', overflow: 'hidden' }}>
                  <div style={{ padding: '16px 20px', background: 'rgba(161,0,255,0.1)', borderBottom: '1px solid #2d2d3d', fontSize: '13px', fontWeight: '700', color: '#E5E7EB', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Alert Timeline
                  </div>
                  <div style={{ padding: '20px' }}>
                    {alert.timeline.events.map((event, idx) => {
                      const isRevealed = revealedItems.includes(idx + 1);

                      return (
                        <div
                          key={idx}
                          onClick={() => togglePanel(`event-${idx}`)}
                          style={{
                            opacity: isRevealed ? 1 : 0,
                            transform: isRevealed ? 'translateX(0)' : 'translateX(-10px)',
                            transition: 'all 0.3s ease-out',
                            display: 'flex',
                            gap: '16px',
                            marginBottom: idx < alert.timeline.events.length - 1 ? '16px' : '0',
                            paddingBottom: idx < alert.timeline.events.length - 1 ? '16px' : '0',
                            borderBottom: idx < alert.timeline.events.length - 1 ? '1px solid #2d2d3d' : 'none',
                            cursor: 'pointer',
                          }}
                        >
                          <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: getEventTypeColor(event.type), marginTop: '2px', marginBottom: '8px' }} />
                            {idx < alert.timeline.events.length - 1 && (
                              <div style={{ width: '2px', height: '32px', background: getEventTypeColor(event.type) + '40' }} />
                            )}
                          </div>

                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                              <div style={{ fontSize: '12px', fontWeight: '700', color: '#E5E7EB' }}>{event.label}</div>
                              <span style={{
                                fontSize: '9px',
                                fontWeight: '700',
                                color: getEventTypeColor(event.type),
                                background: getEventTypeColor(event.type) + '25',
                                padding: '2px 6px',
                                borderRadius: '2px',
                                textTransform: 'capitalize',
                              }}>
                                {event.type}
                              </span>
                            </div>
                            <div style={{ fontSize: '11px', color: '#9CA3AF' }}>{event.date}</div>
                          </div>

                          <div style={{ flexShrink: 0, color: '#A100FF', fontSize: '14px' }}>
                            {expandedPanels[`event-${idx}`] ? '−' : '+'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Parts Timeline Tab */}
            {activeTab === 'parts' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Parts Timeline Chart */}
                <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #2d2d3d', borderRadius: '8px', padding: '20px', minHeight: '320px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#E5E7EB', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Parts Delivery Timeline: Expected vs Actual
                  </div>
                  <ResponsiveLine
                    data={chartData}
                    margin={{ top: 10, right: 20, bottom: 40, left: 50 }}
                    xScale={{ type: 'point' }}
                    yScale={{ type: 'linear', min: 0, max: 30 }}
                    curve="natural"
                    axisBottom={{ tickSize: 4, tickPadding: 8, tickRotation: -30, fontSize: 11, fill: '#9CA3AF' }}
                    axisLeft={{ tickSize: 4, tickPadding: 8, fontSize: 11, fill: '#9CA3AF', legend: 'Days', legendOffset: -40 }}
                    pointSize={7}
                    pointColor={{ from: 'color' }}
                    pointBorderWidth={2}
                    pointBorderColor="#1a1a2e"
                    lineWidth={3}
                    enableArea={false}
                    enableSlicing={false}
                    colors={{ datum: 'color' }}
                    theme={{
                      background: 'transparent',
                      text: { fill: '#9CA3AF', fontSize: 11 },
                      axis: {
                        ticks: { text: { fill: '#9CA3AF' } },
                        legend: { text: { fill: '#9CA3AF' } },
                      },
                      grid: { line: { stroke: '#2d2d3d', strokeDasharray: '4' } },
                      tooltip: {
                        container: {
                          background: 'rgba(26,26,46,0.95)',
                          color: '#E5E7EB',
                          border: '1px solid #A100FF',
                          borderRadius: '6px',
                          fontSize: '11px',
                        },
                      },
                    }}
                  />
                </div>

                {/* Critical Parts Detail */}
                <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #2d2d3d', borderRadius: '8px', padding: '20px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#E5E7EB', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Critical Parts Status
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {affectedSystems.criticalParts.map((part, idx) => {
                      const isRevealed = revealedItems.includes(idx + 5);
                      const statusColor = getPartStatusColor(part.status);

                      return (
                        <div
                          key={part.id}
                          onClick={() => togglePanel(`part-${part.id}`)}
                          style={{
                            background: 'rgba(255,255,255,0.02)',
                            border: `2px solid ${statusColor}40`,
                            borderRadius: '6px',
                            padding: '14px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            opacity: isRevealed ? 1 : 0.3,
                            transform: isRevealed ? 'scale(1)' : 'scale(0.95)',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                            e.currentTarget.style.borderColor = statusColor;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                            e.currentTarget.style.borderColor = statusColor + '40';
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                              <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: statusColor + '25', border: `1px solid ${statusColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', color: statusColor }}>
                                {part.name[0]}
                              </div>
                              <div>
                                <div style={{ fontSize: '12px', fontWeight: '700', color: '#E5E7EB' }}>{part.name}</div>
                                <div style={{ fontSize: '10px', color: '#9CA3AF', marginTop: '2px' }}>{part.detail}</div>
                              </div>
                            </div>
                            <div style={{ fontSize: '10px', fontWeight: '700', color: statusColor, background: statusColor + '25', padding: '4px 10px', borderRadius: '4px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                              {part.status.replace('_', ' ')}
                            </div>
                          </div>

                          {expandedPanels[`part-${part.id}`] && (
                            <div style={{ paddingTop: '10px', borderTop: '1px solid #2d2d3d', animation: 'slideDown 0.3s ease-out' }}>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', fontSize: '10px' }}>
                                <div>
                                  <div style={{ color: '#9CA3AF', marginBottom: '2px' }}>Expected</div>
                                  <div style={{ color: '#10B981', fontWeight: '600' }}>Jan 18</div>
                                </div>
                                <div>
                                  <div style={{ color: '#9CA3AF', marginBottom: '2px' }}>Current ETA</div>
                                  <div style={{ color: statusColor, fontWeight: '600' }}>Jan 25</div>
                                </div>
                                <div>
                                  <div style={{ color: '#9CA3AF', marginBottom: '2px' }}>Delay</div>
                                  <div style={{ color: '#F59E0B', fontWeight: '600' }}>7 days</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Explanation Tab - Root Cause Analysis */}
            {activeTab === 'explanation' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Root Cause Tree Visualization */}
                <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #2d2d3d', borderRadius: '8px', padding: '20px', minHeight: '350px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#E5E7EB', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Root Cause Analysis Tree
                  </div>

                  <svg width="100%" height="280" viewBox="0 0 700 250" style={{ marginBottom: '16px', cursor: 'pointer' }}>
                    <defs>
                      <pattern id="grid-dark" width="50" height="50" patternUnits="userSpaceOnUse">
                        <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#2d2d3d" strokeWidth="0.5" />
                      </pattern>
                      <marker id="arrowhead-purple" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
                        <polygon points="0 0, 10 3, 0 6" fill="#A100FF" opacity="0.6" />
                      </marker>
                    </defs>
                    <rect width="700" height="250" fill="url(#grid-dark)" opacity="0.15" />

                    {/* Render causal links */}
                    {alert.rootCause.causalLinks.map((link, idx) => {
                      const sourceNode = alert.rootCause.causalChain.find(n => n.id === link.source);
                      const targetNode = alert.rootCause.causalChain.find(n => n.id === link.target);
                      if (!sourceNode || !targetNode) return null;

                      const isRevealed = revealedItems.includes(idx);

                      return (
                        <line
                          key={`link-${idx}`}
                          x1={sourceNode.x + 60}
                          y1={sourceNode.y}
                          x2={targetNode.x - 60}
                          y2={targetNode.y}
                          stroke="#A100FF"
                          strokeWidth="2.5"
                          markerEnd="url(#arrowhead-purple)"
                          opacity={isRevealed ? 0.5 : 0.15}
                          style={{ transition: 'opacity 0.3s ease-out' }}
                        />
                      );
                    })}

                    {/* Render causal nodes */}
                    {alert.rootCause.causalChain.map((node, idx) => {
                      const isRevealed = revealedItems.includes(idx);
                      const isSelected = selectedNode?.id === node.id;
                      const nodeTypeColors = {
                        root: '#EF4444',
                        intermediate: '#F59E0B',
                        contributing: '#3B82F6',
                        impact: '#8B5CF6',
                        outcome: '#10B981',
                      };
                      const nodeColor = nodeTypeColors[node.type] || '#9CA3AF';

                      return (
                        <g key={node.id} onClick={() => handleNodeClick(node)} style={{ cursor: 'pointer' }}>
                          <g
                            style={{
                              opacity: isRevealed ? 1 : 0.25,
                              transition: 'opacity 0.3s ease-out',
                            }}
                          >
                            <rect
                              x={node.x - 60}
                              y={node.y - 20}
                              width="120"
                              height="40"
                              rx="6"
                              fill={isSelected ? nodeColor + '30' : nodeColor + '10'}
                              stroke={nodeColor}
                              strokeWidth={isSelected ? '3' : '2'}
                              style={{ transition: 'all 0.2s ease' }}
                            />
                            <text
                              x={node.x}
                              y={node.y}
                              textAnchor="middle"
                              dominantBaseline="middle"
                              fontSize="10"
                              fontWeight="600"
                              fill={isSelected ? nodeColor : '#E5E7EB'}
                              style={{ pointerEvents: 'none' }}
                            >
                              {node.label.split('\n').map((line, i) => (
                                <tspan key={i} x={node.x} dy={i === 0 ? '0' : '12'}>
                                  {line}
                                </tspan>
                              ))}
                            </text>
                          </g>
                        </g>
                      );
                    })}
                  </svg>

                  {/* Selected node details */}
                  {selectedNode && (
                    <div
                      style={{
                        background: 'rgba(161,0,255,0.1)',
                        border: '2px solid #A100FF',
                        borderRadius: '6px',
                        padding: '14px',
                        animation: 'fadeIn 0.3s ease-out',
                      }}
                    >
                      <div style={{ fontSize: '10px', fontWeight: '700', color: '#9CA3AF', marginBottom: '6px', textTransform: 'uppercase' }}>
                        Node Details
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#E5E7EB', marginBottom: '6px' }}>
                        {selectedNode.label}
                      </div>
                      <div style={{ fontSize: '11px', color: '#9CA3AF', marginBottom: '6px' }}>
                        Type: <span style={{ fontWeight: '600', color: '#A100FF' }}>{selectedNode.type.replace('_', ' ')}</span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#9CA3AF' }}>
                        Click another node to compare or deselect to close.
                      </div>
                    </div>
                  )}
                </div>

                {/* Root cause summary */}
                <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #2d2d3d', borderRadius: '8px', padding: '16px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#E5E7EB', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Root Cause Summary
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ fontSize: '10px', fontWeight: '600', color: '#9CA3AF', marginBottom: '6px', textTransform: 'uppercase' }}>Primary Root Cause</div>
                    <div style={{ fontSize: '12px', color: '#EF4444', fontWeight: '600', lineHeight: '1.6' }}>
                      {alert.rootCause.primary}
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid #2d2d3d', paddingTop: '14px' }}>
                    <div style={{ fontSize: '10px', fontWeight: '600', color: '#9CA3AF', marginBottom: '8px', textTransform: 'uppercase' }}>Contributing Factors</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {alert.rootCause.contributing.map((factor, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                          <div style={{ color: '#3B82F6', fontWeight: '600', marginTop: '1px' }}>•</div>
                          <div style={{ fontSize: '11px', color: '#D1D5DB' }}>{factor}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}


            {/* Actions Tab */}
            {activeTab === 'actions' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#E5E7EB', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                  Recommended Actions
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { id: 'acknowledge', label: 'Acknowledge Alert', desc: 'Mark as reviewed and assign owner', color: '#3B82F6', icon: '✓' },
                    { id: 'scenario', label: 'Create Mitigation Scenario', desc: 'Explore expedite or transfer options', color: '#A100FF', icon: '⚙' },
                    { id: 'recommend', label: 'Get AI Recommendations', desc: 'Run full agent analysis and recommendations', color: '#10B981', icon: '🤖' },
                    { id: 'escalate', label: 'Escalate to Manager', desc: 'Request management review and approval', color: '#F59E0B', icon: '📢' },
                  ].map((action, idx) => {
                    const isRevealed = revealedItems.includes(idx);
                    const state = executingActions[action.id];

                    return (
                      <button
                        key={action.id}
                        onClick={() => handleActionClick(action.id)}
                        style={{
                          opacity: isRevealed ? 1 : 0,
                          transform: isRevealed ? 'translateY(0)' : 'translateY(8px)',
                          transition: 'all 0.3s ease-out',
                          background: state === 'executing' ? action.color : state === 'queued' ? '#10B981' : 'rgba(255,255,255,0.05)',
                          border: state ? 'none' : `1px solid ${action.color}60`,
                          borderRadius: '8px',
                          padding: '16px',
                          textAlign: 'left',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '14px',
                          color: state ? 'white' : 'inherit',
                        }}
                        onMouseEnter={(e) => {
                          if (!state) {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                            e.currentTarget.style.borderColor = action.color;
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!state) {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                            e.currentTarget.style.borderColor = action.color + '60';
                          }
                        }}
                      >
                        <div style={{ width: '44px', height: '44px', borderRadius: '8px', background: state ? 'rgba(255,255,255,0.2)' : action.color + '25', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '20px', fontWeight: '700', color: state ? 'white' : action.color, border: state ? 'none' : `1px solid ${action.color}40` }}>
                          {state === 'executing' ? '⏳' : state === 'queued' ? '✓' : action.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '13px', fontWeight: '700', color: state ? 'white' : '#E5E7EB' }}>{action.label}</div>
                          <div style={{ fontSize: '11px', color: state ? 'rgba(255,255,255,0.8)' : '#9CA3AF', marginTop: '3px' }}>
                            {state === 'executing' ? 'Executing action...' : state === 'queued' ? 'Queued for execution' : action.desc}
                          </div>
                        </div>
                        <div style={{ fontSize: '16px', color: state ? 'white' : action.color, fontWeight: '600' }}>
                          {state ? (state === 'executing' ? '...' : '✓') : '→'}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Secondary actions */}
                <div style={{ borderTop: '1px solid #2d2d3d', paddingTop: '16px' }}>
                  <div style={{ fontSize: '11px', fontWeight: '600', color: '#9CA3AF', marginBottom: '12px', textTransform: 'uppercase' }}>Quick Actions</div>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => handleActionClick('add-investigation')}
                      style={{
                        padding: '10px 16px',
                        background: executingActions['add-investigation'] === 'executing' ? '#3B82F6' : executingActions['add-investigation'] === 'queued' ? '#10B981' : 'rgba(59,130,246,0.15)',
                        border: executingActions['add-investigation'] ? 'none' : '1px solid #3B82F660',
                        borderRadius: '6px',
                        color: executingActions['add-investigation'] ? 'white' : '#3B82F6',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (!executingActions['add-investigation']) {
                          e.currentTarget.style.background = 'rgba(59,130,246,0.25)';
                          e.currentTarget.style.borderColor = '#3B82F6';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!executingActions['add-investigation']) {
                          e.currentTarget.style.background = 'rgba(59,130,246,0.15)';
                          e.currentTarget.style.borderColor = '#3B82F660';
                        }
                      }}
                    >
                      {executingActions['add-investigation'] === 'executing' ? '...' : executingActions['add-investigation'] === 'queued' ? '✓' : '📋'} Investigation
                    </button>
                    <button
                      onClick={() => handleActionClick('create-workorder')}
                      style={{
                        padding: '10px 16px',
                        background: executingActions['create-workorder'] === 'executing' ? '#A100FF' : executingActions['create-workorder'] === 'queued' ? '#10B981' : 'rgba(161,0,255,0.15)',
                        border: executingActions['create-workorder'] ? 'none' : '1px solid #A100FF60',
                        borderRadius: '6px',
                        color: executingActions['create-workorder'] ? 'white' : '#A100FF',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (!executingActions['create-workorder']) {
                          e.currentTarget.style.background = 'rgba(161,0,255,0.25)';
                          e.currentTarget.style.borderColor = '#A100FF';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!executingActions['create-workorder']) {
                          e.currentTarget.style.background = 'rgba(161,0,255,0.15)';
                          e.currentTarget.style.borderColor = '#A100FF60';
                        }
                      }}
                    >
                      {executingActions['create-workorder'] === 'executing' ? '...' : executingActions['create-workorder'] === 'queued' ? '✓' : '🔧'} Work Order
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stage Footer */}
      {animationComplete && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderTop: '1px solid #2d2d3d',
          background: '#0f0f1a',
          gap: '12px',
          animation: 'fadeIn 0.3s ease-out',
          flexWrap: 'wrap',
        }}>
          <button
            onClick={() => onBack?.()}
            style={{
              padding: '10px 16px',
              background: 'transparent',
              border: '1px solid #404050',
              borderRadius: '6px',
              color: '#9CA3AF',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#A100FF';
              e.currentTarget.style.color = '#E5E7EB';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#404050';
              e.currentTarget.style.color = '#9CA3AF';
            }}
          >
            ← Back
          </button>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Run What-If Button */}
            <button
              onClick={() => handleActionClick('run-whatif')}
              style={{
                padding: '10px 16px',
                background: executingActions['run-whatif'] === 'executing' ? '#A100FF' : executingActions['run-whatif'] === 'queued' ? '#10B981' : 'rgba(161,0,255,0.15)',
                border: executingActions['run-whatif'] ? 'none' : '1px solid #A100FF60',
                borderRadius: '6px',
                color: executingActions['run-whatif'] ? 'white' : '#A100FF',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!executingActions['run-whatif']) {
                  e.currentTarget.style.background = 'rgba(161,0,255,0.25)';
                  e.currentTarget.style.borderColor = '#A100FF';
                }
              }}
              onMouseLeave={(e) => {
                if (!executingActions['run-whatif']) {
                  e.currentTarget.style.background = 'rgba(161,0,255,0.15)';
                  e.currentTarget.style.borderColor = '#A100FF60';
                }
              }}
            >
              {executingActions['run-whatif'] === 'executing' ? '...' : executingActions['run-whatif'] === 'queued' ? '✓' : '↻ What-If'}
            </button>

            {/* Assign to Team Button */}
            <button
              onClick={() => handleActionClick('assign-team')}
              style={{
                padding: '10px 16px',
                background: executingActions['assign-team'] === 'executing' ? '#F59E0B' : executingActions['assign-team'] === 'queued' ? '#10B981' : 'rgba(245,158,11,0.15)',
                border: executingActions['assign-team'] ? 'none' : '1px solid #F59E0B60',
                borderRadius: '6px',
                color: executingActions['assign-team'] ? 'white' : '#F59E0B',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!executingActions['assign-team']) {
                  e.currentTarget.style.background = 'rgba(245,158,11,0.25)';
                  e.currentTarget.style.borderColor = '#F59E0B';
                }
              }}
              onMouseLeave={(e) => {
                if (!executingActions['assign-team']) {
                  e.currentTarget.style.background = 'rgba(245,158,11,0.15)';
                  e.currentTarget.style.borderColor = '#F59E0B60';
                }
              }}
            >
              {executingActions['assign-team'] === 'executing' ? '...' : executingActions['assign-team'] === 'queued' ? '✓' : '👥 Team'}
            </button>
          </div>

          {/* Continue Button */}
          <button
            onClick={() => onComplete?.()}
            style={{
              padding: '11px 26px',
              background: '#A100FF',
              border: 'none',
              borderRadius: '6px',
              color: 'white',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(161,0,255,0.3)',
              marginLeft: 'auto',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#8B00E0';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(161,0,255,0.4)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#A100FF';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(161,0,255,0.3)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Continue →
          </button>
        </div>
      )}
    </div>
  );
}
