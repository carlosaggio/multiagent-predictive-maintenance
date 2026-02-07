'use client';

import { useState, useEffect, useRef } from 'react';
import { mroAlerts } from '../../../data/mro/mroAlertData';

export default function MROAlertTriageStage({ onBack, onStageAction, onComplete }) {
  const [showScanningIntro, setShowScanningIntro] = useState(true);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanMessages, setScanMessages] = useState([]);
  const [showHeader, setShowHeader] = useState(false);
  const [showSummaryBar, setShowSummaryBar] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [showFooter, setShowFooter] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('severity');
  const [revealedRows, setRevealedRows] = useState([]);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [expandedAlert, setExpandedAlert] = useState(null);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState(new Set());
  const [dismissedAlerts, setDismissedAlerts] = useState(new Set());
  const hasCompletedRef = useRef(false);

  const filters = [
    { id: 'all', label: 'All', count: mroAlerts.length },
    { id: 'critical', label: 'Critical', count: mroAlerts.filter(a => a.severity === 'critical').length },
    { id: 'high', label: 'High', count: mroAlerts.filter(a => a.severity === 'high').length },
    { id: 'medium', label: 'Medium', count: mroAlerts.filter(a => a.severity === 'medium').length },
  ];

  const getFilteredAndSortedAlerts = () => {
    let filtered = activeFilter === 'all'
      ? mroAlerts
      : mroAlerts.filter(a => a.severity === activeFilter);

    // Sort based on sortBy selection
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'severity') {
        const severityOrder = { critical: 3, high: 2, medium: 1, low: 0 };
        return severityOrder[b.severity] - severityOrder[a.severity];
      } else if (sortBy === 'age') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === 'system') {
        return a.location.localeCompare(b.location);
      }
      return 0;
    });

    return sorted;
  };

  const filteredAlerts = getFilteredAndSortedAlerts();

  const calculateAlertAge = (createdAt) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffMs = now - created;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d ${diffHours % 24}h`;
    if (diffHours > 0) return `${diffHours}h ${diffMins % 60}m`;
    return `${diffMins}m`;
  };

  // Phase 1: Scanning intro animation
  const scanSteps = [
    'Connecting to SAP PM alert stream...',
    'Querying vendor portal notifications...',
    'Scanning fleet management warnings...',
    'Correlating across MRO data sources...',
    `${mroAlerts.length} active alerts identified — building triage view...`,
  ];

  useEffect(() => {
    // Scanning animation phase
    scanSteps.forEach((msg, idx) => {
      setTimeout(() => {
        setScanMessages(prev => [...prev, msg]);
        setScanProgress(Math.round(((idx + 1) / scanSteps.length) * 100));
      }, 300 + idx * 500);
    });

    // Transition from scanning to table after scan completes
    const scanDuration = 300 + scanSteps.length * 500 + 600;
    setTimeout(() => {
      setShowScanningIntro(false);
      setShowHeader(true);
    }, scanDuration);

    setTimeout(() => setShowSummaryBar(true), scanDuration + 200);
    setTimeout(() => setShowFilters(true), scanDuration + 400);
    setTimeout(() => setShowTable(true), scanDuration + 600);

    filteredAlerts.forEach((_, idx) => {
      setTimeout(() => {
        setRevealedRows(prev => [...prev, idx]);
      }, scanDuration + 800 + idx * 60);
    });

    setTimeout(() => {
      if (!hasCompletedRef.current) {
        hasCompletedRef.current = true;
        setShowFooter(true);
        setAnimationComplete(true);
      }
    }, scanDuration + 800 + filteredAlerts.length * 60 + 400);
  }, [filteredAlerts.length]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return '#EF4444';
      case 'high': return '#F59E0B';
      case 'medium': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getSeverityDotColor = (severity) => {
    switch (severity) {
      case 'critical': return '#DC2626';
      case 'high': return '#EA580C';
      case 'medium': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'open':
        return { bg: '#FEE2E2', text: '#991B1B', label: 'New' };
      case 'acknowledged':
        return { bg: '#FFFBEB', text: '#92400E', label: 'Acknowledged' };
      default:
        return { bg: '#F0FDF4', text: '#166534', label: 'Under Review' };
    }
  };

  const handleAcknowledge = (alertId) => {
    setAcknowledgedAlerts(prev => new Set([...prev, alertId]));
  };

  const handleDismiss = (alertId) => {
    setDismissedAlerts(prev => new Set([...prev, alertId]));
  };

  const handleInvestigate = (alertId) => {
    onComplete?.();
  };

  return (
    <div style={{ padding: '0', display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#1a1a2e' }}>
      <style>{`
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes highlightPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.3); } 50% { box-shadow: 0 0 0 12px rgba(239, 68, 68, 0); } }
      `}</style>

      {/* Scanning Intro - distinctive visual transition */}
      {showScanningIntro && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 40px',
          background: 'linear-gradient(180deg, #0f0f23 0%, #1a1a2e 100%)',
          minHeight: '400px',
          animation: 'fadeIn 0.3s ease-out',
        }}>
          {/* Scanning radar icon */}
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            border: '3px solid rgba(161,0,255,0.3)',
            borderTopColor: '#A100FF',
            animation: 'spin 1.2s linear infinite',
            marginBottom: '24px',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: '2px solid rgba(161,0,255,0.2)',
              borderTopColor: 'rgba(161,0,255,0.6)',
              animation: 'spin 0.8s linear infinite reverse',
            }} />
          </div>

          <div style={{ fontSize: '16px', fontWeight: '700', color: '#A100FF', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Alert Triage Engine
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '32px' }}>
            Scanning all connected systems for active alerts
          </div>

          {/* Progress bar */}
          <div style={{ width: '320px', marginBottom: '24px' }}>
            <div style={{
              height: '4px',
              background: 'rgba(161,0,255,0.15)',
              borderRadius: '2px',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${scanProgress}%`,
                background: 'linear-gradient(90deg, #A100FF, #7C3AED)',
                borderRadius: '2px',
                transition: 'width 0.4s ease-out',
              }} />
            </div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', textAlign: 'right', marginTop: '4px' }}>
              {scanProgress}%
            </div>
          </div>

          {/* Scan messages */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '320px' }}>
            {scanMessages.map((msg, idx) => (
              <div key={idx} style={{
                fontSize: '11px',
                color: idx === scanMessages.length - 1 ? '#A100FF' : 'rgba(255,255,255,0.4)',
                fontFamily: 'monospace',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                animation: 'fadeSlideUp 0.3s ease-out',
              }}>
                <span style={{ color: idx === scanMessages.length - 1 ? '#A100FF' : '#10B981', fontSize: '8px' }}>
                  {idx < scanMessages.length - 1 ? '●' : '◉'}
                </span>
                {msg}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Header */}
      {showHeader && (
        <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', padding: '20px 24px', borderBottom: '2px solid #A100FF', animation: 'fadeSlideUp 0.4s ease-out' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#A100FF' }} />
            <span style={{ color: '#A100FF', fontSize: '14px', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Enterprise Operations Center</span>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>Real-time alert triage and investigation workbench</div>
        </div>
      )}

      {/* Alert Summary Bar */}
      {showSummaryBar && (
        <div style={{ background: 'rgba(161, 0, 255, 0.05)', borderBottom: '1px solid rgba(161, 0, 255, 0.2)', padding: '14px 24px', animation: 'fadeSlideUp 0.4s ease-out 0.1s backwards' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>
            <span style={{ fontWeight: '600' }}>
              <span style={{ color: '#A100FF', fontWeight: '700' }}>{mroAlerts.length}</span> Active Alerts
            </span>
            <span style={{ color: '#EF4444', fontWeight: '600' }}>
              {mroAlerts.filter(a => a.severity === 'critical').length} Critical
            </span>
            <span style={{ color: '#F59E0B', fontWeight: '600' }}>
              {mroAlerts.filter(a => a.severity === 'high').length} High
            </span>
            <span style={{ color: '#10B981', fontWeight: '600' }}>
              {mroAlerts.filter(a => a.severity === 'medium').length} Medium
            </span>
          </div>
        </div>
      )}

      <div style={{ padding: '24px', flex: 1, overflow: 'auto', background: '#1a1a2e' }}>
        {/* Filter & Sort Controls */}
        {showFilters && (
          <div style={{ marginBottom: '20px', animation: 'fadeSlideUp 0.4s ease-out 0.2s backwards' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '16px' }}>
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => {
                    setActiveFilter(filter.id);
                    setRevealedRows([]);
                    setExpandedAlert(null);
                  }}
                  style={{
                    background: activeFilter === filter.id ? '#A100FF' : 'rgba(255,255,255,0.05)',
                    color: activeFilter === filter.id ? 'white' : 'rgba(255,255,255,0.7)',
                    border: `1px solid ${activeFilter === filter.id ? '#A100FF' : 'rgba(161, 0, 255, 0.2)'}`,
                    borderRadius: '6px',
                    padding: '8px 16px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (activeFilter !== filter.id) {
                      e.currentTarget.style.borderColor = '#A100FF';
                      e.currentTarget.style.background = 'rgba(161, 0, 255, 0.15)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeFilter !== filter.id) {
                      e.currentTarget.style.borderColor = 'rgba(161, 0, 255, 0.2)';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    }
                  }}
                >
                  {filter.label}
                  <span style={{ marginLeft: '6px', fontSize: '11px', opacity: 0.6 }}>({filter.count})</span>
                </button>
              ))}
            </div>

            {/* Sort Controls */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sort by:</span>
              {['severity', 'age', 'system'].map(option => (
                <button
                  key={option}
                  onClick={() => setSortBy(option)}
                  style={{
                    background: sortBy === option ? 'rgba(161, 0, 255, 0.3)' : 'transparent',
                    color: sortBy === option ? '#A100FF' : 'rgba(255,255,255,0.5)',
                    border: `1px solid ${sortBy === option ? '#A100FF' : 'transparent'}`,
                    borderRadius: '4px',
                    padding: '4px 10px',
                    fontSize: '11px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textTransform: 'capitalize',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#A100FF';
                    e.currentTarget.style.background = 'rgba(161, 0, 255, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    if (sortBy !== option) {
                      e.currentTarget.style.borderColor = 'transparent';
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Alert Table */}
        {showTable && (
          <div style={{ animation: 'fadeSlideUp 0.4s ease-out 0.3s backwards', marginBottom: '24px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(161, 0, 255, 0.2)', borderRadius: '8px', overflow: 'hidden' }}>
              {/* Table Header */}
              <div style={{ display: 'grid', gridTemplateColumns: '40px 80px 1fr 140px 110px 100px 90px 100px 100px', gap: '12px', padding: '14px 16px', background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(161, 0, 255, 0.2)', fontSize: '10px', fontWeight: '700', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <div style={{ textAlign: 'center' }}>●</div>
                <div>ID</div>
                <div>Alert Title</div>
                <div>System</div>
                <div>Severity</div>
                <div>Age</div>
                <div>Status</div>
                <div>Assigned To</div>
                <div style={{ textAlign: 'center' }}>Actions</div>
              </div>

              {/* Table Rows */}
              {filteredAlerts.map((alert, idx) => {
                const isRevealed = revealedRows.includes(idx);
                const isHovered = hoveredRow === idx;
                const isExpanded = expandedAlert === alert.id;
                const isCritical = alert.severity === 'critical';
                const statusBadge = getStatusBadgeStyle(alert.status);
                const alertAge = calculateAlertAge(alert.createdAt);

                return (
                  <div key={alert.id}>
                    {/* Main Row */}
                    <div
                      onClick={() => setExpandedAlert(isExpanded ? null : alert.id)}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '40px 80px 1fr 140px 110px 100px 90px 100px 100px',
                        gap: '12px',
                        padding: '12px 16px',
                        borderBottom: '1px solid rgba(161, 0, 255, 0.1)',
                        background: isCritical && isHovered ? 'rgba(239, 68, 68, 0.08)' : isHovered ? 'rgba(161, 0, 255, 0.08)' : 'transparent',
                        borderLeft: isCritical ? '3px solid #DC2626' : '3px solid transparent',
                        opacity: isRevealed ? 1 : 0,
                        transform: isRevealed ? 'translateX(0)' : 'translateX(-12px)',
                        transition: 'all 0.3s ease-out',
                        cursor: 'pointer',
                        fontSize: '13px',
                        color: 'rgba(255,255,255,0.85)',
                        alignItems: 'center',
                        ...(isCritical && { animation: 'highlightPulse 2s infinite' })
                      }}
                      onMouseEnter={() => setHoveredRow(idx)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      {/* Priority Dot */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: getSeverityDotColor(alert.severity),
                          flexShrink: 0,
                        }} />
                      </div>

                      {/* ID */}
                      <div style={{ fontWeight: '700', color: '#A100FF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {alert.id}
                      </div>

                      {/* Title */}
                      <div style={{ color: 'rgba(255,255,255,0.9)', fontWeight: isCritical ? '600' : '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {isCritical && <span style={{ marginRight: '6px', color: '#EF4444' }}>⚠</span>}
                        {alert.typeLabel}
                      </div>

                      {/* System */}
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {alert.location}
                      </div>

                      {/* Severity Badge */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          background: getSeverityColor(alert.severity) + '25',
                          color: getSeverityColor(alert.severity),
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '10px',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          whiteSpace: 'nowrap',
                        }}>
                          <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: getSeverityColor(alert.severity) }} />
                          {alert.severity}
                        </span>
                      </div>

                      {/* Age */}
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', whiteSpace: 'nowrap', textAlign: 'center' }}>
                        {alertAge}
                      </div>

                      {/* Status */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{
                          background: statusBadge.bg + '40',
                          color: statusBadge.bg === '#FEE2E2' ? '#FCA5A5' : statusBadge.bg === '#FFFBEB' ? '#FCD34D' : '#86EFAC',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '9px',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          whiteSpace: 'nowrap',
                        }}>
                          {statusBadge.label}
                        </span>
                      </div>

                      {/* Assigned To */}
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {alert.owner || '—'}
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', justifyContent: 'center' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInvestigate(alert.id);
                          }}
                          title="Investigate"
                          style={{
                            padding: '4px 6px',
                            background: 'rgba(59, 130, 246, 0.2)',
                            border: '1px solid rgba(59, 130, 246, 0.5)',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '11px',
                            color: '#60A5FA',
                            transition: 'all 0.2s ease',
                            fontWeight: '600',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(59, 130, 246, 0.35)';
                            e.currentTarget.style.borderColor = '#60A5FA';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
                            e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
                          }}
                        >
                          🔍
                        </button>
                      </div>
                    </div>

                    {/* Expanded Row */}
                    {isExpanded && (
                      <div style={{
                        background: 'rgba(161, 0, 255, 0.05)',
                        borderBottom: '1px solid rgba(161, 0, 255, 0.2)',
                        padding: '16px 32px',
                        animation: 'slideDown 0.3s ease-out',
                        color: 'rgba(255,255,255,0.85)',
                      }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '16px' }}>
                          {/* Left Column */}
                          <div>
                            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>Summary</div>
                            <div style={{ fontSize: '13px', lineHeight: '1.5', marginBottom: '16px' }}>
                              {alert.description}
                            </div>

                            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>Impact</div>
                            <div style={{ fontSize: '14px', fontWeight: '600', color: '#A100FF', marginBottom: '16px' }}>
                              {alert.impactValue >= 100000 ? `$${(alert.impactValue / 1000).toFixed(0)}K` : alert.impact}
                            </div>
                          </div>

                          {/* Right Column */}
                          <div>
                            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>Affected Entities</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                              {alert.impactedObjects?.slice(0, 3).map(obj => (
                                <div key={obj.id} style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{ color: '#A100FF' }}>→</span>
                                  <span>{obj.label}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Alert Timeline */}
                        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(161, 0, 255, 0.2)' }}>
                          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.5px' }}>Timeline</div>
                          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                            {alert.timeline?.events?.slice(0, 4).map((event, i) => (
                              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>{event.date}</div>
                                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)' }}>{event.label}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', gap: '8px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(161, 0, 255, 0.2)' }}>
                          <button
                            onClick={() => handleAcknowledge(alert.id)}
                            disabled={acknowledgedAlerts.has(alert.id)}
                            style={{
                              padding: '8px 16px',
                              background: acknowledgedAlerts.has(alert.id) ? 'rgba(107, 114, 128, 0.2)' : 'rgba(161, 0, 255, 0.2)',
                              border: `1px solid ${acknowledgedAlerts.has(alert.id) ? 'rgba(107, 114, 128, 0.5)' : 'rgba(161, 0, 255, 0.5)'}`,
                              borderRadius: '4px',
                              color: acknowledgedAlerts.has(alert.id) ? 'rgba(255,255,255,0.5)' : '#A100FF',
                              fontSize: '12px',
                              fontWeight: '600',
                              cursor: acknowledgedAlerts.has(alert.id) ? 'not-allowed' : 'pointer',
                              transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                              if (!acknowledgedAlerts.has(alert.id)) {
                                e.currentTarget.style.background = 'rgba(161, 0, 255, 0.3)';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!acknowledgedAlerts.has(alert.id)) {
                                e.currentTarget.style.background = 'rgba(161, 0, 255, 0.2)';
                              }
                            }}
                          >
                            {acknowledgedAlerts.has(alert.id) ? '✓ Acknowledged' : 'Acknowledge'}
                          </button>

                          <button
                            onClick={() => handleDismiss(alert.id)}
                            disabled={dismissedAlerts.has(alert.id)}
                            style={{
                              padding: '8px 16px',
                              background: dismissedAlerts.has(alert.id) ? 'rgba(107, 114, 128, 0.2)' : 'rgba(249, 158, 11, 0.15)',
                              border: `1px solid ${dismissedAlerts.has(alert.id) ? 'rgba(107, 114, 128, 0.5)' : 'rgba(249, 158, 11, 0.4)'}`,
                              borderRadius: '4px',
                              color: dismissedAlerts.has(alert.id) ? 'rgba(255,255,255,0.5)' : '#FBBF24',
                              fontSize: '12px',
                              fontWeight: '600',
                              cursor: dismissedAlerts.has(alert.id) ? 'not-allowed' : 'pointer',
                              transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                              if (!dismissedAlerts.has(alert.id)) {
                                e.currentTarget.style.background = 'rgba(249, 158, 11, 0.25)';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!dismissedAlerts.has(alert.id)) {
                                e.currentTarget.style.background = 'rgba(249, 158, 11, 0.15)';
                              }
                            }}
                          >
                            {dismissedAlerts.has(alert.id) ? '✓ Dismissed' : 'Dismiss'}
                          </button>

                          <button
                            onClick={() => {
                              handleInvestigate(alert.id);
                            }}
                            style={{
                              padding: '8px 16px',
                              background: 'rgba(59, 130, 246, 0.2)',
                              border: '1px solid rgba(59, 130, 246, 0.5)',
                              borderRadius: '4px',
                              color: '#60A5FA',
                              fontSize: '12px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(59, 130, 246, 0.35)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
                            }}
                          >
                            Investigate Alert →
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* Stage Footer */}
      {showFooter && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          borderTop: '1px solid rgba(161, 0, 255, 0.2)',
          background: 'rgba(0,0,0,0.2)',
          gap: '12px',
          animation: 'fadeIn 0.3s ease-out',
        }}>
          <button
            onClick={() => onBack?.()}
            style={{
              padding: '8px 16px',
              background: 'transparent',
              border: '1px solid rgba(161, 0, 255, 0.3)',
              borderRadius: '6px',
              color: 'rgba(255,255,255,0.6)',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#A100FF';
              e.currentTarget.style.color = '#A100FF';
              e.currentTarget.style.background = 'rgba(161, 0, 255, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(161, 0, 255, 0.3)';
              e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            ← Back
          </button>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {/* Stats Display */}
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.6)', paddingRight: '12px', borderRight: '1px solid rgba(161, 0, 255, 0.2)' }}>
              <span>
                <span style={{ color: '#EF4444', fontWeight: '700' }}>{acknowledgedAlerts.size}</span> acknowledged
              </span>
              <span>
                <span style={{ color: '#F59E0B', fontWeight: '700' }}>{dismissedAlerts.size}</span> dismissed
              </span>
            </div>

            {/* Continue Button */}
            <button
              onClick={() => onComplete?.()}
              style={{
                padding: '8px 20px',
                background: '#A100FF',
                border: 'none',
                borderRadius: '6px',
                color: 'white',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(161, 0, 255, 0.4)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#8B00E0';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(161, 0, 255, 0.5)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#A100FF';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(161, 0, 255, 0.4)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Continue to Alert Details →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
