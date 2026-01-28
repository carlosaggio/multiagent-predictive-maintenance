"use client";

import React, { useState, useEffect, useRef } from 'react';
import ShiftPlanGantt from '../../waio/ShiftPlanGantt';
import EquipmentAssignmentTable from '../../waio/EquipmentAssignmentTable';
import BlendRecipePanel from '../../waio/BlendRecipePanel';
import { waioShiftPlan } from '../../../data/waio/waioScenarioContext';

/**
 * WAIO Shift Plan Stage Component
 * 
 * Shows the selected shift plan with Gantt, equipment, and blend recipe.
 */

// Tab component
function Tab({ label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '10px 20px',
        background: isActive ? '#A100FF' : 'transparent',
        color: isActive ? 'white' : '#6B7280',
        border: 'none',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
    >
      {label}
    </button>
  );
}

// KPI strip for predicted outcome
function PredictedOutcomeStrip({ kpis }) {
  return (
    <div style={{
      display: 'flex',
      gap: '16px',
      padding: '16px',
      background: '#ECFDF5',
      borderRadius: '8px',
      marginBottom: '20px',
      border: '1px solid #10B98130',
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '10px', color: '#065F46', marginBottom: '4px' }}>Plan Compliance</div>
        <div style={{ fontSize: '20px', fontWeight: '700', color: '#059669' }}>
          {Math.round(kpis.planCompliance * 100)}%
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '10px', color: '#065F46', marginBottom: '4px' }}>Under-spec Risk</div>
        <div style={{ fontSize: '20px', fontWeight: '700', color: kpis.underSpecRisk > 0.3 ? '#F59E0B' : '#059669' }}>
          {Math.round(kpis.underSpecRisk * 100)}%
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '10px', color: '#065F46', marginBottom: '4px' }}>Tonnes (Shift)</div>
        <div style={{ fontSize: '20px', fontWeight: '700', color: '#059669' }}>
          {(kpis.tonnesLoaded / 1000).toFixed(0)}k
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '10px', color: '#065F46', marginBottom: '4px' }}>Value at Risk</div>
        <div style={{ fontSize: '20px', fontWeight: '700', color: kpis.valueAtRisk > 1000000 ? '#F59E0B' : '#059669' }}>
          ${(kpis.valueAtRisk / 1000).toFixed(0)}k
        </div>
      </div>
    </div>
  );
}

export default function WAIOShiftPlanStage({ onComplete, selectedPlan }) {
  const [activeTab, setActiveTab] = useState('gantt');
  const hasCompletedRef = useRef(false);

  const plan = waioShiftPlan;

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
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}>
          <div>
            <div style={{ 
              fontSize: '16px', 
              fontWeight: '700', 
              color: 'white',
              marginBottom: '8px',
            }}>
              Selected Shift Plan: {plan.planName}
            </div>
            <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
              12-hour operational plan with equipment assignments and blend recipes
            </div>
          </div>
          <div style={{
            padding: '6px 12px',
            background: '#10B98120',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: '600',
            color: '#10B981',
            textTransform: 'uppercase',
          }}>
            {plan.status}
          </div>
        </div>
      </div>

      {/* Predicted outcome */}
      <div style={{ padding: '20px 20px 0' }}>
        <PredictedOutcomeStrip kpis={plan.predictedKPIs} />
      </div>

      {/* Tab navigation */}
      <div style={{
        padding: '0 20px',
        display: 'flex',
        gap: '8px',
        borderBottom: '1px solid #E2E8F0',
        paddingBottom: '12px',
      }}>
        <Tab 
          label="Schedule (Gantt)" 
          isActive={activeTab === 'gantt'}
          onClick={() => setActiveTab('gantt')}
        />
        <Tab 
          label="Equipment" 
          isActive={activeTab === 'equipment'}
          onClick={() => setActiveTab('equipment')}
        />
        <Tab 
          label="Blend Recipe" 
          isActive={activeTab === 'blend'}
          onClick={() => setActiveTab('blend')}
        />
        <Tab 
          label="Actions" 
          isActive={activeTab === 'actions'}
          onClick={() => setActiveTab('actions')}
        />
      </div>

      {/* Content */}
      <div style={{ padding: '20px' }}>
        {activeTab === 'gantt' && (
          <ShiftPlanGantt
            tasks={plan.ganttTasks}
            title="Shift Plan Timeline (06:00 - 18:00)"
          />
        )}

        {activeTab === 'equipment' && (
          <EquipmentAssignmentTable
            assignments={plan.equipmentAssignments}
            title="Equipment Assignments"
          />
        )}

        {activeTab === 'blend' && (
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 280px' }}>
              <BlendRecipePanel
                recipe={plan.blendRecipe['TRAIN-07']}
                trainId="TRAIN-07"
                gradeTarget={62.0}
              />
            </div>
            <div style={{ flex: '1 1 280px' }}>
              <BlendRecipePanel
                recipe={plan.blendRecipe['TRAIN-08']}
                trainId="TRAIN-08"
                gradeTarget={62.0}
              />
            </div>
          </div>
        )}

        {activeTab === 'actions' && (
          <div>
            <div style={{ 
              fontSize: '14px', 
              fontWeight: '600', 
              color: '#1A1A2E',
              marginBottom: '16px',
            }}>
              Action Checklist for Supervisors
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {plan.actions.map(action => (
                <div
                  key={action.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    background: '#F9FAFB',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <input
                    type="checkbox"
                    style={{
                      width: '18px',
                      height: '18px',
                      cursor: 'pointer',
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      fontSize: '12px', 
                      fontWeight: '600', 
                      color: '#1A1A2E',
                      marginBottom: '2px',
                    }}>
                      {action.action}
                    </div>
                    <div style={{ fontSize: '11px', color: '#6B7280' }}>
                      Owner: {action.owner} • Due: {action.due}
                    </div>
                  </div>
                  <div style={{
                    padding: '4px 10px',
                    background: action.status === 'complete' ? '#D1FAE5' : '#FEF3C7',
                    borderRadius: '12px',
                    fontSize: '10px',
                    fontWeight: '600',
                    color: action.status === 'complete' ? '#065F46' : '#92400E',
                    textTransform: 'uppercase',
                  }}>
                    {action.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export { Tab, PredictedOutcomeStrip };
