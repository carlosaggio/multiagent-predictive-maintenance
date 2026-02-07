"use client";

import React from 'react';
import { mroKPIs } from '../../data/mro/mroKPIData';
import { getCurrentMROScenarioVariant } from '../../data/mro/mroScenarioVariants';
import { mroAlerts } from '../../data/mro/mroAlertData';

/**
 * MRO KPI Strip Component
 *
 * Top KPI cards for the MRO Overview control tower.
 * Shows 5 key MRO metrics: Active Checks, Red Parts, Pool Coverage, MBH Exceptions, and Open Alerts.
 */

// KPI Card Component
function KPICard({ icon, label, value, unit, isAlert, isWarning, tooltip }) {
  const getStatusColor = () => {
    if (isAlert) return '#EF4444';
    if (isWarning) return '#F59E0B';
    return '#6B7280';
  };

  const getBackgroundColor = () => {
    if (isAlert) return '#FEF2F2';
    if (isWarning) return '#FFFBEB';
    return 'white';
  };

  const getBorderColor = () => {
    if (isAlert) return '#FECACA';
    if (isWarning) return '#FED7AA';
    return '#E2E8F0';
  };

  return (
    <div
      style={{
        background: getBackgroundColor(),
        borderRadius: '8px',
        padding: '16px 20px',
        border: `1px solid ${getBorderColor()}`,
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
          background: isAlert ? '#FEE2E2' : isWarning ? '#FEF3C7' : '#F3F4F6',
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
            color: isAlert ? '#DC2626' : isWarning ? '#D97706' : '#6B7280',
            marginBottom: '6px',
            fontWeight: isAlert ? '600' : isWarning ? '600' : '500',
            letterSpacing: '0.3px',
          }}>
            {label}
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: '28px',
              fontWeight: '700',
              color: isAlert ? '#DC2626' : isWarning ? '#D97706' : '#1A1A2E',
              lineHeight: '1',
            }}>
              {value}
            </span>

            {unit && (
              <span style={{
                fontSize: '13px',
                color: isAlert ? '#991B1B' : isWarning ? '#B45309' : '#6B7280',
              }}>
                {unit}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Icons
const Icons = {
  activeChecks: (color = '#3B82F6') => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M17.8 19.2L16 11l3.5-6.1A2 2 0 0 0 15.4 2.5h-2.3m7 13.2l-4.4 2.4M5.3 7c1.3-1.3 3.1-2 5-2 4 0 7.2 3 7.8 6.9M7 10c1.2 0 2.3.3 3.3 1"/>
      <path d="M7 13L4.5 5"/>
    </svg>
  ),
  redParts: (color = '#EF4444') => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  poolCoverage: (color = '#F59E0B') => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
      <polyline points="7 15 12 10 17 15"/>
    </svg>
  ),
  mbhExceptions: (color = '#EF4444') => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <line x1="12" y1="1" x2="12" y2="23"/>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  alerts: (color = '#A100FF') => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
};

export function MROKPIStrip({ compact = false }) {
  // Get current scenario variant
  const variant = getCurrentMROScenarioVariant();

  // Get open alerts count
  const openAlerts = mroAlerts.filter(a => a.status === 'open').length;

  // KPI values from current variant
  const activeChecks = 5;  // From spec
  const redParts = variant.redPartsCount || 3;
  const poolCoverage = variant.poolCoverage || 89;
  const mbhExceptions = variant.mbhExceptions || 2;
  const openAlertCount = openAlerts;

  // Determine status colors for pool coverage and mbh exceptions
  const poolCoverageIsWarning = poolCoverage < 80;
  const mbhIsAlert = mbhExceptions > 0;

  if (compact) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: 'white',
        borderRadius: '6px',
        border: '1px solid #E2E8F0',
        marginBottom: '12px',
        overflow: 'hidden',
      }}>
        {/* Compact KPI items */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '8px 16px',
          borderRight: '1px solid rgba(226, 232, 240, 0.5)',
        }}>
          <div>
            <div style={{ fontSize: '10px', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Active Checks
            </div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#1A1A2E', lineHeight: '1.2' }}>
              {activeChecks}
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '8px 16px',
          borderRight: '1px solid rgba(226, 232, 240, 0.5)',
        }}>
          <div>
            <div style={{ fontSize: '10px', color: redParts > 0 ? '#DC2626' : '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: redParts > 0 ? '600' : '500' }}>
              Red Parts
            </div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: redParts > 0 ? '#DC2626' : '#1A1A2E', lineHeight: '1.2' }}>
              {redParts}
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '8px 16px',
          borderRight: '1px solid rgba(226, 232, 240, 0.5)',
        }}>
          <div>
            <div style={{ fontSize: '10px', color: poolCoverageIsWarning ? '#D97706' : '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: poolCoverageIsWarning ? '600' : '500' }}>
              Pool Coverage
            </div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: poolCoverageIsWarning ? '#D97706' : '#1A1A2E', lineHeight: '1.2' }}>
              {poolCoverage}%
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '8px 16px',
          borderRight: '1px solid rgba(226, 232, 240, 0.5)',
        }}>
          <div>
            <div style={{ fontSize: '10px', color: mbhIsAlert ? '#DC2626' : '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: mbhIsAlert ? '600' : '500' }}>
              MBH Exceptions
            </div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: mbhIsAlert ? '#DC2626' : '#1A1A2E', lineHeight: '1.2' }}>
              {mbhExceptions}
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '8px 16px',
          borderRight: '1px solid rgba(226, 232, 240, 0.5)',
        }}>
          <div>
            <div style={{ fontSize: '10px', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Open Alerts
            </div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#A100FF', lineHeight: '1.2' }}>
              {openAlertCount}
            </div>
          </div>
        </div>

        <div style={{ flex: 1 }} />
        <div style={{
          padding: '8px 16px',
          fontSize: '10px',
          color: '#6B7280',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <span style={{ width: '6px', height: '6px', background: '#10B981', borderRadius: '50%' }} />
          Live
        </div>
      </div>
    );
  }

  // Full mode - card layout
  return (
    <div style={{
      display: 'flex',
      gap: '16px',
      padding: '16px',
      background: 'white',
      borderBottom: '1px solid #E2E8F0',
      flexWrap: 'wrap',
    }}>
      {/* Active Checks */}
      <KPICard
        icon={Icons.activeChecks('#3B82F6')}
        label="Active Checks"
        value={activeChecks}
        tooltip="Number of active aircraft checks in progress"
      />

      {/* Red Parts */}
      <KPICard
        icon={Icons.redParts(redParts > 0 ? '#EF4444' : '#6B7280')}
        label="Red Parts"
        value={redParts}
        isAlert={redParts > 0}
        tooltip="Critical parts with availability issues or delays"
      />

      {/* Pool Coverage */}
      <KPICard
        icon={Icons.poolCoverage(poolCoverageIsWarning ? '#F59E0B' : '#10B981')}
        label="Pool Coverage"
        value={poolCoverage}
        unit="%"
        isWarning={poolCoverageIsWarning}
        tooltip="Percentage of pooled component parts available for deployment"
      />

      {/* MBH Exceptions */}
      <KPICard
        icon={Icons.mbhExceptions(mbhIsAlert ? '#EF4444' : '#6B7280')}
        label="MBH Exceptions"
        value={mbhExceptions}
        isAlert={mbhIsAlert}
        tooltip="Open revenue exceptions or billing discrepancies in maintenance contracts"
      />

      {/* Open Alerts */}
      <KPICard
        icon={Icons.alerts('#A100FF')}
        label="Open Alerts"
        value={openAlertCount}
        tooltip="Total number of open operational alerts across the MRO network"
      />
    </div>
  );
}

export default MROKPIStrip;
