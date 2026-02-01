"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from 'next/dynamic';
import FaultTreeDiagram from "./visualizations/FaultTreeDiagram";
import CrusherLinerVisualization from "./visualizations/CrusherLinerVisualization";
import KnowledgeGraphModal from "./visualizations/KnowledgeGraphModal";
import SAPWorkOrderPreview from "./visualizations/SAPWorkOrderPreview";
import RootCauseTable from "./RootCauseTable";
import HuddleBanner from "./HuddleBanner";
import ActionableRecommendations from "./ActionableRecommendations";
import AgentNetworkDisplay from "./AgentNetworkDisplay";
import { huddleAgents, recommendations } from "../data/workflowQuestions";

// WAIO imports
import { DOMAIN_MODE_IDS } from "../domains/domainModes";
import {
  WAIOAgentNetworkStage,
  WAIODeviationTraceStage,
  WAIOParallelHuddleStage,
  WAIOPlanOptionsStage,
  WAIOShiftPlanStage,
  WAIOPublishStage,
  WAIOMonitorStage,
  // Closed-loop stages (new)
  WAIOReconciliationStage,
  WAIOMinePlanRetrofitStage,
  WAIOPublishToSystemsStage,
} from "./outputStages/waio";

// Dynamic imports for Nivo charts (client-side only)
const EfficiencyTrendChart = dynamic(
  () => import('./charts/EfficiencyTrendChart'),
  { ssr: false, loading: () => <ChartPlaceholder /> }
);

const BulletChart = dynamic(
  () => import('./charts/BulletChart'),
  { ssr: false, loading: () => <ChartPlaceholder /> }
);

const WearHeatmap = dynamic(
  () => import('./charts/WearHeatmap'),
  { ssr: false, loading: () => <ChartPlaceholder /> }
);

const HuddleSummaryChart = dynamic(
  () => import('./charts/HuddleSummaryChart'),
  { ssr: false, loading: () => <ChartPlaceholder /> }
);

// New charts for enhanced agent outputs
const EfficiencyStreamChart = dynamic(
  () => import('./charts/EfficiencyStreamChart'),
  { ssr: false, loading: () => <ChartPlaceholder /> }
);

const PersonnelSankeyChart = dynamic(
  () => import('./charts/PersonnelSankeyChart'),
  { ssr: false, loading: () => <ChartPlaceholder /> }
);

const WeibullChart = dynamic(
  () => import('./charts/WeibullChart'),
  { ssr: false, loading: () => <ChartPlaceholder /> }
);

const FailureModeAreaBump = dynamic(
  () => import('./charts/FailureModeAreaBump'),
  { ssr: false, loading: () => <ChartPlaceholder /> }
);

const InventoryBarChart = dynamic(
  () => import('./charts/InventoryBarChart'),
  { ssr: false, loading: () => <ChartPlaceholder /> }
);

const AgentContributionIcicle = dynamic(
  () => import('./charts/AgentContributionIcicle'),
  { ssr: false, loading: () => <ChartPlaceholder /> }
);

// Chart placeholder during loading
function ChartPlaceholder() {
  return (
    <div style={{ 
      height: '280px', 
      background: '#f9fafb', 
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#9ca3af',
      fontSize: '12px'
    }}>
      Loading chart...
    </div>
  );
}

// Agent Badge Component - Clean, professional style
function AgentBadge({ id, color, isActive, isComplete }) {
  return (
    <div style={{
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      background: isActive ? color : isComplete ? `${color}20` : '#F3F4F6',
      border: `2px solid ${isActive ? color : isComplete ? color : '#E2E8F0'}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '11px',
      fontWeight: '700',
      letterSpacing: '0.5px',
      color: isActive ? 'white' : isComplete ? color : '#9CA3AF',
      transition: 'all 0.3s ease',
      boxShadow: isActive ? `0 0 0 3px ${color}25` : 'none',
    }}>
      {isComplete ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      ) : id}
    </div>
  );
}

// Mini Agent Badge for header - smaller version with animation
function MiniAgentBadge({ id, color, isActive, isComplete, label }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '2px',
    }}>
      <div style={{
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        background: isActive ? color : isComplete ? color : '#E2E8F0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '7px',
        fontWeight: '700',
        color: isActive || isComplete ? 'white' : '#9CA3AF',
        transition: 'all 0.3s ease',
        boxShadow: isActive ? `0 0 0 2px ${color}40, 0 0 8px ${color}60` : 'none',
        animation: isActive ? 'pulse 1.5s infinite' : 'none',
        transform: isActive ? 'scale(1.1)' : 'scale(1)',
      }}>
        {isComplete ? (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        ) : id.substring(0, 2)}
      </div>
      {label && (
        <span style={{ 
          fontSize: '6px', 
          color: isActive ? color : '#6B7280',
          fontWeight: isActive ? '600' : '400',
          whiteSpace: 'nowrap',
        }}>
          {label}
        </span>
      )}
    </div>
  );
}

// Professional SVG icons for tool calls
function ToolIcon({ type, color }) {
  const size = 16;
  const icons = {
    retrieve: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
    ),
    tool: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
      </svg>
    ),
    result: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    ),
    analysis: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
    memory: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <ellipse cx="12" cy="5" rx="9" ry="3"/>
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
      </svg>
    ),
    finding: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
    display: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    )
  };
  return icons[type] || icons.tool;
}

// Tool Call Display Component
function ToolCallDisplay({ step, isAnimating }) {
  const colors = {
    retrieve: '#3B82F6',
    tool: '#A100FF',
    result: '#6B7280',
    analysis: '#8B5CF6',
    memory: '#0078D4',
    finding: '#1a1a2e',  // Neutral dark for findings (not green)
    display: '#A100FF'
  };

  const color = colors[step.type] || '#6B7280';

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '10px',
      padding: '8px 12px',
      background: isAnimating ? `${color}08` : 'transparent',
      borderRadius: '6px',
      marginBottom: '6px',
      borderLeft: `3px solid ${color}`,
      animation: isAnimating ? 'fadeSlideIn 0.3s ease-out' : 'none'
    }}>
      <div style={{ 
        width: '20px', 
        height: '20px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexShrink: 0,
        marginTop: '1px'
      }}>
        <ToolIcon type={step.type} color={color} />
      </div>
      <div style={{ flex: 1 }}>
        {step.type === 'tool' ? (
          <span style={{ 
            fontSize: '11px', 
            fontFamily: '"SF Mono", Monaco, Consolas, monospace',
            background: '#f3f4f6',
            padding: '3px 8px',
            borderRadius: '4px',
            color: color,
            display: 'inline-block'
          }}>
            {step.name}({step.params})
          </span>
        ) : (
          <span style={{ 
            fontSize: '12px', 
            color: step.type === 'finding' ? color : '#4b5563',
            fontWeight: step.type === 'finding' ? '600' : '400',
            lineHeight: '1.5'
          }}>
            {step.text}
          </span>
        )}
      </div>
    </div>
  );
}

export default function OutputConsole({
  currentStage,
  onStageComplete,
  onSelectScenario,
  selectedScenario,
  showKnowledgeGraph,
  setShowKnowledgeGraph,
  // Dynamic agent props
  dynamicAgentResponses = {},
  activeAgent = null,
  queryAgent,
  runHuddleWorkflow,
  // Chat response from chatbot
  chatResponse = null,
  // WAIO props
  domainMode = DOMAIN_MODE_IDS.MAINTENANCE,
  selectedObjective = null,
  selectedPlan = null,
  onSelectPlan = null,
  // Processing state
  isProcessingStage = false,
  // Graph and publish handlers
  onOpenGraph = null,
  onPublish = null,
}) {
  // Check if in WAIO mode
  const isWAIOMode = domainMode === DOMAIN_MODE_IDS.WAIO_SHIFT_OPTIMISER;
  const [activeAgentIndex, setActiveAgentIndex] = useState(-1);
  const [visibleSteps, setVisibleSteps] = useState({});
  const [huddleComplete, setHuddleComplete] = useState(false);
  const [showFaultTree, setShowFaultTree] = useState(false);
  const [showRootCauseTable, setShowRootCauseTable] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [showWorkOrder, setShowWorkOrder] = useState(false);
  const [dynamicSteps, setDynamicSteps] = useState({});
  const [isRunningDynamicHuddle, setIsRunningDynamicHuddle] = useState(false);
  
  // Orchestrator activation state
  const [orchestratorPhase, setOrchestratorPhase] = useState('idle'); // 'idle' | 'activating' | 'monitoring' | 'complete'
  const [activatedAgents, setActivatedAgents] = useState([]);
  const [currentActivatingAgent, setCurrentActivatingAgent] = useState(null);
  const [showHuddleSummary, setShowHuddleSummary] = useState(false);
  
  // Chat response history
  const [chatResponseHistory, setChatResponseHistory] = useState([]);
  
  const bottomRef = useRef(null);
  
  // Add new chat response to history when received
  useEffect(() => {
    if (chatResponse && chatResponse.content) {
      setChatResponseHistory(prev => [...prev, { ...chatResponse, id: Date.now() }]);
    }
  }, [chatResponse]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentStage, activeAgentIndex, visibleSteps, showFaultTree]);

  // Handle initial analysis stage
  useEffect(() => {
    if (currentStage === 'initial_analysis') {
      // Show fault tree first
      const faultTreeTimer = setTimeout(() => {
        setShowFaultTree(true);
        
        // Show root cause table AFTER fault tree animation completes (3 seconds delay)
        // This gives users time to see the fault tree animate before the table appears
        const tableTimer = setTimeout(() => {
          setShowRootCauseTable(true);
          
          // After both are shown, notify completion
          setTimeout(() => {
            onStageComplete && onStageComplete('initial_analysis');
          }, 1500);
        }, 3000);
        
        return () => clearTimeout(tableTimer);
      }, 1500);
      
      return () => clearTimeout(faultTreeTimer);
    }
  }, [currentStage]);

  // Handle trusted huddle stage - orchestrator activation sequence
  useEffect(() => {
    if (currentStage === 'trusted_huddle' && orchestratorPhase === 'idle') {
      // Start orchestrator activation sequence
      setOrchestratorPhase('activating');
      
      // Sequentially activate each agent with delays
      const activateAgents = async () => {
        for (let i = 0; i < huddleAgents.length; i++) {
          const agent = huddleAgents[i];
          
          // Show which agent is being activated
          setCurrentActivatingAgent(agent.id);
          
          // Wait for activation animation (800ms per agent)
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // Add to activated agents
          setActivatedAgents(prev => [...prev, agent.id]);
        }
        
        // All agents activated, switch to monitoring phase
        setCurrentActivatingAgent(null);
        setOrchestratorPhase('monitoring');
        
        // Small delay then start agent execution
        setTimeout(() => {
          setActiveAgentIndex(0);
        }, 500);
      };
      
      // Start activation after brief initial delay
      setTimeout(activateAgents, 800);
      
      // If dynamic agents are available, run the AI-powered workflow in parallel
      if (runHuddleWorkflow && !isRunningDynamicHuddle) {
        setIsRunningDynamicHuddle(true);
        runHuddleWorkflow().then(() => {
          setIsRunningDynamicHuddle(false);
        }).catch(err => {
          console.error('Dynamic huddle error:', err);
          setIsRunningDynamicHuddle(false);
        });
      }
    }
  }, [currentStage, orchestratorPhase, runHuddleWorkflow, isRunningDynamicHuddle]);

  // Animate through agent steps
  useEffect(() => {
    if (currentStage !== 'trusted_huddle' || activeAgentIndex < 0 || activeAgentIndex >= huddleAgents.length) return;

    const agent = huddleAgents[activeAgentIndex];
    let stepIndex = 0;

    const animateSteps = () => {
      if (stepIndex < agent.steps.length) {
        setVisibleSteps(prev => {
          const currentSteps = prev[agent.id] || [];
          // Prevent duplicate step indices
          if (currentSteps.includes(stepIndex)) {
            return prev;
          }
          return {
            ...prev,
            [agent.id]: [...currentSteps, stepIndex]
          };
        });
        stepIndex++;
        setTimeout(animateSteps, 800);
      } else {
        // Move to next agent
        setTimeout(() => {
          if (activeAgentIndex < huddleAgents.length - 1) {
            setActiveAgentIndex(prev => prev + 1);
          } else {
            // All agents complete
            setHuddleComplete(true);
            setOrchestratorPhase('complete');
            
            // Show summary chart after brief delay
            setTimeout(() => {
              setShowHuddleSummary(true);
              // Notify completion after summary is shown
              setTimeout(() => {
                onStageComplete && onStageComplete('trusted_huddle');
              }, 1500);
            }, 800);
          }
        }, 1000);
      }
    };

    // Start animating after small delay
    const startTimer = setTimeout(animateSteps, 500);
    return () => clearTimeout(startTimer);
  }, [activeAgentIndex, currentStage]);

  // Handle recommendations stage
  useEffect(() => {
    if (currentStage === 'recommendations') {
      const timer = setTimeout(() => {
        setShowRecommendations(true);
        setTimeout(() => {
          onStageComplete && onStageComplete('recommendations');
        }, 1500);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentStage]);

  // Handle work order stage
  useEffect(() => {
    if (currentStage === 'work_order') {
      const timer = setTimeout(() => {
        setShowWorkOrder(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentStage]);

  // Generate session ID
  const sessionId = React.useMemo(() => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }, []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
      {/* Header with Progress Bar */}
      <div style={{ borderBottom: '1px solid #e2e8f0' }}>
        {/* Orange animated progress bar */}
        {currentStage && (
          <div style={{
            height: '3px',
            background: 'linear-gradient(90deg, #A100FF 0%, #7C3AED 50%, #A100FF 100%)',
            backgroundSize: '200% 100%',
            animation: 'progressSlide 2s linear infinite',
          }} />
        )}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 20px',
        }}>
          <span style={{ color: '#A100FF', fontSize: '14px', fontWeight: '600' }}>
            Output Console
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '11px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ color: '#718096' }}>Session:</span>
              <span style={{ 
                fontFamily: 'SF Mono, Monaco, Consolas, monospace', 
                color: '#1a1a2e',
                fontWeight: '500'
              }}>
                {sessionId}
              </span>
            </div>
            {currentStage === 'trusted_huddle' ? (
              /* Mini Agent Badges for Huddle */
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px',
                padding: '4px 10px',
                background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2D44 100%)',
                borderRadius: '20px',
              }}>
                {/* Super Agent mini badge */}
                <MiniAgentBadge 
                  id="SA" 
                  color="#A100FF" 
                  isActive={orchestratorPhase === 'activating'}
                  isComplete={orchestratorPhase === 'complete' || activeAgentIndex >= 0}
                />
                <span style={{ color: '#6B7280', fontSize: '8px' }}>→</span>
                {/* Agent mini badges */}
                {huddleAgents.map((agent, idx) => (
                  <MiniAgentBadge
                    key={agent.id}
                    id={agent.id}
                    color={agent.color}
                    isActive={idx === activeAgentIndex}
                    isComplete={idx < activeAgentIndex || huddleComplete}
                  />
                ))}
              </div>
            ) : currentStage && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '4px',
                padding: '4px 8px',
                background: '#f3f4f6',
                borderRadius: '4px',
              }}>
                <span style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#A100FF',
                  animation: 'pulse 1.5s infinite',
                }} />
                <span style={{ color: '#4b5563', textTransform: 'capitalize' }}>
                  {currentStage.replace('_', ' ')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        background: '#fafafa'
      }}>
        {/* Waiting state */}
        {!currentStage && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '200px',
            color: '#9ca3af'
          }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            <p style={{ marginTop: '12px', fontSize: '13px' }}>
              Waiting for your input...
            </p>
          </div>
        )}

        {/* Processing Indicator - shows when stage is loading */}
        {isProcessingStage && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px 20px',
            gap: '16px',
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid #e2e8f0',
              borderTopColor: '#A100FF',
              borderRadius: '50%',
              animation: 'processingSpinner 1s linear infinite',
            }} />
            <div style={{ 
              fontSize: '13px', 
              color: '#6b7280',
              textAlign: 'center',
            }}>
              Processing request...
            </div>
          </div>
        )}

        {/* WAIO Stages */}
        {isWAIOMode && currentStage === 'waio_agent_network' && !isProcessingStage && (
          <WAIOAgentNetworkStage onComplete={() => onStageComplete?.('waio_agent_network')} />
        )}

        {isWAIOMode && currentStage === 'waio_deviation_trace' && !isProcessingStage && (
          <WAIODeviationTraceStage onComplete={() => onStageComplete?.('waio_deviation_trace')} />
        )}

        {isWAIOMode && currentStage === 'waio_parallel_huddle' && !isProcessingStage && (
          <WAIOParallelHuddleStage 
            onComplete={() => onStageComplete?.('waio_parallel_huddle')}
            selectedObjective={selectedObjective}
          />
        )}

        {isWAIOMode && currentStage === 'waio_plan_options' && !isProcessingStage && (
          <WAIOPlanOptionsStage 
            onComplete={() => onStageComplete?.('waio_plan_options')}
            onSelectPlan={onSelectPlan}
            selectedPlan={selectedPlan}
          />
        )}

        {isWAIOMode && currentStage === 'waio_shift_plan' && !isProcessingStage && (
          <WAIOShiftPlanStage 
            onComplete={() => onStageComplete?.('waio_shift_plan')}
            selectedPlan={selectedPlan}
          />
        )}

        {isWAIOMode && currentStage === 'waio_publish' && !isProcessingStage && (
          <WAIOPublishStage onComplete={() => onStageComplete?.('waio_publish')} />
        )}

        {isWAIOMode && currentStage === 'waio_monitor' && !isProcessingStage && (
          <WAIOMonitorStage onComplete={() => onStageComplete?.('waio_monitor')} />
        )}

        {/* Closed-loop Mine Planning Stages (new) */}
        {isWAIOMode && currentStage === 'waio_reconciliation' && !isProcessingStage && (
          <WAIOReconciliationStage onComplete={() => onStageComplete?.('waio_reconciliation')} />
        )}

        {isWAIOMode && currentStage === 'waio_mine_plan_retrofit' && !isProcessingStage && (
          <WAIOMinePlanRetrofitStage 
            onComplete={() => onStageComplete?.('waio_mine_plan_retrofit')} 
            onOpenGraph={onOpenGraph}
            onPublish={onPublish}
          />
        )}

        {isWAIOMode && currentStage === 'waio_publish_to_systems' && !isProcessingStage && (
          <WAIOPublishToSystemsStage onComplete={() => onStageComplete?.('waio_publish_to_systems')} />
        )}

        {/* Agent Network Display - shows after Q1 is answered (Maintenance mode) */}
        {!isWAIOMode && currentStage === 'agent_network' && (
          <div style={{ marginBottom: '24px' }}>
            <AgentNetworkDisplay isActive={true} />
          </div>
        )}

        {/* Initial Analysis Stage */}
        {(currentStage === 'initial_analysis' || showFaultTree) && (
          <div style={{ marginBottom: '24px' }}>
            {/* Cerebra Agent header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px'
            }}>
              <AgentBadge id="SA" color="#A100FF" isActive={!showFaultTree} isComplete={showFaultTree} />
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a2e' }}>
                  Super Agent
                </div>
                <div style={{ fontSize: '11px', color: '#A100FF' }}>
                  {showFaultTree ? 'Analysis Complete' : 'Performing initial fault analysis...'}
                </div>
              </div>
            </div>

            {/* Tool calls for initial analysis */}
            {!showFaultTree && (
              <div style={{ marginBottom: '16px' }}>
                <ToolCallDisplay 
                  step={{ type: 'tool', name: 'fmea_analysis', params: 'equipment=PRIMARY_CRUSHER' }}
                  isAnimating={true}
                />
                <ToolCallDisplay 
                  step={{ type: 'analysis', text: 'Identifying probable failure modes...' }}
                  isAnimating={true}
                />
              </div>
            )}

            {/* Fault Tree - shows first and animates */}
            {showFaultTree && (
              <FaultTreeDiagram 
                onSelectScenario={onSelectScenario}
                isAnimating={true}
              />
            )}

            {/* Root Cause Table - appears AFTER fault tree animation completes */}
            {showRootCauseTable && (
              <div style={{ 
                marginTop: '16px',
                animation: 'fadeSlideIn 0.5s ease-out'
              }}>
                <RootCauseTable />
              </div>
            )}
          </div>
        )}

        {/* Trusted Huddle Stage */}
        {(currentStage === 'trusted_huddle' || huddleComplete) && selectedScenario && (
          <div style={{ marginBottom: '24px' }}>
            {/* Huddle banner - using new component with orchestrator */}
            <HuddleBanner 
              agents={huddleAgents.map(a => a.id)}
              activeAgent={huddleAgents[activeAgentIndex]?.id}
              isComplete={huddleComplete}
              activatedAgents={activatedAgents}
              showOrchestrator={true}
              orchestratorPhase={orchestratorPhase}
              currentActivatingAgent={currentActivatingAgent}
            />

            {/* Agent outputs - only show after orchestrator activation completes */}
            {orchestratorPhase !== 'activating' && huddleAgents.map((agent, agentIndex) => {
              const agentSteps = visibleSteps[agent.id] || [];
              if (agentSteps.length === 0 && agentIndex >= activeAgentIndex) return null;

              return (
                <div 
                  key={agent.id}
                  style={{
                    background: 'white',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    marginBottom: '16px',
                    overflow: 'hidden'
                  }}
                >
                  {/* Agent header */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderBottom: '1px solid #f0f0f0'
                  }}>
                    <AgentBadge 
                      id={agent.id} 
                      color={agent.color}
                      isActive={activeAgentIndex === agentIndex}
                      isComplete={activeAgentIndex > agentIndex || huddleComplete}
                    />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#1a1a2e' }}>
                        {agent.name}
                      </div>
                      <div style={{ fontSize: '10px', color: '#718096' }}>
                        {agent.role}
                      </div>
                    </div>
                  </div>

                  {/* Steps */}
                  <div style={{ padding: '12px 16px' }}>
                    {agentSteps.map((stepIndex) => {
                      const step = agent.steps[stepIndex];
                      
                      // Null guard - prevent crash if stepIndex is out of bounds
                      if (!step) return null;
                      
                      // Unique key combining agent ID and step index
                      const uniqueKey = `${agent.id}-step-${stepIndex}`;
                      
                      // Special handling for chart/visualization displays
                      if (step.type === 'display') {
                        const chartComponents = {
                          'EfficiencyTrendChart': EfficiencyTrendChart,
                          'BulletChart': BulletChart,
                          'WearHeatmap': WearHeatmap,
                          'CrusherLinerVisualization': CrusherLinerVisualization,
                          'EfficiencyStreamChart': EfficiencyStreamChart,
                          'PersonnelSankeyChart': PersonnelSankeyChart,
                          'WeibullChart': WeibullChart,
                          'FailureModeAreaBump': FailureModeAreaBump,
                          'InventoryBarChart': InventoryBarChart,
                          'AgentContributionIcicle': AgentContributionIcicle,
                        };
                        
                        const ChartComponent = chartComponents[step.component];
                        if (ChartComponent) {
                          return (
                            <div key={uniqueKey} style={{ marginBottom: '12px' }}>
                              <ChartComponent />
                            </div>
                          );
                        }
                        // If component not found, skip this step silently
                        return null;
                      }

                      return (
                        <ToolCallDisplay
                          key={uniqueKey}
                          step={step}
                          isAnimating={agentIndex === activeAgentIndex}
                        />
                      );
                    })}
                    
                    {/* Display AI-generated responses if available - Clean inline format */}
                    {dynamicAgentResponses[agent.id] && dynamicAgentResponses[agent.id].length > 0 && (
                      <div style={{ 
                        marginTop: '8px',
                        paddingTop: '8px',
                        borderTop: '1px dashed #e2e8f0'
                      }}>
                        {dynamicAgentResponses[agent.id].map((response, idx) => (
                          <div 
                            key={`${agent.id}-ai-${idx}`}
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '8px',
                              padding: '6px 10px',
                              marginBottom: '4px',
                              borderLeft: `2px solid ${agent.color}`,
                              animation: 'fadeSlideIn 0.3s ease-out'
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={agent.color} strokeWidth="2" style={{ flexShrink: 0, marginTop: '2px' }}>
                              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                              <polyline points="22 4 12 14.01 9 11.01"/>
                            </svg>
                            <div style={{ flex: 1, fontSize: '11px', color: '#374151', lineHeight: '1.5', whiteSpace: 'pre-line' }}>
                              {response.content}
                              <span style={{ fontSize: '9px', color: '#9CA3AF', marginLeft: '8px' }}>
                                AI
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            
            {/* Huddle Summary Chart - shows when huddle is complete */}
            {showHuddleSummary && (
              <div style={{ animation: 'fadeSlideIn 0.5s ease-out' }}>
                <HuddleSummaryChart />
                
                {/* User interaction prompt */}
                <div style={{
                  background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2D44 100%)',
                  borderRadius: '8px',
                  padding: '16px 20px',
                  marginTop: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: 'white' }}>
                      Analysis Complete
                    </div>
                    <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '4px' }}>
                      Ready for your next action. View recommendations or explore the knowledge graph.
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#A100FF',
                      animation: 'pulse 1.5s infinite',
                    }} />
                    <span style={{ fontSize: '11px', color: '#A100FF' }}>Awaiting input</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Recommendations Stage - Enhanced actionable version */}
        {showRecommendations && (
          <ActionableRecommendations
            onCreateWorkOrder={() => setShowWorkOrder(true)}
            onShowKnowledgeGraph={() => setShowKnowledgeGraph(true)}
            onSendEmail={() => {
              // Email sent notification
              console.log('Urgent report sent');
            }}
          />
        )}

        {/* Work Order Stage */}
        {showWorkOrder && (
          <div style={{ marginBottom: '16px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px'
            }}>
              <AgentBadge id="WO" color="#0078D4" isActive={false} isComplete={true} />
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a2e' }}>
                  Work Order Agent
                </div>
                <div style={{ fontSize: '11px', color: '#A100FF' }}>
                  SAP Work Order Created
                </div>
              </div>
            </div>

            <ToolCallDisplay 
              step={{ type: 'tool', name: 'sap_pm_create_notification', params: 'equipment=CRUSHER_001' }}
              isAnimating={false}
            />
            <ToolCallDisplay 
              step={{ type: 'result', text: 'Notification #10075234 created successfully' }}
              isAnimating={false}
            />
            <ToolCallDisplay 
              step={{ type: 'tool', name: 'sap_pm_draft_work_order', params: 'notification=10075234' }}
              isAnimating={false}
            />
            <ToolCallDisplay 
              step={{ type: 'result', text: 'Work Order #WO-2025-0147 drafted' }}
              isAnimating={false}
            />

            <div style={{ marginTop: '16px' }}>
              <SAPWorkOrderPreview />
            </div>
          </div>
        )}

        {/* Chat Response Display - Shows chatbot responses with visualizations */}
        {chatResponseHistory.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '16px',
              paddingBottom: '12px',
              borderBottom: '2px solid #A100FF'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #A100FF 0%, #7C3AED 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a2e' }}>
                  Assistant Response
                </div>
                <div style={{ fontSize: '10px', color: '#6b7280' }}>
                  Query results with visualizations
                </div>
              </div>
            </div>
            
            {chatResponseHistory.map((response, idx) => (
              <ChatResponseCard 
                key={response.id || idx} 
                response={response} 
                isLatest={idx === chatResponseHistory.length - 1}
              />
            ))}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Knowledge Graph Modal */}
      <KnowledgeGraphModal 
        isOpen={showKnowledgeGraph}
        onClose={() => setShowKnowledgeGraph(false)}
      />

      <style jsx>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes progressSlide {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes processingSpinner {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// Recommendation Section Component
// RecommendationSection moved to ActionableRecommendations component

// Chat Response Card with relevant visualizations
function ChatResponseCard({ response, isLatest }) {
  // Determine which visualization to show based on topic
  const getVisualization = (topic) => {
    switch (topic?.toLowerCase()) {
      case 'work order':
        return { component: 'workorder_summary', label: 'Work Order Details' };
      case 'equipment':
        return { component: 'equipment_kpi', label: 'Equipment KPIs' };
      case 'liner diagnostics':
      case 'liner':
        return { component: 'wear_heatmap', label: 'Liner Wear Analysis' };
      case 'timeseries':
        return { component: 'efficiency_trend', label: 'Efficiency Trend' };
      case 'reliability':
        return { component: 'reliability_metrics', label: 'Reliability Analysis' };
      case 'inventory':
        return { component: 'inventory_status', label: 'Parts Availability' };
      case 'labor':
        return { component: 'crew_assignment', label: 'Crew Assignment' };
      case 'root cause':
        return { component: 'rca_summary', label: 'Root Cause Analysis' };
      case 'recommendations':
        return { component: 'action_items', label: 'Action Items' };
      case 'schedule':
        return { component: 'timeline', label: 'Maintenance Timeline' };
      default:
        return null;
    }
  };
  
  const viz = getVisualization(response.topic);
  
  // Format content with markdown-style bold
  const formatContent = (content) => {
    if (!content) return content;
    const lines = content.split('\n');
    return lines.map((line, i) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      return (
        <div key={i} style={{ marginBottom: line.startsWith('•') ? '4px' : '8px' }}>
          {parts.map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={j} style={{ color: '#1a1a2e' }}>{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </div>
      );
    });
  };

  return (
    <div style={{
      background: isLatest ? '#fafafa' : 'white',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      marginBottom: '12px',
      overflow: 'hidden',
      animation: isLatest ? 'fadeSlideIn 0.5s ease-out' : 'none',
    }}>
      {/* Query header */}
      <div style={{
        padding: '12px 16px',
        background: 'linear-gradient(90deg, #A100FF08 0%, transparent 100%)',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}>
        <div style={{
          fontSize: '11px',
          color: '#A100FF',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
          </svg>
          Query
        </div>
        <div style={{ fontSize: '12px', color: '#374151', flex: 1 }}>
          "{response.query}"
        </div>
        <div style={{ fontSize: '9px', color: '#9ca3af' }}>
          {response.timestamp}
        </div>
      </div>

      {/* Agent & Tool info */}
      {(response.agent || response.toolUsed) && (
        <div style={{
          padding: '8px 16px',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          gap: '12px',
          fontSize: '10px',
        }}>
          {response.agent && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#6b7280' }}>
              <span style={{
                background: '#A100FF',
                color: 'white',
                padding: '2px 6px',
                borderRadius: '3px',
                fontWeight: '600',
                fontSize: '9px',
              }}>
                {response.agent}
              </span>
              Agent
            </div>
          )}
          {response.toolUsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#6b7280' }}>
              <code style={{
                background: '#f3f4f6',
                padding: '2px 6px',
                borderRadius: '3px',
                fontSize: '9px',
                fontFamily: 'monospace',
              }}>
                {response.toolUsed}
              </code>
              Tool
            </div>
          )}
          {response.cached && (
            <div style={{ 
              marginLeft: 'auto',
              background: '#10B98120',
              color: '#10B981',
              padding: '2px 6px',
              borderRadius: '3px',
              fontSize: '9px',
              fontWeight: '500',
            }}>
              ⚡ Cached
            </div>
          )}
        </div>
      )}

      {/* Main content */}
      <div style={{ padding: '16px' }}>
        {/* Response text */}
        <div style={{
          fontSize: '12px',
          color: '#4b5563',
          lineHeight: '1.6',
          marginBottom: viz ? '16px' : 0,
        }}>
          {formatContent(response.content)}
        </div>

        {/* Visualization based on topic */}
        {viz && isLatest && (
          <div style={{
            marginTop: '16px',
            paddingTop: '16px',
            borderTop: '1px dashed #e2e8f0',
          }}>
            <div style={{
              fontSize: '10px',
              fontWeight: '600',
              color: '#6b7280',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="20" x2="18" y2="10"/>
                <line x1="12" y1="20" x2="12" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
              {viz.label}
            </div>
            <TopicVisualization topic={response.topic} />
          </div>
        )}
      </div>

      {/* Topic badge */}
      <div style={{
        padding: '8px 16px',
        background: '#f9fafb',
        borderTop: '1px solid #f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{
          fontSize: '9px',
          color: '#A100FF',
          background: '#A100FF10',
          padding: '3px 8px',
          borderRadius: '10px',
        }}>
          {response.topic} context
        </div>
      </div>
    </div>
  );
}

// Topic-specific mini visualization
function TopicVisualization({ topic }) {
  const topicLower = topic?.toLowerCase() || '';
  
  // Work Order Summary
  if (topicLower.includes('work order')) {
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '8px',
      }}>
        {[
          { label: 'WO Number', value: '4000000147', color: '#1a1a2e' },
          { label: 'Status', value: 'REL', color: '#10B981' },
          { label: 'Priority', value: 'Very High', color: '#EF4444' },
          { label: 'Est. Cost', value: '$20,174', color: '#F59E0B' },
        ].map((item, i) => (
          <div key={i} style={{
            background: '#fafafa',
            padding: '10px',
            borderRadius: '6px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '14px', fontWeight: '700', color: item.color }}>{item.value}</div>
            <div style={{ fontSize: '9px', color: '#6b7280' }}>{item.label}</div>
          </div>
        ))}
      </div>
    );
  }
  
  // Liner/Wear Analysis
  if (topicLower.includes('liner') || topicLower.includes('wear')) {
    return (
      <div style={{ display: 'flex', gap: '8px' }}>
        {['A', 'B', 'C', 'D'].map((zone, i) => {
          const wear = [60, 85, 55, 70][i];
          const color = wear > 80 ? '#EF4444' : wear > 65 ? '#F59E0B' : '#10B981';
          return (
            <div key={zone} style={{
              flex: 1,
              background: '#fafafa',
              padding: '12px',
              borderRadius: '6px',
              textAlign: 'center',
              borderTop: `3px solid ${color}`,
            }}>
              <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '4px' }}>Zone {zone}</div>
              <div style={{ fontSize: '18px', fontWeight: '700', color }}>{wear}%</div>
              <div style={{ fontSize: '9px', color: '#9ca3af' }}>
                {wear > 80 ? 'Critical' : wear > 65 ? 'Warning' : 'OK'}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
  
  // Reliability Metrics
  if (topicLower.includes('reliability') || topicLower.includes('weibull')) {
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '8px',
      }}>
        {[
          { label: 'P(Failure)', value: '38%', color: '#EF4444' },
          { label: 'Weibull β', value: '2.1', color: '#8B5CF6' },
          { label: 'RUL', value: '5-7 days', color: '#F59E0B' },
        ].map((item, i) => (
          <div key={i} style={{
            background: '#fafafa',
            padding: '10px',
            borderRadius: '6px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '16px', fontWeight: '700', color: item.color }}>{item.value}</div>
            <div style={{ fontSize: '9px', color: '#6b7280' }}>{item.label}</div>
          </div>
        ))}
      </div>
    );
  }
  
  // Equipment KPIs
  if (topicLower.includes('equipment') || topicLower.includes('crusher')) {
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '8px',
      }}>
        {[
          { label: 'Efficiency', value: '82%', target: '89%', color: '#EF4444' },
          { label: 'Hours', value: '48,250', color: '#3B82F6' },
          { label: 'Criticality', value: 'A', color: '#A100FF' },
        ].map((item, i) => (
          <div key={i} style={{
            background: '#fafafa',
            padding: '10px',
            borderRadius: '6px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '16px', fontWeight: '700', color: item.color }}>{item.value}</div>
            <div style={{ fontSize: '9px', color: '#6b7280' }}>{item.label}</div>
            {item.target && <div style={{ fontSize: '8px', color: '#9ca3af' }}>Target: {item.target}</div>}
          </div>
        ))}
      </div>
    );
  }
  
  // Parts Inventory
  if (topicLower.includes('inventory') || topicLower.includes('part')) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {[
          { part: 'CJ-8845', name: 'Fixed Liner', qty: 4, status: 'In Stock' },
          { part: 'CJ-8846', name: 'Movable Liner', qty: 3, status: 'In Stock' },
        ].map((item, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: '#fafafa',
            padding: '8px 12px',
            borderRadius: '6px',
          }}>
            <code style={{ fontSize: '10px', color: '#A100FF', fontWeight: '600' }}>{item.part}</code>
            <span style={{ flex: 1, fontSize: '11px', color: '#374151' }}>{item.name}</span>
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#1a1a2e' }}>{item.qty}</span>
            <span style={{
              fontSize: '9px',
              background: '#10B98120',
              color: '#10B981',
              padding: '2px 6px',
              borderRadius: '3px',
            }}>
              {item.status}
            </span>
          </div>
        ))}
      </div>
    );
  }
  
  // Labor/Crew
  if (topicLower.includes('labor') || topicLower.includes('crew')) {
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '8px',
      }}>
        <div style={{
          background: '#fafafa',
          padding: '12px',
          borderRadius: '6px',
        }}>
          <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '4px' }}>Lead Technician</div>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#1a1a2e' }}>James Morrison</div>
          <div style={{ fontSize: '9px', color: '#6b7280' }}>95% skill match</div>
        </div>
        <div style={{
          background: '#fafafa',
          padding: '12px',
          borderRadius: '6px',
        }}>
          <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '4px' }}>Team Assignment</div>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#1a1a2e' }}>Team A</div>
          <div style={{ fontSize: '9px', color: '#3B82F6' }}>4 fitters available</div>
        </div>
      </div>
    );
  }
  
  // Default - no specific visualization
  return null;
}
