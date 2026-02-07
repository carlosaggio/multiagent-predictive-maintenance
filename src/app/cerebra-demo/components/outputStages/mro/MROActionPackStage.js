'use client';

import { useState, useEffect, useRef } from 'react';
import { mroActionPack } from '../../../data/mro/mroActionPackData';

export default function MROActionPackStage({ onBack, onStageAction, onComplete }) {
  const [showHeader, setShowHeader] = useState(false);
  const [revealedActions, setRevealedActions] = useState([]);
  const [showSAPPreview, setShowSAPPreview] = useState(false);
  const [showAuditTrail, setShowAuditTrail] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [expandedAction, setExpandedAction] = useState(null);
  const [executingAction, setExecutingAction] = useState(null);
  const [executedActions, setExecutedActions] = useState({});
  const [totalCost, setTotalCost] = useState(0);
  const [executedCost, setExecutedCost] = useState(0);
  const [actionOrder, setActionOrder] = useState(mroActionPack.actions.map((_, idx) => idx));
  const [approvalRequested, setApprovalRequested] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState(null);
  const [showModifyPanel, setShowModifyPanel] = useState(false);
  const [selectedActions, setSelectedActions] = useState(new Set(mroActionPack.actions.map((_, idx) => idx)));
  const [actionStatuses, setActionStatuses] = useState({});
  const [sapWriteBackStatus, setSapWriteBackStatus] = useState({});
  const [hoveredRisk, setHoveredRisk] = useState(null);
  const [costLimitOverride, setCostLimitOverride] = useState(null);
  const [priorityOverrides, setPriorityOverrides] = useState({});

  useEffect(() => {
    setTimeout(() => setShowHeader(true), 200);

    mroActionPack.actions.forEach((_, idx) => {
      setTimeout(() => {
        setRevealedActions(prev => [...prev, idx]);
      }, 600 + idx * 300);
    });

    setTimeout(() => setShowSAPPreview(true), 600 + mroActionPack.actions.length * 300 + 300);
    setTimeout(() => setShowAuditTrail(true), 600 + mroActionPack.actions.length * 300 + 600);

    setTimeout(() => {
      setAnimationComplete(true);
    }, 600 + mroActionPack.actions.length * 300 + 1400);

    // Calculate total cost
    const total = mroActionPack.actions.reduce((sum, action) => {
      const rawCost = action.details?.cost;
      const cost = typeof rawCost === 'number' ? rawCost : parseInt(String(rawCost || '0').replace(/[^0-9]/g, '') || 0);
      return sum + cost;
    }, 0);
    setTotalCost(total);

    // Initialize action statuses
    const initialStatuses = {};
    mroActionPack.actions.forEach((_, idx) => {
      initialStatuses[idx] = 'pending';
    });
    setActionStatuses(initialStatuses);

    // Initialize SAP write-back statuses
    const sapStatuses = {};
    if (mroActionPack.sapWriteBack) {
      mroActionPack.sapWriteBack.forEach((sap, idx) => {
        sapStatuses[idx] = 'pending';
      });
      setSapWriteBackStatus(sapStatuses);
    }
  }, []);

  const getStatusColor = (status) => {
    if (status === 'pre_approved') return { bg: '#ECFDF5', text: '#065F46', dot: '#10B981' };
    if (status === 'pending_approval') return { bg: '#FFFBEB', text: '#92400E', dot: '#F59E0B' };
    if (status === 'approved') return { bg: '#ECFDF5', text: '#065F46', dot: '#10B981' };
    return { bg: '#F3F4F6', text: '#374151', dot: '#6B7280' };
  };

  const getExecutionStatusColor = (status) => {
    switch (status) {
      case 'complete':
        return { bg: 'rgba(16,185,129,0.1)', border: '#10B981', text: '#10B981', label: 'Complete' };
      case 'in_progress':
        return { bg: 'rgba(161,0,255,0.1)', border: '#A100FF', text: '#A100FF', label: 'In Progress' };
      case 'pending':
        return { bg: 'rgba(248,113,113,0.1)', border: '#EF4444', text: '#EF4444', label: 'Pending' };
      case 'blocked':
        return { bg: 'rgba(239,68,68,0.1)', border: '#DC2626', text: '#DC2626', label: 'Blocked' };
      default:
        return { bg: 'rgba(107,114,128,0.1)', border: '#6B7280', text: '#6B7280', label: 'Unknown' };
    }
  };

  const getRiskLevel = (action) => {
    const rawCost = action.details?.cost;
      const cost = typeof rawCost === 'number' ? rawCost : parseInt(String(rawCost || '0').replace(/[^0-9]/g, '') || 0);
    if (cost > 50000) return { level: 'Critical', color: '#DC2626', icon: '⚠️' };
    if (cost > 20000) return { level: 'High', color: '#F59E0B', icon: '⚡' };
    if (cost > 5000) return { level: 'Medium', color: '#FBBF24', icon: '◆' };
    return { level: 'Low', color: '#10B981', icon: '✓' };
  };

  const getRiskDescription = (action) => {
    const messages = [
      'Failure to execute could result in extended downtime (18-24 hours)',
      'Critical spare part shortage - no backup vendors available',
      'Delays in SAP update could cause billing discrepancies',
      'Vendor supply chain dependency - single point of failure',
      'System integration issue - affects downstream processes',
      'Cost overrun could trigger budget review and delays',
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const getSystemCategory = (action) => {
    const title = action.title.toLowerCase();
    if (title.includes('sap') || title.includes('mm') || title.includes('requisition')) return 'SAP MM';
    if (title.includes('work') || title.includes('order') || title.includes('pm')) return 'SAP PM';
    if (title.includes('vendor') || title.includes('supplier') || title.includes('parts')) return 'Vendor';
    if (title.includes('notify') || title.includes('notification') || title.includes('fleet')) return 'Customer Notifications';
    return 'General';
  };

  const getActionDetails = (action) => {
    return {
      id: action.id || 'ACT-' + Math.random().toString().slice(2, 8),
      description: action.description,
      system: getSystemCategory(action),
      owner: action.details?.vendor || 'Operations',
      priority: action.details?.cost ? (parseInt(String(action.details.cost).replace(/[^0-9]/g, '')) > 20000 ? 'P1' : 'P2') : 'P3',
      status: actionStatuses[mroActionPack.actions.indexOf(action)] || 'pending',
      eta: action.details?.eta || '2h',
    };
  };

  const handleExecuteAction = (idx) => {
    if (!selectedActions.has(idx)) return;

    setExecutingAction(idx);
    setActionStatuses(prev => ({ ...prev, [idx]: 'in_progress' }));

    // Simulate execution with SAP write-back
    setTimeout(() => {
      const action = mroActionPack.actions[idx];
      const rawCost = action.details?.cost;
      const cost = typeof rawCost === 'number' ? rawCost : parseInt(String(rawCost || '0').replace(/[^0-9]/g, '') || 0);
      setExecutedActions(prev => ({ ...prev, [idx]: true }));
      setExecutedCost(prev => prev + cost);
      setActionStatuses(prev => ({ ...prev, [idx]: 'complete' }));
      setExecutingAction(null);
      onStageAction?.(`Action ${action.id || idx + 1} executed: ${action.title}`);
    }, 1200);
  };

  const toggleActionSelection = (idx) => {
    setSelectedActions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(idx)) {
        newSet.delete(idx);
      } else {
        newSet.add(idx);
      }
      return newSet;
    });
  };

  const handleExecuteAll = () => {
    Array.from(selectedActions).forEach((idx, position) => {
      setTimeout(() => {
        handleExecuteAction(idx);
      }, position * 400);
    });
  };

  const getSystemCostBreakdown = () => {
    const breakdown = {};
    mroActionPack.actions.forEach((action, idx) => {
      if (selectedActions.has(idx)) {
        const system = getSystemCategory(action);
        const rawCost = action.details?.cost;
      const cost = typeof rawCost === 'number' ? rawCost : parseInt(String(rawCost || '0').replace(/[^0-9]/g, '') || 0);
        if (!breakdown[system]) breakdown[system] = 0;
        breakdown[system] += cost;
      }
    });
    return breakdown;
  };

  const getSelectedCost = () => {
    return mroActionPack.actions.reduce((sum, action, idx) => {
      if (selectedActions.has(idx)) {
        const rawCost = action.details?.cost;
      const cost = typeof rawCost === 'number' ? rawCost : parseInt(String(rawCost || '0').replace(/[^0-9]/g, '') || 0);
        return sum + cost;
      }
      return sum;
    }, 0);
  };

  const moveAction = (idx, direction) => {
    const currentPos = actionOrder.indexOf(idx);
    if (direction === 'up' && currentPos > 0) {
      const newOrder = [...actionOrder];
      [newOrder[currentPos - 1], newOrder[currentPos]] = [newOrder[currentPos], newOrder[currentPos - 1]];
      setActionOrder(newOrder);
    } else if (direction === 'down' && currentPos < actionOrder.length - 1) {
      const newOrder = [...actionOrder];
      [newOrder[currentPos + 1], newOrder[currentPos]] = [newOrder[currentPos], newOrder[currentPos + 1]];
      setActionOrder(newOrder);
    }
  };

  const handleRequestApproval = () => {
    setApprovalRequested(true);
    setApprovalStatus('pending');
    const selectedCount = selectedActions.size;
    const selectedCost = getSelectedCost();
    onStageAction?.(`Requesting SAP approval routing for ${selectedCount} actions with total cost $${selectedCost.toLocaleString()}`);

    // Simulate SAP write-back sequence
    setTimeout(() => {
      setSapWriteBackStatus(prev => ({ ...prev, 0: 'in_progress' }));
    }, 200);

    setTimeout(() => {
      setSapWriteBackStatus(prev => ({ ...prev, 0: 'complete' }));
      setSapWriteBackStatus(prev => ({ ...prev, 1: 'in_progress' }));
    }, 800);

    setTimeout(() => {
      setSapWriteBackStatus(prev => ({ ...prev, 1: 'complete' }));
      setSapWriteBackStatus(prev => ({ ...prev, 2: 'in_progress' }));
    }, 1400);

    setTimeout(() => {
      setSapWriteBackStatus(prev => ({ ...prev, 2: 'complete' }));
      setSapWriteBackStatus(prev => ({ ...prev, 3: 'in_progress' }));
    }, 1900);

    setTimeout(() => {
      setSapWriteBackStatus(prev => ({ ...prev, 3: 'complete' }));
      setApprovalStatus('approved');
      onStageAction?.('SAP approval granted - All selected actions authorized for execution');
    }, 2400);

    setTimeout(() => {
      setApprovalRequested(false);
      setApprovalStatus(null);
    }, 3200);
  };

  const handleModifyActions = () => {
    setShowModifyPanel(!showModifyPanel);
    if (!showModifyPanel) {
      onStageAction?.('Opened action modification panel - SAP MM parameter review');
    }
  };

  const executedCount = Object.keys(executedActions).length;
  const selectedCount = selectedActions.size;
  const progressPercent = selectedCount > 0 ? (executedCount / selectedCount) * 100 : 0;

  return (
    <div style={{ padding: '0', background: '#1a1a2e', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
        @keyframes progressFill { from { width: 0%; } to { width: 100%; } }
        @keyframes checkSlide { from { transform: translateX(-100%); } to { transform: translateX(0); } }
        @keyframes slideDown { from { transform: translateY(-100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .tooltip-container { position: relative; display: inline-block; }
        .tooltip-text { visibility: hidden; background-color: #2D3748; color: #F1F5F9; text-align: center; padding: 8px 12px; border-radius: 4px; position: absolute; z-index: 1000; bottom: 125%; left: 50%; transform: translateX(-50%); white-space: nowrap; font-size: 10px; border: 1px solid #4A5568; }
        .tooltip-container:hover .tooltip-text { visibility: visible; }
        .gantt-bar { position: relative; height: 24px; border-radius: 3px; display: flex; align-items: center; padding: 0 4px; font-size: 9px; color: white; font-weight: 600; }
      `}</style>

      {/* Header */}
      {showHeader && (
        <div style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          padding: '20px',
          borderBottom: '2px solid #A100FF',
          animation: 'fadeSlideUp 0.4s ease-out',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
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
              Enterprise Action Pack {mroActionPack.id}
            </span>
            <div style={{
              background: '#10B981',
              color: 'white',
              padding: '2px 8px',
              borderRadius: '3px',
              fontSize: '10px',
              fontWeight: '600',
              marginLeft: 'auto',
            }}>
              Ready for execution
            </div>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', marginBottom: '12px' }}>
            {mroActionPack.actions.length} coordinated actions across SAP MM, SAP PM, Vendor, and Customer systems
          </div>
          {/* Progress Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
            <div style={{ background: 'rgba(161,0,255,0.1)', border: '1px solid #A100FF', borderRadius: '4px', padding: '10px' }}>
              <div style={{ fontSize: '10px', color: '#A100FF', fontWeight: '600', marginBottom: '2px' }}>SELECTED</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#F1F5F9' }}>{selectedCount} of {mroActionPack.actions.length}</div>
            </div>
            <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid #10B981', borderRadius: '4px', padding: '10px' }}>
              <div style={{ fontSize: '10px', color: '#10B981', fontWeight: '600', marginBottom: '2px' }}>EXECUTED</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#10B981' }}>{executedCount} completed</div>
            </div>
            <div style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid #3B82F6', borderRadius: '4px', padding: '10px' }}>
              <div style={{ fontSize: '10px', color: '#3B82F6', fontWeight: '600', marginBottom: '2px' }}>PROGRESS</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#3B82F6' }}>{Math.round(progressPercent)}%</div>
            </div>
          </div>
        </div>
      )}

      <div style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
        {/* Progress Tracker */}
        {animationComplete && (
          <div style={{
            animation: 'fadeSlideUp 0.4s ease-out',
            background: '#16213e',
            border: '1px solid #2D3748',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '20px',
          }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#F1F5F9', marginBottom: '12px' }}>
              EXECUTION PROGRESS
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '12px',
            }}>
              <div style={{ flex: 1 }}>
                <div style={{
                  height: '12px',
                  background: 'rgba(161,0,255,0.1)',
                  borderRadius: '6px',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, #A100FF, #7C00CC)',
                    width: `${progressPercent}%`,
                    transition: 'width 0.4s ease',
                  }} />
                </div>
              </div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#A100FF', minWidth: '50px', textAlign: 'right' }}>
                {executedCount}/{selectedCount}
              </div>
            </div>

            {/* Cost Summary */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '12px',
            }}>
              <div>
                <div style={{ fontSize: '10px', color: '#94A3B8', fontWeight: '600', marginBottom: '4px' }}>
                  SELECTED COST
                </div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#F1F5F9' }}>
                  ${getSelectedCost().toLocaleString()}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: '#10B981', fontWeight: '600', marginBottom: '4px' }}>
                  EXECUTED COST
                </div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#10B981' }}>
                  ${executedCost.toLocaleString()}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: '#3B82F6', fontWeight: '600', marginBottom: '4px' }}>
                  REMAINING
                </div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#3B82F6' }}>
                  ${(getSelectedCost() - executedCost).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* System-by-System Cost Breakdown */}
        {animationComplete && (
          <div style={{
            animation: 'fadeSlideUp 0.4s ease-out',
            background: '#16213e',
            border: '1px solid #2D3748',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '20px',
          }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#F1F5F9', marginBottom: '12px' }}>
              COST BREAKDOWN BY SYSTEM
            </div>
            <div style={{ display: 'grid', gap: '10px' }}>
              {Object.entries(getSystemCostBreakdown()).map(([system, cost]) => (
                <div key={system} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px',
                  background: '#1a1a2e',
                  border: '1px solid #2D3748',
                  borderRadius: '4px',
                }}>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: '600', color: '#F1F5F9' }}>{system}</div>
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#A100FF' }}>
                    ${cost.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gantt Timeline View */}
        {animationComplete && (
          <div style={{
            animation: 'fadeSlideUp 0.4s ease-out',
            background: '#16213e',
            border: '1px solid #2D3748',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '20px',
          }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#F1F5F9', marginBottom: '12px' }}>
              EXECUTION TIMELINE (GANTT VIEW)
            </div>
            <div style={{ display: 'grid', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
              {actionOrder.slice(0, 8).map((originalIdx) => {
                const action = mroActionPack.actions[originalIdx];
                const isExecuted = executedActions[originalIdx];
                const isExecuting = executingAction === originalIdx;
                const statusColor = isExecuted ? '#10B981' : (isExecuting ? '#A100FF' : '#6B7280');

                return (
                  <div key={action.id} style={{
                    display: 'grid',
                    gridTemplateColumns: '120px 1fr',
                    gap: '8px',
                    alignItems: 'center',
                  }}>
                    <div style={{ fontSize: '9px', color: '#94A3B8', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {action.title.substring(0, 15)}...
                    </div>
                    <div style={{
                      height: '20px',
                      background: 'rgba(161,0,255,0.1)',
                      borderRadius: '3px',
                      overflow: 'hidden',
                      position: 'relative',
                    }}>
                      <div style={{
                        height: '100%',
                        background: statusColor,
                        width: isExecuted ? '100%' : (isExecuting ? '66%' : '10%'),
                        transition: 'width 0.3s ease',
                        borderRadius: '3px',
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Cards by System */}
        <div style={{ marginBottom: '20px' }}>
          {['SAP MM', 'SAP PM', 'Vendor', 'Customer Notifications'].map((system) => {
            const systemActions = mroActionPack.actions
              .map((action, idx) => ({ action, idx }))
              .filter(({ action }) => getSystemCategory(action) === system);

            if (systemActions.length === 0) return null;

            return (
              <div key={system} style={{
                animation: 'fadeSlideUp 0.4s ease-out',
                background: '#16213e',
                border: '1px solid #2D3748',
                borderRadius: '8px',
                overflow: 'hidden',
                marginBottom: '16px',
              }}>
                {/* System Header */}
                <div style={{
                  background: 'rgba(161,0,255,0.1)',
                  borderBottom: '1px solid #2D3748',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <div style={{
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: '#A100FF',
                  }} />
                  <span style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#A100FF',
                    flex: 1,
                  }}>
                    {system}
                  </span>
                  <span style={{
                    fontSize: '10px',
                    color: '#94A3B8',
                    background: '#1a1a2e',
                    padding: '2px 8px',
                    borderRadius: '3px',
                  }}>
                    {systemActions.length} actions
                  </span>
                </div>

                {/* Actions in this system */}
                <div style={{ padding: '12px' }}>
                  {systemActions.map(({ action, idx: originalIdx }) => {
                    const isRevealed = revealedActions.includes(originalIdx);
                    const isExpanded = expandedAction === originalIdx;
                    const isExecuting = executingAction === originalIdx;
                    const isExecuted = executedActions[originalIdx];
                    const isSelected = selectedActions.has(originalIdx);
                    const risk = getRiskLevel(action);
                    const details = getActionDetails(action);

                    return (
                      <div
                        key={action.id}
                        style={{
                          opacity: isRevealed ? 1 : 0,
                          transform: isRevealed ? 'translateY(0)' : 'translateY(12px)',
                          transition: 'all 0.4s ease-out',
                          background: isExecuted ? 'rgba(16,185,129,0.05)' : 'rgba(45,55,72,0.3)',
                          border: isExecuted ? '1px solid #10B981' : '1px solid #4A5568',
                          borderRadius: '6px',
                          padding: '12px',
                          marginBottom: '8px',
                          cursor: 'pointer',
                        }}
                      >
                        {/* Action header with selection checkbox */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '8px',
                          marginBottom: '8px',
                        }}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleActionSelection(originalIdx)}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              width: '16px',
                              height: '16px',
                              cursor: 'pointer',
                              marginTop: '2px',
                              accentColor: '#A100FF',
                            }}
                          />
                          <div
                            onClick={() => setExpandedAction(isExpanded ? null : originalIdx)}
                            style={{ flex: 1, cursor: 'pointer' }}
                          >
                            <div style={{
                              fontSize: '12px',
                              fontWeight: '700',
                              color: '#F1F5F9',
                              marginBottom: '2px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                            }}>
                              <span>{details.id}</span>
                              {isExecuted && <span style={{ fontSize: '11px', color: '#10B981' }}>✓</span>}
                            </div>
                            <div style={{
                              fontSize: '10px',
                              color: '#94A3B8',
                              lineHeight: '1.3',
                            }}>
                              {action.title}
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                            {/* Priority Badge */}
                            <div style={{
                              background: details.priority === 'P1' ? '#DC2626' : (details.priority === 'P2' ? '#F59E0B' : '#6B7280'),
                              color: 'white',
                              padding: '2px 6px',
                              borderRadius: '2px',
                              fontSize: '9px',
                              fontWeight: '700',
                            }}>
                              {details.priority}
                            </div>
                            {/* Risk Indicator */}
                            <div className="tooltip-container" style={{ cursor: 'help' }}>
                              <span style={{ fontSize: '14px' }}>{risk.icon}</span>
                              <span className="tooltip-text">{getRiskDescription(action)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Status and Details Grid */}
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                          gap: '8px',
                          marginBottom: '8px',
                          fontSize: '9px',
                        }}>
                          <div>
                            <div style={{ color: '#94A3B8', fontWeight: '600' }}>OWNER</div>
                            <div style={{ color: '#F1F5F9', marginTop: '1px' }}>{details.owner}</div>
                          </div>
                          <div>
                            <div style={{ color: '#94A3B8', fontWeight: '600' }}>COST</div>
                            <div style={{ color: '#EF4444', marginTop: '1px', fontWeight: '600' }}>{action.details?.cost || '$0'}</div>
                          </div>
                          <div>
                            <div style={{ color: '#94A3B8', fontWeight: '600' }}>ETA</div>
                            <div style={{ color: '#F1F5F9', marginTop: '1px' }}>{details.eta}</div>
                          </div>
                          <div>
                            <div style={{ color: '#94A3B8', fontWeight: '600' }}>STATUS</div>
                            <div style={{ color: getExecutionStatusColor(details.status).text, marginTop: '1px' }}>
                              {getExecutionStatusColor(details.status).label}
                            </div>
                          </div>
                        </div>

                        {/* Execution Progress Bar */}
                        {(isExecuting || isExecuted) && (
                          <div style={{
                            background: 'rgba(161,0,255,0.05)',
                            border: '1px solid ' + (isExecuted ? '#10B981' : '#A100FF'),
                            borderRadius: '4px',
                            padding: '8px',
                            marginBottom: '8px',
                          }}>
                            <div style={{ fontSize: '9px', color: isExecuted ? '#10B981' : '#A100FF', fontWeight: '600', marginBottom: '4px' }}>
                              {isExecuted ? '✓ Executed to SAP' : '⟳ Executing...'}
                            </div>
                            <div style={{
                              height: '4px',
                              background: 'rgba(161,0,255,0.2)',
                              borderRadius: '2px',
                              overflow: 'hidden',
                            }}>
                              <div style={{
                                height: '100%',
                                background: isExecuted ? '#10B981' : '#A100FF',
                                width: isExecuted ? '100%' : '66%',
                                animation: isExecuting ? 'progressFill 1s ease-out forwards' : 'none',
                              }} />
                            </div>
                          </div>
                        )}

                        {/* Expanded Details */}
                        {isExpanded && (
                          <div style={{
                            background: '#1a1a2e',
                            border: '1px solid #2D3748',
                            borderRadius: '4px',
                            padding: '8px',
                            marginBottom: '8px',
                            animation: 'fadeSlideUp 0.2s ease-out',
                          }}>
                            <div style={{ fontSize: '10px', color: '#F1F5F9', lineHeight: '1.5' }}>
                              {action.description}
                            </div>
                            <div style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(2, 1fr)',
                              gap: '8px',
                              marginTop: '8px',
                              paddingTop: '8px',
                              borderTop: '1px solid #2D3748',
                            }}>
                              {action.details.from && (
                                <div>
                                  <div style={{ fontSize: '8px', color: '#94A3B8', fontWeight: '600', marginBottom: '1px' }}>FROM</div>
                                  <div style={{ fontSize: '10px', color: '#F1F5F9' }}>{action.details.from}</div>
                                </div>
                              )}
                              {action.details.to && (
                                <div>
                                  <div style={{ fontSize: '8px', color: '#94A3B8', fontWeight: '600', marginBottom: '1px' }}>TO</div>
                                  <div style={{ fontSize: '10px', color: '#F1F5F9' }}>{action.details.to}</div>
                                </div>
                              )}
                              {action.details.vendor && (
                                <div>
                                  <div style={{ fontSize: '8px', color: '#94A3B8', fontWeight: '600', marginBottom: '1px' }}>VENDOR</div>
                                  <div style={{ fontSize: '10px', color: '#F1F5F9' }}>{action.details.vendor}</div>
                                </div>
                              )}
                              {action.details.part && (
                                <div>
                                  <div style={{ fontSize: '8px', color: '#94A3B8', fontWeight: '600', marginBottom: '1px' }}>PART</div>
                                  <div style={{ fontSize: '10px', color: '#F1F5F9' }}>{action.details.part}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* SAP Transaction Info */}
                        {isExpanded && (
                          <div style={{
                            background: '#1a1a2e',
                            border: '1px solid #2D3748',
                            borderRadius: '4px',
                            padding: '8px',
                            marginBottom: '8px',
                            fontSize: '9px',
                            color: '#A100FF',
                          }}>
                            <span style={{ fontWeight: '600' }}>SAP: </span>
                            {action.sapTransaction}
                          </div>
                        )}

                        {/* Execute Button */}
                        {isExpanded && !isExecuted && isSelected && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleExecuteAction(originalIdx);
                            }}
                            disabled={isExecuting}
                            style={{
                              width: '100%',
                              padding: '6px 8px',
                              background: isExecuting ? '#7C00CC' : '#A100FF',
                              border: 'none',
                              borderRadius: '4px',
                              color: 'white',
                              fontSize: '10px',
                              fontWeight: '600',
                              cursor: isExecuting ? 'not-allowed' : 'pointer',
                              transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                              if (!isExecuting) {
                                e.currentTarget.style.background = '#8B00E0';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isExecuting) {
                                e.currentTarget.style.background = '#A100FF';
                              }
                            }}
                          >
                            {isExecuting ? 'Executing...' : 'Execute Action'}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              );
            })}
        </div>

        {/* SAP Live Write-back Status */}
        {approvalRequested && (
          <div style={{
            animation: 'fadeSlideUp 0.4s ease-out',
            background: '#16213e',
            border: '1px solid #2D3748',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '20px',
          }}>
            <div style={{
              fontSize: '12px',
              fontWeight: '700',
              color: '#F1F5F9',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#3B82F6',
                animation: 'pulse 1.5s infinite',
              }} />
              SAP Live System Status
            </div>
            <div style={{ display: 'grid', gap: '8px' }}>
              {[
                { system: 'SAP MM', task: 'Creating PO requisition #REQ-2024-8837', icon: '📦' },
                { system: 'SAP PM', task: 'Updating work order WP-55 dependencies', icon: '🔧' },
                { system: 'Vendor Portal', task: 'Sending expedite request to Parts Corp', icon: '📤' },
                { system: 'Fleet Ops', task: 'Notifying outstation coordinators', icon: '🚚' },
              ].map((item, idx) => {
                const status = sapWriteBackStatus[idx] || 'pending';
                const isComplete = status === 'complete';
                const isInProgress = status === 'in_progress';

                return (
                  <div key={idx} style={{
                    background: '#1a1a2e',
                    border: `1px solid ${isComplete ? '#10B981' : (isInProgress ? '#A100FF' : '#2D3748')}`,
                    borderRadius: '4px',
                    padding: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: '600', color: '#F1F5F9', marginBottom: '2px' }}>
                        {item.icon} {item.system}
                      </div>
                      <div style={{ fontSize: '10px', color: '#94A3B8' }}>{item.task}</div>
                    </div>
                    <div style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      color: isComplete ? '#10B981' : (isInProgress ? '#A100FF' : '#6B7280'),
                    }}>
                      {isComplete ? '✓' : (isInProgress ? '⟳' : '◆')}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{
              marginTop: '12px',
              padding: '10px',
              background: 'rgba(16,185,129,0.1)',
              border: '1px solid #10B981',
              borderRadius: '4px',
              fontSize: '11px',
              color: '#10B981',
              fontWeight: '600',
              textAlign: 'center',
            }}>
              {approvalStatus === 'approved' ? '✓ All systems synced and ready for execution' : 'Syncing with SAP systems...'}
            </div>
          </div>
        )}

        {/* Modify Actions Panel */}
        {showModifyPanel && (
          <div style={{
            animation: 'fadeSlideUp 0.4s ease-out',
            background: '#16213e',
            border: '2px solid #A100FF',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '20px',
          }}>
            <div style={{
              fontSize: '12px',
              fontWeight: '700',
              color: '#F1F5F9',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#A100FF',
              }} />
              Modify Action Parameters
            </div>

            {/* Cost Limit Override */}
            <div style={{
              background: '#1a1a2e',
              border: '1px solid #2D3748',
              borderRadius: '6px',
              padding: '12px',
              marginBottom: '12px',
            }}>
              <div style={{ fontSize: '11px', fontWeight: '600', color: '#F1F5F9', marginBottom: '8px' }}>
                Cost Limit Override
              </div>
              <input
                type="number"
                placeholder="Enter max cost limit"
                value={costLimitOverride || ''}
                onChange={(e) => setCostLimitOverride(e.target.value ? parseInt(e.target.value) : null)}
                style={{
                  width: '100%',
                  padding: '8px',
                  background: '#0f0f1e',
                  border: '1px solid #2D3748',
                  borderRadius: '4px',
                  color: '#F1F5F9',
                  fontSize: '11px',
                }}
              />
              <div style={{ fontSize: '9px', color: '#94A3B8', marginTop: '6px' }}>
                Current selected total: ${getSelectedCost().toLocaleString()}
              </div>
            </div>

            {/* Priority Override */}
            <div style={{
              background: '#1a1a2e',
              border: '1px solid #2D3748',
              borderRadius: '6px',
              padding: '12px',
              marginBottom: '12px',
            }}>
              <div style={{ fontSize: '11px', fontWeight: '600', color: '#F1F5F9', marginBottom: '8px' }}>
                Priority Overrides (Top 3 Actions)
              </div>
              <div style={{ display: 'grid', gap: '8px' }}>
                {mroActionPack.actions.slice(0, 3).map((action, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px',
                    background: '#16213e',
                    borderRadius: '4px',
                  }}>
                    <div style={{ flex: 1, fontSize: '9px', color: '#94A3B8' }}>
                      {action.title.substring(0, 25)}...
                    </div>
                    <select
                      value={priorityOverrides[idx] || 'P2'}
                      onChange={(e) => setPriorityOverrides(prev => ({ ...prev, [idx]: e.target.value }))}
                      style={{
                        padding: '4px 6px',
                        background: '#0f0f1e',
                        border: '1px solid #2D3748',
                        borderRadius: '3px',
                        color: '#F1F5F9',
                        fontSize: '9px',
                      }}
                    >
                      <option value="P1">P1 - Critical</option>
                      <option value="P2">P2 - High</option>
                      <option value="P3">P3 - Normal</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>

            {/* Vendor Selection */}
            <div style={{
              background: '#1a1a2e',
              border: '1px solid #2D3748',
              borderRadius: '6px',
              padding: '12px',
            }}>
              <div style={{ fontSize: '11px', fontWeight: '600', color: '#F1F5F9', marginBottom: '8px' }}>
                Alternate Vendor Selection
              </div>
              <div style={{ display: 'grid', gap: '6px' }}>
                {['Parts Corp (Primary)', 'TechSupply Inc (Backup)', 'Global Parts Ltd (Emergency)'].map((vendor, idx) => (
                  <label key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px',
                    background: '#16213e',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}>
                    <input type="radio" name="vendor" defaultChecked={idx === 0} style={{ accentColor: '#A100FF' }} />
                    <span style={{ fontSize: '10px', color: '#F1F5F9' }}>{vendor}</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{
              marginTop: '12px',
              padding: '10px',
              background: 'rgba(161,0,255,0.05)',
              border: '1px solid #A100FF',
              borderRadius: '4px',
              fontSize: '9px',
              color: '#A100FF',
              textAlign: 'center',
              fontWeight: '600',
            }}>
              Changes will be applied when you request approval
            </div>
          </div>
        )}

        {/* SAP Write-back Preview */}
        {showSAPPreview && !approvalRequested && (
          <div style={{
            animation: 'fadeSlideUp 0.4s ease-out',
            background: '#16213e',
            border: '1px solid #2D3748',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '20px',
          }}>
            <div style={{
              fontSize: '12px',
              fontWeight: '700',
              color: '#F1F5F9',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#3B82F6',
              }} />
              SAP Write-back Transactions (Preview)
            </div>
            <div style={{ display: 'grid', gap: '8px' }}>
              {mroActionPack.sapWriteBack && mroActionPack.sapWriteBack.map((sap, idx) => (
                <div key={idx} style={{
                  background: '#1a1a2e',
                  border: '1px solid #2D3748',
                  borderRadius: '4px',
                  padding: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: '600', color: '#F1F5F9', marginBottom: '2px' }}>
                      {sap.system} {sap.type}
                    </div>
                    <div style={{ fontSize: '10px', color: '#94A3B8' }}>{sap.transaction}</div>
                  </div>
                  <div style={{
                    background: '#ECFDF5',
                    color: '#065F46',
                    padding: '4px 8px',
                    borderRadius: '3px',
                    fontSize: '9px',
                    fontWeight: '600',
                  }}>
                    {sap.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Audit Trail */}
        {showAuditTrail && (
          <div style={{
            animation: 'fadeSlideUp 0.4s ease-out',
            background: '#16213e',
            border: '1px solid #2D3748',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '20px',
          }}>
            <div style={{
              fontSize: '12px',
              fontWeight: '700',
              color: '#F1F5F9',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#06B6D4',
              }} />
              Audit Trail & Compliance
            </div>
            <div style={{
              maxHeight: '250px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}>
              {mroActionPack.auditTrail && mroActionPack.auditTrail.map((entry, idx) => {
                const time = new Date(entry.timestamp).toLocaleTimeString();
                return (
                  <div key={idx} style={{
                    padding: '8px',
                    background: '#1a1a2e',
                    borderLeft: '2px solid #A100FF',
                    borderRadius: '0 4px 4px 0',
                    fontSize: '9px',
                  }}>
                    <div style={{
                      fontWeight: '600',
                      color: '#F1F5F9',
                      marginBottom: '1px',
                    }}>
                      {entry.actor}
                    </div>
                    <div style={{ color: '#94A3B8', lineHeight: '1.3' }}>
                      {entry.action}
                    </div>
                    <div style={{ color: '#6B7280', fontSize: '8px', marginTop: '2px' }}>
                      {time}
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
          flexWrap: 'wrap',
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
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#94A3B8'; e.currentTarget.style.color = '#F1F5F9'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#4A5568'; e.currentTarget.style.color = '#94A3B8'; }}
          >
            ← Back
          </button>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={handleExecuteAll}
              disabled={selectedCount === 0}
              style={{
                padding: '10px 16px',
                background: selectedCount === 0 ? '#2D3748' : '#16213e',
                border: `1px solid ${selectedCount === 0 ? '#4A5568' : '#2D3748'}`,
                borderRadius: '6px',
                color: selectedCount === 0 ? '#6B7280' : '#F1F5F9',
                fontSize: '12px',
                fontWeight: '600',
                cursor: selectedCount === 0 ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (selectedCount > 0) {
                  e.currentTarget.style.borderColor = '#A100FF';
                  e.currentTarget.style.color = '#A100FF';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedCount > 0) {
                  e.currentTarget.style.borderColor = '#2D3748';
                  e.currentTarget.style.color = '#F1F5F9';
                }
              }}
            >
              Execute All ({selectedCount})
            </button>

            <button
              onClick={handleRequestApproval}
              disabled={approvalRequested || selectedCount === 0}
              style={{
                padding: '10px 16px',
                background: (approvalRequested || selectedCount === 0) ? '#2D3748' : '#16213e',
                border: `1px solid ${(approvalRequested || selectedCount === 0) ? '#4A5568' : '#2D3748'}`,
                borderRadius: '6px',
                color: approvalRequested ? '#10B981' : '#F1F5F9',
                fontSize: '12px',
                fontWeight: '600',
                cursor: (approvalRequested || selectedCount === 0) ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!approvalRequested && selectedCount > 0) {
                  e.currentTarget.style.borderColor = '#A100FF';
                  e.currentTarget.style.color = '#A100FF';
                }
              }}
              onMouseLeave={(e) => {
                if (!approvalRequested && selectedCount > 0) {
                  e.currentTarget.style.borderColor = '#2D3748';
                  e.currentTarget.style.color = '#F1F5F9';
                }
              }}
            >
              {approvalStatus === 'approved' ? '✓ Approved' : 'Request Approval'}
            </button>

            <button
              onClick={handleModifyActions}
              style={{
                padding: '10px 16px',
                background: showModifyPanel ? '#A100FF' : '#16213e',
                border: `1px solid ${showModifyPanel ? '#A100FF' : '#2D3748'}`,
                borderRadius: '6px',
                color: '#F1F5F9',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!showModifyPanel) {
                  e.currentTarget.style.borderColor = '#A100FF';
                  e.currentTarget.style.color = '#A100FF';
                }
              }}
              onMouseLeave={(e) => {
                if (!showModifyPanel) {
                  e.currentTarget.style.borderColor = '#2D3748';
                  e.currentTarget.style.color = '#F1F5F9';
                }
              }}
            >
              {showModifyPanel ? '✓ Editor Active' : 'Modify'}
            </button>
          </div>

          <button
            onClick={() => onComplete?.()}
            disabled={selectedCount === 0}
            style={{
              padding: '10px 24px',
              background: selectedCount === 0 ? '#6B7280' : '#A100FF',
              border: 'none',
              borderRadius: '6px',
              color: 'white',
              fontSize: '12px',
              fontWeight: '600',
              cursor: selectedCount === 0 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
              boxShadow: selectedCount === 0 ? 'none' : '0 2px 8px rgba(161,0,255,0.3)',
            }}
            onMouseEnter={(e) => {
              if (selectedCount > 0) {
                e.currentTarget.style.background = '#8B00E0';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedCount > 0) {
                e.currentTarget.style.background = '#A100FF';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            Continue {selectedCount > 0 && `(${selectedCount})`} →
          </button>
        </div>
      )}
    </div>
  );
}
