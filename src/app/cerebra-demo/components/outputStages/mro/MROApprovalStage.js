'use client';

import { useState, useEffect, useRef } from 'react';
import { mroApprovalQueue } from '../../../data/mro/mroActionPackData';

// Enterprise approval chain configuration
const APPROVAL_CHAIN = [
  { id: 1, name: 'Sarah Chen', role: 'Material Planner', initials: 'SC' },
  { id: 2, name: 'James Mitchell', role: 'Engineering Lead', initials: 'JM' },
  { id: 3, name: 'Robert Davis', role: 'Operations Manager', initials: 'RD' },
  { id: 4, name: 'Victoria Martinez', role: 'VP Supply Chain', initials: 'VM' },
];

const APPROVAL_ITEMS = [
  { id: 'po-8837', title: 'PO Expedite', reference: 'PO-8837', vendor: 'Parts Corp', cost: 4200, status: 'auto-approved', approver: 'System' },
  { id: 'pt-3391', title: 'Part Transfer', reference: 'PN-3391', location: 'Hub East Pool', status: 'approved', approver: 'Sarah Chen' },
  { id: 'ew-7742a', title: 'Engineering Waiver', reference: 'PN-7742A', reason: 'Alternate approval', status: 'pending', approver: 'James Mitchell' },
  { id: 'so-55', title: 'Schedule Override', reference: 'WP-55', action: 'Task resequencing', status: 'approved', approver: 'Robert Davis' },
];

const COMPLIANCE_CHECKS = [
  { id: 1, name: 'SOX Compliance', status: true },
  { id: 2, name: 'Airworthiness Directive', status: true },
  { id: 3, name: 'Customer Contract Terms', status: true },
];

const REJECTION_REASONS = [
  'Budget exceeded',
  'Risk too high',
  'Alternative preferred',
  'Needs more info',
];

const ESCALATION_ROUTING = [
  { id: 1, title: 'VP Supply Chain', name: 'Victoria Martinez' },
  { id: 2, title: 'CFO', name: 'Michael Torres' },
];

export default function MROApprovalStage({ onBack, onStageAction, onComplete }) {
  const [showHeader, setShowHeader] = useState(false);
  const [showApprovalChain, setShowApprovalChain] = useState(false);
  const [approvalChainStatus, setApprovalChainStatus] = useState({});
  const [approvalItemsVisible, setApprovalItemsVisible] = useState(false);
  const [writeBackItems, setWriteBackItems] = useState({});
  const [allApprovalsComplete, setAllApprovalsComplete] = useState(false);
  const [showContinueButton, setShowContinueButton] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showEscalationModal, setShowEscalationModal] = useState(false);
  const [escalationReason, setEscalationReason] = useState('');
  const [selectedEscalationTarget, setSelectedEscalationTarget] = useState(0);

  useEffect(() => {
    // Show header
    setTimeout(() => setShowHeader(true), 200);

    // Show approval chain
    setTimeout(() => setShowApprovalChain(true), 800);

    // Cascade approvals through chain (1.5s delays)
    APPROVAL_CHAIN.forEach((approver, idx) => {
      setTimeout(() => {
        setApprovalChainStatus(prev => ({
          ...prev,
          [approver.id]: { status: 'approved', timestamp: new Date().toLocaleTimeString() },
        }));
      }, 1500 + idx * 1500);
    });

    // Show approval items table
    setTimeout(() => setApprovalItemsVisible(true), 2000);

    // Auto-trigger write-back animations after all approvals
    setTimeout(() => {
      setAllApprovalsComplete(true);
      triggerWriteBack();
    }, 1500 + APPROVAL_CHAIN.length * 1500 + 800);
  }, []);

  const triggerWriteBack = () => {
    const writeBackSequence = [
      { id: 1, label: 'Posting to SAP MM', delay: 0 },
      { id: 2, label: 'Updating work order in SAP PM', delay: 1500 },
      { id: 3, label: 'Triggering vendor notification', delay: 3000 },
      { id: 4, label: 'Recording audit trail', delay: 4500 },
    ];

    writeBackSequence.forEach(item => {
      setTimeout(() => {
        setWriteBackItems(prev => ({ ...prev, [item.id]: true }));
      }, item.delay);
    });

    // Show continue button after all write-back items
    setTimeout(() => {
      setShowContinueButton(true);
    }, 6000);
  };

  const getTotalCost = () => APPROVAL_ITEMS.reduce((sum, item) => sum + (item.cost || 0), 0);
  const getBudget = () => 10000;
  const getApprovedCount = () => Object.values(approvalChainStatus).filter(a => a.status === 'approved').length;
  const isWithinBudget = () => getTotalCost() <= getBudget();

  const handleApproveAll = () => {
    const pendingApprovals = APPROVAL_CHAIN.filter(a => !approvalChainStatus[a.id]);
    pendingApprovals.forEach((approver, idx) => {
      setTimeout(() => {
        setApprovalChainStatus(prev => ({
          ...prev,
          [approver.id]: { status: 'approved', timestamp: new Date().toLocaleTimeString() },
        }));
      }, 500 + idx * 500);
    });

    setTimeout(() => {
      setAllApprovalsComplete(true);
      triggerWriteBack();
    }, 500 + pendingApprovals.length * 500 + 500);
  };

  const handleReject = () => {
    if (!rejectionReason) return;
    onStageAction?.({ type: 'approval_rejected', reason: rejectionReason });
    setShowRejectionModal(false);
    setRejectionReason('');
  };

  const handleEscalate = () => {
    if (!escalationReason) return;
    const target = ESCALATION_ROUTING[selectedEscalationTarget];
    onStageAction?.({ type: 'approval_escalated', escalatedTo: target.title, name: target.name, reason: escalationReason });
    setShowEscalationModal(false);
    setEscalationReason('');
  };

  return (
    <div style={{ padding: '0', background: '#1a1a2e', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideLeft { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }
        @keyframes checkmark {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        @keyframes progressFill {
          from { width: 0; }
          to { width: 100%; }
        }
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
              Approval Workflow
            </span>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', marginTop: '4px' }}>
            Actions ready for approval from authorized signers
          </div>
        </div>
      )}

      <div style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
        {/* Enterprise Approval Chain */}
        {showApprovalChain && (
          <div style={{
            animation: 'fadeSlideUp 0.5s ease-out',
            background: '#16213e',
            border: '2px solid #A100FF',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px',
          }}>
            <div style={{
              fontSize: '13px',
              fontWeight: '700',
              color: '#A100FF',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#A100FF',
                animation: 'pulse 1.5s infinite',
              }} />
              APPROVAL ROUTING CHAIN
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'stretch',
              gap: '12px',
              overflowX: 'auto',
              paddingBottom: '8px',
            }}>
              {APPROVAL_CHAIN.map((approver, idx) => {
                const isApproved = approvalChainStatus[approver.id];
                const delay = 1.5 + idx * 1.5;
                return (
                  <div
                    key={approver.id}
                    style={{
                      flex: '0 0 auto',
                      minWidth: '160px',
                      animation: showApprovalChain ? `fadeSlideUp 0.5s ease-out ${delay}s both` : 'none',
                    }}
                  >
                    <div style={{
                      background: isApproved ? 'rgba(16,185,129,0.15)' : 'rgba(45,55,72,0.5)',
                      border: `2px solid ${isApproved ? '#10B981' : '#4A5568'}`,
                      borderRadius: '10px',
                      padding: '12px',
                      textAlign: 'center',
                      transition: 'all 0.4s ease',
                    }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        background: isApproved ? '#10B981' : '#2D3748',
                        border: `2px solid ${isApproved ? '#10B981' : '#4A5568'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 10px',
                        fontSize: '18px',
                        fontWeight: '700',
                        color: isApproved ? 'white' : '#94A3B8',
                        animation: isApproved ? 'checkmark 0.5s ease-out' : 'none',
                      }}>
                        {isApproved ? '✓' : approver.initials}
                      </div>
                      <div style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        color: '#F1F5F9',
                        marginBottom: '4px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {approver.name}
                      </div>
                      <div style={{
                        fontSize: '9px',
                        color: isApproved ? '#10B981' : '#94A3B8',
                        marginBottom: '6px',
                      }}>
                        {approver.role}
                      </div>
                      <div style={{
                        fontSize: '8px',
                        color: isApproved ? '#10B981' : '#6B7280',
                        fontWeight: '600',
                      }}>
                        {isApproved ? (
                          <>
                            {isApproved.status}
                            <div style={{ marginTop: '2px', fontSize: '7px' }}>
                              {isApproved.timestamp}
                            </div>
                          </>
                        ) : (
                          '⏳ Pending'
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Approval Items Table */}
        {approvalItemsVisible && (
          <div style={{
            animation: 'fadeSlideUp 0.5s ease-out',
            background: '#16213e',
            border: '1px solid #2D3748',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
            overflow: 'x-auto',
          }}>
            <div style={{
              fontSize: '12px',
              fontWeight: '700',
              color: '#F1F5F9',
              marginBottom: '12px',
            }}>
              Items Under Approval
            </div>
            <div style={{
              overflowX: 'auto',
              borderRadius: '8px',
              border: '1px solid #2D3748',
            }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '11px',
              }}>
                <thead>
                  <tr style={{
                    background: 'rgba(161,0,255,0.1)',
                    borderBottom: '2px solid #A100FF',
                  }}>
                    <th style={{
                      padding: '10px 12px',
                      textAlign: 'left',
                      fontWeight: '700',
                      color: '#A100FF',
                      whiteSpace: 'nowrap',
                    }}>
                      Item
                    </th>
                    <th style={{
                      padding: '10px 12px',
                      textAlign: 'left',
                      fontWeight: '700',
                      color: '#A100FF',
                      whiteSpace: 'nowrap',
                    }}>
                      Reference
                    </th>
                    <th style={{
                      padding: '10px 12px',
                      textAlign: 'left',
                      fontWeight: '700',
                      color: '#A100FF',
                      whiteSpace: 'nowrap',
                    }}>
                      Details
                    </th>
                    <th style={{
                      padding: '10px 12px',
                      textAlign: 'right',
                      fontWeight: '700',
                      color: '#A100FF',
                      whiteSpace: 'nowrap',
                    }}>
                      Cost
                    </th>
                    <th style={{
                      padding: '10px 12px',
                      textAlign: 'left',
                      fontWeight: '700',
                      color: '#A100FF',
                      whiteSpace: 'nowrap',
                    }}>
                      Status
                    </th>
                    <th style={{
                      padding: '10px 12px',
                      textAlign: 'left',
                      fontWeight: '700',
                      color: '#A100FF',
                      whiteSpace: 'nowrap',
                    }}>
                      Approver
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {APPROVAL_ITEMS.map((item, idx) => (
                    <tr
                      key={item.id}
                      style={{
                        borderBottom: '1px solid #2D3748',
                        background: idx % 2 === 0 ? 'transparent' : 'rgba(45,55,72,0.3)',
                        animation: approvalItemsVisible ? `fadeSlideUp 0.4s ease-out ${0.1 + idx * 0.1}s both` : 'none',
                      }}
                    >
                      <td style={{ padding: '10px 12px', color: '#F1F5F9', fontWeight: '600' }}>
                        {item.title}
                      </td>
                      <td style={{ padding: '10px 12px', color: '#94A3B8', fontFamily: 'monospace' }}>
                        {item.reference}
                      </td>
                      <td style={{ padding: '10px 12px', color: '#94A3B8' }}>
                        {item.vendor || item.location || item.reason || item.action}
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'right', color: '#EF4444', fontWeight: '600' }}>
                        {item.cost ? `$${item.cost.toLocaleString()}` : '—'}
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          background: item.status === 'approved' ? 'rgba(16,185,129,0.2)' : item.status === 'auto-approved' ? 'rgba(59,130,246,0.2)' : 'rgba(148,163,184,0.2)',
                          color: item.status === 'approved' ? '#10B981' : item.status === 'auto-approved' ? '#3B82F6' : '#94A3B8',
                          fontWeight: '600',
                          fontSize: '10px',
                        }}>
                          {item.status === 'approved' ? '✓ Approved' : item.status === 'auto-approved' ? '✓ Auto-approved' : '⏳ Pending'}
                        </div>
                      </td>
                      <td style={{ padding: '10px 12px', color: '#F1F5F9' }}>
                        {item.approver}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Cost Summary & Budget Check */}
        {approvalItemsVisible && (
          <div style={{
            animation: 'fadeSlideUp 0.5s ease-out 0.2s both',
            background: '#16213e',
            border: `2px solid ${isWithinBudget() ? '#10B981' : '#EF4444'}`,
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
          }}>
            <div>
              <div style={{ fontSize: '10px', fontWeight: '700', color: '#94A3B8', marginBottom: '4px' }}>
                TOTAL BUDGET
              </div>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#A100FF' }}>
                ${getBudget().toLocaleString()}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '10px', fontWeight: '700', color: '#94A3B8', marginBottom: '4px' }}>
                REQUESTED TOTAL
              </div>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#EF4444' }}>
                ${getTotalCost().toLocaleString()}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '10px', fontWeight: '700', color: '#94A3B8', marginBottom: '4px' }}>
                REMAINING BUDGET
              </div>
              <div style={{
                fontSize: '18px',
                fontWeight: '700',
                color: isWithinBudget() ? '#10B981' : '#EF4444',
              }}>
                ${(getBudget() - getTotalCost()).toLocaleString()}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '10px', fontWeight: '700', color: '#94A3B8', marginBottom: '4px' }}>
                STATUS
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '14px',
                fontWeight: '700',
              }}>
                <span style={{ color: isWithinBudget() ? '#10B981' : '#EF4444' }}>
                  {isWithinBudget() ? '✓ Within budget' : '✗ Over budget'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Compliance Checks */}
        {approvalItemsVisible && (
          <div style={{
            animation: 'fadeSlideUp 0.5s ease-out 0.3s both',
            background: '#16213e',
            border: '1px solid #2D3748',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
          }}>
            <div style={{
              fontSize: '12px',
              fontWeight: '700',
              color: '#F1F5F9',
              marginBottom: '12px',
            }}>
              Compliance Verification
            </div>
            <div style={{ display: 'grid', gap: '10px' }}>
              {COMPLIANCE_CHECKS.map(check => (
                <div
                  key={check.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px',
                    background: check.status ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                    borderRadius: '6px',
                    border: `1px solid ${check.status ? '#10B981' : '#EF4444'}`,
                  }}
                >
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '4px',
                    background: check.status ? '#10B981' : '#EF4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: '700',
                    flexShrink: 0,
                  }}>
                    {check.status ? '✓' : '✗'}
                  </div>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    color: check.status ? '#10B981' : '#EF4444',
                  }}>
                    {check.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Write-Back Status */}
        {allApprovalsComplete && (
          <div style={{
            animation: 'fadeSlideUp 0.5s ease-out',
            background: 'rgba(16,185,129,0.1)',
            border: '2px solid #10B981',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
          }}>
            <div style={{
              fontSize: '12px',
              fontWeight: '700',
              color: '#10B981',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#10B981',
                animation: 'pulse 1.5s infinite',
              }} />
              SYSTEM WRITE-BACK EXECUTION
            </div>
            <div style={{ display: 'grid', gap: '8px' }}>
              {[
                { id: 1, label: 'Posting to SAP MM' },
                { id: 2, label: 'Updating work order in SAP PM' },
                { id: 3, label: 'Triggering vendor notification' },
                { id: 4, label: 'Recording audit trail' },
              ].map(item => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px',
                    background: writeBackItems[item.id] ? 'rgba(16,185,129,0.1)' : 'rgba(45,55,72,0.5)',
                    borderRadius: '6px',
                    border: `1px solid ${writeBackItems[item.id] ? '#10B981' : '#4A5568'}`,
                    animation: writeBackItems[item.id] ? 'fadeSlideUp 0.4s ease-out' : 'none',
                  }}
                >
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '4px',
                    background: writeBackItems[item.id] ? '#10B981' : '#2D3748',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: '700',
                    flexShrink: 0,
                    animation: writeBackItems[item.id] ? 'checkmark 0.5s ease-out' : 'none',
                  }}>
                    {writeBackItems[item.id] ? '✓' : '⊙'}
                  </div>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    color: writeBackItems[item.id] ? '#10B981' : '#94A3B8',
                  }}>
                    {item.label}
                  </span>
                  {writeBackItems[item.id] && (
                    <span style={{
                      fontSize: '9px',
                      color: '#10B981',
                      marginLeft: 'auto',
                    }}>
                      ✓
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Rejection Modal */}
      {showRejectionModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          animation: 'fadeIn 0.2s ease-out',
        }}>
          <div style={{
            background: '#1a1a2e',
            border: '2px solid #EF4444',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '400px',
            animation: 'scaleIn 0.3s ease-out',
          }}>
            <div style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#F1F5F9',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <div style={{ color: '#EF4444' }}>✗</div>
              Reject Approval
            </div>
            <div style={{
              fontSize: '11px',
              color: '#94A3B8',
              marginBottom: '16px',
              lineHeight: '1.5',
            }}>
              Please select a reason for rejecting this approval request.
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                fontSize: '10px',
                fontWeight: '700',
                color: '#94A3B8',
                display: 'block',
                marginBottom: '8px',
                textTransform: 'uppercase',
              }}>
                Rejection Reason
              </label>
              <select
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: '#16213e',
                  border: '1px solid #2D3748',
                  borderRadius: '6px',
                  color: '#F1F5F9',
                  fontSize: '11px',
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                }}
              >
                <option value="">Select a reason...</option>
                {REJECTION_REASONS.map((reason, idx) => (
                  <option key={idx} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                fontSize: '10px',
                fontWeight: '700',
                color: '#94A3B8',
                display: 'block',
                marginBottom: '8px',
                textTransform: 'uppercase',
              }}>
                Additional Notes
              </label>
              <textarea
                placeholder="Provide additional context..."
                style={{
                  width: '100%',
                  minHeight: '80px',
                  padding: '10px 12px',
                  background: '#16213e',
                  border: '1px solid #2D3748',
                  borderRadius: '6px',
                  color: '#F1F5F9',
                  fontSize: '11px',
                  fontFamily: 'inherit',
                  resize: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{
              display: 'flex',
              gap: '8px',
            }}>
              <button
                onClick={() => {
                  setShowRejectionModal(false);
                  setRejectionReason('');
                }}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  background: '#16213e',
                  border: '1px solid #2D3748',
                  borderRadius: '6px',
                  color: '#F1F5F9',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#4A5568';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#2D3748';
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectionReason}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  background: rejectionReason ? '#EF4444' : '#6B7280',
                  border: 'none',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: rejectionReason ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease',
                  opacity: rejectionReason ? 1 : 0.5,
                }}
                onMouseEnter={(e) => {
                  if (rejectionReason) {
                    e.currentTarget.style.background = '#DC2626';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (rejectionReason) {
                    e.currentTarget.style.background = '#EF4444';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Escalation Modal */}
      {showEscalationModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          animation: 'fadeIn 0.2s ease-out',
        }}>
          <div style={{
            background: '#1a1a2e',
            border: '2px solid #A100FF',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '400px',
            animation: 'scaleIn 0.3s ease-out',
          }}>
            <div style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#F1F5F9',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <div style={{ color: '#A100FF' }}>⬆</div>
              Escalate Approval
            </div>
            <div style={{
              fontSize: '11px',
              color: '#94A3B8',
              marginBottom: '16px',
              lineHeight: '1.5',
            }}>
              Escalate this approval request to a higher authority.
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                fontSize: '10px',
                fontWeight: '700',
                color: '#94A3B8',
                display: 'block',
                marginBottom: '8px',
                textTransform: 'uppercase',
              }}>
                Escalate To
              </label>
              <div style={{ display: 'grid', gap: '8px' }}>
                {ESCALATION_ROUTING.map((target, idx) => (
                  <label
                    key={target.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 12px',
                      background: selectedEscalationTarget === idx ? 'rgba(161,0,255,0.2)' : '#16213e',
                      border: `2px solid ${selectedEscalationTarget === idx ? '#A100FF' : '#2D3748'}`,
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (selectedEscalationTarget !== idx) {
                        e.currentTarget.style.borderColor = '#4A5568';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedEscalationTarget !== idx) {
                        e.currentTarget.style.borderColor = '#2D3748';
                      }
                    }}
                  >
                    <input
                      type="radio"
                      name="escalation"
                      checked={selectedEscalationTarget === idx}
                      onChange={() => setSelectedEscalationTarget(idx)}
                      style={{
                        cursor: 'pointer',
                        width: '16px',
                        height: '16px',
                        accentColor: '#A100FF',
                      }}
                    />
                    <div>
                      <div style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        color: '#F1F5F9',
                      }}>
                        {target.title}
                      </div>
                      <div style={{
                        fontSize: '9px',
                        color: '#94A3B8',
                      }}>
                        {target.name}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                fontSize: '10px',
                fontWeight: '700',
                color: '#94A3B8',
                display: 'block',
                marginBottom: '8px',
                textTransform: 'uppercase',
              }}>
                Escalation Reason
              </label>
              <textarea
                value={escalationReason}
                onChange={(e) => setEscalationReason(e.target.value)}
                placeholder="Explain why this requires escalation..."
                style={{
                  width: '100%',
                  minHeight: '80px',
                  padding: '10px 12px',
                  background: '#16213e',
                  border: '1px solid #2D3748',
                  borderRadius: '6px',
                  color: '#F1F5F9',
                  fontSize: '11px',
                  fontFamily: 'inherit',
                  resize: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{
              display: 'flex',
              gap: '8px',
            }}>
              <button
                onClick={() => {
                  setShowEscalationModal(false);
                  setEscalationReason('');
                }}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  background: '#16213e',
                  border: '1px solid #2D3748',
                  borderRadius: '6px',
                  color: '#F1F5F9',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#4A5568';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#2D3748';
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleEscalate}
                disabled={!escalationReason}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  background: escalationReason ? '#A100FF' : '#6B7280',
                  border: 'none',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: escalationReason ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease',
                  opacity: escalationReason ? 1 : 0.5,
                }}
                onMouseEnter={(e) => {
                  if (escalationReason) {
                    e.currentTarget.style.background = '#8B00E0';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (escalationReason) {
                    e.currentTarget.style.background = '#A100FF';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                Escalate Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stage Footer */}
      {showContinueButton && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderTop: '1px solid #2D3748',
          background: 'rgba(26,26,46,0.95)',
          gap: '12px',
          animation: 'fadeSlideUp 0.4s ease-out',
        }}>
          <button
            onClick={() => onBack?.()}
            style={{
              padding: '10px 16px',
              background: 'transparent',
              border: '1px solid #4A5568',
              borderRadius: '6px',
              color: '#94A3B8',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
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

          <div style={{ display: 'flex', gap: '10px' }}>
            {!allApprovalsComplete ? (
              <button
                onClick={handleApproveAll}
                style={{
                  padding: '10px 20px',
                  background: '#10B981',
                  border: 'none',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(16,185,129,0.3)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#059669';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#10B981';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                ✓ Approve All
              </button>
            ) : null}

            <button
              onClick={() => setShowRejectionModal(true)}
              style={{
                padding: '10px 20px',
                background: '#16213e',
                border: '1px solid #2D3748',
                borderRadius: '6px',
                color: '#F1F5F9',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#EF4444';
                e.currentTarget.style.color = '#EF4444';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#2D3748';
                e.currentTarget.style.color = '#F1F5F9';
              }}
            >
              ✗ Reject
            </button>

            <button
              onClick={() => setShowEscalationModal(true)}
              style={{
                padding: '10px 20px',
                background: '#16213e',
                border: '1px solid #2D3748',
                borderRadius: '6px',
                color: '#F1F5F9',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#A100FF';
                e.currentTarget.style.color = '#A100FF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#2D3748';
                e.currentTarget.style.color = '#F1F5F9';
              }}
            >
              ⬆ Escalate
            </button>
          </div>

          <button
            onClick={() => {
              onStageAction?.({ type: 'approval_complete', approvalCount: getApprovedCount() });
              onComplete?.();
            }}
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
            Continue →
          </button>
        </div>
      )}
    </div>
  );
}
