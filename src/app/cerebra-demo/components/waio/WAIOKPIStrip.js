"use client";

import React from 'react';

/**
 * WAIO KPI Strip Component
 * 
 * Top KPI cards for the WAIO shift optimiser control tower.
 */

// KPI Card Component
function KPICard({ icon, label, value, unit, delta, deltaLabel, isAlert, isPositive, tooltip }) {
  const getStatusColor = () => {
    if (isAlert) return '#EF4444';
    if (isPositive === true) return '#10B981';
    if (isPositive === false) return '#EF4444';
    return '#6B7280';
  };

  const getDeltaIcon = () => {
    if (isPositive === true) return '↑';
    if (isPositive === false) return '↓';
    return '';
  };

  return (
    <div 
      style={{
        background: isAlert ? '#FEF2F2' : 'white',
        borderRadius: '8px',
        padding: '16px 20px',
        border: `1px solid ${isAlert ? '#FECACA' : '#E2E8F0'}`,
        minWidth: '200px',
        flex: '1 1 200px',
        transition: 'all 0.3s ease',
        cursor: tooltip ? 'help' : 'default',
      }}
      title={tooltip}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
        {/* Icon */}
        <div style={{
          width: '40px',
          height: '40px',
          background: isAlert ? '#FEE2E2' : '#F3F4F6',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          {icon}
        </div>
        
        {/* Content */}
        <div style={{ flex: 1 }}>
          <div style={{ 
            fontSize: '12px', 
            color: isAlert ? '#DC2626' : '#6B7280', 
            marginBottom: '6px',
            fontWeight: isAlert ? '600' : '500',
            letterSpacing: '0.3px',
          }}>
            {label}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ 
              fontSize: '28px', 
              fontWeight: '700', 
              color: isAlert ? '#DC2626' : '#1A1A2E',
              lineHeight: '1',
            }}>
              {value}
            </span>
            
            {unit && (
              <span style={{ 
                fontSize: '13px', 
                color: isAlert ? '#991B1B' : '#6B7280',
              }}>
                {unit}
              </span>
            )}
          </div>
          
          {delta !== undefined && (
            <div style={{ 
              marginTop: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}>
              <span style={{ 
                fontSize: '12px', 
                fontWeight: '600',
                color: getStatusColor(),
              }}>
                {getDeltaIcon()}{delta}
              </span>
              {deltaLabel && (
                <span style={{ 
                  fontSize: '11px', 
                  color: '#9CA3AF',
                }}>
                  {deltaLabel}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Icons
const Icons = {
  compliance: (color = '#4B5563') => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  risk: (color = '#EF4444') => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  tonnes: (color = '#4B5563') => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <line x1="12" y1="20" x2="12" y2="10"/>
      <line x1="18" y1="20" x2="18" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="16"/>
    </svg>
  ),
  value: (color = '#EF4444') => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <line x1="12" y1="1" x2="12" y2="23"/>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
};

// Format number with commas
const formatNumber = (num) => {
  if (typeof num === 'number') {
    return num.toLocaleString('en-US');
  }
  return num;
};

// Format percentage
const formatPercent = (num) => {
  if (typeof num === 'number') {
    return `${Math.round(num * 100)}%`;
  }
  return num;
};

// Format currency
const formatCurrency = (num) => {
  if (typeof num === 'number') {
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `$${(num / 1000).toFixed(0)}k`;
    }
    return `$${num}`;
  }
  return num;
};

export default function WAIOKPIStrip({ kpis }) {
  if (!kpis) return null;

  const {
    planCompliance = 0.84,
    underSpecRisk = 0.38,
    tonnesLoaded = 145327,
    tonnesTarget = 155000,
    valueAtRiskUSD = 1800000,
  } = kpis;

  const tonneDelta = tonnesLoaded - tonnesTarget;
  const tonnesDeltaPercent = ((tonneDelta / tonnesTarget) * 100).toFixed(1);

  return (
    <div style={{
      display: 'flex',
      gap: '16px',
      padding: '16px',
      background: 'white',
      borderBottom: '1px solid #E2E8F0',
      flexWrap: 'wrap',
    }}>
      {/* Plan Compliance */}
      <KPICard
        icon={Icons.compliance(planCompliance < 0.9 ? '#F59E0B' : '#10B981')}
        label="Plan Compliance (Shift)"
        value={formatPercent(planCompliance)}
        delta={`${((planCompliance - 0.95) * 100).toFixed(1)}%`}
        deltaLabel="vs target"
        isPositive={planCompliance >= 0.9}
        tooltip="Percentage of planned operations executed on schedule"
      />

      {/* Under-spec Risk */}
      <KPICard
        icon={Icons.risk()}
        label="Under-spec Risk (Next 2 Trains)"
        value={formatPercent(underSpecRisk)}
        delta={underSpecRisk > 0.3 ? 'HIGH' : underSpecRisk > 0.15 ? 'MEDIUM' : 'LOW'}
        isAlert={underSpecRisk > 0.35}
        isPositive={underSpecRisk <= 0.2 ? true : underSpecRisk > 0.35 ? false : null}
        tooltip="Probability of next train loads failing grade specification"
      />

      {/* Tonnes Loaded */}
      <KPICard
        icon={Icons.tonnes(tonneDelta < 0 ? '#F59E0B' : '#10B981')}
        label="Tonnes Loaded (Shift)"
        value={formatNumber(tonnesLoaded)}
        unit="t"
        delta={`${tonnesDeltaPercent}%`}
        deltaLabel={`vs ${formatNumber(tonnesTarget)}t target`}
        isPositive={tonneDelta >= 0}
        tooltip="Total tonnes loaded this shift vs target"
      />

      {/* Value at Risk */}
      <KPICard
        icon={Icons.value()}
        label="Value at Risk (Quality + Demurrage)"
        value={formatCurrency(valueAtRiskUSD)}
        delta={valueAtRiskUSD > 1000000 ? 'CRITICAL' : valueAtRiskUSD > 500000 ? 'HIGH' : 'MODERATE'}
        isAlert={valueAtRiskUSD > 1500000}
        isPositive={valueAtRiskUSD < 500000}
        tooltip="Estimated penalty exposure from quality non-compliance and port delays"
      />
    </div>
  );
}

export { KPICard, Icons };
