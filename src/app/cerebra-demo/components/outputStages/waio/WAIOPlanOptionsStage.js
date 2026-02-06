"use client";

import React, { useState, useEffect, useRef } from 'react';
import PlanOptionCards from '../../waio/PlanOptionCards';
import { waioPlanOptions } from '../../../data/waio/waioScenarioContext';
import { useProgressiveReveal, LoadingSpinner, progressiveLoaderStyles } from '../../../utils/progressiveLoader';

/**
 * WAIO Plan Options Stage Component
 * 
 * Displays the 3 plan options generated from the huddle.
 * Enhanced with progressive loading for a more dynamic feel.
 */

// Processing indicator for plan generation
function PlanGenerationIndicator({ step }) {
  const steps = [
    'Optimizing constraint parameters...',
    'Generating compliance-first variant...',
    'Calculating balanced trade-offs...',
    'Evaluating throughput-first option...',
    'Ranking alternatives...',
  ];
  
  return (
    <div style={{
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px',
    }}>
      <LoadingSpinner size={36} />
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '14px', fontWeight: '600', color: '#1A1A2E', marginBottom: '6px' }}>
          Generating Plan Options
        </div>
        <div style={{ fontSize: '12px', color: '#6B7280' }}>
          {steps[step] || steps[0]}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        {steps.map((_, idx) => (
          <div
            key={idx}
            style={{
              width: '32px',
              height: '4px',
              borderRadius: '2px',
              background: idx <= step ? '#A100FF' : '#E2E8F0',
              transition: 'background 0.3s ease',
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function WAIOPlanOptionsStage({ onComplete, onSelectPlan, selectedPlan }) {
  const hasCompletedRef = useRef(false);
  
  // Progressive loading states
  const [loadingStep, setLoadingStep] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [showHeader, setShowHeader] = useState(false);
  const [showTakeaways, setShowTakeaways] = useState(false);
  const [showCards, setShowCards] = useState(false);

  // Progressive loading sequence
  useEffect(() => {
    const timers = [
      setTimeout(() => setLoadingStep(1), 400),
      setTimeout(() => setLoadingStep(2), 750),
      setTimeout(() => setLoadingStep(3), 1100),
      setTimeout(() => setLoadingStep(4), 1450),
      setTimeout(() => { setShowContent(true); setShowHeader(true); }, 1800),
      setTimeout(() => setShowTakeaways(true), 2100),
      setTimeout(() => setShowCards(true), 2400),
    ];
    
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  // Completion trigger
  useEffect(() => {
    if (showCards && !hasCompletedRef.current) {
      hasCompletedRef.current = true;
      setTimeout(() => onComplete?.(), 600);
    }
  }, [showCards, onComplete]);

  return (
    <div style={{
      background: 'white',
      borderRadius: '8px',
      border: '1px solid #E2E8F0',
      overflow: 'hidden',
    }}>
      {/* Initial loading state */}
      {!showContent && (
        <PlanGenerationIndicator step={loadingStep} />
      )}
      
      {/* Main content */}
      {showContent && (
        <>
          {/* Header */}
          {showHeader && (
            <div style={{
              padding: '20px',
              background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2D44 100%)',
              animation: 'fadeIn 0.4s ease-out',
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
          )}

          {/* Key takeaways */}
          {showTakeaways && (
            <div style={{
              padding: '16px 20px',
              background: '#F5F3FF',
              borderBottom: '1px solid #E2E8F0',
              animation: 'fadeSlideUp 0.4s ease-out',
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
          )}

          {/* Plan options */}
          {showCards && (
            <div style={{ padding: '20px', animation: 'fadeSlideUp 0.4s ease-out' }}>
              <PlanOptionCards
                options={waioPlanOptions}
                selectedOption={selectedPlan}
                onSelectOption={onSelectPlan}
                recommendedOption="PLAN-B"
              />
            </div>
          )}
        </>
      )}
      
      <style jsx>{progressiveLoaderStyles}</style>
    </div>
  );
}
