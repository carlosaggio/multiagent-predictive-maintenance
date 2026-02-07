'use client';

import { useState, useEffect, useRef } from 'react';
import { mroAutomations } from '../../../data/mro/mroAutomationData';

const ENTERPRISE_RULES = [
  {
    id: 'rule-1',
    name: 'Auto-Expedite Purchase Orders',
    description: 'Automatically expedite critical parts when lead time exceeds TAT buffer',
    trigger: 'SAP MM inventory alert',
    condition: 'Part criticality = A AND lead_time > TAT_buffer + 2 days',
    action: 'Create expedite request, notify vendor, update work order',
    confidence: 94,
    backtested: { successRate: 92, samplesAnalyzed: 1847 },
    estimatedSavings: 15000,
    status: true,
  },
  {
    id: 'rule-2',
    name: 'Auto-Transfer Pool Stock',
    description: 'Automatically transfer stock when outstation coverage drops below 80%',
    trigger: 'Daily inventory reconciliation',
    condition: 'outstation_coverage < 0.80 AND central_stock > safety_stock * 1.2',
    action: 'Create transfer order, adjust pool allocation',
    confidence: 87,
    backtested: { successRate: 88, samplesAnalyzed: 1256 },
    estimatedSavings: 8000,
    status: true,
  },
  {
    id: 'rule-3',
    name: 'Revenue Exception Auto-Triage',
    description: 'Automatically triage billing exceptions exceeding variance threshold',
    trigger: 'Monthly billing reconciliation',
    condition: '|billed - contracted| > $50,000 AND variance_age < 30 days',
    action: 'Create exception ticket, assign to revenue analyst, flag for review',
    confidence: 91,
    backtested: { successRate: 95, samplesAnalyzed: 342 },
    estimatedSavings: 0, // Time savings: 12 hrs/month
    timeSavingsHours: 12,
    status: true,
  },
];

export default function MROAutomationStage({ onBack, onStageAction, onComplete }) {
  const [showHeader, setShowHeader] = useState(false);
  const [revealedCards, setRevealedCards] = useState([]);
  const [toggleStates, setToggleStates] = useState({});
  const [showRunLog, setShowRunLog] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [expandedAutomation, setExpandedAutomation] = useState(null);
  const [testingState, setTestingState] = useState({});
  const [showExpandedEditor, setShowExpandedEditor] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showRunHistory, setShowRunHistory] = useState({});
  const [testAllActive, setTestAllActive] = useState(false);
  const [savedRules, setSavedRules] = useState({});
  const [allRulesSaved, setAllRulesSaved] = useState(false);
  const [createdRules, setCreatedRules] = useState([]);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [enterpriseRuleToggles, setEnterpriseRuleToggles] = useState({});
  const [showDeploymentAnimation, setShowDeploymentAnimation] = useState(false);
  const [deploymentProgress, setDeploymentProgress] = useState({});
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    setTimeout(() => setShowHeader(true), 200);

    // Initialize toggle states
    const initialStates = {};
    mroAutomations.forEach((auto) => {
      initialStates[auto.id] = auto.enabled;
    });
    setToggleStates(initialStates);

    // Initialize enterprise rule toggles
    const enterpriseStates = {};
    ENTERPRISE_RULES.forEach((rule) => {
      enterpriseStates[rule.id] = rule.status;
    });
    setEnterpriseRuleToggles(enterpriseStates);

    // Reveal cards
    mroAutomations.forEach((_, idx) => {
      setTimeout(() => {
        setRevealedCards(prev => [...prev, idx]);
      }, 600 + idx * 300);
    });

    // Show run log
    setTimeout(() => {
      setShowRunLog(true);
    }, 600 + mroAutomations.length * 300 + 300);

    // Set animation complete and trigger completion after delay
    setTimeout(() => {
      setAnimationComplete(true);
      if (!hasCompletedRef.current) {
        hasCompletedRef.current = true;
      }
    }, 600 + mroAutomations.length * 300 + 1200);
  }, []);

  const handleToggle = (autoId) => {
    setToggleStates(prev => ({
      ...prev,
      [autoId]: !prev[autoId],
    }));
  };

  const handleTestRule = (autoId) => {
    setTestingState(prev => ({
      ...prev,
      [autoId]: 'testing',
    }));

    setTimeout(() => {
      setTestingState(prev => ({
        ...prev,
        [autoId]: 'complete',
      }));
    }, 2000);

    setTimeout(() => {
      setTestingState(prev => ({
        ...prev,
        [autoId]: null,
      }));
    }, 4000);
  };

  const handleTestAll = () => {
    setTestAllActive(true);
    mroAutomations.forEach((auto) => {
      setTestingState(prev => ({
        ...prev,
        [auto.id]: 'testing',
      }));
    });

    setTimeout(() => {
      mroAutomations.forEach((auto) => {
        setTestingState(prev => ({
          ...prev,
          [auto.id]: 'complete',
        }));
      });
    }, 2000);

    setTimeout(() => {
      setTestAllActive(false);
      setTestingState({});
    }, 4000);
  };

  const handleEnterpriseRuleToggle = (ruleId) => {
    setEnterpriseRuleToggles(prev => ({
      ...prev,
      [ruleId]: !prev[ruleId],
    }));
  };

  const handleSaveAllRules = () => {
    setShowDeploymentAnimation(true);
    const systems = ['SAP MM', 'SAP PM', 'SAP FI', 'Vendor Portal'];

    systems.forEach((system, idx) => {
      setTimeout(() => {
        setDeploymentProgress(prev => ({
          ...prev,
          [system]: 'syncing',
        }));
      }, idx * 400);

      setTimeout(() => {
        setDeploymentProgress(prev => ({
          ...prev,
          [system]: 'complete',
        }));
      }, idx * 400 + 600);
    });

    setTimeout(() => {
      setAllRulesSaved(true);
      setShowSaveConfirmation(true);
      onStageAction?.({
        type: 'all_rules_saved',
        totalRules: ENTERPRISE_RULES.length,
        syncStatus: 'All systems synchronized',
        systems: ['SAP MM', 'SAP PM', 'SAP FI', 'Vendor Portal'],
      });
      setTimeout(() => {
        setShowSaveConfirmation(false);
        setShowDeploymentAnimation(false);
      }, 5000);
    }, systems.length * 400 + 1000);
  };

  const totalAnnualSavings = ENTERPRISE_RULES.reduce((sum, rule) => sum + rule.estimatedSavings, 0);
  const averageConfidence = Math.round(ENTERPRISE_RULES.reduce((sum, rule) => sum + rule.confidence, 0) / ENTERPRISE_RULES.length);

  return (
    <div style={{ padding: '0', background: '#1a1a2e', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
        @keyframes glow { 0%, 100% { box-shadow: 0 0 8px rgba(16, 185, 129, 0.5); } 50% { box-shadow: 0 0 16px rgba(16, 185, 129, 0.8); } }
        @keyframes glowRed { 0%, 100% { box-shadow: 0 0 8px rgba(239, 68, 68, 0.5); } 50% { box-shadow: 0 0 16px rgba(239, 68, 68, 0.8); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes shimmer { 0% { background-position: -1000px 0; } 100% { background-position: 1000px 0; } }
      `}</style>

      {/* Header */}
      {showHeader && (
        <div style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          padding: '16px 20px',
          borderRadius: '8px 8px 0 0',
          borderBottom: '2px solid #A100FF',
          animation: 'fadeSlideUp 0.4s ease-out',
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
              Automation Library
            </span>
          </div>
          <div style={{ color: 'rgba(241,245,249,0.6)', fontSize: '11px', marginTop: '4px' }}>
            Active automation rules and continuous execution settings
          </div>
        </div>
      )}

      <div style={{ padding: '20px', flex: 1, overflow: 'auto' }}>
        {/* Learning Summary Banner */}
        {showRunLog && (
          <div style={{
            animation: 'fadeSlideUp 0.4s ease-out',
            background: 'linear-gradient(135deg, rgba(161,0,255,0.15) 0%, rgba(161,0,255,0.08) 100%)',
            border: '2px solid #A100FF',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                background: 'rgba(161, 0, 255, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                flexShrink: 0,
              }}>
                ⚡
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#A100FF',
                  marginBottom: '6px',
                }}>
                  Learning Summary
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#F1F5F9',
                  lineHeight: '1.5',
                  marginBottom: '10px',
                }}>
                  Based on this intervention, the system has identified 3 automation opportunities that can reduce operational variance and improve efficiency across PO management, inventory allocation, and billing reconciliation.
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '12px',
                  fontSize: '11px',
                }}>
                  <div style={{
                    background: 'rgba(161, 0, 255, 0.1)',
                    border: '1px solid #A100FF',
                    borderRadius: '4px',
                    padding: '8px',
                  }}>
                    <div style={{ color: '#94A3B8', marginBottom: '4px' }}>Annual Savings</div>
                    <div style={{ color: '#10B981', fontWeight: '700', fontSize: '13px' }}>
                      ${totalAnnualSavings.toLocaleString()}
                    </div>
                  </div>
                  <div style={{
                    background: 'rgba(161, 0, 255, 0.1)',
                    border: '1px solid #A100FF',
                    borderRadius: '4px',
                    padding: '8px',
                  }}>
                    <div style={{ color: '#94A3B8', marginBottom: '4px' }}>Avg Confidence</div>
                    <div style={{ color: '#A100FF', fontWeight: '700', fontSize: '13px' }}>
                      {averageConfidence}%
                    </div>
                  </div>
                  <div style={{
                    background: 'rgba(161, 0, 255, 0.1)',
                    border: '1px solid #A100FF',
                    borderRadius: '4px',
                    padding: '8px',
                  }}>
                    <div style={{ color: '#94A3B8', marginBottom: '4px' }}>Risk Reduction</div>
                    <div style={{ color: '#F59E0B', fontWeight: '700', fontSize: '13px' }}>
                      34%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enterprise Rules Section */}
        {showRunLog && (
          <div style={{ marginBottom: '28px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px',
            }}>
              <div style={{
                width: '4px',
                height: '20px',
                borderRadius: '2px',
                background: '#A100FF',
              }} />
              <h2 style={{
                fontSize: '14px',
                fontWeight: '700',
                color: '#F1F5F9',
                margin: 0,
              }}>
                Enterprise Rules
              </h2>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                background: 'rgba(161, 0, 255, 0.2)',
                border: '1px solid #A100FF',
                borderRadius: '4px',
                padding: '2px 8px',
                fontSize: '10px',
                fontWeight: '600',
                color: '#A100FF',
              }}>
                {ENTERPRISE_RULES.filter(r => enterpriseRuleToggles[r.id]).length}/{ENTERPRISE_RULES.length} Active
              </div>
            </div>

            {ENTERPRISE_RULES.map((rule, idx) => {
              const isActive = enterpriseRuleToggles[rule.id];
              return (
                <div
                  key={rule.id}
                  style={{
                    animation: `fadeSlideUp 0.4s ease-out ${idx * 100}ms both`,
                    background: '#2D3748',
                    border: isActive ? '1px solid #A100FF' : '1px solid #404856',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '12px',
                    transition: 'all 0.2s ease',
                    boxShadow: isActive ? '0 0 12px rgba(161, 0, 255, 0.2)' : 'none',
                  }}
                >
                  {/* Rule Header */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '13px',
                        fontWeight: '700',
                        color: '#F1F5F9',
                        marginBottom: '4px',
                      }}>
                        {rule.name}
                      </div>
                      <div style={{
                        fontSize: '11px',
                        color: '#94A3B8',
                        lineHeight: '1.4',
                      }}>
                        {rule.description}
                      </div>
                    </div>

                    {/* Toggle Switch */}
                    <div style={{
                      marginLeft: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      gap: '8px',
                      flexShrink: 0,
                    }}>
                      <button
                        onClick={() => handleEnterpriseRuleToggle(rule.id)}
                        style={{
                          width: '40px',
                          height: '24px',
                          borderRadius: '12px',
                          border: 'none',
                          background: isActive ? '#10B981' : '#404856',
                          cursor: 'pointer',
                          position: 'relative',
                          transition: 'all 0.2s ease',
                          padding: '0',
                          boxShadow: isActive ? '0 0 8px rgba(16, 185, 129, 0.5)' : 'none',
                        }}
                        onMouseEnter={(e) => {
                          if (isActive) {
                            e.currentTarget.style.boxShadow = '0 0 12px rgba(16, 185, 129, 0.8)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (isActive) {
                            e.currentTarget.style.boxShadow = '0 0 8px rgba(16, 185, 129, 0.5)';
                          }
                        }}
                      >
                        <div style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          background: 'white',
                          position: 'absolute',
                          top: '2px',
                          left: isActive ? '18px' : '2px',
                          transition: 'left 0.2s ease',
                        }} />
                      </button>
                      <span style={{
                        fontSize: '10px',
                        fontWeight: '600',
                        color: isActive ? '#10B981' : '#94A3B8',
                        textTransform: 'uppercase',
                      }}>
                        {isActive ? 'ON' : 'OFF'}
                      </span>
                    </div>
                  </div>

                  {/* Rule Details Grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                    marginBottom: '12px',
                  }}>
                    {/* Trigger */}
                    <div style={{
                      background: 'rgba(161, 0, 255, 0.08)',
                      border: '1px solid #404856',
                      borderRadius: '6px',
                      padding: '10px',
                    }}>
                      <div style={{
                        fontSize: '9px',
                        color: '#A100FF',
                        fontWeight: '600',
                        marginBottom: '4px',
                        textTransform: 'uppercase',
                      }}>
                        Trigger
                      </div>
                      <div style={{
                        fontSize: '11px',
                        color: '#F1F5F9',
                        fontWeight: '500',
                      }}>
                        {rule.trigger}
                      </div>
                    </div>

                    {/* Condition */}
                    <div style={{
                      background: 'rgba(161, 0, 255, 0.08)',
                      border: '1px solid #404856',
                      borderRadius: '6px',
                      padding: '10px',
                    }}>
                      <div style={{
                        fontSize: '9px',
                        color: '#A100FF',
                        fontWeight: '600',
                        marginBottom: '4px',
                        textTransform: 'uppercase',
                      }}>
                        Condition
                      </div>
                      <div style={{
                        fontSize: '10px',
                        color: '#F1F5F9',
                        fontFamily: 'monospace',
                        fontWeight: '400',
                      }}>
                        {rule.condition}
                      </div>
                    </div>
                  </div>

                  {/* Action */}
                  <div style={{
                    background: 'rgba(65, 105, 225, 0.08)',
                    border: '1px solid #404856',
                    borderRadius: '6px',
                    padding: '10px',
                    marginBottom: '12px',
                  }}>
                    <div style={{
                      fontSize: '9px',
                      color: '#4169E1',
                      fontWeight: '600',
                      marginBottom: '4px',
                      textTransform: 'uppercase',
                    }}>
                      Action
                    </div>
                    <div style={{
                      fontSize: '11px',
                      color: '#F1F5F9',
                    }}>
                      {rule.action}
                    </div>
                  </div>

                  {/* Metrics Row */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                    gap: '12px',
                    paddingTop: '12px',
                    borderTop: '1px solid #404856',
                  }}>
                    <div>
                      <div style={{
                        fontSize: '9px',
                        color: '#94A3B8',
                        fontWeight: '600',
                        marginBottom: '4px',
                        textTransform: 'uppercase',
                      }}>
                        Confidence
                      </div>
                      <div style={{
                        fontSize: '13px',
                        fontWeight: '700',
                        color: rule.confidence > 90 ? '#10B981' : rule.confidence > 85 ? '#F59E0B' : '#F87171',
                      }}>
                        {rule.confidence}%
                      </div>
                    </div>

                    <div>
                      <div style={{
                        fontSize: '9px',
                        color: '#94A3B8',
                        fontWeight: '600',
                        marginBottom: '4px',
                        textTransform: 'uppercase',
                      }}>
                        Backtested
                      </div>
                      <div style={{
                        fontSize: '11px',
                        color: '#F1F5F9',
                        fontWeight: '600',
                      }}>
                        {rule.backtested.successRate}% success
                      </div>
                      <div style={{
                        fontSize: '9px',
                        color: '#94A3B8',
                      }}>
                        n={rule.backtested.samplesAnalyzed}
                      </div>
                    </div>

                    <div>
                      <div style={{
                        fontSize: '9px',
                        color: '#94A3B8',
                        fontWeight: '600',
                        marginBottom: '4px',
                        textTransform: 'uppercase',
                      }}>
                        Est. Savings
                      </div>
                      {rule.estimatedSavings > 0 ? (
                        <div style={{
                          fontSize: '13px',
                          fontWeight: '700',
                          color: '#10B981',
                        }}>
                          ${rule.estimatedSavings.toLocaleString()}
                        </div>
                      ) : (
                        <div style={{
                          fontSize: '11px',
                          color: '#F1F5F9',
                          fontWeight: '600',
                        }}>
                          {rule.timeSavingsHours}h/mo
                        </div>
                      )}
                    </div>

                    <div>
                      <div style={{
                        fontSize: '9px',
                        color: '#94A3B8',
                        fontWeight: '600',
                        marginBottom: '4px',
                        textTransform: 'uppercase',
                      }}>
                        Status
                      </div>
                      <div style={{
                        fontSize: '11px',
                        fontWeight: '600',
                        color: isActive ? '#10B981' : '#94A3B8',
                        textTransform: 'capitalize',
                      }}>
                        {isActive ? 'Active' : 'Inactive'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* System Sync Status */}
            <div style={{
              background: 'rgba(161, 0, 255, 0.08)',
              border: '1px solid #404856',
              borderRadius: '8px',
              padding: '12px',
              marginTop: '16px',
              marginBottom: '20px',
            }}>
              <div style={{
                fontSize: '10px',
                color: '#94A3B8',
                fontWeight: '600',
                marginBottom: '8px',
                textTransform: 'uppercase',
              }}>
                System Sync Status
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
                gap: '8px',
              }}>
                {['SAP MM', 'SAP PM', 'SAP FI', 'Vendor Portal'].map((system) => (
                  <div
                    key={system}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '11px',
                      color: deploymentProgress[system] === 'complete' ? '#10B981' : '#94A3B8',
                      fontWeight: '600',
                    }}
                  >
                    {deploymentProgress[system] === 'syncing' && (
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#F59E0B',
                        animation: 'pulse 1s infinite',
                      }} />
                    )}
                    {deploymentProgress[system] === 'complete' && (
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#10B981',
                      }} />
                    )}
                    {!deploymentProgress[system] && (
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#404856',
                      }} />
                    )}
                    <span>{system}</span>
                    {deploymentProgress[system] === 'complete' && ' ✓'}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Automation cards */}
        <div style={{ marginBottom: '20px' }}>
          {mroAutomations.map((automation, idx) => {
            const isRevealed = revealedCards.includes(idx);
            const isEnabled = toggleStates[automation.id];
            const successRate = Math.round(automation.stats.successRate * 100);
            const isTesting = testingState[automation.id] === 'testing';
            const isTestComplete = testingState[automation.id] === 'complete';

            return (
              <div
                key={automation.id}
                style={{
                  opacity: isRevealed ? 1 : 0,
                  transform: isRevealed ? 'translateY(0)' : 'translateY(12px)',
                  transition: 'all 0.4s ease-out',
                  background: '#2D3748',
                  border: '1px solid #404856',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '12px',
                }}
              >
                {/* Header with toggle */}
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '13px',
                      fontWeight: '700',
                      color: '#F1F5F9',
                      marginBottom: '2px',
                    }}>
                      {automation.name}
                    </div>
                    <div style={{
                      fontSize: '11px',
                      color: '#94A3B8',
                      lineHeight: '1.4',
                    }}>
                      {automation.description}
                    </div>
                  </div>

                  {/* Toggle switch with visual feedback */}
                  <div style={{
                    marginLeft: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    flexShrink: 0,
                  }}>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: '600',
                      color: isEnabled ? '#10B981' : '#94A3B8',
                      textTransform: 'uppercase',
                    }}>
                      {isEnabled ? 'ON' : 'OFF'}
                    </span>
                    <button
                      onClick={() => handleToggle(automation.id)}
                      style={{
                        width: '40px',
                        height: '24px',
                        borderRadius: '12px',
                        border: 'none',
                        background: isEnabled ? '#10B981' : '#404856',
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'all 0.2s ease',
                        padding: '0',
                        boxShadow: isEnabled ? '0 0 8px rgba(16, 185, 129, 0.5)' : 'none',
                      }}
                      onMouseEnter={(e) => {
                        if (isEnabled) {
                          e.currentTarget.style.boxShadow = '0 0 12px rgba(16, 185, 129, 0.8)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (isEnabled) {
                          e.currentTarget.style.boxShadow = '0 0 8px rgba(16, 185, 129, 0.5)';
                        }
                      }}
                    >
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: 'white',
                        position: 'absolute',
                        top: '2px',
                        left: isEnabled ? '18px' : '2px',
                        transition: 'left 0.2s ease',
                      }} />
                    </button>
                  </div>
                </div>

                {/* Trigger condition */}
                <div style={{
                  background: 'rgba(161, 0, 255, 0.1)',
                  border: '1px solid #404856',
                  borderRadius: '4px',
                  padding: '10px 12px',
                  marginBottom: '12px',
                }}>
                  <div style={{ fontSize: '9px', color: '#94A3B8', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase' }}>
                    Trigger
                  </div>
                  <div style={{ fontSize: '11px', color: '#F1F5F9', fontWeight: '500', fontFamily: 'monospace' }}>
                    {automation.trigger.condition}
                  </div>
                  <div style={{ fontSize: '9px', color: '#94A3B8', marginTop: '4px' }}>
                    Frequency: {automation.trigger.frequency}
                  </div>
                </div>

                {/* Action template */}
                <div style={{
                  background: 'rgba(161, 0, 255, 0.05)',
                  border: '1px solid #404856',
                  borderRadius: '4px',
                  padding: '10px 12px',
                  marginBottom: '12px',
                }}>
                  <div style={{ fontSize: '9px', color: '#A100FF', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase' }}>
                    Action Template
                  </div>
                  <div style={{ fontSize: '11px', color: '#F1F5F9', fontWeight: '500' }}>
                    {automation.action.template}
                  </div>
                </div>

                {/* Approval policy */}
                <div style={{
                  background: 'rgba(65, 105, 225, 0.05)',
                  border: '1px solid #404856',
                  borderRadius: '4px',
                  padding: '10px 12px',
                  marginBottom: '12px',
                }}>
                  <div style={{ fontSize: '9px', color: '#4169E1', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase' }}>
                    Approval Policy
                  </div>
                  <div style={{ fontSize: '11px', color: '#F1F5F9' }}>
                    {automation.action.approvalPolicy}
                  </div>
                </div>

                {/* Stats */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                  gap: '12px',
                  paddingTop: '12px',
                  borderTop: '1px solid #404856',
                  marginBottom: '12px',
                }}>
                  {automation.stats.lastRun ? (
                    <div>
                      <div style={{ fontSize: '9px', color: '#94A3B8', fontWeight: '600', marginBottom: '2px' }}>LAST RUN</div>
                      <div style={{ fontSize: '11px', color: '#F1F5F9' }}>
                        {new Date(automation.stats.lastRun).toLocaleTimeString()}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: '9px', color: '#94A3B8', fontWeight: '600', marginBottom: '2px' }}>LAST RUN</div>
                      <div style={{ fontSize: '11px', color: '#94A3B8' }}>Never</div>
                    </div>
                  )}
                  <div>
                    <div style={{ fontSize: '9px', color: '#94A3B8', fontWeight: '600', marginBottom: '2px' }}>THIS WEEK</div>
                    <div style={{ fontSize: '11px', color: '#F1F5F9', fontWeight: '600' }}>
                      {automation.stats.actionsThisWeek} actions
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '9px', color: '#94A3B8', fontWeight: '600', marginBottom: '2px' }}>SUCCESS RATE</div>
                    <div style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      color: automation.stats.successRate > 0.85 ? '#10B981' : '#F59E0B',
                    }}>
                      {successRate}%
                    </div>
                  </div>
                  {automation.stats.avgCostPerAction > 0 && (
                    <div>
                      <div style={{ fontSize: '9px', color: '#94A3B8', fontWeight: '600', marginBottom: '2px' }}>AVG COST</div>
                      <div style={{ fontSize: '11px', color: '#F1F5F9' }}>
                        ${automation.stats.avgCostPerAction.toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  marginBottom: '12px',
                }}>
                  <button
                    onClick={() => handleTestRule(automation.id)}
                    disabled={isTesting}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      background: isTesting ? '#404856' : '#2D3748',
                      border: '1px solid #404856',
                      borderRadius: '4px',
                      color: '#F1F5F9',
                      fontSize: '11px',
                      fontWeight: '600',
                      cursor: isTesting ? 'default' : 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!isTesting) {
                        e.currentTarget.style.borderColor = '#A100FF';
                        e.currentTarget.style.color = '#A100FF';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isTesting) {
                        e.currentTarget.style.borderColor = '#404856';
                        e.currentTarget.style.color = '#F1F5F9';
                      }
                    }}
                  >
                    {isTesting ? 'Testing rule...' : isTestComplete ? '✓ Rule passed (3 matches found)' : 'Test Rule'}
                  </button>

                  <button
                    onClick={() => setShowExpandedEditor(showExpandedEditor === automation.id ? null : automation.id)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      background: '#2D3748',
                      border: '1px solid #404856',
                      borderRadius: '4px',
                      color: '#F1F5F9',
                      fontSize: '11px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#A100FF';
                      e.currentTarget.style.color = '#A100FF';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#404856';
                      e.currentTarget.style.color = '#F1F5F9';
                    }}
                  >
                    Edit Rule
                  </button>

                  <button
                    onClick={() => setShowRunHistory(prev => ({
                      ...prev,
                      [automation.id]: !prev[automation.id],
                    }))}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      background: '#2D3748',
                      border: '1px solid #404856',
                      borderRadius: '4px',
                      color: '#F1F5F9',
                      fontSize: '11px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#A100FF';
                      e.currentTarget.style.color = '#A100FF';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#404856';
                      e.currentTarget.style.color = '#F1F5F9';
                    }}
                  >
                    Run History
                  </button>
                </div>

                {/* Expanded editor panel */}
                {showExpandedEditor === automation.id && (
                  <div style={{
                    background: 'rgba(161, 0, 255, 0.08)',
                    border: '1px solid #A100FF',
                    borderRadius: '4px',
                    padding: '12px',
                    marginBottom: '12px',
                    animation: 'fadeSlideUp 0.3s ease-out',
                  }}>
                    <div style={{ fontSize: '11px', fontWeight: '600', color: '#A100FF', marginBottom: '8px' }}>
                      Rule Editor
                    </div>
                    <div style={{
                      background: '#1a1a2e',
                      border: '1px solid #404856',
                      borderRadius: '3px',
                      padding: '8px',
                      marginBottom: '8px',
                      fontFamily: 'monospace',
                      fontSize: '10px',
                      color: '#F1F5F9',
                    }}>
                      <div style={{ marginBottom: '4px' }}>
                        <span style={{ color: '#A100FF' }}>trigger:</span> {automation.trigger.condition}
                      </div>
                      <div style={{ marginBottom: '4px' }}>
                        <span style={{ color: '#A100FF' }}>action:</span> {automation.action.template}
                      </div>
                      <div>
                        <span style={{ color: '#A100FF' }}>policy:</span> {automation.action.approvalPolicy}
                      </div>
                    </div>
                    <button
                      style={{
                        width: '100%',
                        padding: '6px',
                        background: savedRules[automation.id] ? '#10B981' : '#A100FF',
                        border: 'none',
                        borderRadius: '3px',
                        color: 'white',
                        fontSize: '10px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onClick={() => {
                        setSavedRules(prev => ({ ...prev, [automation.id]: true }));
                        onStageAction?.({ type: 'rule_saved', ruleId: automation.id, ruleName: automation.name, sapSystem: 'SAP ECC 6.0' });
                      }}
                    >
                      {savedRules[automation.id] ? '✓ Saved' : 'Save Changes'}
                    </button>
                  </div>
                )}

                {/* Run history */}
                {showRunHistory[automation.id] && (
                  <div style={{
                    background: 'rgba(161, 0, 255, 0.08)',
                    border: '1px solid #404856',
                    borderRadius: '4px',
                    padding: '12px',
                    animation: 'fadeSlideUp 0.3s ease-out',
                  }}>
                    <div style={{ fontSize: '11px', fontWeight: '600', color: '#A100FF', marginBottom: '8px' }}>
                      Last 5 Runs
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {automation.runLog.slice(0, 5).map((log, idx) => (
                        <div key={idx} style={{
                          padding: '6px 8px',
                          background: '#1a1a2e',
                          border: '1px solid #404856',
                          borderRadius: '3px',
                          fontSize: '9px',
                          color: '#F1F5F9',
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}>
                          <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                          <span style={{
                            color: log.result === 'success' ? '#10B981' : log.result === 'escalated' ? '#F59E0B' : '#94A3B8',
                          }}>
                            {log.result}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Save Confirmation Banner */}
        {showSaveConfirmation && (
          <div style={{
            animation: 'fadeSlideUp 0.4s ease-out',
            background: 'rgba(16,185,129,0.1)',
            border: '2px solid #10B981',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#10B981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '18px',
              fontWeight: '700',
              flexShrink: 0,
            }}>
              ✓
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#10B981', marginBottom: '2px' }}>
                All Rules Saved Successfully
              </div>
              <div style={{ fontSize: '11px', color: '#10B981' }}>
                System synced with SAP ECC 6.0 — {mroAutomations.length} automation rules deployed
              </div>
            </div>
          </div>
        )}

        {/* Create New Rule Button */}
        {showRunLog && (
          <div style={{ marginBottom: '20px' }}>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              style={{
                width: '100%',
                padding: '12px',
                background: '#2D3748',
                border: '1px solid #A100FF',
                borderRadius: '6px',
                color: '#A100FF',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(161, 0, 255, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#2D3748';
              }}
            >
              + Create New Rule
            </button>

            {showCreateForm && (
              <div style={{
                marginTop: '12px',
                background: 'rgba(161, 0, 255, 0.1)',
                border: '1px solid #A100FF',
                borderRadius: '6px',
                padding: '16px',
                animation: 'fadeSlideUp 0.3s ease-out',
              }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#A100FF', marginBottom: '12px' }}>
                  New Automation Rule Template
                </div>
                <div style={{
                  background: '#1a1a2e',
                  border: '1px solid #404856',
                  borderRadius: '4px',
                  padding: '12px',
                  fontFamily: 'monospace',
                  fontSize: '10px',
                  color: '#F1F5F9',
                  marginBottom: '12px',
                  maxHeight: '150px',
                  overflowY: 'auto',
                }}>
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{ color: '#A100FF' }}>name:</span> &quot;New Rule&quot;
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{ color: '#A100FF' }}>trigger:</span>
                  </div>
                  <div style={{ marginLeft: '20px', marginBottom: '8px' }}>
                    condition: &quot;Define trigger condition&quot;
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{ color: '#A100FF' }}>action:</span>
                  </div>
                  <div style={{ marginLeft: '20px' }}>
                    template: &quot;Define action template&quot;
                  </div>
                </div>
                <button
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: '#A100FF',
                    border: 'none',
                    borderRadius: '4px',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onClick={() => {
                    const newRuleId = `rule-${Date.now()}`;
                    setCreatedRules(prev => [...prev, newRuleId]);
                    setShowCreateForm(false);
                    onStageAction?.({ type: 'rule_created', ruleId: newRuleId, ruleName: 'New Rule', timestamp: new Date().toLocaleTimeString() });
                  }}
                >
                  Create Rule
                </button>
              </div>
            )}
          </div>
        )}

        {/* Run Log */}
        {showRunLog && (
          <div style={{
            animation: 'fadeSlideUp 0.4s ease-out',
            background: '#2D3748',
            border: '1px solid #404856',
            borderRadius: '8px',
            padding: '16px',
          }}>
            <div style={{
              fontSize: '12px',
              fontWeight: '700',
              color: '#F1F5F9',
              marginBottom: '12px',
            }}>
              Recent Activity
            </div>
            <div style={{
              maxHeight: '280px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}>
              {mroAutomations
                .flatMap(auto => auto.runLog.map(log => ({ ...log, automationId: auto.id })))
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .map((log, idx) => {
                  const isSuccess = log.result === 'success';
                  const isEscalated = log.result === 'escalated';

                  return (
                    <div key={idx} style={{
                      padding: '10px 12px',
                      background: '#1a1a2e',
                      border: '1px solid #404856',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                    }}>
                      {/* Status icon */}
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: isSuccess ? 'rgba(16, 185, 129, 0.2)' : isEscalated ? 'rgba(245, 158, 11, 0.2)' : 'rgba(148, 163, 184, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        fontSize: '10px',
                        fontWeight: '700',
                        color: isSuccess ? '#10B981' : isEscalated ? '#F59E0B' : '#94A3B8',
                      }}>
                        {isSuccess && '✓'}
                        {isEscalated && '!'}
                        {!isSuccess && !isEscalated && '◆'}
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: '11px',
                          fontWeight: '600',
                          color: '#F1F5F9',
                          marginBottom: '2px',
                        }}>
                          {log.action}
                        </div>
                        <div style={{
                          fontSize: '10px',
                          color: '#94A3B8',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}>
                          <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                          {log.approved !== undefined && (
                            <span>
                              • {log.approved ? 'Approved' : 'Pending'}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Result badge */}
                      <div style={{
                        padding: '2px 6px',
                        borderRadius: '2px',
                        fontSize: '9px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        background: isSuccess ? 'rgba(16, 185, 129, 0.2)' : isEscalated ? 'rgba(245, 158, 11, 0.2)' : 'rgba(148, 163, 184, 0.2)',
                        color: isSuccess ? '#10B981' : isEscalated ? '#F59E0B' : '#94A3B8',
                        flexShrink: 0,
                      }}>
                        {log.result}
                      </div>
                    </div>
                  );
                })}
            </div>
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
          borderTop: '1px solid #2D3748',
          background: 'rgba(26,26,46,0.95)',
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
            }}
          >
            ← Back
          </button>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleSaveAllRules}
              disabled={showDeploymentAnimation}
              style={{
                padding: '10px 16px',
                background: allRulesSaved ? '#10B981' : '#2D3748',
                border: '1px solid ' + (allRulesSaved ? '#10B981' : '#404856'),
                borderRadius: '6px',
                color: '#F1F5F9',
                fontSize: '13px',
                fontWeight: '600',
                cursor: showDeploymentAnimation ? 'default' : 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!allRulesSaved && !showDeploymentAnimation) {
                  e.currentTarget.style.borderColor = '#A100FF';
                  e.currentTarget.style.color = '#A100FF';
                }
              }}
              onMouseLeave={(e) => {
                if (!allRulesSaved && !showDeploymentAnimation) {
                  e.currentTarget.style.borderColor = '#404856';
                  e.currentTarget.style.color = '#F1F5F9';
                }
              }}
            >
              {showDeploymentAnimation ? '⟳ Deploying...' : allRulesSaved ? '✓ All Rules Saved' : 'Save All Rules'}
            </button>
            <button
              onClick={handleTestAll}
              disabled={testAllActive}
              style={{
                padding: '10px 16px',
                background: testAllActive ? '#404856' : '#2D3748',
                border: '1px solid #404856',
                borderRadius: '6px',
                color: '#F1F5F9',
                fontSize: '13px',
                fontWeight: '600',
                cursor: testAllActive ? 'default' : 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!testAllActive) {
                  e.currentTarget.style.borderColor = '#A100FF';
                  e.currentTarget.style.color = '#A100FF';
                }
              }}
              onMouseLeave={(e) => {
                if (!testAllActive) {
                  e.currentTarget.style.borderColor = '#404856';
                  e.currentTarget.style.color = '#F1F5F9';
                }
              }}
            >
              {testAllActive ? 'Testing All...' : 'Test All'}
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
            onMouseEnter={e => {
              e.currentTarget.style.background = '#8B00E0';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#A100FF';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Continue →
          </button>
        </div>
      )}
    </div>
  );
}
