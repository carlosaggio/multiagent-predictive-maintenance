"use client";

import React from 'react';

/**
 * Plan Delta Summary Component
 * 
 * Shows what tasks changed (added/removed/shifted) and net KPI impact.
 */

// Change type configurations
const CHANGE_TYPES = {
  added: { color: '#10B981', bgColor: '#D1FAE5', icon: '+', label: 'Added' },
  removed: { color: '#EF4444', bgColor: '#FEE2E2', icon: '−', label: 'Removed' },
  modified: { color: '#F59E0B', bgColor: '#FEF3C7', icon: '~', label: 'Modified' },
  shifted: { color: '#3B82F6', bgColor: '#DBEAFE', icon: '↔', label: 'Shifted' },
};

// Change item component
function ChangeItem({ change }) {
  const config = CHANGE_TYPES[change.type] || CHANGE_TYPES.modified;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '10px',
      padding: '10px 12px',
      background: 'white',
      borderRadius: '6px',
      border: `1px solid ${config.bgColor}`,
      borderLeft: `3px solid ${config.color}`,
      marginBottom: '6px',
    }}>
      {/* Change type indicator */}
      <div style={{
        width: '24px',
        height: '24px',
        borderRadius: '4px',
        background: config.bgColor,
        color: config.color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        fontWeight: '700',
        flexShrink: 0,
      }}>
        {config.icon}
      </div>

      {/* Change details */}
      <div style={{ flex: 1 }}>
        <div style={{ 
          fontSize: '11px', 
          fontWeight: '600', 
          color: '#1A1A2E',
          marginBottom: '2px',
        }}>
          {change.task}
        </div>
        <div style={{ 
          fontSize: '10px', 
          color: '#6B7280',
        }}>
          {change.description}
        </div>
        {change.impact && (
          <div style={{
            marginTop: '4px',
            fontSize: '10px',
            color: config.color,
            fontWeight: '500',
          }}>
            Impact: {change.impact}
          </div>
        )}
      </div>

      {/* Type badge */}
      <div style={{
        padding: '2px 8px',
        borderRadius: '10px',
        background: config.bgColor,
        color: config.color,
        fontSize: '9px',
        fontWeight: '600',
        textTransform: 'uppercase',
        flexShrink: 0,
      }}>
        {config.label}
      </div>
    </div>
  );
}

// KPI impact row component
function KPIImpactRow({ label, before, after, unit = '', isPositive }) {
  const delta = after - before;
  const deltaStr = delta >= 0 ? `+${delta.toFixed(1)}` : delta.toFixed(1);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      padding: '8px 0',
      borderBottom: '1px solid #F3F4F6',
    }}>
      <div style={{ 
        flex: 1, 
        fontSize: '11px', 
        color: '#6B7280',
      }}>
        {label}
      </div>
      <div style={{ 
        width: '70px', 
        textAlign: 'right',
        fontSize: '11px',
        color: '#9CA3AF',
      }}>
        {before.toFixed(1)}{unit}
      </div>
      <div style={{
        width: '24px',
        textAlign: 'center',
        color: '#D1D5DB',
      }}>
        →
      </div>
      <div style={{ 
        width: '70px', 
        textAlign: 'right',
        fontSize: '12px',
        fontWeight: '600',
        color: '#1A1A2E',
      }}>
        {after.toFixed(1)}{unit}
      </div>
      <div style={{
        width: '60px',
        textAlign: 'right',
        fontSize: '11px',
        fontWeight: '600',
        color: isPositive ? '#10B981' : '#EF4444',
      }}>
        {deltaStr}{unit}
      </div>
    </div>
  );
}

export default function PlanDeltaSummary({ 
  changes = [],
  kpiChanges = {},
  trigger = null,
}) {
  // Default KPI changes
  const defaultKPIs = {
    planCompliance: { before: 0.84, after: 0.88, isPositive: true },
    underSpecRisk: { before: 0.38, after: 0.28, isPositive: true },
    tonnes: { before: 145000, after: 148000, isPositive: true },
    valueAtRisk: { before: 1800000, after: 1200000, isPositive: true },
  };

  const kpis = { ...defaultKPIs, ...kpiChanges };

  // Default changes
  const defaultChanges = [
    {
      type: 'modified',
      task: 'Blend Recipe TRAIN-07',
      description: 'SP-2 proportion increased from 45% to 55%',
      impact: '+0.3% Fe improvement',
    },
    {
      type: 'shifted',
      task: 'Dig Face SH-03',
      description: 'Relocated from Pit 3 Zone B to Zone C',
      impact: '+0.5% Fe recovery',
    },
    {
      type: 'added',
      task: 'TRK-08 Activation',
      description: 'Standby truck activated to compensate for TRK-12',
      impact: 'Haul capacity restored',
    },
    {
      type: 'removed',
      task: 'Pit 3 Zone B Dig',
      description: 'Suspended until blast window clears (10:00)',
      impact: 'Temporary throughput reduction',
    },
  ];

  const changeList = changes.length > 0 ? changes : defaultChanges;

  return (
    <div style={{
      background: 'white',
      borderRadius: '8px',
      border: '1px solid #E2E8F0',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 16px',
        background: 'linear-gradient(135deg, #A100FF 0%, #7C3AED 100%)',
      }}>
        <div style={{ 
          fontSize: '13px', 
          fontWeight: '600', 
          color: 'white',
        }}>
          Plan Update Summary
        </div>
        {trigger && (
          <div style={{ 
            fontSize: '11px', 
            color: 'rgba(255,255,255,0.8)',
            marginTop: '4px',
          }}>
            Triggered by: {trigger}
          </div>
        )}
      </div>

      {/* Changes list */}
      <div style={{ padding: '16px' }}>
        <div style={{ 
          fontSize: '11px', 
          fontWeight: '600', 
          color: '#6B7280',
          marginBottom: '10px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}>
          Changes ({changeList.length})
        </div>
        {changeList.map((change, idx) => (
          <ChangeItem key={idx} change={change} />
        ))}
      </div>

      {/* KPI Impact */}
      <div style={{
        padding: '16px',
        background: '#F9FAFB',
        borderTop: '1px solid #E2E8F0',
      }}>
        <div style={{ 
          fontSize: '11px', 
          fontWeight: '600', 
          color: '#6B7280',
          marginBottom: '10px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}>
          Net KPI Impact
        </div>
        
        <div style={{
          background: 'white',
          borderRadius: '6px',
          padding: '8px 12px',
        }}>
          {/* Column headers */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '4px 0 8px 0',
            borderBottom: '1px solid #E2E8F0',
          }}>
            <div style={{ flex: 1, fontSize: '10px', color: '#9CA3AF' }}>Metric</div>
            <div style={{ width: '70px', textAlign: 'right', fontSize: '10px', color: '#9CA3AF' }}>Before</div>
            <div style={{ width: '24px' }}></div>
            <div style={{ width: '70px', textAlign: 'right', fontSize: '10px', color: '#9CA3AF' }}>After</div>
            <div style={{ width: '60px', textAlign: 'right', fontSize: '10px', color: '#9CA3AF' }}>Change</div>
          </div>

          <KPIImpactRow 
            label="Plan Compliance"
            before={kpis.planCompliance.before * 100}
            after={kpis.planCompliance.after * 100}
            unit="%"
            isPositive={kpis.planCompliance.isPositive}
          />
          <KPIImpactRow 
            label="Under-spec Risk"
            before={kpis.underSpecRisk.before * 100}
            after={kpis.underSpecRisk.after * 100}
            unit="%"
            isPositive={kpis.underSpecRisk.isPositive}
          />
          <KPIImpactRow 
            label="Tonnes (k)"
            before={kpis.tonnes.before / 1000}
            after={kpis.tonnes.after / 1000}
            unit="k"
            isPositive={kpis.tonnes.isPositive}
          />
          <KPIImpactRow 
            label="Value at Risk ($k)"
            before={kpis.valueAtRisk.before / 1000}
            after={kpis.valueAtRisk.after / 1000}
            unit=""
            isPositive={kpis.valueAtRisk.isPositive}
          />
        </div>

        {/* Net summary */}
        <div style={{
          marginTop: '12px',
          padding: '10px 12px',
          background: '#D1FAE5',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span style={{ 
            fontSize: '11px', 
            color: '#065F46',
            fontWeight: '600',
          }}>
            Net improvement: $600k value at risk reduction, +4% compliance
          </span>
        </div>
      </div>
    </div>
  );
}

export { ChangeItem, KPIImpactRow, CHANGE_TYPES };
