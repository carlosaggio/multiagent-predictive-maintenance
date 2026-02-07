'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { MRO_AGENT_CONFIG, MRO_CURATED_RESPONSES } from '../../../data/mro/mroAgentConfig';
import { getCurrentMROScenarioVariant } from '../../../data/mro/mroScenarioVariants';

const ResponsiveRadar = dynamic(
  () => import('@nivo/radar').then(m => m.ResponsiveRadar),
  { ssr: false }
);

export default function MROAIPAgentStage({ onBack, onStageAction, onComplete }) {
  const [showAvatar, setShowAvatar] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [showReasoningSteps, setShowReasoningSteps] = useState(false);
  const [reasoningStepsDisplayed, setReasoningStepsDisplayed] = useState([]);
  const [showAnalysisCategories, setShowAnalysisCategories] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [showConfidenceChart, setShowConfidenceChart] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [activeAction, setActiveAction] = useState(null);
  const [actionStatus, setActionStatus] = useState({});
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [expandedFollowUp, setExpandedFollowUp] = useState(null);
  const [showScenarioPreview, setShowScenarioPreview] = useState(false);
  const hasCompletedRef = useRef(false);

  const response = MRO_CURATED_RESPONSES['OO'];
  const agent = MRO_AGENT_CONFIG['OO'];
  const currentVariant = getCurrentMROScenarioVariant();

  // Agent reasoning steps with typewriter effect
  const reasoningSteps = [
    { step: 1, text: 'Accessing SAP MM inventory data across 3 warehouses...', duration: 1200 },
    { step: 2, text: 'Analyzing SAP PM work order WP-55 dependencies...', duration: 1000 },
    { step: 3, text: 'Querying vendor portal for supplier response times...', duration: 1100 },
    { step: 4, text: 'Evaluating fleet schedule impact analysis...', duration: 900 },
    { step: 5, text: 'Cross-referencing 12 data sources across 4 systems...', duration: 800 },
    { step: 6, text: 'Synthesizing confidence scores and recommendations...', duration: 1000 },
  ];

  // Analysis categories with key findings
  const analysisCategories = [
    {
      id: 'parts_availability',
      name: 'Parts Availability',
      status: 'critical',
      statusColor: '#EF4444',
      keyFinding: '3 critical parts below min stock',
      confidence: 96,
      dataSource: 'SAP MM',
      details: [
        'IDG Component: 2 units vs 5 min threshold',
        'Hydraulic Pump: Emergency order placed',
        'Seal Kit: Lead time 14 days',
      ],
    },
    {
      id: 'vendor_performance',
      name: 'Vendor Performance',
      status: 'warning',
      statusColor: '#F59E0B',
      keyFinding: 'Primary vendor response time +40%',
      confidence: 88,
      dataSource: 'Vendor API',
      details: [
        'Avg response: 4.2hrs vs SLA 3hrs',
        'Fill rate: 94.2% (target 98%)',
        'Secondary vendor: 3.1hrs response',
      ],
    },
    {
      id: 'schedule_impact',
      name: 'Schedule Impact',
      status: 'warning',
      statusColor: '#F59E0B',
      keyFinding: 'WP-55 slip risk 35% probability',
      confidence: 92,
      dataSource: 'SAP PM',
      details: [
        'Task dependencies: 4 blocking activities',
        'Hangar slot: 18hrs available',
        'Crew availability: Confirmed',
      ],
    },
    {
      id: 'revenue_risk',
      name: 'Revenue Risk',
      status: 'critical',
      statusColor: '#EF4444',
      keyFinding: '$240K at risk if AOG occurs',
      confidence: 94,
      dataSource: 'Fleet DB',
      details: [
        'Daily lease rate: $8,400',
        'Contract penalty: 2x daily rate',
        'Insurance impact: 5% deductible',
      ],
    },
    {
      id: 'outstation_coverage',
      name: 'Outstation Coverage',
      status: 'green',
      statusColor: '#10B981',
      keyFinding: 'Backup resources available',
      confidence: 90,
      dataSource: 'Fleet DB',
      details: [
        'Hub East: 2 spare aircraft available',
        'Hub West: 1 spare with 6hr swap time',
        'Crew coverage: 95% ready',
      ],
    },
  ];

  // Follow-up questions with detail expansion
  const followUpQuestions = [
    {
      id: 'cost_vs_risk',
      question: 'Should we prioritize cost reduction or risk mitigation?',
      details: 'This trade-off analysis impacts vendor selection and expedite decisions. Risk mitigation would recommend primary vendor despite 40% delay. Cost reduction suggests secondary vendor savings.',
    },
    {
      id: 'timeline',
      question: 'What is the acceptable timeline for resolution?',
      details: 'Timeline constraints affect whether to pursue emergency parts ordering vs waiting for scheduled delivery. 7-day window suggests expedite required. 14-day window allows standard procurement.',
    },
    {
      id: 'vendor_constraints',
      question: 'Are there constraints on vendor selection?',
      details: 'Contract exclusivity clauses or performance guarantees may limit options. Currently 3 qualified vendors available. One has FAA approval restrictions.',
    },
  ];

  // Confidence breakdown data for radar chart
  const confidenceData = [
    { name: 'Parts Data', value: 96 },
    { name: 'Vendor Intel', value: 88 },
    { name: 'Schedule Analysis', value: 92 },
    { name: 'Financial Impact', value: 94 },
    { name: 'Resource Avail', value: 90 },
  ];

  // Recommendation summary
  const recommendation = {
    title: 'Recommended: Option B - Transfer + Reprioritise',
    description: 'Based on analysis of 12 data sources across 4 systems',
    details: [
      'Transfer aircraft to Hub East backup (6hr swap, $0 transfer cost)',
      'Reprioritise WP-55 to 7-day window with secondary vendor parts',
      'Activate emergency procurement for IDG component (lead time 3 days)',
      'Notify operator of 48-hour delay vs 7-day AOG risk mitigation',
    ],
    confidence: 94,
    riskMitigation: 'Reduces AOG probability from 28% to 3%',
  };

  const quickActions = [
    { id: 'triage', label: 'Run Alert Triage', color: '#A100FF' },
    { id: 'scenario', label: 'Create Scenario', color: '#3B82F6' },
    { id: 'recommend', label: 'Get Recommendations', color: '#10B981' },
  ];

  useEffect(() => {
    // Show avatar first
    setTimeout(() => setShowAvatar(true), 200);

    // Stream text word by word
    const words = response.content.split(' ');
    words.forEach((word, idx) => {
      setTimeout(() => {
        setDisplayedText(prev => (prev ? prev + ' ' + word : word));
      }, 800 + idx * 40);
    });

    const textCompleteTime = 800 + words.length * 40;

    // Show reasoning steps
    setTimeout(() => {
      setShowReasoningSteps(true);
      let cumulativeDelay = 0;
      reasoningSteps.forEach((step, idx) => {
        setTimeout(() => {
          setReasoningStepsDisplayed(prev => [...prev, idx]);
        }, cumulativeDelay);
        cumulativeDelay += step.duration + 200;
      });
    }, textCompleteTime + 300);

    // Show analysis categories
    setTimeout(() => {
      setShowAnalysisCategories(true);
    }, textCompleteTime + 3000);

    // Show recommendation
    setTimeout(() => {
      setShowRecommendation(true);
    }, textCompleteTime + 4000);

    // Show confidence chart
    setTimeout(() => {
      setShowConfidenceChart(true);
    }, textCompleteTime + 5000);

    // Show actions
    setTimeout(() => setShowActions(true), textCompleteTime + 6000);

    // Trigger animation completion
    setTimeout(() => {
      setAnimationComplete(true);
    }, textCompleteTime + 6500);
  }, []);

  const [showActions, setShowActions] = useState(false);

  const handleActionClick = (actionId) => {
    setActiveAction(actionId);
    setActionStatus(prev => ({ ...prev, [actionId]: 'loading' }));

    if (actionId === 'triage') {
      // Run Alert Triage → advance to the triage stage
      onStageAction?.('Quick Action: Running full alert triage across all systems...');
      setTimeout(() => {
        setActionStatus(prev => ({ ...prev, [actionId]: 'complete' }));
      }, 1200);
      setTimeout(() => {
        onComplete?.();
      }, 2000);
      return;
    }

    if (actionId === 'scenario') {
      // Create Scenario → show inline scenario preview, then advance
      onStageAction?.('Quick Action: Generating scenario from current analysis...');
      setTimeout(() => {
        setActionStatus(prev => ({ ...prev, [actionId]: 'complete' }));
        setShowScenarioPreview(true);
      }, 1500);
      return;
    }

    if (actionId === 'recommend') {
      // Get Recommendations → reveal recommendation + follow-up sections
      onStageAction?.('Quick Action: Surfacing AI recommendations and follow-up analysis');
      setTimeout(() => {
        setActionStatus(prev => ({ ...prev, [actionId]: 'complete' }));
        setShowRecommendation(true);
        setShowConfidenceChart(true);
        setShowFollowUp(true);
        // Scroll to recommendation
        setTimeout(() => {
          const el = document.querySelector('[data-section="recommendation"]');
          el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }, 1000);
      return;
    }

    // Fallback for any other action
    setTimeout(() => {
      setActionStatus(prev => ({ ...prev, [actionId]: 'complete' }));
    }, 1500);
    setTimeout(() => {
      setActiveAction(null);
      setActionStatus(prev => ({ ...prev, [actionId]: null }));
    }, 3000);
  };

  const toggleCategoryExpand = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const toggleFollowUpExpand = (questionId) => {
    setExpandedFollowUp(expandedFollowUp === questionId ? null : questionId);
  };

  return (
    <div style={{ padding: '0', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <style>{`
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes checkmark { 0% { transform: scale(0); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
        @keyframes typewriter { from { width: 0; opacity: 0; } to { width: 100%; opacity: 1; } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes slideDown { from { max-height: 0; opacity: 0; } to { max-height: 500px; opacity: 1; } }
      `}</style>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', padding: '16px 20px', borderBottom: `2px solid ${agent.color}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: agent.color, animation: 'pulse 1.5s infinite' }} />
            <span style={{ color: agent.color, fontSize: '13px', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase' }}>AI Agent Analysis</span>
          </div>
          {displayedText === response.content && displayedText && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '14px', fontWeight: '700' }}>
                94%
              </div>
              <span style={{ color: '#94A3B8', fontSize: '10px' }}>Agent Confidence</span>
            </div>
          )}
        </div>
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', marginTop: '4px' }}>Enterprise-grade MRO analysis with multi-source data correlation</div>
      </div>

      <div style={{ flex: 1, padding: '20px', background: '#1a1a2e', overflowY: 'auto' }}>
        {/* Agent Avatar and Response */}
        {showAvatar && (
          <div style={{ display: 'flex', gap: '14px', marginBottom: '24px', animation: 'fadeSlideUp 0.4s ease-out' }}>
            <div style={{ flexShrink: 0 }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: agent.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '20px', fontWeight: '700', boxShadow: `0 4px 12px rgba(161,0,255,0.4)` }}>
                {agent.id}
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '11px', fontWeight: '600', color: '#94A3B8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{agent.name}</div>
              <div style={{ fontSize: '13px', lineHeight: '1.6', color: '#E2E8F0' }}>
                {displayedText}
                {displayedText && displayedText !== response.content && (
                  <span style={{ animation: 'fadeIn 0.5s infinite', marginLeft: '2px', color: '#A100FF' }}>▊</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Real-time Reasoning Steps */}
        {showReasoningSteps && (
          <div style={{ marginBottom: '24px', animation: 'fadeSlideUp 0.4s ease-out' }}>
            <div style={{ fontSize: '11px', fontWeight: '600', color: '#94A3B8', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#A100FF', animation: 'pulse 1.5s infinite' }} />
              Agent Reasoning
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {reasoningSteps.map((step, idx) => {
                const isDisplayed = reasoningStepsDisplayed.includes(idx);
                return (
                  <div
                    key={step.step}
                    style={{
                      padding: '12px 14px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(161,0,255,0.2)',
                      borderRadius: '6px',
                      fontSize: '12px',
                      color: isDisplayed ? '#E2E8F0' : '#64748B',
                      transition: 'all 0.3s ease',
                      opacity: isDisplayed ? 1 : 0.5,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span style={{ fontSize: '10px', fontWeight: '700', color: '#A100FF', minWidth: '20px' }}>
                      {isDisplayed ? '✓' : '○'}
                    </span>
                    <span style={{ flex: 1 }}>{step.text}</span>
                    {isDisplayed && (
                      <span style={{ fontSize: '10px', color: '#64748B' }}>Done</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Analysis Categories Section */}
        {showAnalysisCategories && (
          <div style={{ marginBottom: '24px', animation: 'fadeSlideUp 0.4s ease-out' }}>
            <div style={{ fontSize: '11px', fontWeight: '600', color: '#94A3B8', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Analysis Categories</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              {analysisCategories.map((category) => {
                const isExpanded = expandedCategory === category.id;
                return (
                  <div key={category.id}>
                    <div
                      onClick={() => toggleCategoryExpand(category.id)}
                      style={{
                        padding: '14px 16px',
                        background: 'rgba(255,255,255,0.05)',
                        border: `2px solid ${category.statusColor}40`,
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: isExpanded ? `0 4px 12px ${category.statusColor}20` : 'none',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                        e.currentTarget.style.borderColor = category.statusColor + '80';
                      }}
                      onMouseLeave={(e) => {
                        if (!isExpanded) {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                          e.currentTarget.style.borderColor = category.statusColor + '40';
                        }
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: category.statusColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '10px', fontWeight: '700', flexShrink: 0, opacity: 0.9 }}>
                          {category.status === 'critical' ? '!' : category.status === 'warning' ? '⚠' : '✓'}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '12px', fontWeight: '700', color: '#E2E8F0', marginBottom: '4px' }}>{category.name}</div>
                          <div style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '6px' }}>{category.keyFinding}</div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                            <span style={{ fontSize: '9px', background: 'rgba(161,0,255,0.2)', color: '#A100FF', padding: '2px 6px', borderRadius: '3px' }}>{category.dataSource}</span>
                            <span style={{ fontSize: '11px', fontWeight: '600', color: category.statusColor }}>{category.confidence}%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Category Details */}
                    {isExpanded && (
                      <div style={{
                        marginTop: '8px',
                        padding: '12px 14px',
                        background: 'rgba(255,255,255,0.03)',
                        border: `1px solid ${category.statusColor}40`,
                        borderTop: `2px solid ${category.statusColor}60`,
                        borderRadius: '6px',
                        animation: 'slideDown 0.3s ease-out',
                      }}>
                        <div style={{ fontSize: '10px', color: '#94A3B8', lineHeight: '1.6' }}>
                          {category.details.map((detail, idx) => (
                            <div key={idx} style={{ marginBottom: '6px', paddingLeft: '16px', position: 'relative' }}>
                              <span style={{ position: 'absolute', left: 0, color: category.statusColor }}>•</span>
                              {detail}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recommendation Section */}
        {showRecommendation && (
          <div data-section="recommendation" style={{ marginBottom: '24px', animation: 'fadeSlideUp 0.4s ease-out' }}>
            <div style={{ fontSize: '11px', fontWeight: '600', color: '#94A3B8', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Agent Recommendation</div>
            <div style={{ padding: '16px 18px', background: 'rgba(161,0,255,0.08)', border: '2px solid rgba(161,0,255,0.3)', borderRadius: '8px' }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#A100FF', marginBottom: '4px' }}>{recommendation.title}</div>
              <div style={{ fontSize: '10px', color: '#94A3B8', marginBottom: '12px', fontStyle: 'italic' }}>{recommendation.description}</div>
              <div style={{ display: 'grid', gap: '8px', marginBottom: '12px' }}>
                {recommendation.details.map((detail, idx) => (
                  <div key={idx} style={{ fontSize: '11px', color: '#E2E8F0', display: 'flex', gap: '8px' }}>
                    <span style={{ color: '#A100FF', flexShrink: 0 }}>→</span>
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
              <div style={{ paddingTop: '10px', borderTop: '1px solid rgba(161,0,255,0.2)', display: 'flex', gap: '16px', fontSize: '11px' }}>
                <div>
                  <span style={{ color: '#94A3B8' }}>Overall Confidence: </span>
                  <span style={{ color: '#10B981', fontWeight: '700' }}>{recommendation.confidence}%</span>
                </div>
                <div>
                  <span style={{ color: '#94A3B8' }}>Risk Mitigation: </span>
                  <span style={{ color: '#10B981', fontWeight: '700' }}>{recommendation.riskMitigation}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Confidence Breakdown Chart */}
        {showConfidenceChart && (
          <div style={{ marginBottom: '24px', animation: 'fadeSlideUp 0.4s ease-out' }}>
            <div style={{ fontSize: '11px', fontWeight: '600', color: '#94A3B8', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Confidence Breakdown by Factor</div>
            <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(161,0,255,0.2)', borderRadius: '8px', padding: '12px', height: '300px' }}>
              <ResponsiveRadar
                data={confidenceData.map(d => ({ ...d, 'value': d.value }))}
                keys={['value']}
                indexBy="name"
                margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
                curve="linearClosed"
                borderWidth={2}
                borderColor="#A100FF"
                gridLevels={5}
                gridShape="circular"
                gridLabelOffset={16}
                enableDots={true}
                dotSize={8}
                dotColor="#A100FF"
                colors={['#A100FF']}
                isInteractive={true}
                theme={{
                  text: { fill: '#94A3B8', fontSize: 11 },
                  grid: { line: { stroke: 'rgba(161,0,255,0.1)' } },
                  tooltip: {
                    container: {
                      background: '#1a1a2e',
                      color: '#E2E8F0',
                      border: '1px solid rgba(161,0,255,0.3)',
                      borderRadius: '4px',
                    },
                  },
                }}
              />
            </div>
          </div>
        )}

        {/* Follow-up Questions */}
        {showFollowUp && (
          <div style={{ marginBottom: '24px', animation: 'fadeSlideUp 0.4s ease-out' }}>
            <div style={{ fontSize: '11px', fontWeight: '600', color: '#94A3B8', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Follow-up Questions</div>
            <div style={{ display: 'grid', gap: '10px' }}>
              {followUpQuestions.map((fq) => {
                const isExpanded = expandedFollowUp === fq.id;
                return (
                  <div key={fq.id}>
                    <button
                      onClick={() => {
                        toggleFollowUpExpand(fq.id);
                        onStageAction?.(`Expanded follow-up: ${fq.question}`);
                      }}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        background: 'rgba(255,255,255,0.05)',
                        border: `1px solid rgba(161,0,255,0.2)`,
                        borderRadius: '6px',
                        fontSize: '12px',
                        color: '#E2E8F0',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                        e.currentTarget.style.borderColor = 'rgba(161,0,255,0.4)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isExpanded) {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                          e.currentTarget.style.borderColor = 'rgba(161,0,255,0.2)';
                        }
                      }}
                    >
                      <span>? {fq.question}</span>
                      <span style={{ fontSize: '10px', color: '#94A3B8' }}>{isExpanded ? '▲' : '▼'}</span>
                    </button>
                    {isExpanded && (
                      <div style={{
                        marginTop: '6px',
                        padding: '10px 12px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(161,0,255,0.15)',
                        borderRadius: '4px',
                        fontSize: '11px',
                        color: '#94A3B8',
                        lineHeight: '1.5',
                        animation: 'slideDown 0.2s ease-out',
                      }}>
                        {fq.details}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {showActions && (
          <div style={{ animation: 'fadeSlideUp 0.4s ease-out' }}>
            <div style={{ fontSize: '11px', fontWeight: '600', color: '#94A3B8', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Quick Actions</div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {quickActions.map((action) => {
                const status = actionStatus[action.id];
                const isActive = activeAction === action.id;

                return (
                  <button
                    key={action.id}
                    onClick={() => handleActionClick(action.id)}
                    disabled={status === 'loading'}
                    style={{
                      background: action.color,
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '10px 14px',
                      fontSize: '11px',
                      fontWeight: '600',
                      cursor: status === 'loading' ? 'wait' : 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      minHeight: '32px',
                    }}
                    onMouseEnter={(e) => {
                      if (!status) {
                        e.currentTarget.style.opacity = '0.9';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = `0 4px 8px ${action.color}40`;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!status) {
                        e.currentTarget.style.opacity = '1';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }
                    }}
                  >
                    {status === 'loading' ? (
                      <>
                        <div style={{
                          width: '14px',
                          height: '14px',
                          borderRadius: '50%',
                          border: '2px solid rgba(255,255,255,0.3)',
                          borderTop: '2px solid white',
                          animation: 'spin 0.8s linear infinite',
                        }} />
                        <span>Processing...</span>
                      </>
                    ) : status === 'complete' ? (
                      <>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ animation: 'checkmark 0.4s ease-out' }}>
                          <circle cx="7" cy="7" r="7" fill="white" opacity="0.2"/>
                          <path d="M4 7l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>Complete</span>
                      </>
                    ) : (
                      action.label
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Inline Scenario Preview - shown when "Create Scenario" quick action is clicked */}
        {showScenarioPreview && (
          <div style={{ marginTop: '20px', animation: 'fadeSlideUp 0.4s ease-out' }}>
            <div style={{ fontSize: '11px', fontWeight: '600', color: '#94A3B8', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Generated Scenario Preview</div>
            <div style={{ padding: '16px 18px', background: 'rgba(59,130,246,0.08)', border: '2px solid rgba(59,130,246,0.3)', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3B82F6' }} />
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#60A5FA' }}>Scenario: IDG Component Shortage — 3 Response Options</span>
              </div>
              <div style={{ display: 'grid', gap: '10px', marginBottom: '14px' }}>
                {[
                  { opt: 'A', label: 'Emergency Expedite', cost: '$18,500', time: '48hrs', risk: 'Low' },
                  { opt: 'B', label: 'Transfer + Reprioritise', cost: '$4,200', time: '7 days', risk: 'Medium' },
                  { opt: 'C', label: 'Standard Procurement', cost: '$2,100', time: '14 days', risk: 'High' },
                ].map(s => (
                  <div key={s.opt} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: '6px' }}>
                    <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60A5FA', fontSize: '11px', fontWeight: '700', flexShrink: 0 }}>{s.opt}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: '#E2E8F0' }}>{s.label}</div>
                      <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '2px' }}>Cost: {s.cost} · Lead Time: {s.time} · AOG Risk: {s.risk}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => onComplete?.()}
                style={{
                  padding: '8px 16px',
                  background: '#3B82F6',
                  border: 'none',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '11px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#2563EB'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#3B82F6'; }}
              >
                Open Full Scenario Builder →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer with Continue Button */}
      {animationComplete && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderTop: '1px solid rgba(161,0,255,0.2)',
          background: '#1a1a2e',
          gap: '12px',
          animation: 'fadeIn 0.3s ease-out',
        }}>
          <button
            onClick={() => onBack?.()}
            style={{
              padding: '8px 16px',
              background: 'transparent',
              border: '1px solid #4A5568',
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
              e.currentTarget.style.borderColor = '#A100FF';
              e.currentTarget.style.color = '#A100FF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#4A5568';
              e.currentTarget.style.color = '#94A3B8';
            }}
          >
            ← Back
          </button>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => {
                setShowFollowUp(!showFollowUp);
                if (!showFollowUp) {
                  onStageAction?.('Opened follow-up questions panel');
                }
              }}
              style={{
                padding: '10px 16px',
                background: showFollowUp ? '#A100FF' : 'transparent',
                border: `1px solid ${showFollowUp ? '#A100FF' : '#94A3B8'}`,
                borderRadius: '6px',
                color: showFollowUp ? 'white' : '#94A3B8',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!showFollowUp) {
                  e.currentTarget.style.borderColor = '#A100FF';
                  e.currentTarget.style.color = '#A100FF';
                }
              }}
              onMouseLeave={(e) => {
                if (!showFollowUp) {
                  e.currentTarget.style.borderColor = '#94A3B8';
                  e.currentTarget.style.color = '#94A3B8';
                }
              }}
            >
              {showFollowUp ? '✓ Follow-up Active' : 'Ask Follow-up'}
            </button>
          </div>
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
              boxShadow: '0 2px 8px rgba(161,0,255,0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#8B00E0';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#A100FF';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Proceed to Alert Triage →
          </button>
        </div>
      )}
    </div>
  );
}
