"use client";

import React, { useState } from 'react';

/**
 * Plan Option Cards Component
 * 
 * Displays A/B/C plan options with trade-offs for selection.
 */

// KPI Mini Display
function KPIMini({ label, value, status }) {
  const statusColors = {
    good: '#10B981',
    warning: '#F59E0B',
    critical: '#EF4444',
    neutral: '#6B7280',
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '6px 0',
      borderBottom: '1px solid #F3F4F6',
    }}>
      <span style={{ fontSize: '11px', color: '#6B7280' }}>{label}</span>
      <span style={{ 
        fontSize: '12px', 
        fontWeight: '600', 
        color: statusColors[status] || statusColors.neutral,
      }}>
        {value}
      </span>
    </div>
  );
}

// Trade-off List
function TradeoffList({ pros, cons }) {
  return (
    <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
      <div style={{ flex: 1 }}>
        <div style={{ 
          fontSize: '10px', 
          fontWeight: '600', 
          color: '#10B981',
          marginBottom: '6px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}>
          Pros
        </div>
        {pros?.map((pro, idx) => (
          <div key={idx} style={{
            fontSize: '11px',
            color: '#4B5563',
            padding: '4px 0',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '6px',
          }}>
            <span style={{ color: '#10B981' }}>+</span>
            {pro}
          </div>
        ))}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ 
          fontSize: '10px', 
          fontWeight: '600', 
          color: '#EF4444',
          marginBottom: '6px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}>
          Cons
        </div>
        {cons?.map((con, idx) => (
          <div key={idx} style={{
            fontSize: '11px',
            color: '#4B5563',
            padding: '4px 0',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '6px',
          }}>
            <span style={{ color: '#EF4444' }}>−</span>
            {con}
          </div>
        ))}
      </div>
    </div>
  );
}

// Single Plan Card
function PlanCard({ option, isSelected, onSelect, isRecommended }) {
  const getFeStatus = (fe, risk) => {
    if (fe >= 62.2) return 'good';
    if (fe >= 62.0) return 'warning';
    return 'critical';
  };

  const getRiskStatus = (risk) => {
    if (risk <= 0.2) return 'good';
    if (risk <= 0.35) return 'warning';
    return 'critical';
  };

  const getTonnesStatus = (tonnes, target = 155000) => {
    if (tonnes >= target) return 'good';
    if (tonnes >= target * 0.95) return 'warning';
    return 'critical';
  };

  const outcome = option.predictedOutcome;
  const train07 = outcome?.trainGrades?.['TRAIN-07'] || {};

  return (
    <div 
      style={{
        flex: '1 1 280px',
        background: isSelected ? '#F5F3FF' : 'white',
        borderRadius: '12px',
        border: `2px solid ${isSelected ? '#A100FF' : '#E2E8F0'}`,
        padding: '20px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        position: 'relative',
        boxShadow: isSelected ? '0 4px 12px rgba(161, 0, 255, 0.15)' : '0 1px 3px rgba(0,0,0,0.05)',
      }}
      onClick={() => onSelect(option.id)}
    >
      {/* Recommended badge */}
      {isRecommended && (
        <div style={{
          position: 'absolute',
          top: '-10px',
          right: '16px',
          background: '#A100FF',
          color: 'white',
          fontSize: '9px',
          fontWeight: '600',
          padding: '4px 10px',
          borderRadius: '10px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}>
          Recommended
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ 
          fontSize: '16px', 
          fontWeight: '700', 
          color: '#1A1A2E',
          marginBottom: '4px',
        }}>
          {option.name}
        </div>
        <div style={{ fontSize: '12px', color: '#6B7280' }}>
          {option.description}
        </div>
      </div>

      {/* KPI Grid */}
      <div style={{
        background: '#F9FAFB',
        borderRadius: '8px',
        padding: '12px',
        marginBottom: '12px',
      }}>
        <KPIMini 
          label="Train-07 Fe" 
          value={`${train07.Fe?.toFixed(2) || 'N/A'}%`}
          status={getFeStatus(train07.Fe, train07.risk)}
        />
        <KPIMini 
          label="Under-spec Risk" 
          value={`${Math.round((train07.risk || 0) * 100)}%`}
          status={getRiskStatus(train07.risk)}
        />
        <KPIMini 
          label="Total Tonnes" 
          value={`${((outcome?.totalTonnes || 0) / 1000).toFixed(0)}k t`}
          status={getTonnesStatus(outcome?.totalTonnes)}
        />
        <KPIMini 
          label="Compliance Prob." 
          value={`${Math.round((outcome?.complianceProbability || 0) * 100)}%`}
          status={outcome?.complianceProbability >= 0.8 ? 'good' : outcome?.complianceProbability >= 0.6 ? 'warning' : 'critical'}
        />
        <KPIMini 
          label="Value at Risk" 
          value={`$${((outcome?.valueAtRisk || 0) / 1000).toFixed(0)}k`}
          status={outcome?.valueAtRisk <= 500000 ? 'good' : outcome?.valueAtRisk <= 1000000 ? 'warning' : 'critical'}
        />
      </div>

      {/* Key Changes */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{ 
          fontSize: '10px', 
          fontWeight: '600', 
          color: '#6B7280',
          marginBottom: '6px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}>
          Key Changes
        </div>
        {option.keyChanges?.slice(0, 3).map((change, idx) => (
          <div key={idx} style={{
            fontSize: '11px',
            color: '#4B5563',
            padding: '4px 0',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '6px',
          }}>
            <span style={{ color: '#A100FF' }}>→</span>
            {change}
          </div>
        ))}
      </div>

      {/* Trade-offs */}
      <TradeoffList 
        pros={option.tradeoffs?.pros} 
        cons={option.tradeoffs?.cons} 
      />

      {/* Selection indicator */}
      <div style={{
        marginTop: '16px',
        padding: '10px',
        background: isSelected ? '#A100FF' : '#F3F4F6',
        borderRadius: '8px',
        textAlign: 'center',
        color: isSelected ? 'white' : '#6B7280',
        fontSize: '12px',
        fontWeight: '600',
        transition: 'all 0.2s ease',
      }}>
        {isSelected ? '✓ Selected' : 'Select this plan'}
      </div>
    </div>
  );
}

export default function PlanOptionCards({ 
  options = [], 
  selectedOption,
  onSelectOption,
  recommendedOption = 'PLAN-B',
}) {
  const [selected, setSelected] = useState(selectedOption);

  const handleSelect = (optionId) => {
    setSelected(optionId);
    onSelectOption?.(optionId);
  };

  return (
    <div>
      {/* Header */}
      <div style={{
        marginBottom: '20px',
        padding: '16px 20px',
        background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2D44 100%)',
        borderRadius: '8px',
      }}>
        <div style={{ fontSize: '14px', fontWeight: '600', color: 'white' }}>
          Shift Plan Options
        </div>
        <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>
          Choose the plan that best balances your objectives. Each option shows predicted outcomes and trade-offs.
        </div>
      </div>

      {/* Cards Grid */}
      <div style={{
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap',
      }}>
        {options.map(option => (
          <PlanCard
            key={option.id}
            option={option}
            isSelected={selected === option.id}
            onSelect={handleSelect}
            isRecommended={option.id === recommendedOption}
          />
        ))}
      </div>

      {/* Summary */}
      {selected && (
        <div style={{
          marginTop: '20px',
          padding: '16px',
          background: '#F5F3FF',
          borderRadius: '8px',
          border: '1px solid #A100FF30',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <span style={{ fontSize: '12px', color: '#6B7280' }}>Selected: </span>
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#A100FF' }}>
              {options.find(o => o.id === selected)?.name}
            </span>
          </div>
          <button style={{
            padding: '8px 16px',
            background: '#A100FF',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
          }}>
            Proceed with Selected Plan →
          </button>
        </div>
      )}
    </div>
  );
}

export { PlanCard, KPIMini, TradeoffList };
