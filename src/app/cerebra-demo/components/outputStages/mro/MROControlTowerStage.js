'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { mroKPIs } from '../../../data/mro/mroKPIData';
import { mroAlerts } from '../../../data/mro/mroAlertData';

const FACILITIES = [
  {
    id: 'hangar1',
    name: 'Hangar 1',
    status: 'operating',
    metric: 'Utilization',
    value: 87,
    unit: '%',
    events: [
      { time: '14:32', type: 'check_start', label: 'C-Check AC-042 started' },
      { time: '13:15', type: 'completion', label: 'RO-221 completed' },
      { time: '12:08', type: 'alert', label: 'PN-7742 flagged unavailable' },
    ]
  },
  {
    id: 'hangar2',
    name: 'Hangar 2',
    status: 'operating',
    metric: 'TAT',
    value: 3.2,
    unit: 'days',
    events: [
      { time: '15:01', type: 'check_start', label: 'D-Check AC-078 in progress' },
      { time: '14:20', type: 'resource', label: 'Mechanic assigned (3 available)' },
      { time: '13:45', type: 'normal', label: 'Shift rotation completed' },
    ]
  },
  {
    id: 'central_parts',
    name: 'Central Parts',
    status: 'operating',
    metric: 'Stock Level',
    value: 1247,
    unit: 'units',
    events: [
      { time: '14:55', type: 'normal', label: 'Inbound delivery: 342 units' },
      { time: '14:10', type: 'outbound', label: 'Issued to Hangar 1: 89 units' },
      { time: '13:32', type: 'normal', label: 'Inventory audit completed' },
    ]
  },
  {
    id: 'component_shop',
    name: 'Component Shop',
    status: 'operating',
    metric: 'ROs Pending',
    value: 12,
    unit: 'orders',
    events: [
      { time: '15:10', type: 'completion', label: 'RO-221 (PN-9108) ready for return' },
      { time: '14:48', type: 'progress', label: 'RO-445 (IDG) 78% complete' },
      { time: '14:25', type: 'alert', label: 'RO-445 TAT at risk (SLA +8d)' },
    ]
  },
  {
    id: 'hub_east',
    name: 'Hub East',
    status: 'critical',
    metric: 'Buffer Days',
    value: 2,
    unit: 'days',
    events: [
      { time: '15:05', type: 'alert', label: 'Critical buffer: 2 days remaining' },
      { time: '14:30', type: 'outbound', label: 'APU consumables issued: 34 units' },
      { time: '13:55', type: 'normal', label: 'Hub shift operations normal' },
    ]
  },
  {
    id: 'hub_west',
    name: 'Hub West',
    status: 'operating',
    metric: 'Buffer Days',
    value: 5,
    unit: 'days',
    events: [
      { time: '15:08', type: 'normal', label: 'Stock replenishment: 2-day buffer maintained' },
      { time: '14:15', type: 'normal', label: 'Hub operations normal' },
      { time: '13:20', type: 'normal', label: 'Cycle count completed' },
    ]
  },
];

const AGENTS = [
  { id: 'agent_part_scout', name: 'Parts Scout AI', status: 'active', lastAction: '2m ago', activity: 'Monitoring sourcing' },
  { id: 'agent_scheduler', name: 'Scheduler AI', status: 'active', lastAction: '1m ago', activity: 'Optimizing TAT' },
  { id: 'agent_risk_guard', name: 'Risk Guard AI', status: 'monitoring', lastAction: '30s ago', activity: 'Alert monitoring' },
  { id: 'agent_financial', name: 'Financial AI', status: 'analyzing', lastAction: '45s ago', activity: 'Variance analysis' },
  { id: 'agent_inventory', name: 'Inventory AI', status: 'active', lastAction: '3m ago', activity: 'Stock optimization' },
  { id: 'agent_hub_east', name: 'Hub East Coordinator', status: 'alert', lastAction: '1m ago', activity: 'Escalating buffer risk' },
  { id: 'agent_hub_west', name: 'Hub West Coordinator', status: 'active', lastAction: '4m ago', activity: 'Normal operations' },
];

export default function MROControlTowerStage({ onBack, onStageAction, onComplete }) {
  const [showKPIs, setShowKPIs] = useState(false);
  const [showFacilities, setShowFacilities] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const [showAgents, setShowAgents] = useState(false);
  const [revealedKPIs, setRevealedKPIs] = useState([]);
  const [revealedAlerts, setRevealedAlerts] = useState([]);
  const [revealedFacilities, setRevealedFacilities] = useState([]);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [expandedKPI, setExpandedKPI] = useState(null);
  const [expandedFacility, setExpandedFacility] = useState(null);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showAllAlerts, setShowAllAlerts] = useState(false);
  const [investigatingAlert, setInvestigatingAlert] = useState(false);

  // Progressive reveal timeline
  useEffect(() => {
    setTimeout(() => setShowKPIs(true), 300);

    mroKPIs.controlTower.forEach((_, idx) => {
      setTimeout(() => {
        setRevealedKPIs(prev => [...prev, idx]);
      }, 500 + idx * 80);
    });

    setTimeout(() => setShowFacilities(true), 1200);
    FACILITIES.forEach((_, idx) => {
      setTimeout(() => {
        setRevealedFacilities(prev => [...prev, idx]);
      }, 1400 + idx * 100);
    });

    setTimeout(() => setShowAlerts(true), 2000);

    mroAlerts.slice(0, 5).forEach((_, idx) => {
      setTimeout(() => {
        setRevealedAlerts(prev => [...prev, idx]);
      }, 2200 + idx * 100);
    });

    setTimeout(() => setShowAgents(true), 2700);

    setTimeout(() => {
      setAnimationComplete(true);
    }, 3000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical': return '#EF4444';
      case 'alert': return '#EF4444';
      case 'high': return '#F59E0B';
      case 'warning': return '#F59E0B';
      case 'analyzing': return '#3B82F6';
      case 'monitoring': return '#10B981';
      case 'active': return '#10B981';
      case 'operating': return '#10B981';
      default: return '#10B981';
    }
  };

  const getTrendIcon = (trend) => {
    if (trend === 'up') return '↑';
    if (trend === 'down') return '↓';
    return '→';
  };

  const getTrendColor = (trend, severity) => {
    if (severity === 'critical') return '#EF4444';
    if (severity === 'warning') return '#F59E0B';
    if (trend === 'down') return '#10B981';
    return '#F59E0B';
  };

  const getKPITrendData = (kpi) => {
    const trendValues = {
      up: `+${Math.floor(Math.random() * 20)}% from last hour`,
      down: `-${Math.floor(Math.random() * 15)}% from last hour`,
      stable: 'No change from baseline'
    };
    return trendValues[kpi.trend] || 'Trend data unavailable';
  };

  const renderSparkline = (count = 7) => {
    const bars = Array.from({ length: count }, () => Math.random() * 100);
    const max = Math.max(...bars);
    return bars.map((val, i) => (
      <div
        key={i}
        style={{
          flex: 1,
          height: '20px',
          background: `linear-gradient(to top, #8B5CF6, #A78BFA)`,
          borderRadius: '2px',
          opacity: 0.3 + (val / max) * 0.7,
        }}
      />
    ));
  };

  const getFacilityStatusColor = (status) => {
    if (status === 'critical') return '#EF4444';
    if (status === 'warning') return '#F59E0B';
    return '#10B981';
  };

  return (
    <div style={{ padding: '0', display: 'flex', flexDirection: 'column', height: '100%', background: '#1a1a2e' }}>
      <style>{`
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInLeft { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
        @keyframes glow { 0%, 100% { box-shadow: 0 0 8px rgba(239, 68, 68, 0.3); } 50% { box-shadow: 0 0 16px rgba(239, 68, 68, 0.6); } }
        @keyframes flowIn { 0% { stroke-dashoffset: 1000; } to { stroke-dashoffset: 0; } }
        @keyframes shimmer { 0% { background-position: -1000px 0; } 100% { background-position: 1000px 0; } }
      `}</style>

      {/* Header with purple accent bar */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        padding: '16px 20px',
        borderBottom: '3px solid #A100FF',
        boxShadow: '0 2px 12px rgba(161,0,255,0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#A100FF',
              animation: 'pulse 1.5s infinite'
            }} />
            <span style={{ color: '#A100FF', fontSize: '13px', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Operations Intelligence Center</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', color: '#94A3B8' }}>
            <div style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#10B981',
              animation: 'pulse 2s infinite'
            }} />
            LIVE
          </div>
        </div>
        <div style={{ color: '#94A3B8', fontSize: '11px', marginTop: '4px' }}>7 Operational Hubs | 7 Coordinating Agents | Real-time Status & Risk Monitoring</div>
      </div>

      <div style={{ flex: 1, padding: '20px', background: '#1a1a2e', overflow: 'auto' }}>
        {/* KPI Tiles Section - 5 Across */}
        {showKPIs && (
          <div style={{ marginBottom: '24px', animation: 'fadeSlideUp 0.4s ease-out' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#94A3B8', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Key Performance Indicators</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
              {mroKPIs.controlTower.map((kpi, idx) => {
                const isRevealed = revealedKPIs.includes(idx);
                const statusColor = getStatusColor(kpi.severity);
                const isExpanded = expandedKPI === idx;
                const isCritical = kpi.severity === 'critical';

                return (
                  <div key={kpi.id}>
                    <div
                      onClick={() => setExpandedKPI(expandedKPI === idx ? null : idx)}
                      style={{
                        opacity: isRevealed ? 1 : 0,
                        transform: isRevealed ? 'scale(1)' : 'scale(0.9)',
                        transition: 'all 0.3s ease-out',
                        background: 'rgba(255,255,255,0.04)',
                        border: `1px solid ${statusColor}40`,
                        borderLeft: `4px solid ${statusColor}`,
                        borderRadius: '8px',
                        padding: '14px',
                        textAlign: 'center',
                        cursor: isRevealed ? 'pointer' : 'default',
                        boxShadow: isExpanded ? `0 0 16px ${statusColor}30` : isCritical ? `0 0 12px ${statusColor}20` : 'none',
                        animation: isCritical && isRevealed ? 'glow 2s infinite' : 'none',
                      }}
                      onMouseEnter={(e) => {
                        if (isRevealed) {
                          e.currentTarget.style.borderColor = statusColor + '60';
                          e.currentTarget.style.boxShadow = `0 0 16px ${statusColor}30`;
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (isRevealed && !isExpanded) {
                          e.currentTarget.style.borderColor = statusColor + '40';
                          e.currentTarget.style.boxShadow = isCritical ? `0 0 12px ${statusColor}20` : 'none';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }
                      }}
                    >
                      <div style={{ fontSize: '10px', color: '#94A3B8', marginBottom: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{kpi.label}</div>
                      <div style={{ fontSize: '24px', fontWeight: '700', color: statusColor, marginBottom: '8px' }}>
                        {kpi.value}{kpi.unit}
                      </div>
                      {isRevealed && (
                        <>
                          <div style={{ display: 'flex', gap: '2px', marginBottom: '8px' }}>
                            {renderSparkline(7)}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '10px', color: getTrendColor(kpi.trend, kpi.severity) }}>
                            <span>{getTrendIcon(kpi.trend)}</span>
                            <span style={{ textTransform: 'capitalize' }}>{kpi.trend}</span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* KPI Detail Expansion */}
                    {isExpanded && isRevealed && (
                      <div style={{
                        marginTop: '8px',
                        padding: '12px',
                        background: 'rgba(255,255,255,0.04)',
                        border: `1px solid ${statusColor}40`,
                        borderRadius: '6px',
                        animation: 'fadeSlideUp 0.3s ease-out',
                        fontSize: '9px',
                        color: '#F1F5F9',
                      }}>
                        <div style={{ fontWeight: '600', color: statusColor, marginBottom: '6px' }}>Trend Analysis</div>
                        <div style={{ color: '#94A3B8', marginBottom: '8px' }}>{getKPITrendData(kpi)}</div>
                        <div style={{ display: 'flex', gap: '2px', height: '30px' }}>
                          {renderSparkline(7)}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* System Health Dashboard - Facility Status Cards */}
        {showFacilities && (
          <div style={{ marginBottom: '24px', animation: 'fadeSlideUp 0.4s ease-out' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#94A3B8', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>System Health Dashboard - 7 Operational Nodes</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '12px' }}>
              {FACILITIES.slice(0, 6).map((facility, idx) => {
                const isRevealed = revealedFacilities.includes(idx);
                const statusColor = getFacilityStatusColor(facility.status);
                const isExpanded = expandedFacility === idx;
                const isCritical = facility.status === 'critical';

                return (
                  <div key={facility.id}>
                    <div
                      onClick={() => setExpandedFacility(expandedFacility === idx ? null : idx)}
                      style={{
                        opacity: isRevealed ? 1 : 0,
                        transform: isRevealed ? 'scale(1)' : 'scale(0.9)',
                        transition: 'all 0.3s ease-out',
                        background: 'rgba(255,255,255,0.04)',
                        border: `1px solid ${statusColor}40`,
                        borderLeft: `4px solid ${statusColor}`,
                        borderRadius: '8px',
                        padding: '16px',
                        cursor: isRevealed ? 'pointer' : 'default',
                        boxShadow: isExpanded ? `0 0 16px ${statusColor}30` : isCritical ? `0 0 12px ${statusColor}20` : 'none',
                        animation: isCritical && isRevealed ? 'glow 2s infinite' : 'none',
                      }}
                      onMouseEnter={(e) => {
                        if (isRevealed) {
                          e.currentTarget.style.borderColor = statusColor + '60';
                          e.currentTarget.style.boxShadow = `0 0 16px ${statusColor}30`;
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (isRevealed && !isExpanded) {
                          e.currentTarget.style.borderColor = statusColor + '40';
                          e.currentTarget.style.boxShadow = isCritical ? `0 0 12px ${statusColor}20` : 'none';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                        <div style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: statusColor,
                          animation: isCritical ? 'pulse 1.5s infinite' : 'none'
                        }} />
                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#F1F5F9', flex: 1 }}>{facility.name}</span>
                        <span style={{ fontSize: '9px', fontWeight: '600', color: statusColor, textTransform: 'uppercase', letterSpacing: '0.5px', background: `${statusColor}20`, padding: '2px 6px', borderRadius: '3px' }}>{facility.status}</span>
                      </div>
                      <div style={{ fontSize: '24px', fontWeight: '700', color: statusColor, marginBottom: '4px' }}>
                        {facility.value}{facility.unit}
                      </div>
                      <div style={{ fontSize: '9px', color: '#94A3B8', marginBottom: '10px' }}>{facility.metric}</div>
                      {isExpanded && isRevealed && (
                        <div style={{
                          marginTop: '12px',
                          paddingTop: '12px',
                          borderTop: `1px solid ${statusColor}30`,
                          animation: 'fadeSlideUp 0.3s ease-out',
                        }}>
                          <div style={{ fontSize: '9px', fontWeight: '600', color: '#94A3B8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Last 3 Events</div>
                          {facility.events.map((event, eventIdx) => (
                            <div key={eventIdx} style={{
                              fontSize: '8px',
                              color: '#94A3B8',
                              marginBottom: '6px',
                              paddingLeft: '12px',
                              borderLeft: `2px solid ${event.type === 'alert' ? '#EF4444' : event.type === 'completion' ? '#10B981' : event.type === 'normal' ? '#64748b' : '#3B82F6'}`,
                            }}>
                              <div style={{ color: '#F1F5F9', fontWeight: '600' }}>{event.time}</div>
                              <div>{event.label}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Finance Row - Centered Below */}
            {FACILITIES.slice(6).map((facility, idx) => {
              const actualIdx = 6 + idx;
              const isRevealed = revealedFacilities.includes(actualIdx);
              const statusColor = '#A100FF';
              const isExpanded = expandedFacility === actualIdx;

              return (
                <div key={facility.id} style={{ display: 'flex', justifyContent: 'center' }}>
                  <div style={{ width: '100%', maxWidth: '33.333%' }}>
                    <div
                      onClick={() => setExpandedFacility(expandedFacility === actualIdx ? null : actualIdx)}
                      style={{
                        opacity: isRevealed ? 1 : 0,
                        transform: isRevealed ? 'scale(1)' : 'scale(0.9)',
                        transition: 'all 0.3s ease-out',
                        background: 'rgba(255,255,255,0.04)',
                        border: `1px solid ${statusColor}40`,
                        borderLeft: `4px solid ${statusColor}`,
                        borderRadius: '8px',
                        padding: '16px',
                        cursor: isRevealed ? 'pointer' : 'default',
                        boxShadow: isExpanded ? `0 0 16px ${statusColor}30` : 'none',
                      }}
                      onMouseEnter={(e) => {
                        if (isRevealed) {
                          e.currentTarget.style.borderColor = statusColor + '60';
                          e.currentTarget.style.boxShadow = `0 0 16px ${statusColor}30`;
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (isRevealed && !isExpanded) {
                          e.currentTarget.style.borderColor = statusColor + '40';
                          e.currentTarget.style.boxShadow = 'none';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                        <div style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: statusColor,
                        }} />
                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#F1F5F9', flex: 1 }}>{facility.name}</span>
                        <span style={{ fontSize: '9px', fontWeight: '600', color: statusColor, textTransform: 'uppercase', letterSpacing: '0.5px', background: `${statusColor}20`, padding: '2px 6px', borderRadius: '3px' }}>OPERATIONAL</span>
                      </div>
                      <div style={{ fontSize: '24px', fontWeight: '700', color: statusColor, marginBottom: '4px' }}>
                        {facility.value}{facility.unit}
                      </div>
                      <div style={{ fontSize: '9px', color: '#94A3B8', marginBottom: '10px' }}>{facility.metric}</div>
                      {isExpanded && isRevealed && (
                        <div style={{
                          marginTop: '12px',
                          paddingTop: '12px',
                          borderTop: `1px solid ${statusColor}30`,
                          animation: 'fadeSlideUp 0.3s ease-out',
                        }}>
                          <div style={{ fontSize: '9px', fontWeight: '600', color: '#94A3B8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Last 3 Events</div>
                          {facility.events.map((event, eventIdx) => (
                            <div key={eventIdx} style={{
                              fontSize: '8px',
                              color: '#94A3B8',
                              marginBottom: '6px',
                              paddingLeft: '12px',
                              borderLeft: `2px solid #A100FF60`,
                            }}>
                              <div style={{ color: '#F1F5F9', fontWeight: '600' }}>{event.time}</div>
                              <div>{event.label}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Row: Active Alerts Panel + Agent Status Matrix */}
        {showAlerts && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '12px', animation: 'fadeSlideUp 0.4s ease-out' }}>
            {/* Active Alerts Panel */}
            <div>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#94A3B8', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active Alerts ({mroAlerts.length})</div>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', overflow: 'hidden', maxHeight: '400px', overflowY: 'auto' }}>
                {(showAllAlerts ? mroAlerts : mroAlerts.slice(0, 5)).map((alert, idx) => {
                  const isRevealed = revealedAlerts.includes(idx);
                  const severityColor = getStatusColor(alert.severity);
                  const isSelected = selectedAlert === idx;

                  return (
                    <div
                      key={alert.id}
                      onClick={() => setSelectedAlert(selectedAlert === idx ? null : idx)}
                      style={{
                        opacity: isRevealed ? 1 : 0,
                        transform: isRevealed ? 'translateX(0)' : 'translateX(-10px)',
                        transition: 'all 0.3s ease-out',
                        padding: '12px 14px',
                        borderBottom: (showAllAlerts ? idx < mroAlerts.length - 1 : idx < 4) ? '1px solid rgba(255,255,255,0.08)' : 'none',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                        cursor: isRevealed ? 'pointer' : 'default',
                        background: isSelected ? `${severityColor}20` : 'transparent',
                        borderLeft: `3px solid ${severityColor}`,
                      }}
                      onMouseEnter={(e) => {
                        if (isRevealed && !isSelected) {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (isRevealed && !isSelected) {
                          e.currentTarget.style.background = 'transparent';
                        }
                      }}
                    >
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: severityColor, marginTop: '4px', flexShrink: 0, boxShadow: `0 0 8px ${severityColor}60` }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                          <span style={{ fontSize: '10px', fontWeight: '700', color: '#F1F5F9' }}>{alert.id}</span>
                          <span style={{ fontSize: '8px', fontWeight: '600', color: severityColor, textTransform: 'uppercase', letterSpacing: '0.4px', background: `${severityColor}30`, padding: '1px 4px', borderRadius: '2px' }}>{alert.severity}</span>
                        </div>
                        <div style={{ fontSize: '9px', color: '#94A3B8', marginBottom: '2px' }}>{alert.typeLabel}</div>
                        <div style={{ fontSize: '8px', color: '#64748b', lineHeight: '1.3' }}>{alert.description.substring(0, 80)}...</div>
                      </div>
                      <div style={{ fontSize: '10px', fontWeight: '600', color: severityColor, whiteSpace: 'nowrap', flexShrink: 0 }}>
                        {alert.impactValue >= 100000 ? `$${(alert.impactValue / 1000).toFixed(0)}K` : alert.impact}
                      </div>
                    </div>
                  );
                })}
              </div>
              {!showAllAlerts && mroAlerts.length > 5 && (
                <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '10px', color: '#A100FF', cursor: 'pointer', fontWeight: '600' }} onClick={() => setShowAllAlerts(true)}>
                  + {mroAlerts.length - 5} more alerts
                </div>
              )}
            </div>

            {/* Agent Status Matrix */}
            {showAgents && (
              <div style={{ animation: 'fadeSlideUp 0.4s ease-out' }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#94A3B8', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Coordinating Agents (7)</div>
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', overflow: 'hidden' }}>
                  {AGENTS.map((agent, idx) => {
                    const agentStatusColor = getStatusColor(agent.status);
                    return (
                      <div
                        key={agent.id}
                        style={{
                          padding: '12px 14px',
                          borderBottom: idx < AGENTS.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <div style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: agentStatusColor,
                          flexShrink: 0,
                          animation: ['active', 'alert'].includes(agent.status) ? 'pulse 1.5s infinite' : 'none'
                        }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '10px', fontWeight: '700', color: '#F1F5F9', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {agent.name}
                          </div>
                          <div style={{ fontSize: '8px', color: '#94A3B8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {agent.activity}
                          </div>
                        </div>
                        <div style={{ fontSize: '8px', color: agentStatusColor, fontWeight: '600', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                          {agent.lastAction}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer with Action Buttons */}
      {animationComplete && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(26,26,46,0.95)',
          gap: '12px',
          animation: 'fadeIn 0.3s ease-out',
          backdropFilter: 'blur(8px)',
        }}>
          <button
            onClick={() => onBack?.()}
            style={{
              padding: '8px 16px',
              background: 'transparent',
              border: '1px solid #4A5568',
              borderRadius: '6px',
              color: '#94A3B8',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#A100FF';
              e.currentTarget.style.color = '#A100FF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#4A5568';
              e.currentTarget.style.color = '#94A3B8';
            }}
          >
            ← Back
          </button>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => {
                setInvestigatingAlert(true);
                onStageAction?.({ type: 'investigation_started', alertCount: mroAlerts.length, severity: 'critical' });
                setTimeout(() => {
                  setInvestigatingAlert(false);
                  onComplete?.();
                }, 2000);
              }}
              disabled={investigatingAlert}
              style={{
                padding: '10px 16px',
                background: investigatingAlert ? '#A100FF' : 'transparent',
                border: '1px solid ' + (investigatingAlert ? '#A100FF' : '#94A3B8'),
                borderRadius: '6px',
                color: investigatingAlert ? '#F1F5F9' : '#94A3B8',
                fontSize: '12px',
                fontWeight: '600',
                cursor: investigatingAlert ? 'default' : 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!investigatingAlert) {
                  e.currentTarget.style.borderColor = '#A100FF';
                  e.currentTarget.style.color = '#A100FF';
                }
              }}
              onMouseLeave={(e) => {
                if (!investigatingAlert) {
                  e.currentTarget.style.borderColor = '#94A3B8';
                  e.currentTarget.style.color = '#94A3B8';
                }
              }}
            >
              {investigatingAlert ? '⟳ Investigating...' : 'Investigate Alert'}
            </button>
            <button
              onClick={() => setShowAllAlerts(!showAllAlerts)}
              style={{
                padding: '10px 16px',
                background: showAllAlerts ? 'rgba(161,0,255,0.2)' : 'transparent',
                border: '1px solid ' + (showAllAlerts ? '#A100FF' : '#94A3B8'),
                borderRadius: '6px',
                color: showAllAlerts ? '#A100FF' : '#94A3B8',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!showAllAlerts) {
                  e.currentTarget.style.borderColor = '#A100FF';
                  e.currentTarget.style.color = '#A100FF';
                }
              }}
              onMouseLeave={(e) => {
                if (!showAllAlerts) {
                  e.currentTarget.style.borderColor = '#94A3B8';
                  e.currentTarget.style.color = '#94A3B8';
                }
              }}
            >
              {showAllAlerts ? '✓ All Alerts (' + mroAlerts.length + ')' : 'View All Alerts (' + mroAlerts.length + ')'}
            </button>
          </div>
          <button
            onClick={() => onComplete?.()}
            style={{
              padding: '10px 24px',
              background: '#A100FF',
              border: 'none',
              borderRadius: '6px',
              color: 'white',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(161,0,255,0.4)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#C43EFF';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(161,0,255,0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#A100FF';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(161,0,255,0.4)';
            }}
          >
            Continue →
          </button>
        </div>
      )}
    </div>
  );
}
