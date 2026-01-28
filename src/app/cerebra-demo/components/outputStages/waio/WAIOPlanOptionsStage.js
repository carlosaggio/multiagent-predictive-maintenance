"use client";

import React, { useEffect, useRef } from 'react';
import PlanOptionCards from '../../waio/PlanOptionCards';
import { waioPlanOptions } from '../../../data/waio/waioScenarioContext';

/**
 * WAIO Plan Options Stage Component
 * 
 * Displays the 3 plan options generated from the huddle.
 */

export default function WAIOPlanOptionsStage({ onComplete, onSelectPlan, selectedPlan }) {
  const hasCompletedRef = useRef(false);

  // Trigger completion after mount - only once
  useEffect(() => {
    if (hasCompletedRef.current) return;
    
    const timer = setTimeout(() => {
      if (!hasCompletedRef.current) {
        hasCompletedRef.current = true;
        onComplete?.();
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, []); // Empty dependency array

  return (
    <div style={{
      background: 'white',
      borderRadius: '8px',
      border: '1px solid #E2E8F0',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '20px',
        background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2D44 100%)',
      }}>
        <div style={{ 
          fontSize: '16px', 
          fontWeight: '700', 
          color: 'white',
          marginBottom: '8px',
        }}>
          Shift Plan Options
        </div>
        <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
          Three feasible plans with different trade-offs based on constraint analysis
        </div>
      </div>

      {/* Key takeaways */}
      <div style={{
        padding: '16px 20px',
        background: '#F5F3FF',
        borderBottom: '1px solid #E2E8F0',
      }}>
        <div style={{ 
          fontSize: '11px', 
          fontWeight: '600', 
          color: '#A100FF',
          marginBottom: '8px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}>
          Key Takeaways
        </div>
        <ul style={{ 
          margin: 0, 
          paddingLeft: '16px', 
          fontSize: '12px', 
          color: '#4B5563',
          lineHeight: '1.6',
        }}>
          <li><strong>Option A</strong> maximises compliance (92%) but reduces throughput by 8%</li>
          <li><strong>Option B</strong> (Recommended) balances value and tonnes with 82% compliance</li>
          <li><strong>Option C</strong> maximises throughput but has 48% under-spec risk on Train-07</li>
        </ul>
      </div>

      {/* Plan options */}
      <div style={{ padding: '20px' }}>
        <PlanOptionCards
          options={waioPlanOptions}
          selectedOption={selectedPlan}
          onSelectOption={onSelectPlan}
          recommendedOption="PLAN-B"
        />
      </div>
    </div>
  );
}
