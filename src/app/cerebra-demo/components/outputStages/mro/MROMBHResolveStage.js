'use client';

import { useState, useEffect, useRef } from 'react';

export default function MROMBHResolveStage({ onBack, onStageAction, onComplete }) {
  const [showHeader, setShowHeader] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showAudit, setShowAudit] = useState(false);
  const [showApproval, setShowApproval] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [revealedItems, setRevealedItems] = useState([]);
  const [expandedCause, setExpandedCause] = useState(null);
  const [executingAction, setExecutingAction] = useState(null);
  const [executedActions, setExecutedActions] = useState({});
  const [totalImpact, setTotalImpact] = useState(0);
  const [showSignature, setShowSignature] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [attachedEvidence, setAttachedEvidence] = useState({});
  const [escalationSent, setEscalationSent] = useState(false);
  const [showEscalationPanel, setShowEscalationPanel] = useState(false);
  const [showResolutionWorkflow, setShowResolutionWorkflow] = useState(false);
  const [resolutionSteps, setResolutionSteps] = useState([]);
  const [showComplianceCheck, setShowComplianceCheck] = useState(false);
  const [sapPostingSteps, setSapPostingSteps] = useState([]);
  const [resolutionSubmitted, setResolutionSubmitted] = useState(false);
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    setTimeout(() => setShowHeader(true), 200);
    setTimeout(() => setShowResults(true), 600);
    setTimeout(() => setShowActions(true), 1000);
    setTimeout(() => setShowResolutionWorkflow(true), 1400);
    setTimeout(() => setShowComplianceCheck(true), 1800);
    setTimeout(() => setShowAudit(true), 2200);
    setTimeout(() => setShowApproval(true), 2600);

    // Stagger item reveals
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        setRevealedItems(prev => [...prev, i]);
      }, 2800 + i * 80);
    }

    // Set animation complete
    setTimeout(() => {
      setAnimationComplete(true);
      if (!hasCompletedRef.current) {
        hasCompletedRef.current = true;
      }
    }, 3200);
  }, []);

  const rootCauses = [
    { id: 1, text: 'Flying hours under-reported for 3 aircraft (AC-042, AC-118, AC-205)', severity: 'critical', evidence: '5 supporting documents', details: 'Flight hours data mismatch between maintenance records and billing system. Aircraft utilization records show 124+112+88 = 324 additional flight hours not reflected in current billing cycle totaling $239,400 across 3 contracts.' },
    { id: 2, text: 'Contract Beta rate amendment not applied (Q3)', severity: 'critical', evidence: '3 supporting documents', details: 'Rate update from Q3 amendment was not applied to billing system. Effective rate: $1,000/hr vs billed $893/hr, affecting 112 flight hours on AC-118.' },
  ];

  const resolutionItems = [
    { id: 'DN-2024-0891', type: 'Debit Note', aircraft: 'AC-042', description: 'Flying hours adjustment (+124 hrs)', amount: 87400, status: 'pending' },
    { id: 'DN-2024-0892', type: 'Debit Note', aircraft: 'AC-118', description: 'Rate correction (Q3 amendment)', amount: 112000, status: 'pending' },
    { id: 'DN-2024-0893', type: 'Debit Note', aircraft: 'AC-205', description: 'Spare parts reconciliation', amount: 40600, status: 'pending' },
    { id: 'CM-2024-0156', type: 'Credit Memo', aircraft: 'MBH-Gen', description: 'Goodwill credit (late billing)', amount: 0, status: 'pending' },
  ];

  const resolutionActions = [
    { id: 'accrual', label: 'Adjust Accrual', amount: '$240K', description: 'Reconcile flying hours with utilisation data', impact: 240000 },
    { id: 'correction', label: 'Create SAP Entries', amount: 'DN+CM', description: 'Generate 3 debit notes + 1 credit memo', impact: 0 },
    { id: 'parameters', label: 'Customer Notification', amount: 'N/A', description: 'Updated invoice and billing terms', impact: 0 },
  ];

  const auditTrail = [
    { timestamp: '14:45:23', action: 'Investigation initiated', status: 'completed' },
    { timestamp: '14:47:10', action: 'Root cause analysis completed', status: 'completed' },
    { timestamp: '14:52:35', action: 'Resolution actions drafted', status: 'completed' },
    { timestamp: '14:58:22', action: 'Awaiting approval', status: 'pending' },
  ];

  const evidenceDetails = {
    1: ['Flight_Log_Archive_2024.pdf', 'Maintenance_Records_Fleet_Alpha.xlsx', 'Billing_Comparison_Report.docx', 'Aircraft_Utilization_Data.xlsx', 'Flight_Hours_Reconciliation.docx'],
    2: ['Rate_Amendment_Q3_2024.pdf', 'SAP_Contract_Terms.xlsx', 'Billing_Rate_Comparison.docx'],
  };

  const workflowSteps = [
    { step: 1, title: 'Identify Discrepancy', description: '$240K gap in Contract Beta billing', status: 'completed' },
    { step: 2, title: 'Root Cause Analysis', description: 'Flying hours under-reported for 3 aircraft', status: 'completed' },
    { step: 3, title: 'Generate Entries', description: '3 debit notes + 1 credit memo created', status: 'pending' },
    { step: 4, title: 'Post to SAP FI', description: 'Journal entries with document numbers', status: 'pending' },
    { step: 5, title: 'Customer Notify', description: 'Updated invoice + billing confirmation', status: 'pending' },
  ];

  const complianceItems = [
    { id: 'rev-rec', label: 'Revenue Recognition Rules', status: 'verified', detail: 'ASC 606 compliant - services delivered and performance obligations satisfied' },
    { id: 'audit', label: 'Audit Trail Complete', status: 'verified', detail: 'Full documentation trail from discrepancy identification to resolution posting' },
    { id: 'terms', label: 'Customer Terms Verified', status: 'verified', detail: 'Corrections align with MBH Contract Beta terms and rate schedules' },
  ];

  const handleExecuteAction = (actionId, actionAmount) => {
    setExecutingAction(actionId);

    setTimeout(() => {
      setExecutedActions(prev => ({
        ...prev,
        [actionId]: 'processing',
      }));
    }, 1000);

    setTimeout(() => {
      setExecutedActions(prev => ({
        ...prev,
        [actionId]: 'complete',
      }));
      setTotalImpact(prev => prev + actionAmount);
      setShowSignature(true);
    }, 2500);

    setTimeout(() => {
      setExecutingAction(null);
    }, 3500);
  };

  const handleSubmitResolution = () => {
    setSubmitting(true);

    const sapSteps = [
      { step: 'Creating debit note DN-2024-0891 in SAP FI...', status: 'processing' },
      { step: 'Posting journal entry JE-2024-4521...', status: 'pending' },
      { step: 'Updating customer account AR-CUST-042...', status: 'pending' },
      { step: 'Generating revised invoice INV-2024-0445...', status: 'pending' },
      { step: 'Recording audit trail in compliance module...', status: 'pending' },
    ];
    setSapPostingSteps(sapSteps);

    // Simulate SAP posting steps
    let stepIndex = 0;
    const stepInterval = setInterval(() => {
      if (stepIndex < sapSteps.length) {
        setSapPostingSteps(prev => {
          const updated = [...prev];
          if (stepIndex > 0) {
            updated[stepIndex - 1] = { ...updated[stepIndex - 1], status: 'completed' };
          }
          if (stepIndex < updated.length) {
            updated[stepIndex] = { ...updated[stepIndex], status: 'processing' };
          }
          return updated;
        });
        stepIndex++;
      } else {
        clearInterval(stepInterval);
        setTimeout(() => {
          setSubmitting(false);
          setResolutionSubmitted(true);
          setSapPostingSteps(prev => prev.map(s => ({ ...s, status: 'completed' })));
          onStageAction?.('Resolution submitted and posted to SAP FI — billing corrections applied, audit trail recorded');
        }, 500);
      }
    }, 800);
  };

  return (
    <div style={{ padding: '0', background: '#1a1a2e', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>

      {/* Header */}
      {showHeader && (
        <div style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          padding: '16px 20px',
          borderRadius: '8px 8px 0 0',
          borderBottom: '2px solid #8B5CF6',
          animation: 'fadeSlideUp 0.4s ease-out',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#8B5CF6',
              animation: 'pulse 1.5s infinite',
            }} />
            <span style={{
              color: '#8B5CF6',
              fontSize: '13px',
              fontWeight: '700',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}>
              Revenue Exception Resolution
            </span>
          </div>
          <div style={{ color: 'rgba(241,245,249,0.6)', fontSize: '11px' }}>
            MBH Contract Beta investigation and correction
          </div>
        </div>
      )}

      <div style={{ padding: '20px', flex: 1, overflow: 'auto' }}>
        {/* SAP Posting Visualization */}
        {sapPostingSteps.length > 0 && (
          <div style={{ marginBottom: '20px', animation: 'fadeSlideUp 0.4s ease-out' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#94A3B8', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              SAP FI Posting in Progress
            </div>
            <div style={{
              background: '#2D3748',
              border: '1px solid #404856',
              borderRadius: '6px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}>
              {sapPostingSteps.map((step, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 12px',
                  background: step.status === 'completed' ? 'rgba(16, 185, 129, 0.08)' : step.status === 'processing' ? 'rgba(139, 92, 246, 0.08)' : 'rgba(139, 92, 246, 0.04)',
                  border: `1px solid ${step.status === 'completed' ? '#10B981' : step.status === 'processing' ? '#8B5CF6' : '#404856'}`,
                  borderRadius: '4px',
                }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: step.status === 'completed' ? 'rgba(16, 185, 129, 0.2)' : step.status === 'processing' ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                    border: `2px solid ${step.status === 'completed' ? '#10B981' : step.status === 'processing' ? '#8B5CF6' : '#404856'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    color: step.status === 'completed' ? '#10B981' : step.status === 'processing' ? '#8B5CF6' : '#94A3B8',
                    flexShrink: 0,
                  }}>
                    {step.status === 'completed' ? '✓' : step.status === 'processing' ? '⟳' : ''}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: step.status === 'completed' ? '#10B981' : '#F1F5F9',
                    fontWeight: step.status === 'processing' ? '600' : '500',
                  }}>
                    {step.step}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Investigation Results */}
        {showResults && (
          <div style={{ marginBottom: '20px', animation: 'fadeSlideUp 0.4s ease-out' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#94A3B8', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Investigation Results
            </div>
            <div style={{
              background: '#2D3748',
              border: '1px solid #404856',
              borderRadius: '6px',
              padding: '16px',
              marginBottom: '16px',
            }}>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#8B5CF6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '700',
                  flexShrink: 0,
                }}>
                  ✓
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#F1F5F9', marginBottom: '4px' }}>
                    Root Cause Analysis Complete
                  </div>
                  <div style={{ fontSize: '11px', color: '#94A3B8' }}>
                    Revenue exception in MBH Contract Beta traced to data capture gaps
                  </div>
                </div>
              </div>

              {/* Root Causes List */}
              <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #404856' }}>
                <div style={{ fontSize: '11px', fontWeight: '600', color: '#94A3B8', marginBottom: '8px' }}>Root Causes:</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {rootCauses.map((cause, idx) => {
                    const isRevealed = revealedItems.includes(idx);
                    const isExpanded = expandedCause === cause.id;

                    return (
                      <div key={cause.id}>
                        <div
                          onClick={() => setExpandedCause(isExpanded ? null : cause.id)}
                          style={{
                            opacity: isRevealed ? 1 : 0,
                            transform: isRevealed ? 'translateX(0)' : 'translateX(-10px)',
                            transition: 'all 0.3s ease-out',
                            display: 'flex',
                            gap: '10px',
                            alignItems: 'flex-start',
                            padding: '10px 12px',
                            background: '#1a1a2e',
                            border: isExpanded ? '1px solid #8B5CF6' : '1px solid #404856',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={(e) => {
                            if (!isExpanded) {
                              e.currentTarget.style.borderColor = '#8B5CF6';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isExpanded) {
                              e.currentTarget.style.borderColor = '#404856';
                            }
                          }}
                        >
                          <div style={{
                            width: '5px',
                            height: '5px',
                            borderRadius: '50%',
                            background: '#EF4444',
                            marginTop: '4px',
                            flexShrink: 0,
                          }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '11px', color: '#F1F5F9', fontWeight: '600' }}>
                              {cause.text}
                            </div>
                            <div style={{ fontSize: '9px', color: '#94A3B8', marginTop: '2px' }}>
                              Evidence: {cause.evidence}
                            </div>
                          </div>
                          <div style={{ fontSize: '11px', color: '#94A3B8', flexShrink: 0 }}>
                            {isExpanded ? '▼' : '▶'}
                          </div>
                        </div>

                        {/* Expanded evidence detail */}
                        {isExpanded && (
                          <div style={{
                            background: 'rgba(139, 92, 246, 0.08)',
                            border: '1px solid #8B5CF6',
                            borderTop: 'none',
                            borderRadius: '0 0 4px 4px',
                            padding: '12px',
                            marginTop: '-1px',
                            animation: 'slideInRight 0.3s ease-out',
                          }}>
                            <div style={{ fontSize: '10px', fontWeight: '600', color: '#8B5CF6', marginBottom: '8px' }}>
                              DETAILED EVIDENCE
                            </div>
                            <div style={{ fontSize: '10px', color: '#F1F5F9', lineHeight: '1.5', marginBottom: '8px' }}>
                              {cause.details}
                            </div>
                            <div style={{ fontSize: '9px', color: '#94A3B8', marginBottom: '8px' }}>
                              Supporting Documents:
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              {evidenceDetails[cause.id]?.map((doc, docIdx) => (
                                <div key={docIdx} style={{
                                  padding: '6px 8px',
                                  background: '#1a1a2e',
                                  border: '1px solid #404856',
                                  borderRadius: '3px',
                                  fontSize: '9px',
                                  color: '#94A3B8',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                }}>
                                  <span style={{ color: '#8B5CF6' }}>📄</span>
                                  {doc}
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
            </div>
          </div>
        )}

        {/* Resolution Preparation Actions */}
        {showActions && (
          <div style={{ marginBottom: '20px', animation: 'fadeSlideUp 0.4s ease-out' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#94A3B8', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Preparation Steps
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
              {resolutionActions.map((action, idx) => {
                const isRevealed = revealedItems.includes(idx + 2);
                const isExecuting = executingAction === action.id;
                const isComplete = executedActions[action.id] === 'complete';
                const isProcessing = executedActions[action.id] === 'processing';

                return (
                  <div key={action.id}>
                    <div
                      onClick={() => !isExecuting && !isProcessing && handleExecuteAction(action.id, action.impact)}
                      style={{
                        opacity: isRevealed ? 1 : 0,
                        transform: isRevealed ? 'translateY(0)' : 'translateY(8px)',
                        transition: 'all 0.3s ease-out',
                        background: '#2D3748',
                        border: isComplete ? '1px solid #10B981' : '1px solid #404856',
                        borderRadius: '6px',
                        padding: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        cursor: isExecuting || isProcessing ? 'default' : 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (!isExecuting && !isProcessing && !isComplete) {
                          e.currentTarget.style.borderColor = '#8B5CF6';
                          e.currentTarget.style.background = '#3a3f4d';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isExecuting && !isProcessing && !isComplete) {
                          e.currentTarget.style.borderColor = '#404856';
                          e.currentTarget.style.background = '#2D3748';
                        }
                      }}
                    >
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: isComplete ? 'rgba(16, 185, 129, 0.2)' : '#8B5CF620',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isComplete ? '#10B981' : '#8B5CF6',
                        fontSize: '16px',
                        fontWeight: '700',
                        flexShrink: 0,
                      }}>
                        {isComplete ? '✓' : idx + 1}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '11px', fontWeight: '600', color: '#F1F5F9', marginBottom: '2px' }}>
                          {action.label}
                        </div>
                        <div style={{ fontSize: '10px', color: '#94A3B8' }}>
                          {action.description}
                        </div>
                      </div>
                      <div style={{
                        fontSize: '12px',
                        fontWeight: '700',
                        color: isComplete ? '#10B981' : '#8B5CF6',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                      }}>
                        {isExecuting ? 'Processing...' : isProcessing ? '⟳' : isComplete ? '✓ Ready' : action.amount}
                      </div>
                    </div>

                    {/* Execution status and evidence attachment */}
                    {(isExecuting || isProcessing || isComplete) && (
                      <div style={{
                        background: 'rgba(139, 92, 246, 0.08)',
                        border: '1px solid #8B5CF6',
                        borderTop: 'none',
                        borderRadius: '0 0 6px 6px',
                        padding: '12px',
                        marginTop: '-1px',
                        animation: 'slideInRight 0.3s ease-out',
                      }}>
                        {isComplete && (
                          <div style={{ marginBottom: '12px' }}>
                            <div style={{ fontSize: '10px', fontWeight: '600', color: '#10B981', marginBottom: '4px' }}>
                              ✓ Preparation Complete
                            </div>
                            <div style={{ fontSize: '10px', color: '#F1F5F9' }}>
                              {action.id === 'accrual' && '✓ Flying hours accrual reviewed - $240,000 total recovery'}
                              {action.id === 'correction' && '✓ 3 debit notes + 1 credit memo prepared for SAP FI posting'}
                              {action.id === 'parameters' && '✓ Customer notification documents ready for transmission'}
                            </div>
                          </div>
                        )}
                        <button
                          onClick={() => setAttachedEvidence(prev => ({
                            ...prev,
                            [action.id]: !prev[action.id],
                          }))}
                          style={{
                            padding: '6px 12px',
                            background: '#2D3748',
                            border: '1px solid #404856',
                            borderRadius: '3px',
                            color: '#8B5CF6',
                            fontSize: '10px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#8B5CF6';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#404856';
                          }}
                        >
                          {attachedEvidence[action.id] ? '✓ Evidence Attached' : '+ Attach Evidence'}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Total Impact Running Total */}
            {totalImpact > 0 && (
              <div style={{
                background: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid #8B5CF6',
                borderRadius: '6px',
                padding: '12px',
                animation: 'slideInRight 0.3s ease-out',
              }}>
                <div style={{ fontSize: '10px', fontWeight: '600', color: '#94A3B8', marginBottom: '4px' }}>
                  TOTAL FINANCIAL IMPACT
                </div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#10B981' }}>
                  ${totalImpact.toLocaleString()}
                </div>
                <div style={{ fontSize: '9px', color: '#94A3B8', marginTop: '4px' }}>
                  Cumulative financial correction applied
                </div>
              </div>
            )}
          </div>
        )}

        {/* Digital Approval Signature */}
        {showSignature && (
          <div style={{
            background: 'rgba(139, 92, 246, 0.08)',
            border: '1px solid #8B5CF6',
            borderRadius: '6px',
            padding: '16px',
            marginBottom: '20px',
            animation: 'fadeSlideUp 0.4s ease-out',
          }}>
            <div style={{ fontSize: '11px', fontWeight: '600', color: '#8B5CF6', marginBottom: '12px' }}>
              DIGITAL APPROVAL
            </div>
            <div style={{
              display: 'flex',
              gap: '12px',
              padding: '12px',
              background: '#1a1a2e',
              border: '1px solid #404856',
              borderRadius: '4px',
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(139, 92, 246, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#8B5CF6',
                fontSize: '18px',
                flexShrink: 0,
              }}>
                ✍
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '11px', fontWeight: '600', color: '#F1F5F9', marginBottom: '2px' }}>
                  Approved by: System Automation
                </div>
                <div style={{ fontSize: '9px', color: '#94A3B8' }}>
                  Digital Signature: SA-MBH-2024-021847 | {new Date().toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Resolution Workflow */}
        {showResolutionWorkflow && (
          <div style={{ marginBottom: '20px', animation: 'fadeSlideUp 0.4s ease-out' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#94A3B8', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Resolution Workflow
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {workflowSteps.map((step, idx) => (
                <div key={step.step} style={{ display: 'flex', gap: '12px' }}>
                  {/* Step Circle */}
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: step.status === 'completed' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(139, 92, 246, 0.2)',
                    border: `2px solid ${step.status === 'completed' ? '#10B981' : '#8B5CF6'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: step.status === 'completed' ? '#10B981' : '#8B5CF6',
                    fontSize: '14px',
                    fontWeight: '700',
                    flexShrink: 0,
                  }}>
                    {step.status === 'completed' ? '✓' : step.step}
                  </div>

                  {/* Step Content */}
                  <div style={{ flex: 1, paddingTop: '2px' }}>
                    <div style={{ fontSize: '11px', fontWeight: '600', color: '#F1F5F9', marginBottom: '2px' }}>
                      Step {step.step}: {step.title}
                    </div>
                    <div style={{ fontSize: '10px', color: '#94A3B8' }}>
                      {step.description}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div style={{
                    padding: '4px 8px',
                    background: step.status === 'completed' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(139, 92, 246, 0.15)',
                    border: `1px solid ${step.status === 'completed' ? '#10B981' : '#8B5CF6'}`,
                    borderRadius: '3px',
                    fontSize: '9px',
                    fontWeight: '600',
                    color: step.status === 'completed' ? '#10B981' : '#8B5CF6',
                    textTransform: 'capitalize',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}>
                    {step.status}
                  </div>

                  {/* Connector Line */}
                  {idx < workflowSteps.length - 1 && (
                    <div style={{
                      position: 'absolute',
                      left: '67px',
                      width: '2px',
                      height: '30px',
                      background: 'rgba(139, 92, 246, 0.3)',
                      marginTop: '32px',
                    }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resolution Items Table */}
        {showResolutionWorkflow && (
          <div style={{ marginBottom: '20px', animation: 'fadeSlideUp 0.4s ease-out' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#94A3B8', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Resolution Items (SAP FI Documents)
            </div>
            <div style={{
              background: '#2D3748',
              border: '1px solid #404856',
              borderRadius: '6px',
              overflow: 'hidden',
            }}>
              {/* Table Header */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '120px 100px 100px 100px 80px',
                gap: '12px',
                padding: '12px 14px',
                background: 'rgba(139, 92, 246, 0.1)',
                borderBottom: '1px solid #404856',
                fontSize: '10px',
                fontWeight: '700',
                color: '#8B5CF6',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                <div>Document</div>
                <div>Type</div>
                <div>Aircraft/Account</div>
                <div>Description</div>
                <div>Amount</div>
              </div>

              {/* Table Rows */}
              {resolutionItems.map((item, idx) => (
                <div
                  key={item.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '120px 100px 100px 100px 80px',
                    gap: '12px',
                    padding: '12px 14px',
                    borderBottom: idx < resolutionItems.length - 1 ? '1px solid #404856' : 'none',
                    alignItems: 'center',
                    fontSize: '10px',
                  }}
                >
                  <div style={{ color: '#8B5CF6', fontWeight: '600' }}>{item.id}</div>
                  <div style={{
                    color: item.type === 'Debit Note' ? '#EF4444' : '#10B981',
                    fontWeight: '600',
                  }}>
                    {item.type}
                  </div>
                  <div style={{ color: '#F1F5F9' }}>{item.aircraft}</div>
                  <div style={{ color: '#94A3B8' }}>{item.description}</div>
                  <div style={{
                    color: item.type === 'Debit Note' ? '#10B981' : '#94A3B8',
                    fontWeight: '600',
                  }}>
                    {item.type === 'Debit Note' ? '+' : ''} ${item.amount.toLocaleString()}
                  </div>
                </div>
              ))}

              {/* Total Row */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '120px 100px 100px 100px 80px',
                gap: '12px',
                padding: '12px 14px',
                background: 'rgba(139, 92, 246, 0.15)',
                borderTop: '2px solid #8B5CF6',
                fontSize: '11px',
                fontWeight: '700',
                color: '#8B5CF6',
              }}>
                <div />
                <div />
                <div />
                <div style={{ color: '#F1F5F9' }}>TOTAL RECOVERY</div>
                <div style={{ color: '#10B981' }}>$240,000</div>
              </div>
            </div>

            {/* Before/After Comparison */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginTop: '12px',
            }}>
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid #EF4444',
                borderRadius: '6px',
                padding: '12px',
              }}>
                <div style={{ fontSize: '10px', fontWeight: '600', color: '#EF4444', marginBottom: '6px' }}>
                  BEFORE
                </div>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#F1F5F9', marginBottom: '4px' }}>
                  Billing Amount
                </div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#EF4444' }}>
                  $2,760,000
                </div>
                <div style={{ fontSize: '9px', color: '#94A3B8', marginTop: '4px' }}>
                  Actual contract value with gaps
                </div>
              </div>

              <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid #10B981',
                borderRadius: '6px',
                padding: '12px',
              }}>
                <div style={{ fontSize: '10px', fontWeight: '600', color: '#10B981', marginBottom: '6px' }}>
                  AFTER
                </div>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#F1F5F9', marginBottom: '4px' }}>
                  Corrected Amount
                </div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#10B981' }}>
                  $3,000,000
                </div>
                <div style={{ fontSize: '9px', color: '#94A3B8', marginTop: '4px' }}>
                  Full contract value realized
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Compliance Check */}
        {showComplianceCheck && (
          <div style={{ marginBottom: '20px', animation: 'fadeSlideUp 0.4s ease-out' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#94A3B8', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Compliance Verification
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {complianceItems.map((item) => (
                <div key={item.id} style={{
                  background: '#2D3748',
                  border: '1px solid #10B981',
                  borderRadius: '6px',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: 'rgba(16, 185, 129, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#10B981',
                    fontSize: '12px',
                    fontWeight: '700',
                    flexShrink: 0,
                  }}>
                    ✓
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '11px', fontWeight: '600', color: '#F1F5F9', marginBottom: '2px' }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: '10px', color: '#94A3B8' }}>
                      {item.detail}
                    </div>
                  </div>
                  <div style={{
                    padding: '4px 8px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid #10B981',
                    borderRadius: '3px',
                    fontSize: '9px',
                    fontWeight: '600',
                    color: '#10B981',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}>
                    {item.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Audit Trail */}
        {showAudit && (
          <div style={{ marginBottom: '20px', animation: 'fadeSlideUp 0.4s ease-out' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#94A3B8', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Audit Trail
            </div>
            <div style={{ background: '#2D3748', border: '1px solid #404856', borderRadius: '6px', overflow: 'hidden' }}>
              {auditTrail.map((entry, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '12px 14px',
                    borderBottom: idx < auditTrail.length - 1 ? '1px solid #404856' : 'none',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                  }}
                >
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: entry.status === 'completed' ? '#10B981' : '#F59E0B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '10px',
                    fontWeight: '700',
                    flexShrink: 0,
                    marginTop: '2px',
                  }}>
                    {entry.status === 'completed' ? '✓' : '⌛'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '11px', fontWeight: '600', color: '#F1F5F9' }}>
                      {entry.action}
                    </div>
                    <div style={{ fontSize: '9px', color: '#94A3B8', marginTop: '2px' }}>
                      {entry.timestamp}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Approval Section */}
        {showApproval && (
          <div style={{ animation: 'fadeSlideUp 0.4s ease-out' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#94A3B8', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Approval Status
            </div>
            <div style={{
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid #8B5CF6',
              borderRadius: '6px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(139, 92, 246, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#8B5CF6',
                fontSize: '18px',
                fontWeight: '700',
                flexShrink: 0,
              }}>
                ✓
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#F1F5F9', marginBottom: '2px' }}>
                  Ready for SAP FI Posting
                </div>
                <div style={{ fontSize: '10px', color: '#94A3B8' }}>
                  3 debit notes + 1 credit memo prepared. Total recovery: $240,000. Compliance verified ✓
                </div>
              </div>
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
          <div style={{ display: 'flex', gap: '8px', position: 'relative' }}>
            <button
              onClick={() => {
                setEscalationSent(true);
                setShowEscalationPanel(true);
                onStageAction?.({ type: 'escalation_sent', escalatedTo: 'CFO', routingPath: 'Revenue Accounting → Finance Director → CFO', financialImpact: totalImpact || 240000 });
                setTimeout(() => setShowEscalationPanel(false), 4500);
              }}
              style={{
                padding: '10px 16px',
                background: escalationSent ? '#8B5CF6' : '#2D3748',
                border: '1px solid ' + (escalationSent ? '#8B5CF6' : '#404856'),
                borderRadius: '6px',
                color: '#F1F5F9',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!escalationSent) {
                  e.currentTarget.style.borderColor = '#8B5CF6';
                  e.currentTarget.style.color = '#8B5CF6';
                }
              }}
              onMouseLeave={(e) => {
                if (!escalationSent) {
                  e.currentTarget.style.borderColor = '#404856';
                  e.currentTarget.style.color = '#F1F5F9';
                }
              }}
            >
              {escalationSent ? '✓ Escalated' : 'Escalate'}
            </button>
            {showEscalationPanel && (
              <div style={{
                position: 'absolute',
                bottom: '45px',
                right: '0',
                background: '#16213e',
                border: '2px solid #8B5CF6',
                borderRadius: '8px',
                padding: '14px',
                minWidth: '240px',
                zIndex: 100,
                animation: 'fadeSlideUp 0.3s ease-out',
                boxShadow: '0 4px 16px rgba(139,92,246,0.3)',
              }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#8B5CF6', marginBottom: '10px' }}>
                  Escalation Routing
                </div>
                <div style={{ fontSize: '10px', color: '#F1F5F9', marginBottom: '8px', lineHeight: '1.6' }}>
                  Revenue Accounting
                  <div style={{ fontSize: '9px', color: '#94A3B8', marginLeft: '12px' }}>↓</div>
                  Finance Director
                  <div style={{ fontSize: '9px', color: '#94A3B8', marginLeft: '12px' }}>↓</div>
                  CFO (Final Approval)
                </div>
                <div style={{ fontSize: '9px', color: '#94A3B8', marginBottom: '8px', paddingTop: '8px', borderTop: '1px solid #404856' }}>
                  Financial Impact: ${(totalImpact || 240000).toLocaleString()}
                </div>
                <div style={{ fontSize: '9px', color: '#10B981', fontWeight: '600' }}>
                  ✓ Escalation notification sent
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleSubmitResolution}
              disabled={submitting}
              style={{
                padding: '10px 24px',
                background: '#8B5CF6',
                border: 'none',
                borderRadius: '6px',
                color: 'white',
                fontSize: '13px',
                fontWeight: '600',
                cursor: submitting ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(139,92,246,0.3)',
              }}
              onMouseEnter={e => {
                if (!submitting) {
                  e.currentTarget.style.background = '#7C3AED';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={e => {
                if (!submitting) {
                  e.currentTarget.style.background = '#8B5CF6';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              {submitting ? 'Writing to SAP...' : 'Submit Resolution →'}
            </button>

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
        </div>
      )}
    </div>
  );
}
