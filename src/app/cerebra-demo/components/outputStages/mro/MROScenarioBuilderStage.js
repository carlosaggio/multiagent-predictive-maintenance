'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { mroScenarioOptions } from '../../../data/mro/mroScenarioOptions';

// Dynamically import charts with SSR disabled
const ResponsiveLine = dynamic(
  () => import('@nivo/line').then(m => m.ResponsiveLine),
  { ssr: false, loading: () => <div style={{ height: '300px', background: '#F3E8FF', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}>Loading chart...</div> }
);

const ResponsiveBar = dynamic(
  () => import('@nivo/bar').then(m => m.ResponsiveBar),
  { ssr: false, loading: () => <div style={{ height: '300px', background: '#F3E8FF', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}>Loading chart...</div> }
);

// Simulation data generator functions
const generateCostProjection = (optionId) => {
  const baselineData = [];
  const optimizedData = [];

  for (let day = 0; day <= 7; day++) {
    baselineData.push({ x: day, y: 4800 + day * 120 });
    optimizedData.push({ x: day, y: 4800 - (day * 180) });
  }

  return [
    { id: 'Current Cost Trend', data: baselineData.map(d => ({ x: `Day ${d.x}`, y: d.y })) },
    { id: 'Optimized Trend', data: optimizedData.map(d => ({ x: `Day ${d.x}`, y: Math.max(d.y, 1200) })) }
  ];
};

const generateRiskTimeline = (optionId) => {
  const optionMetrics = {
    'OPTION-A': { name: 'Expedite PO', cost: 4200, tat: 2, risk: 65 },
    'OPTION-B': { name: 'Transfer+Reprioritise', cost: 280, tat: 0.75, risk: 28 },
    'OPTION-C': { name: 'Alternate Part', cost: 6100, tat: 1, risk: 42 },
    'OPTION-D': { name: 'Combined Strategy', cost: 4480, tat: 2.5, risk: 12 },
  };

  const metric = optionMetrics[optionId];
  if (!metric) return [];

  return [
    { option: metric.name, 'TAT (Days)': metric.tat, 'Cost ($)': metric.cost / 1000, 'Risk Score': metric.risk }
  ];
};

const generateDetailedResults = (optionId) => {
  const resultMap = {
    'OPTION-A': {
      successRate: 0.78,
      timeSavings: 3,
      costImpact: 4200,
      riskReduction: 0.45,
      tatHours: 48,
    },
    'OPTION-B': {
      successRate: 0.91,
      timeSavings: 5,
      costImpact: 280,
      riskReduction: 0.72,
      tatHours: 18,
    },
    'OPTION-C': {
      successRate: 0.82,
      timeSavings: 4,
      costImpact: 6100,
      riskReduction: 0.58,
      tatHours: 24,
    },
    'OPTION-D': {
      successRate: 0.94,
      timeSavings: 6,
      costImpact: 4480,
      riskReduction: 0.88,
      tatHours: 60,
    },
  };

  return resultMap[optionId];
};

export default function MROScenarioBuilderStage({ selectedPlan, onSelectPlan, onBack, onStageAction, onComplete }) {
  const [revealedSteps, setRevealedSteps] = useState([]);
  const [showLoading, setShowLoading] = useState(true);
  const [showCards, setShowCards] = useState([]);
  const [showExplain, setShowExplain] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [runningSimulation, setRunningSimulation] = useState(null);
  const [simulationProgress, setSimulationProgress] = useState({});
  const [simulationResults, setSimulationResults] = useState(null);
  const [selectedCards, setSelectedCards] = useState(new Set());
  const [comparisonMode, setComparisonMode] = useState(false);
  const [parameterValues, setParameterValues] = useState({
    leadTime: 50,
    costTolerance: 50,
    riskAcceptance: 50,
  });
  const [writingBack, setWritingBack] = useState(false);
  const [writeBackStatus, setWriteBackStatus] = useState(null);
  const [writeBackSteps, setWriteBackSteps] = useState([]);
  const [showParameterEditor, setShowParameterEditor] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    const steps = ['begin', 'simulate', 'execute'];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setRevealedSteps(prev => [...prev, step]);
      }, 200 + idx * 150);
    });

    setTimeout(() => {
      setShowLoading(false);
    }, 2000);

    mroScenarioOptions.forEach((_, idx) => {
      setTimeout(() => {
        setShowCards(prev => [...prev, idx]);
      }, 2300 + idx * 300);
    });

    setTimeout(() => {
      setShowExplain(true);
    }, 2300 + mroScenarioOptions.length * 300 + 300);

    setTimeout(() => {
      if (!hasCompletedRef.current) {
        hasCompletedRef.current = true;
        setAnimationComplete(true);
      }
    }, 2300 + mroScenarioOptions.length * 300 + 1200);
  }, []);

  const steps = [
    { id: 'begin', label: 'Begin', number: 1 },
    { id: 'simulate', label: 'Simulate', number: 2 },
    { id: 'execute', label: 'Execute', number: 3 },
  ];

  const getMetricColor = (label, value) => {
    if (label === 'Risk Score') {
      if (value === 'Very Low') return '#10B981';
      if (value === 'Low') return '#10B981';
      if (value === 'Medium') return '#F59E0B';
      return '#EF4444';
    }
    return '#3B82F6';
  };

  const handleCardSelect = (cardId) => {
    const newSelected = new Set(selectedCards);
    if (newSelected.has(cardId)) {
      newSelected.delete(cardId);
    } else {
      newSelected.add(cardId);
    }
    setSelectedCards(newSelected);
    if (!comparisonMode && newSelected.size === 1) {
      const id = Array.from(newSelected)[0];
      onSelectPlan?.(id);
    }
  };

  const handleRunSimulation = (cardId) => {
    setRunningSimulation(cardId);
    setSimulationProgress(prev => ({ ...prev, [cardId]: 0 }));
    onStageAction?.(`Simulating scenario ${cardId} with current parameters`);

    let progress = 0;
    const steps = [25, 50, 75, 100];
    let stepIndex = 0;

    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        progress = steps[stepIndex];
        stepIndex++;
        setSimulationProgress(prev => ({ ...prev, [cardId]: progress }));

        if (progress === 100) {
          clearInterval(interval);
          setRunningSimulation(null);

          // Generate detailed simulation results
          const results = generateDetailedResults(cardId);
          const riskLabel = cardId === 'OPTION-B' ? 'Low' : cardId === 'OPTION-D' ? 'Very Low' : cardId === 'OPTION-A' ? 'Medium' : 'Medium';
          const riskColor = cardId === 'OPTION-B' || cardId === 'OPTION-D' ? '#10B981' : '#F59E0B';

          setSimulationResults({
            cardId,
            costProjection: generateCostProjection(cardId),
            riskTimeline: generateRiskTimeline(cardId),
            outcomes: [
              { label: 'Success Rate', value: `${Math.round(results.successRate * 100)}%`, color: '#10B981' },
              { label: 'Time Savings', value: `${results.timeSavings} days`, color: '#3B82F6' },
              { label: 'Cost Impact', value: `$${results.costImpact.toLocaleString()}`, color: '#F59E0B' },
              { label: 'Risk Reduction', value: `${Math.round(results.riskReduction * 100)}%`, color: riskColor },
            ],
            details: results,
          });

          onStageAction?.(`Simulation complete for ${cardId} - Success ${Math.round(results.successRate * 100)}%, Time -${results.timeSavings}d, Cost $${results.costImpact}, Risk ${riskLabel}`);
        }
      }
    }, 300);
  };

  const handleComparisonMode = () => {
    if (selectedCards.size >= 2) {
      setComparisonMode(!comparisonMode);
    }
  };

  const handleExecutePlan = () => {
    setWritingBack(true);
    setWriteBackStatus('writing');
    setWriteBackSteps([]);
    onStageAction?.(`Executing plan: Writing to SAP with Lead Time=${parameterValues.leadTime}d, Cost Tolerance=${parameterValues.costTolerance}%, Risk Acceptance=${parameterValues.riskAcceptance}%`);

    const steps = [
      { label: 'Creating SAP MM requisition', duration: 800 },
      { label: 'Updating inventory allocation', duration: 1000 },
      { label: 'Notifying supplier', duration: 600 },
      { label: 'Confirming ETA', duration: 800 },
    ];

    let completedSteps = [];
    steps.forEach((step, idx) => {
      setTimeout(() => {
        completedSteps = [...completedSteps, step.label];
        setWriteBackSteps([...completedSteps]);
        onStageAction?.(`SAP write-back: ${step.label}...`);
      }, idx === 0 ? 200 : steps.slice(0, idx).reduce((sum, s) => sum + s.duration, 0) + 200);
    });

    const totalDuration = steps.reduce((sum, s) => sum + s.duration, 0) + 500;
    setTimeout(() => {
      setWriteBackStatus('committed');
      onStageAction?.('SAP write-back completed successfully - MRP plan committed');
    }, totalDuration);

    setTimeout(() => {
      setWritingBack(false);
      setWriteBackStatus(null);
      setWriteBackSteps([]);
    }, totalDuration + 1500);
  };

  return (
    <div style={{ padding: '0', background: '#0f0f1e', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
        @keyframes progressBar { 0% { width: 0%; } 100% { width: 100%; } }
      `}</style>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        padding: '16px 20px',
        borderRadius: '8px 8px 0 0',
        borderBottom: '2px solid #A100FF',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#A100FF',
            animation: 'pulse 1.5s infinite',
          }} />
          <span style={{
            color: '#A100FF',
            fontSize: '13px',
            fontWeight: '700',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
          }}>
            What-If Scenario Simulator
          </span>
        </div>
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', marginTop: '4px' }}>
          Comparing feasible options for delayed part resolution...
        </div>
      </div>

      <div style={{ padding: '20px', flex: 1, overflow: 'auto' }}>
        {/* Stepper */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'space-between' }}>
            {steps.map((step, idx) => (
              <div key={step.id} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: revealedSteps.includes(step.id) ? '#A100FF' : '#E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '13px',
                    fontWeight: '700',
                    flexShrink: 0,
                    animation: revealedSteps.includes(step.id) ? 'scaleIn 0.4s ease-out' : 'none',
                  }}
                >
                  {step.number}
                </div>
                <div style={{ marginLeft: '8px', minWidth: '80px' }}>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: revealedSteps.includes(step.id) ? '#A100FF' : '#6B7280',
                  }}>
                    {step.label}
                  </div>
                </div>
                {idx < steps.length - 1 && (
                  <div style={{
                    height: '2px',
                    flex: 1,
                    background: revealedSteps.includes(steps[idx + 1].id) ? '#A100FF' : '#E2E8F0',
                    marginLeft: '8px',
                    transition: 'background 0.4s ease-out',
                  }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Loading indicator */}
        {showLoading && (
          <div style={{
            padding: '20px',
            textAlign: 'center',
            animation: 'fadeIn 0.4s ease-out',
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <div style={{
                width: '24px',
                height: '24px',
                border: '2px solid #A100FF',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }} />
              <span style={{ fontSize: '13px', color: '#6B7280' }}>
                Evaluating scenario options...
              </span>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Scenario cards grid */}
        {!showLoading && (
          <div>
            {/* Parameter Editor Panel (shown when toggled) */}
            {showParameterEditor && (
              <div style={{
                background: 'rgba(161, 0, 255, 0.1)',
                border: '2px solid #A100FF',
                borderRadius: '6px',
                padding: '16px',
                marginBottom: '20px',
                animation: 'fadeSlideUp 0.4s ease-out',
              }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#A100FF', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Advanced Parameter Editor
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  {[
                    { key: 'leadTime', label: 'Lead Time Tolerance', min: 0, max: 100, unit: 'days' },
                    { key: 'costTolerance', label: 'Cost Tolerance', min: 0, max: 100, unit: '%' },
                    { key: 'riskAcceptance', label: 'Risk Acceptance', min: 0, max: 100, unit: '%' },
                  ].map(param => (
                    <div key={param.key}>
                      <label style={{ fontSize: '11px', fontWeight: '600', color: '#94A3B8', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                        {param.label}
                      </label>
                      <input
                        type="range"
                        min={param.min}
                        max={param.max}
                        value={parameterValues[param.key]}
                        onChange={(e) => {
                          setParameterValues(prev => ({
                            ...prev,
                            [param.key]: parseInt(e.target.value)
                          }));
                          onStageAction?.(`Updated ${param.label} to ${parseInt(e.target.value)}${param.unit === 'days' ? ' days' : param.unit}`);
                        }}
                        style={{
                          width: '100%',
                          cursor: 'pointer',
                          accentColor: '#A100FF',
                        }}
                      />
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#A100FF', marginTop: '6px', textAlign: 'center' }}>
                        {parameterValues[param.key]}{param.unit === 'days' ? '' : param.unit}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Parameter Sliders */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(161, 0, 255, 0.2)',
              borderRadius: '6px',
              padding: '16px',
              marginBottom: '20px',
              animation: 'fadeSlideUp 0.4s ease-out',
            }}>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#94A3B8', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                What-If Parameters
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                {[
                  { key: 'leadTime', label: 'Lead Time Tolerance', min: 0, max: 100, unit: 'days' },
                  { key: 'costTolerance', label: 'Cost Tolerance', min: 0, max: 100, unit: '%' },
                  { key: 'riskAcceptance', label: 'Risk Acceptance', min: 0, max: 100, unit: '%' },
                ].map(param => (
                  <div key={param.key}>
                    <label style={{ fontSize: '11px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                      {param.label}
                    </label>
                    <input
                      type="range"
                      min={param.min}
                      max={param.max}
                      value={parameterValues[param.key]}
                      onChange={(e) => setParameterValues(prev => ({
                        ...prev,
                        [param.key]: parseInt(e.target.value)
                      }))}
                      style={{
                        width: '100%',
                        cursor: 'pointer',
                        accentColor: '#A100FF',
                      }}
                    />
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#A100FF', marginTop: '6px', textAlign: 'center' }}>
                      {parameterValues[param.key]}{param.unit === 'days' ? '' : param.unit}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cards Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px',
              marginBottom: '16px',
              animation: 'fadeSlideUp 0.4s ease-out',
            }}>
              {mroScenarioOptions.map((option, idx) => {
                const isRevealed = showCards.includes(idx);
                const isRecommended = option.recommended;
                const isSelected = selectedCards.has(option.id) || selectedPlan === option.id;
                const isRunning = runningSimulation === option.id;
                const progress = simulationProgress[option.id] || 0;

                return (
                  <div
                    key={option.id}
                    onClick={() => handleCardSelect(option.id)}
                    style={{
                      opacity: isRevealed ? 1 : 0,
                      transform: isRevealed ? 'translateY(0)' : 'translateY(12px)',
                      transition: 'all 0.4s ease-out',
                      background: isSelected ? 'linear-gradient(135deg, rgba(161, 0, 255, 0.2) 0%, rgba(161, 0, 255, 0.1) 100%)' : 'rgba(255, 255, 255, 0.05)',
                      border: isSelected ? '2px solid #A100FF' : isRecommended ? '2px solid #A100FF' : '1px solid rgba(161, 0, 255, 0.2)',
                      borderRadius: '8px',
                      padding: '16px',
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                    onMouseEnter={(e) => {
                      if (!isRunning) {
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(161,0,255,0.2)';
                        e.currentTarget.style.transform = isSelected ? 'translateY(0)' : isRevealed ? 'translateY(-4px)' : 'translateY(12px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isRunning) {
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.transform = isSelected ? 'translateY(0)' : (isRevealed ? 'translateY(0)' : 'translateY(12px)');
                      }
                    }}
                  >
                    {/* Selection checkmark */}
                    {isSelected && (
                      <div style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: '#A100FF',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: '700',
                        animation: 'scaleIn 0.3s ease-out',
                      }}>
                        ✓
                      </div>
                    )}

                    {/* Recommended badge */}
                    {isRecommended && !isSelected && (
                      <div style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        background: '#A100FF',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}>
                        ★ RECOMMENDED
                      </div>
                    )}

                    {/* Option name */}
                    <div style={{
                      fontSize: '13px',
                      fontWeight: '700',
                      color: '#F1F5F9',
                      marginBottom: '4px',
                      paddingRight: isRecommended ? '120px' : '0',
                    }}>
                      {option.name}
                    </div>

                    {/* Description */}
                    <div style={{
                      fontSize: '11px',
                      color: '#94A3B8',
                      marginBottom: '12px',
                      lineHeight: '1.4',
                    }}>
                      {option.description}
                    </div>

                    {/* Metrics grid */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '8px',
                      marginBottom: '12px',
                    }}>
                      <div style={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                      }}>
                        <div style={{ fontSize: '9px', color: '#94A3B8', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Days Saved</div>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: '#10B981' }}>
                          -{option.metrics.timeImpact}
                        </div>
                      </div>
                      <div style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                      }}>
                        <div style={{ fontSize: '9px', color: '#94A3B8', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Cost Impact</div>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: '#EF4444' }}>
                          {option.metrics.costImpact}
                        </div>
                      </div>
                      <div style={{
                        background: getMetricColor('Risk Score', option.metrics.riskScore) === '#10B981' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                        padding: '8px',
                        borderRadius: '4px',
                        border: getMetricColor('Risk Score', option.metrics.riskScore) === '#10B981' ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(245, 158, 11, 0.2)',
                      }}>
                        <div style={{ fontSize: '9px', color: '#94A3B8', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Risk</div>
                        <div style={{
                          fontSize: '13px',
                          fontWeight: '700',
                          color: getMetricColor('Risk Score', option.metrics.riskScore),
                        }}>
                          {option.metrics.riskScore}
                        </div>
                      </div>
                      <div style={{
                        background: 'rgba(59, 130, 246, 0.1)',
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid rgba(59, 130, 246, 0.2)',
                      }}>
                        <div style={{ fontSize: '9px', color: '#94A3B8', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Confidence</div>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: '#3B82F6' }}>
                          {Math.round(option.metrics.confidence * 100)}%
                        </div>
                      </div>
                    </div>

                    {/* Divider */}
                    <div style={{
                      height: '1px',
                      background: 'rgba(161, 0, 255, 0.2)',
                      marginBottom: '12px',
                    }} />

                    {/* Pros/Cons */}
                    <div style={{ marginBottom: '8px' }}>
                      <div style={{
                        fontSize: '10px',
                        fontWeight: '600',
                        color: '#10B981',
                        marginBottom: '4px',
                      }}>
                        Pros
                      </div>
                      <ul style={{
                        margin: 0,
                        paddingLeft: '16px',
                        fontSize: '10px',
                        color: '#CBD5E1',
                        lineHeight: '1.4',
                      }}>
                        {option.tradeoffs.pros.slice(0, 2).map((pro, i) => (
                          <li key={i}>{pro}</li>
                        ))}
                      </ul>
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                      <div style={{
                        fontSize: '10px',
                        fontWeight: '600',
                        color: '#EF4444',
                        marginBottom: '4px',
                      }}>
                        Cons
                      </div>
                      <ul style={{
                        margin: 0,
                        paddingLeft: '16px',
                        fontSize: '10px',
                        color: '#CBD5E1',
                        lineHeight: '1.4',
                      }}>
                        {option.tradeoffs.cons.slice(0, 2).map((con, i) => (
                          <li key={i}>{con}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Run Simulation Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRunSimulation(option.id);
                      }}
                      disabled={isRunning}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        background: isRunning ? '#A100FF' : 'rgba(161, 0, 255, 0.1)',
                        border: `1px solid ${isRunning ? '#A100FF' : 'rgba(161, 0, 255, 0.3)'}`,
                        borderRadius: '6px',
                        color: isRunning ? 'white' : '#A100FF',
                        fontSize: '11px',
                        fontWeight: '600',
                        cursor: isRunning ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s ease',
                        marginBottom: '8px',
                      }}
                      onMouseEnter={(e) => {
                        if (!isRunning) {
                          e.currentTarget.style.background = 'rgba(161, 0, 255, 0.2)';
                          e.currentTarget.style.borderColor = '#A100FF';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isRunning) {
                          e.currentTarget.style.background = 'rgba(161, 0, 255, 0.1)';
                          e.currentTarget.style.borderColor = 'rgba(161, 0, 255, 0.3)';
                        }
                      }}
                    >
                      {isRunning ? `Running: ${Math.round(progress)}%` : '▶ Run Simulation'}
                    </button>

                    {/* Progress bar */}
                    {progress > 0 && (
                      <div style={{
                        width: '100%',
                        height: '4px',
                        background: 'rgba(161, 0, 255, 0.2)',
                        borderRadius: '2px',
                        overflow: 'hidden',
                      }}>
                        <div style={{
                          height: '100%',
                          background: '#A100FF',
                          width: `${progress}%`,
                          transition: 'width 0.1s linear',
                          boxShadow: '0 0 8px rgba(161, 0, 255, 0.6)',
                        }} />
                      </div>
                    )}

                    {/* Simulation results with charts */}
                    {simulationResults?.cardId === option.id && (
                      <div style={{
                        marginTop: '12px',
                        padding: '16px',
                        background: '#1a1a2e',
                        border: '1px solid #A100FF',
                        borderRadius: '6px',
                        animation: 'fadeIn 0.3s ease-out',
                      }}>
                        <div style={{ fontSize: '11px', fontWeight: '600', color: '#A100FF', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ display: 'inline-block', animation: 'pulse 1.5s infinite' }}>●</span>
                          Simulation Results
                        </div>

                        {/* KPI Impact Cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '16px' }}>
                          {simulationResults.outcomes.map((outcome, i) => (
                            <div key={i} style={{
                              background: 'rgba(161, 0, 255, 0.1)',
                              padding: '10px',
                              borderRadius: '4px',
                              border: '1px solid rgba(161, 0, 255, 0.2)',
                            }}>
                              <div style={{ fontSize: '9px', color: '#94A3B8', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{outcome.label}</div>
                              <div style={{ fontWeight: '700', color: outcome.color, fontSize: '13px' }}>{outcome.value}</div>
                            </div>
                          ))}
                        </div>

                        {/* Cost Projection Chart */}
                        <div style={{ marginBottom: '16px' }}>
                          <div style={{ fontSize: '10px', fontWeight: '600', color: '#94A3B8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Cost Projection (7-Day)</div>
                          <div style={{ height: '240px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '4px', overflow: 'hidden' }}>
                            <ResponsiveLine
                              data={simulationResults.costProjection}
                              margin={{ top: 10, right: 30, bottom: 30, left: 60 }}
                              xScale={{ type: 'point' }}
                              yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
                              curve="monotoneX"
                              axisBottom={{
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0,
                                legend: '',
                                legendOffset: 36,
                                legendPosition: 'middle',
                              }}
                              axisLeft={{
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0,
                                legend: 'Cost ($)',
                                legendOffset: -50,
                                legendPosition: 'middle',
                                format: (val) => `$${val}`
                              }}
                              colors={['#EF4444', '#10B981']}
                              pointSize={4}
                              pointColor={{ theme: 'background' }}
                              pointBorderWidth={2}
                              pointBorderColor={{ from: 'serieColor' }}
                              enableArea={true}
                              areaOpacity={0.15}
                              theme={{
                                background: 'transparent',
                                textColor: '#94A3B8',
                                fontSize: 11,
                                grid: { line: { stroke: '#2D3748' } }
                              }}
                              motionConfig="molasses"
                              useMesh={true}
                              legends={[{
                                anchor: 'bottom',
                                direction: 'row',
                                justify: false,
                                translateX: 0,
                                translateY: 30,
                                itemsSpacing: 20,
                                itemWidth: 80,
                                itemHeight: 18,
                                itemOpacity: 0.75,
                                symbolSize: 12,
                                textColor: '#94A3B8',
                              }]}
                            />
                          </div>
                        </div>

                        {/* Risk vs TAT Comparison */}
                        <div style={{ marginBottom: '12px' }}>
                          <div style={{ fontSize: '10px', fontWeight: '600', color: '#94A3B8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Option Comparison</div>
                          <div style={{ height: '200px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '4px', overflow: 'hidden' }}>
                            <ResponsiveBar
                              data={[
                                { scenario: 'TAT (h)', 'Option A': 48, 'Option B': 18, 'Option C': 24, 'Option D': 60 },
                                { scenario: 'Cost ($k)', 'Option A': 4.2, 'Option B': 0.28, 'Option C': 6.1, 'Option D': 4.48 },
                                { scenario: 'Risk', 'Option A': 65, 'Option B': 28, 'Option C': 42, 'Option D': 12 },
                              ]}
                              keys={['Option A', 'Option B', 'Option C', 'Option D']}
                              indexBy="scenario"
                              margin={{ top: 10, right: 30, bottom: 30, left: 50 }}
                              padding={0.4}
                              valueScale={{ type: 'linear' }}
                              indexScale={{ type: 'band', round: true }}
                              colors={['#EF4444', '#10B981', '#F59E0B', '#3B82F6']}
                              axisBottom={{
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0,
                              }}
                              axisLeft={{
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0,
                              }}
                              theme={{
                                background: 'transparent',
                                textColor: '#94A3B8',
                                fontSize: 11,
                                grid: { line: { stroke: '#2D3748' } }
                              }}
                              motionConfig="molasses"
                              legends={[{
                                dataFrom: 'keys',
                                anchor: 'bottom',
                                direction: 'row',
                                justify: false,
                                translateX: 0,
                                translateY: 30,
                                itemsSpacing: 10,
                                itemWidth: 80,
                                itemHeight: 18,
                                itemOpacity: 0.75,
                                symbolSize: 12,
                                textColor: '#94A3B8',
                              }]}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Comparison view */}
            {comparisonMode && selectedCards.size >= 2 && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(161, 0, 255, 0.2)',
                borderRadius: '6px',
                padding: '16px',
                marginBottom: '16px',
                animation: 'fadeSlideUp 0.4s ease-out',
              }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#94A3B8', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Side-by-Side Comparison
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${selectedCards.size}, 1fr)`, gap: '12px' }}>
                  {mroScenarioOptions.filter(opt => selectedCards.has(opt.id)).map(option => (
                    <div key={option.id} style={{ borderLeft: '3px solid #A100FF', paddingLeft: '12px' }}>
                      <div style={{ fontSize: '12px', fontWeight: '700', color: '#F1F5F9', marginBottom: '8px' }}>
                        {option.name}
                      </div>
                      <div style={{ fontSize: '11px', color: '#CBD5E1', lineHeight: '1.6' }}>
                        <div><span style={{ fontWeight: '600' }}>Time:</span> -{option.metrics.timeImpact}</div>
                        <div><span style={{ fontWeight: '600' }}>Cost:</span> {option.metrics.costImpact}</div>
                        <div><span style={{ fontWeight: '600' }}>Risk:</span> {option.metrics.riskScore}</div>
                        <div><span style={{ fontWeight: '600' }}>Confidence:</span> {Math.round(option.metrics.confidence * 100)}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Explanation panel */}
            {showExplanation && (
              <div style={{
                animation: 'fadeSlideUp 0.4s ease-out',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid #10B981',
                borderRadius: '6px',
                padding: '12px 16px',
                marginTop: '12px',
              }}>
                <div style={{ fontSize: '11px', fontWeight: '600', color: '#10B981', marginBottom: '8px' }}>Why Option B is Recommended</div>
                <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '11px', color: '#6EE7B7', lineHeight: '1.6' }}>
                  <li>Lowest cost ($280 vs $4,200-$6,100)</li>
                  <li>Highest risk reduction (72%)</li>
                  <li>Fastest resolution (18 hours)</li>
                  <li>Best confidence score (91%)</li>
                  <li>Maintains all backup options</li>
                </ul>
              </div>
            )}

            {/* Explain recommendation link */}
            {showExplain && !showLoading && (
              <div style={{
                animation: 'fadeSlideUp 0.4s ease-out',
                paddingTop: '12px',
                borderTop: '1px solid rgba(161, 0, 255, 0.2)',
              }}>
                <a href="#" onClick={(e) => {
                  e.preventDefault();
                  setShowExplanation(!showExplanation);
                  onStageAction?.('Viewing recommendation explanation for Option B');
                }} style={{
                  fontSize: '12px',
                  color: '#A100FF',
                  textDecoration: 'none',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}>
                  {showExplanation ? '▼ Hide recommendation' : '→ Explain recommendation'}
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stage Footer */}
      {animationComplete && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderTop: '1px solid rgba(161, 0, 255, 0.2)',
          background: 'rgba(255, 255, 255, 0.02)',
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
              color: '#94A3B8',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(161, 0, 255, 0.1)';
              e.currentTarget.style.borderColor = '#A100FF';
              e.currentTarget.style.color = '#A100FF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(161, 0, 255, 0.3)';
              e.currentTarget.style.color = '#94A3B8';
            }}
          >
            ← Back
          </button>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Compare Plans Button */}
            <button
              onClick={handleComparisonMode}
              disabled={selectedCards.size < 2}
              style={{
                padding: '8px 14px',
                background: selectedCards.size >= 2 && comparisonMode ? '#A100FF' : 'rgba(161, 0, 255, 0.1)',
                border: `1px solid ${selectedCards.size >= 2 && comparisonMode ? '#A100FF' : 'rgba(161, 0, 255, 0.2)'}`,
                borderRadius: '6px',
                color: selectedCards.size >= 2 && comparisonMode ? 'white' : '#A100FF',
                fontSize: '12px',
                fontWeight: '600',
                cursor: selectedCards.size >= 2 ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s ease',
                opacity: selectedCards.size >= 2 ? 1 : 0.5,
              }}
              onMouseEnter={(e) => {
                if (selectedCards.size >= 2 && !comparisonMode) {
                  e.currentTarget.style.background = 'rgba(161, 0, 255, 0.2)';
                  e.currentTarget.style.borderColor = '#A100FF';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedCards.size >= 2 && !comparisonMode) {
                  e.currentTarget.style.background = 'rgba(161, 0, 255, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(161, 0, 255, 0.2)';
                }
              }}
            >
              {comparisonMode ? '✓ ' : ''}Compare Plans
            </button>

            {/* Modify Parameters Button */}
            <button
              onClick={() => {
                setShowParameterEditor(!showParameterEditor);
                if (!showParameterEditor) {
                  onStageAction?.('Opened parameter editor for scenario refinement');
                }
              }}
              style={{
                padding: '8px 14px',
                background: showParameterEditor ? '#A100FF' : 'rgba(161, 0, 255, 0.1)',
                border: `1px solid ${showParameterEditor ? '#A100FF' : 'rgba(161, 0, 255, 0.2)'}`,
                borderRadius: '6px',
                color: showParameterEditor ? 'white' : '#A100FF',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!showParameterEditor) {
                  e.currentTarget.style.background = 'rgba(161, 0, 255, 0.2)';
                  e.currentTarget.style.borderColor = '#A100FF';
                }
              }}
              onMouseLeave={(e) => {
                if (!showParameterEditor) {
                  e.currentTarget.style.background = 'rgba(161, 0, 255, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(161, 0, 255, 0.2)';
                }
              }}
            >
              {showParameterEditor ? '✓ Editor Active' : '⚙ Modify Parameters'}
            </button>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {/* Write-Back Status with Steps */}
            {writingBack && (
              <div style={{
                padding: '12px 16px',
                background: writeBackStatus === 'writing' ? 'rgba(161, 0, 255, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                border: `1px solid ${writeBackStatus === 'writing' ? '#A100FF' : '#10B981'}`,
                color: writeBackStatus === 'writing' ? '#A100FF' : '#10B981',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                animation: 'fadeIn 0.3s ease-out',
                minWidth: '300px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0, marginTop: '2px' }}>
                  <span style={{ display: 'inline-block', animation: 'spin 0.8s linear infinite', fontSize: '14px' }}>
                    {writeBackStatus === 'writing' ? '⏳' : '✓'}
                  </span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ marginBottom: writeBackSteps.length > 0 ? '8px' : '0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {writeBackStatus === 'writing' ? 'Executing SAP Write-Back' : 'Plan Committed'}
                  </div>
                  {writeBackSteps.length > 0 && (
                    <div style={{ fontSize: '10px', color: writeBackStatus === 'writing' ? '#C084FC' : '#6EE7B7', lineHeight: '1.5' }}>
                      {writeBackSteps.map((step, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>✓</span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            )}

            {/* Execute Plan Button */}
            <button
              onClick={handleExecutePlan}
              disabled={!selectedPlan && selectedCards.size === 0 || writingBack}
              style={{
                padding: '10px 24px',
                background: (!selectedPlan && selectedCards.size === 0) || writingBack ? 'rgba(161, 0, 255, 0.2)' : '#A100FF',
                border: 'none',
                borderRadius: '6px',
                color: 'white',
                fontSize: '13px',
                fontWeight: '600',
                cursor: ((!selectedPlan && selectedCards.size === 0) || writingBack) ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                boxShadow: ((!selectedPlan && selectedCards.size === 0) || writingBack) ? 'none' : '0 4px 12px rgba(161,0,255,0.4)',
                opacity: ((!selectedPlan && selectedCards.size === 0) || writingBack) ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (selectedPlan || selectedCards.size > 0) {
                  if (!writingBack) {
                    e.currentTarget.style.background = '#8B00E0';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(161,0,255,0.5)';
                  }
                }
              }}
              onMouseLeave={(e) => {
                if (selectedPlan || selectedCards.size > 0) {
                  if (!writingBack) {
                    e.currentTarget.style.background = '#A100FF';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(161,0,255,0.4)';
                  }
                }
              }}
            >
              Execute Selected Plan →
            </button>

            {/* Continue Button */}
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
                e.currentTarget.style.background = '#8B00E0';
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
        </div>
      )}
    </div>
  );
}
