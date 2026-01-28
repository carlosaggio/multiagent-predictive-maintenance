"use client";

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamic import for Nivo Bar
const ResponsiveBar = dynamic(
  () => import('@nivo/bar').then(mod => mod.ResponsiveBar),
  { ssr: false, loading: () => <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading chart...</div> }
);

/**
 * Value at Risk Bar Chart Component
 * 
 * Shows breakdown of value at risk by category.
 */

// Category colors
const CATEGORY_COLORS = {
  grade_penalty: '#EF4444',
  demurrage: '#F59E0B',
  throughput: '#6366F1',
  contract: '#EC4899',
  other: '#6B7280',
};

// Format currency
const formatCurrency = (value) => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
  return `$${value}`;
};

// Risk category component
function RiskCategory({ category, value, total, color }) {
  const percentage = (value / total) * 100;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      padding: '10px 0',
      borderBottom: '1px solid #F3F4F6',
    }}>
      {/* Color indicator */}
      <div style={{
        width: '4px',
        height: '32px',
        background: color,
        borderRadius: '2px',
        marginRight: '12px',
      }} />

      {/* Label and value */}
      <div style={{ flex: 1 }}>
        <div style={{ 
          fontSize: '12px', 
          fontWeight: '600', 
          color: '#1A1A2E',
          marginBottom: '2px',
        }}>
          {category}
        </div>
        <div style={{ 
          fontSize: '10px', 
          color: '#6B7280',
        }}>
          {percentage.toFixed(0)}% of total risk
        </div>
      </div>

      {/* Bar */}
      <div style={{
        width: '120px',
        height: '8px',
        background: '#F3F4F6',
        borderRadius: '4px',
        overflow: 'hidden',
        marginRight: '12px',
      }}>
        <div style={{
          width: `${percentage}%`,
          height: '100%',
          background: color,
          borderRadius: '4px',
          transition: 'width 0.3s ease',
        }} />
      </div>

      {/* Value */}
      <div style={{
        fontSize: '13px',
        fontWeight: '700',
        color: color,
        minWidth: '80px',
        textAlign: 'right',
      }}>
        {formatCurrency(value)}
      </div>
    </div>
  );
}

// Summary card component
function SummaryCard({ label, value, sublabel, status }) {
  const statusColors = {
    critical: { bg: '#FEF2F2', border: '#EF4444', text: '#DC2626' },
    warning: { bg: '#FFFBEB', border: '#F59E0B', text: '#D97706' },
    good: { bg: '#ECFDF5', border: '#10B981', text: '#059669' },
  };
  const colors = statusColors[status] || statusColors.warning;

  return (
    <div style={{
      flex: 1,
      padding: '14px 16px',
      background: colors.bg,
      borderRadius: '8px',
      borderLeft: `4px solid ${colors.border}`,
    }}>
      <div style={{ 
        fontSize: '10px', 
        color: '#6B7280',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        marginBottom: '6px',
      }}>
        {label}
      </div>
      <div style={{ 
        fontSize: '24px', 
        fontWeight: '700', 
        color: colors.text,
        lineHeight: 1,
      }}>
        {value}
      </div>
      {sublabel && (
        <div style={{ 
          fontSize: '10px', 
          color: '#6B7280',
          marginTop: '4px',
        }}>
          {sublabel}
        </div>
      )}
    </div>
  );
}

export default function ValueAtRiskBar({ 
  data,
  title = 'Value at Risk Analysis',
  showBreakdown = true,
}) {
  // Default data
  const defaultData = {
    total: 1800000,
    categories: [
      { id: 'grade_penalty', label: 'Grade Penalty Exposure', value: 740000 },
      { id: 'demurrage', label: 'Demurrage Risk', value: 450000 },
      { id: 'throughput', label: 'Throughput Shortfall', value: 380000 },
      { id: 'contract', label: 'Contract Penalty Risk', value: 230000 },
    ],
    comparison: {
      previous: 2100000,
      trend: 'down',
    },
  };

  const chartData = data || defaultData;
  const total = chartData.total || chartData.categories.reduce((sum, cat) => sum + cat.value, 0);
  
  // Determine status based on total
  const getStatus = (value) => {
    if (value >= 1500000) return 'critical';
    if (value >= 800000) return 'warning';
    return 'good';
  };

  // Sort categories by value
  const sortedCategories = [...chartData.categories].sort((a, b) => b.value - a.value);

  return (
    <div style={{
      background: 'white',
      borderRadius: '8px',
      border: '1px solid #E2E8F0',
      padding: '16px',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '14px', fontWeight: '600', color: '#1A1A2E' }}>
          {title}
        </div>
        <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>
          Combined exposure from quality, logistics, and commercial risks
        </div>
      </div>

      {/* Summary cards */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '20px',
      }}>
        <SummaryCard 
          label="Total Value at Risk"
          value={formatCurrency(total)}
          sublabel={chartData.comparison ? `${chartData.comparison.trend === 'down' ? '↓' : '↑'} from ${formatCurrency(chartData.comparison.previous)}` : null}
          status={getStatus(total)}
        />
        <SummaryCard 
          label="Highest Risk Category"
          value={formatCurrency(sortedCategories[0]?.value || 0)}
          sublabel={sortedCategories[0]?.label}
          status={getStatus(sortedCategories[0]?.value || 0)}
        />
      </div>

      {/* Breakdown */}
      {showBreakdown && (
        <div style={{
          background: '#F9FAFB',
          borderRadius: '8px',
          padding: '12px 16px',
        }}>
          <div style={{ 
            fontSize: '11px', 
            fontWeight: '600', 
            color: '#6B7280',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            Risk Breakdown
          </div>
          
          {sortedCategories.map((category) => (
            <RiskCategory
              key={category.id}
              category={category.label}
              value={category.value}
              total={total}
              color={CATEGORY_COLORS[category.id] || CATEGORY_COLORS.other}
            />
          ))}
        </div>
      )}

      {/* Recommendation */}
      <div style={{
        marginTop: '16px',
        padding: '12px',
        background: '#F5F3FF',
        borderRadius: '6px',
        border: '1px solid #A100FF20',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A100FF" strokeWidth="2" style={{ marginTop: '2px', flexShrink: 0 }}>
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 16v-4"/>
          <path d="M12 8h.01"/>
        </svg>
        <div style={{ fontSize: '11px', color: '#4B5563', lineHeight: '1.5' }}>
          <strong style={{ color: '#A100FF' }}>Recommendation:</strong> Focus on reducing grade penalty exposure through improved blend recipe. 
          Expected reduction: ${formatCurrency(740000 * 0.5)} with Option B (Balanced) plan.
        </div>
      </div>
    </div>
  );
}

export { RiskCategory, SummaryCard, CATEGORY_COLORS, formatCurrency };
