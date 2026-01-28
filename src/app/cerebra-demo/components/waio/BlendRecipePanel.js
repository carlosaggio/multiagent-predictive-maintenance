"use client";

import React from 'react';

/**
 * Blend Recipe Panel Component
 * 
 * Shows reclaim rates from stockpiles, pit feed rates, and predicted blended grade.
 */

// Source bar component
function SourceBar({ source, proportion, color }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '8px 0',
    }}>
      <div style={{
        width: '80px',
        fontSize: '11px',
        fontWeight: '600',
        color: '#1A1A2E',
      }}>
        {source.stockpile || source.pit}
      </div>
      
      <div style={{
        flex: 1,
        height: '24px',
        background: '#F3F4F6',
        borderRadius: '4px',
        overflow: 'hidden',
        position: 'relative',
      }}>
        <div style={{
          width: `${proportion * 100}%`,
          height: '100%',
          background: color,
          borderRadius: '4px',
          transition: 'width 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: '8px',
        }}>
          {proportion > 0.2 && (
            <span style={{ 
              fontSize: '10px', 
              fontWeight: '600', 
              color: 'white',
            }}>
              {Math.round(proportion * 100)}%
            </span>
          )}
        </div>
        {proportion <= 0.2 && (
          <span style={{
            position: 'absolute',
            left: `${proportion * 100 + 2}%`,
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '10px',
            fontWeight: '600',
            color: '#6B7280',
          }}>
            {Math.round(proportion * 100)}%
          </span>
        )}
      </div>
      
      <div style={{
        width: '70px',
        fontSize: '11px',
        color: '#6B7280',
        textAlign: 'right',
      }}>
        {source.rate_tph?.toLocaleString()} tph
      </div>
    </div>
  );
}

// Grade display component
function GradeDisplay({ grade, label, target, unit = '%' }) {
  const isGood = grade >= target;
  
  return (
    <div style={{
      background: isGood ? '#ECFDF5' : '#FEF2F2',
      padding: '12px 16px',
      borderRadius: '8px',
      border: `1px solid ${isGood ? '#10B981' : '#EF4444'}20`,
    }}>
      <div style={{ 
        fontSize: '10px', 
        color: '#6B7280',
        marginBottom: '4px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
      }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
        <span style={{ 
          fontSize: '24px', 
          fontWeight: '700', 
          color: isGood ? '#059669' : '#DC2626',
        }}>
          {grade?.toFixed(2)}
        </span>
        <span style={{ fontSize: '12px', color: '#6B7280' }}>{unit}</span>
      </div>
      <div style={{ 
        fontSize: '10px', 
        color: isGood ? '#059669' : '#DC2626',
        marginTop: '4px',
      }}>
        {isGood ? '✓' : '⚠'} Target: ≥{target}{unit}
      </div>
    </div>
  );
}

// Confidence meter component
function ConfidenceMeter({ confidence }) {
  const getColor = (conf) => {
    if (conf >= 0.85) return '#10B981';
    if (conf >= 0.7) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '8px',
      padding: '8px 12px',
      background: '#F9FAFB',
      borderRadius: '6px',
    }}>
      <span style={{ fontSize: '11px', color: '#6B7280' }}>Confidence:</span>
      <div style={{
        width: '80px',
        height: '6px',
        background: '#E5E7EB',
        borderRadius: '3px',
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${confidence * 100}%`,
          height: '100%',
          background: getColor(confidence),
          borderRadius: '3px',
          transition: 'width 0.3s ease',
        }} />
      </div>
      <span style={{ 
        fontSize: '11px', 
        fontWeight: '600', 
        color: getColor(confidence),
      }}>
        {Math.round(confidence * 100)}%
      </span>
    </div>
  );
}

// Change diff component
function ChangeDiff({ changes }) {
  if (!changes || changes.length === 0) return null;

  return (
    <div style={{
      marginTop: '12px',
      padding: '10px 12px',
      background: '#FEF3C7',
      borderRadius: '6px',
      border: '1px solid #F59E0B20',
    }}>
      <div style={{ 
        fontSize: '10px', 
        fontWeight: '600', 
        color: '#92400E',
        marginBottom: '6px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
      }}>
        Changes vs Last Shift
      </div>
      {changes.map((change, idx) => (
        <div key={idx} style={{
          fontSize: '11px',
          color: '#92400E',
          padding: '2px 0',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <span style={{ color: '#F59E0B' }}>Δ</span>
          {change}
        </div>
      ))}
    </div>
  );
}

// Source colors
const SOURCE_COLORS = {
  'SP-1': '#6B7280',
  'SP-2': '#10B981',
  'SP-3': '#F59E0B',
  'SP-4': '#A100FF',
  'PIT1-ZA': '#6366F1',
  'PIT2-ZA': '#8B5CF6',
  'PIT3-ZB': '#EC4899',
  'PIT3-ZC': '#EF4444',
};

export default function BlendRecipePanel({ 
  recipe, 
  trainId = 'TRAIN-07',
  gradeTarget = 62.0,
}) {
  if (!recipe) return null;

  const { sources, predictedGrade, confidence } = recipe;

  // Calculate changes (mock)
  const changes = [
    'SP-2 increased from 45% to 55% (+10%)',
    'Pit 3 Zone B reduced to 0% (−20%)',
    'Pit 3 Zone C added at 10%',
  ];

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
        background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2D44 100%)',
        borderBottom: '1px solid #E2E8F0',
      }}>
        <div style={{ 
          fontSize: '13px', 
          fontWeight: '600', 
          color: 'white',
        }}>
          Blend Recipe: {trainId}
        </div>
        <div style={{ 
          fontSize: '11px', 
          color: '#9CA3AF',
          marginTop: '2px',
        }}>
          Optimised for grade compliance with throughput balance
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '16px' }}>
        {/* Source proportions */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ 
            fontSize: '11px', 
            fontWeight: '600', 
            color: '#6B7280',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            Source Mix
          </div>
          {sources?.map((source, idx) => (
            <SourceBar
              key={idx}
              source={source}
              proportion={source.proportion}
              color={SOURCE_COLORS[source.stockpile || source.pit] || '#A100FF'}
            />
          ))}
        </div>

        {/* Predicted grades */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginBottom: '12px',
        }}>
          <GradeDisplay 
            grade={predictedGrade?.Fe} 
            label="Predicted Fe"
            target={gradeTarget}
          />
          <GradeDisplay 
            grade={predictedGrade?.SiO2} 
            label="Predicted SiO₂"
            target={4.5}
            unit="%"
          />
        </div>

        {/* Confidence */}
        <ConfidenceMeter confidence={confidence || 0.78} />

        {/* Changes */}
        <ChangeDiff changes={changes} />
      </div>
    </div>
  );
}

export { SourceBar, GradeDisplay, ConfidenceMeter, ChangeDiff };
