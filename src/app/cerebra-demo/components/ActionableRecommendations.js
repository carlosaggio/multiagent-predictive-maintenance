"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';

const MaintenanceCalendar = dynamic(
  () => import('./charts/MaintenanceCalendar'),
  { ssr: false }
);

// Actionable recommendations with metadata
const actionableItems = {
  immediate: [
    {
      id: 'im1',
      text: 'Schedule liner replacement during next planned maintenance window',
      deadline: 'Within 5 days',
      owner: 'James Morrison',
      priority: 'Critical',
      sapAction: 'Create PM Order',
    },
    {
      id: 'im2',
      text: 'Reduce crusher feed rate by 10% to extend liner life',
      deadline: 'Immediate',
      owner: 'Control Room',
      priority: 'High',
      sapAction: 'Update Process Parameters',
    },
    {
      id: 'im3',
      text: 'Assign James Morrison as lead technician (95% skill match)',
      deadline: 'Today',
      owner: 'Maintenance Planner',
      priority: 'High',
      sapAction: 'Resource Assignment',
    },
  ],
  nearTerm: [
    {
      id: 'nt1',
      text: 'Order backup liner set for inventory (CJ-8845)',
      deadline: 'Within 2 weeks',
      owner: 'Procurement',
      priority: 'Medium',
      sapAction: 'Create PR',
    },
    {
      id: 'nt2',
      text: 'Schedule feed chute alignment inspection during liner replacement',
      deadline: 'Jan 20',
      owner: 'Reliability Engineer',
      priority: 'Medium',
      sapAction: 'Add to WO',
    },
    {
      id: 'nt3',
      text: 'Update maintenance procedures based on 25% lifecycle overrun',
      deadline: 'Within 1 month',
      owner: 'Maintenance Manager',
      priority: 'Medium',
      sapAction: 'Document Update',
    },
  ],
  longTerm: [
    {
      id: 'lt1',
      text: 'Implement predictive liner wear monitoring using thickness sensors',
      deadline: 'Q2 2025',
      owner: 'Reliability Team',
      priority: 'Low',
      sapAction: 'Capital Project',
    },
    {
      id: 'lt2',
      text: 'Review ore hardness variability and adjust crusher settings',
      deadline: 'Ongoing',
      owner: 'Process Engineer',
      priority: 'Low',
      sapAction: 'Study Request',
    },
    {
      id: 'lt3',
      text: 'Evaluate upgraded liner material for extended lifecycle',
      deadline: 'Q3 2025',
      owner: 'Engineering',
      priority: 'Low',
      sapAction: 'Vendor Evaluation',
    },
  ],
};

// Priority colors
const priorityColors = {
  Critical: '#EF4444',
  High: '#F59E0B',
  Medium: '#3B82F6',
  Low: '#10B981',
};

function ActionItem({ item, isChecked, onToggle, onAddToWorkOrder }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      padding: '12px',
      background: isChecked ? '#F0FDF4' : '#FAFAFA',
      borderRadius: '6px',
      marginBottom: '8px',
      border: `1px solid ${isChecked ? '#86EFAC' : '#E2E8F0'}`,
      transition: 'all 0.2s ease',
    }}>
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={isChecked}
        onChange={() => onToggle(item.id)}
        style={{
          width: '18px',
          height: '18px',
          accentColor: '#10B981',
          cursor: 'pointer',
          marginTop: '2px',
        }}
      />
      
      <div style={{ flex: 1 }}>
        <div style={{ 
          fontSize: '12px', 
          color: isChecked ? '#166534' : '#1a1a2e',
          textDecoration: isChecked ? 'line-through' : 'none',
          lineHeight: '1.4',
        }}>
          {item.text}
        </div>
        
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          marginTop: '6px',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <span style={{ 
            fontSize: '10px', 
            color: '#64748B',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            {item.deadline}
          </span>
          <span style={{ 
            fontSize: '10px', 
            color: '#64748B',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            {item.owner}
          </span>
          <span style={{ 
            fontSize: '9px', 
            padding: '2px 6px',
            borderRadius: '10px',
            background: `${priorityColors[item.priority]}15`,
            color: priorityColors[item.priority],
            fontWeight: '600',
          }}>
            {item.priority}
          </span>
        </div>
      </div>
      
      {/* Add to Work Order button */}
      <button
        onClick={() => onAddToWorkOrder(item)}
        disabled={isChecked}
        style={{
          padding: '4px 8px',
          fontSize: '9px',
          background: isChecked ? '#E2E8F0' : '#0078D4',
          color: isChecked ? '#9CA3AF' : 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isChecked ? 'not-allowed' : 'pointer',
          whiteSpace: 'nowrap',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M5 12h14"/>
        </svg>
        {item.sapAction}
      </button>
    </div>
  );
}

function RecommendationCategory({ title, items, color, checkedItems, onToggle, onAddToWorkOrder }) {
  const allChecked = items.every(item => checkedItems.includes(item.id));
  const someChecked = items.some(item => checkedItems.includes(item.id));
  
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '10px',
      }}>
        <div style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          background: color,
        }} />
        <span style={{ 
          fontSize: '13px', 
          fontWeight: '600', 
          color: color,
        }}>
          {title}
        </span>
        {someChecked && (
          <span style={{ 
            fontSize: '10px', 
            color: '#10B981',
            marginLeft: 'auto',
          }}>
            {items.filter(i => checkedItems.includes(i.id)).length}/{items.length} complete
          </span>
        )}
      </div>
      
      {items.map((item) => (
        <ActionItem
          key={item.id}
          item={item}
          isChecked={checkedItems.includes(item.id)}
          onToggle={onToggle}
          onAddToWorkOrder={onAddToWorkOrder}
        />
      ))}
    </div>
  );
}

export default function ActionableRecommendations({ 
  onCreateWorkOrder,
  onShowKnowledgeGraph,
  onSendEmail,
}) {
  const [checkedItems, setCheckedItems] = useState([]);
  const [workOrderItems, setWorkOrderItems] = useState([]);
  const [showEmailModal, setShowEmailModal] = useState(false);

  const handleToggle = (itemId) => {
    setCheckedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleAddToWorkOrder = (item) => {
    if (!workOrderItems.find(i => i.id === item.id)) {
      setWorkOrderItems(prev => [...prev, item]);
    }
  };

  const totalItems = [...actionableItems.immediate, ...actionableItems.nearTerm, ...actionableItems.longTerm].length;
  const completedItems = checkedItems.length;
  const progressPercent = Math.round((completedItems / totalItems) * 100);

  return (
    <div style={{
      background: 'white',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      marginBottom: '16px',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        borderBottom: '1px solid #f0f0f0',
        background: '#FAFAFA',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: '#A100FF20',
            border: '2px solid #A100FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A100FF" strokeWidth="2">
              <polyline points="9 11 12 14 22 4"/>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#1a1a2e' }}>
              Action Recommendations
            </div>
            <div style={{ fontSize: '10px', color: '#A100FF' }}>
              {completedItems}/{totalItems} actions addressed • {progressPercent}% complete
            </div>
          </div>
        </div>
        
        {/* Quick action buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={onShowKnowledgeGraph}
            style={{
              padding: '6px 10px',
              fontSize: '10px',
              background: 'white',
              color: '#0078D4',
              border: '1px solid #0078D4',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83"/>
            </svg>
            Knowledge Graph
          </button>
          <button
            onClick={() => setShowEmailModal(true)}
            style={{
              padding: '6px 10px',
              fontSize: '10px',
              background: '#E67E22',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            Send Report
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ 
        height: '4px', 
        background: '#E2E8F0',
      }}>
        <div style={{
          height: '100%',
          width: `${progressPercent}%`,
          background: 'linear-gradient(90deg, #10B981, #059669)',
          transition: 'width 0.3s ease',
        }} />
      </div>

      {/* Main content */}
      <div style={{ padding: '16px' }}>
        {/* Maintenance Calendar */}
        <MaintenanceCalendar />
        
        {/* Recommendations */}
        <RecommendationCategory 
          title="Immediate Actions" 
          items={actionableItems.immediate} 
          color="#EF4444"
          checkedItems={checkedItems}
          onToggle={handleToggle}
          onAddToWorkOrder={handleAddToWorkOrder}
        />
        <RecommendationCategory 
          title="Near-Term Actions" 
          items={actionableItems.nearTerm} 
          color="#F59E0B"
          checkedItems={checkedItems}
          onToggle={handleToggle}
          onAddToWorkOrder={handleAddToWorkOrder}
        />
        <RecommendationCategory 
          title="Long-Term Actions" 
          items={actionableItems.longTerm} 
          color="#10B981"
          checkedItems={checkedItems}
          onToggle={handleToggle}
          onAddToWorkOrder={handleAddToWorkOrder}
        />

        {/* Work Order Queue */}
        {workOrderItems.length > 0 && (
          <div style={{
            marginTop: '16px',
            padding: '12px',
            background: '#EFF6FF',
            borderRadius: '8px',
            border: '1px solid #BFDBFE',
          }}>
            <div style={{ 
              fontSize: '12px', 
              fontWeight: '600', 
              color: '#1E40AF',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="12" y1="18" x2="12" y2="12"/>
                <line x1="9" y1="15" x2="15" y2="15"/>
              </svg>
              Work Order Items ({workOrderItems.length})
            </div>
            <div style={{ fontSize: '11px', color: '#1E40AF', marginBottom: '8px' }}>
              {workOrderItems.map(i => i.sapAction).join(', ')}
            </div>
            <button
              onClick={onCreateWorkOrder}
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '12px',
                fontWeight: '600',
                background: '#0078D4',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              Create SAP Work Order with Selected Items
            </button>
          </div>
        )}
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            width: '480px',
            maxHeight: '80vh',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a2e' }}>
                Send Urgent Maintenance Report
              </div>
              <button
                onClick={() => setShowEmailModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            
            <div style={{ padding: '20px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '11px', color: '#64748B', display: 'block', marginBottom: '4px' }}>
                  Recipients
                </label>
                <input
                  type="text"
                  defaultValue="maintenance-team@mineops.com, james.morrison@mineops.com"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #E2E8F0',
                    borderRadius: '6px',
                    fontSize: '12px',
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '11px', color: '#64748B', display: 'block', marginBottom: '4px' }}>
                  Subject
                </label>
                <input
                  type="text"
                  defaultValue="[URGENT] Primary Crusher - Liner Replacement Required Within 5 Days"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #E2E8F0',
                    borderRadius: '6px',
                    fontSize: '12px',
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '11px', color: '#64748B', display: 'block', marginBottom: '4px' }}>
                  Include Attachments
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { name: 'Analysis Report (PDF)', checked: true },
                    { name: 'Work Order Draft', checked: true },
                    { name: 'Knowledge Graph Export', checked: false },
                    { name: 'Maintenance Calendar', checked: true },
                  ].map((item, idx) => (
                    <label key={idx} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      fontSize: '12px',
                      color: '#1a1a2e',
                      cursor: 'pointer',
                    }}>
                      <input type="checkbox" defaultChecked={item.checked} />
                      {item.name}
                    </label>
                  ))}
                </div>
              </div>
              
              <div style={{
                background: '#FEF2F2',
                borderRadius: '6px',
                padding: '12px',
                marginBottom: '16px',
                borderLeft: '3px solid #EF4444',
              }}>
                <div style={{ fontSize: '11px', fontWeight: '600', color: '#991B1B' }}>
                  Priority: URGENT
                </div>
                <div style={{ fontSize: '11px', color: '#B91C1C', marginTop: '4px' }}>
                  Root Cause: Liner wear at 65% (critical threshold)
                  <br />
                  Estimated Production Loss: $47,500/day if not addressed
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setShowEmailModal(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    fontSize: '12px',
                    background: 'white',
                    color: '#64748B',
                    border: '1px solid #E2E8F0',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowEmailModal(false);
                    onSendEmail && onSendEmail();
                  }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    background: '#EF4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="22" y1="2" x2="11" y2="13"/>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                  Send Urgent Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

