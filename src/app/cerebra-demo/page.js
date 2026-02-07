"use client";

import React, { useState, useCallback, useEffect } from "react";
import "./styles/cerebra.css";
import LoginScreen from "./components/LoginScreen";
import CerebraHeader from "./components/CerebraHeader";
import MiningProcessFlowDiagram from "./components/MiningProcessFlowDiagram";
import ConversationPanel from "./components/ConversationPanel";
import OutputConsole from "./components/OutputConsole";
import NotificationPanel from "./components/NotificationPanel";
import { notifications } from "./data/miningData";
import { workflowQuestions, faultTreeOptions } from "./data/workflowQuestions";
import { useDynamicAgents } from "./hooks/useDynamicAgents";

// WAIO imports
import { DOMAIN_MODES, DOMAIN_MODE_IDS, DEFAULT_DOMAIN_MODE } from "./domains/domainModes";
import { waioNotifications } from "./data/waio/waioNotifications";
import { waioWorkflowQuestions, waioStageConfig, waioObjectiveWeights, getRandomScenarioVariant, getCurrentScenarioVariant, setScenarioVariantById } from "./data/waio/waioWorkflowQuestions";
import { waioShift } from "./data/waio/waioScenarioContext";
import { WAIOKPIStrip } from "./components/waio";

// MRO Overview Components
import { MROKPIStrip, MROOperationsFlowDiagram } from "./components/mro";
import MROOntologyGraphModal from "./components/visualizations/MROOntologyGraphModal";

// MRO imports
import { mroNotifications } from "./data/mro/mroNotifications";
import { mroWorkflowQuestions, mroStageConfig } from "./data/mro/mroWorkflowQuestions";
import { mroScenarioContext } from "./data/mro/mroScenarioContext";
import { getRandomMROScenarioVariant, getCurrentMROScenarioVariant, setMROScenarioVariantById } from "./data/mro/mroScenarioVariants";

// Graph modal
import P2COntologyGraphModal from "./components/visualizations/P2COntologyGraphModal";

// Scene states
const SCENES = {
  LOGIN: "login",
  OVERVIEW: "overview",
  ANALYSIS: "analysis",
};

export default function CerebraDemo() {
  const [currentScene, setCurrentScene] = useState(SCENES.LOGIN);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Domain mode state
  const [domainMode, setDomainMode] = useState(DEFAULT_DOMAIN_MODE);
  const activeDomain = DOMAIN_MODES[domainMode];
  
  // Workflow state
  const [currentQuestionId, setCurrentQuestionId] = useState('q1');
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [isConversationLocked, setIsConversationLocked] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState(null);
  
  // WAIO-specific state
  const [selectedObjective, setSelectedObjective] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  
  // Output console state
  const [outputStage, setOutputStage] = useState(null);
  const [stageHistory, setStageHistory] = useState([]);
  const [showKnowledgeGraph, setShowKnowledgeGraph] = useState(false);
  const [isProcessingStage, setIsProcessingStage] = useState(false);
  
  // Helper to set output stage with processing delay (simulates AI inference)
  const setOutputStageWithDelay = useCallback((stage, delay = 800) => {
    setIsProcessingStage(true);
    // Before setting new output stage, save current one to history
    if (outputStage) {
      setStageHistory(prev => [...prev, { stage: outputStage, questionId: currentQuestionId }]);
    }
    setOutputStage(null); // Clear current stage
    setTimeout(() => {
      setOutputStage(stage);
      setIsProcessingStage(false);
    }, delay + Math.random() * 400); // Add slight randomness for realism
  }, [outputStage, currentQuestionId]);

  // Handle navigating backwards through stages
  const handleStageBack = useCallback(() => {
    if (stageHistory.length === 0) return;

    const previousStages = [...stageHistory];
    const previousStage = previousStages.pop();

    setStageHistory(previousStages);
    setOutputStage(previousStage.stage);

    // Set corresponding question ID based on stage
    if (previousStage.questionId) {
      setCurrentQuestionId(previousStage.questionId);
    }
  }, [stageHistory]);
  
  // P2C Ontology Graph modal state
  const [showP2CGraph, setShowP2CGraph] = useState(false);
  const [graphFocusId, setGraphFocusId] = useState(null);
  const [graphMode, setGraphMode] = useState('instance');

  // Control Tower overlay state (MRO mode)
  const [showControlTowerOverlay, setShowControlTowerOverlay] = useState(false);
  
  // Chatbot response state - displayed in Output Console
  const [chatResponse, setChatResponse] = useState(null);
  
  // Dynamic agents hook for AI-powered responses
  const {
    agentResponses,
    activeAgent,
    isProcessing: isAgentProcessing,
    queryAgent,
    runHuddleWorkflow,
    reset: resetAgents,
  } = useDynamicAgents();
  
  // Helper to get active workflow questions based on domain
  const getActiveWorkflowQuestions = () => {
    if (domainMode === DOMAIN_MODE_IDS.MRO_SUPPLY_CHAIN) return mroWorkflowQuestions;
    if (domainMode === DOMAIN_MODE_IDS.WAIO_SHIFT_OPTIMISER) return waioWorkflowQuestions;
    return workflowQuestions;
  };
  
  // Helper to get active notifications based on domain
  const getActiveNotifications = () => {
    if (domainMode === DOMAIN_MODE_IDS.MRO_SUPPLY_CHAIN) return mroNotifications;
    if (domainMode === DOMAIN_MODE_IDS.WAIO_SHIFT_OPTIMISER) return waioNotifications;
    return notifications;
  };
  
  // Handle domain mode switch
  const handleDomainModeSwitch = useCallback((newMode) => {
    if (newMode === domainMode) return;
    
    setDomainMode(newMode);
    
    // Randomize scenario variant when entering WAIO mode for varied demo experience
    if (newMode === DOMAIN_MODE_IDS.WAIO_SHIFT_OPTIMISER) {
      const variant = getRandomScenarioVariant();
      console.log('WAIO Scenario Rotated:', variant.name, variant.trainId);
    }

    // Randomize scenario variant when entering MRO mode
    if (newMode === DOMAIN_MODE_IDS.MRO_SUPPLY_CHAIN) {
      const variant = getRandomMROScenarioVariant();
      console.log('MRO Scenario Rotated:', variant.name, variant.aircraftTail);
    }

    // Reset all conversation and workflow state
    const startQuestion = newMode === DOMAIN_MODE_IDS.WAIO_SHIFT_OPTIMISER ? 'waio_q1'
      : newMode === DOMAIN_MODE_IDS.MRO_SUPPLY_CHAIN ? 'mro_q1'
      : 'q1';
    setCurrentQuestionId(startQuestion);
    setAnsweredQuestions([]);
    setIsConversationLocked(false);
    setSelectedScenario(null);
    setSelectedObjective(null);
    setSelectedPlan(null);
    setOutputStage(null);
    setShowKnowledgeGraph(false);
    setShowP2CGraph(false);
    setChatResponse(null);
    resetAgents();
  }, [domainMode, resetAgents]);
  
  // Handle opening P2C graph modal
  const handleOpenGraph = useCallback(({ focusId = null, mode = 'instance' } = {}) => {
    setGraphFocusId(focusId);
    setGraphMode(mode);
    setShowP2CGraph(true);
  }, []);
  
  // Handle closing P2C graph modal  
  const handleCloseGraph = useCallback(() => {
    setShowP2CGraph(false);
    setGraphFocusId(null);
  }, []);

  // Get current question object
  const getCurrentQuestion = () => {
    if (!currentQuestionId) {
      console.log('getCurrentQuestion: No currentQuestionId');
      return null;
    }
    
    // WAIO mode uses waioWorkflowQuestions
    if (domainMode === DOMAIN_MODE_IDS.WAIO_SHIFT_OPTIMISER) {
      const question = waioWorkflowQuestions[currentQuestionId];
      console.log('getCurrentQuestion (WAIO):', { domainMode, currentQuestionId, questionFound: !!question, questionText: question?.text?.substring(0, 50) });
      return question;
    }

    // MRO mode uses mroWorkflowQuestions
    if (domainMode === DOMAIN_MODE_IDS.MRO_SUPPLY_CHAIN) {
      const question = mroWorkflowQuestions[currentQuestionId];
      console.log('getCurrentQuestion (MRO):', { domainMode, currentQuestionId, questionFound: !!question, questionText: question?.text?.substring(0, 50) });
      return question;
    }

    // Maintenance mode uses workflowQuestions
    const question = workflowQuestions[currentQuestionId];
    console.log('getCurrentQuestion (Maintenance):', { domainMode, currentQuestionId, questionFound: !!question });
    
    // For Q3, populate dynamic options from fault tree
    if (question && question.isDynamic) {
      return {
        ...question,
        options: faultTreeOptions.map(opt => ({
          id: opt.id,
          label: opt.label,
          probability: opt.probability,
          evidence: opt.evidence,
          color: opt.color
        }))
      };
    }
    return question;
  };

  // Handle login
  const handleLogin = useCallback(() => {
    console.log('LOGIN: Setting scene to OVERVIEW');
    setCurrentScene(SCENES.OVERVIEW);
  }, []);
  
  // Debug: Log scene changes
  useEffect(() => {
    console.log('SCENE CHANGED TO:', currentScene);
  }, [currentScene]);
  
  // Debug: Log question changes
  useEffect(() => {
    console.log('QUESTION CHANGED TO:', currentQuestionId);
  }, [currentQuestionId]);

  // Handle clicking on equipment in digital twin
  const handleEquipmentClick = useCallback((equipmentId) => {
    console.log('handleEquipmentClick:', { equipmentId, domainMode });

    // Handle "Expand Full Ontology" from overview graph
    if (equipmentId === '__expand__') {
      handleOpenGraph();
      return;
    }

    // In WAIO mode, any clickable element triggers the WAIO workflow
    // In MRO mode, any clickable element triggers the MRO workflow
    // In maintenance mode, only primary_crusher triggers analysis
    const shouldTrigger = domainMode === DOMAIN_MODE_IDS.WAIO_SHIFT_OPTIMISER || domainMode === DOMAIN_MODE_IDS.MRO_SUPPLY_CHAIN || equipmentId === 'primary_crusher';

    if (shouldTrigger) {
      // Reset analysis state - use correct starting question based on domain mode
      const startingQuestion = domainMode === DOMAIN_MODE_IDS.WAIO_SHIFT_OPTIMISER ? 'waio_q1'
        : domainMode === DOMAIN_MODE_IDS.MRO_SUPPLY_CHAIN ? 'mro_q1' : 'q1';
      console.log('Starting analysis with question:', startingQuestion);
      
      setCurrentScene(SCENES.ANALYSIS);
      setCurrentQuestionId(startingQuestion);
      setAnsweredQuestions([]);
      setIsConversationLocked(false);
      setSelectedScenario(null);
      setOutputStage(null);
      // Reset WAIO-specific state
      setSelectedObjective(null);
      setSelectedPlan(null);
      // Reset dynamic agents
      resetAgents();
    }
  }, [resetAgents, domainMode]);

  // Handle notification click
  const handleNotificationClick = useCallback((notification) => {
    // For WAIO mode, clicking a notification with a scenarioVariantId starts that scenario
    if (domainMode === DOMAIN_MODE_IDS.WAIO_SHIFT_OPTIMISER && notification.scenarioVariantId) {
      // Set the scenario variant based on the notification
      const variant = setScenarioVariantById(notification.scenarioVariantId);
      console.log('Notification clicked - Setting scenario:', variant.name, variant.trainId);

      // Close notifications panel
      setShowNotifications(false);

      // Navigate to analysis scene and reset workflow to Q1
      setCurrentScene(SCENES.ANALYSIS);
      setCurrentQuestionId('waio_q1');
      setAnsweredQuestions([]);
      setSelectedScenario(null);
      setOutputStage(null);
      setSelectedObjective(null);
      setSelectedPlan(null);
      setChatResponse(null);
      return;
    }

    // For MRO mode, clicking a notification with a scenarioVariantId starts that scenario
    if (domainMode === DOMAIN_MODE_IDS.MRO_SUPPLY_CHAIN && notification.scenarioVariantId) {
      const variant = setMROScenarioVariantById(notification.scenarioVariantId);
      console.log('MRO Notification clicked - Setting scenario:', variant.name, variant.aircraftTail);

      setShowNotifications(false);
      setCurrentScene(SCENES.ANALYSIS);
      setCurrentQuestionId('mro_q1');
      setAnsweredQuestions([]);
      setSelectedScenario(null);
      setOutputStage(null);
      setSelectedObjective(null);
      setSelectedPlan(null);
      setChatResponse(null);
      return;
    }

    // For maintenance mode or non-actionable notifications
    if (notification.severity === "critical") {
      setShowNotifications(false);
      handleEquipmentClick('primary_crusher');
    }
  }, [domainMode, handleEquipmentClick]);

  // Handle answer in conversation panel
  const handleAnswer = useCallback((questionId, optionId) => {
    console.log('handleAnswer called:', { questionId, optionId, domainMode });
    const activeQuestions = getActiveWorkflowQuestions();
    const question = activeQuestions[questionId];
    const timestamp = new Date().toLocaleTimeString();
    
    // Record the answer
    setAnsweredQuestions(prev => [...prev, {
      questionId,
      question,
      answer: optionId,
      timestamp
    }]);

    // Handle WAIO question flows
    if (domainMode === DOMAIN_MODE_IDS.WAIO_SHIFT_OPTIMISER) {
      switch (questionId) {
        case 'waio_q1':
          if (optionId === 'yes') {
            setCurrentQuestionId('waio_q2');
            setOutputStageWithDelay('waio_agent_network', 600);
          }
          break;
          
        case 'waio_q2':
          if (optionId === 'yes') {
            setIsConversationLocked(true);
            setOutputStageWithDelay('waio_deviation_trace', 800);
          } else {
            setCurrentQuestionId('waio_q3');
          }
          break;
          
        case 'waio_q3': {
          // User selected an objective - proceed to parallel huddle question
          console.log('WAIO Q3 answered:', optionId, '- advancing to Q4');
          setSelectedObjective(optionId);
          setCurrentQuestionId('waio_q4');
          break;
        }
          
        case 'waio_q4':
          if (optionId === 'yes') {
            setIsConversationLocked(true);
            setOutputStageWithDelay('waio_parallel_huddle', 1000);
          }
          break;
          
        case 'waio_q5':
          // User selected a plan option
          setSelectedPlan(optionId === 'plan_a' ? 'PLAN-A' : optionId === 'plan_b' ? 'PLAN-B' : 'PLAN-C');
          setCurrentQuestionId('waio_q6');
          setOutputStageWithDelay('waio_shift_plan', 700);
          break;
          
        case 'waio_q6':
          if (optionId === 'yes') {
            setIsConversationLocked(true);
            setOutputStageWithDelay('waio_publish', 800);
          } else {
            setCurrentQuestionId('waio_q5');
            setOutputStageWithDelay('waio_plan_options', 500);
          }
          break;
          
        case 'waio_q7':
          if (optionId === 'yes') {
            setOutputStageWithDelay('waio_monitor', 600);
          }
          // Q7 now transitions to Q8 (closed-loop) regardless of answer
          setCurrentQuestionId('waio_q8');
          break;
          
        // ============================================================================
        // CLOSED-LOOP MINE PLANNING HANDLERS (Q8-Q10)
        // ============================================================================
          
        case 'waio_q8':
          if (optionId === 'yes') {
            setIsConversationLocked(true);
            setOutputStageWithDelay('waio_reconciliation', 900);
          }
          break;
          
        case 'waio_q9':
          if (optionId === 'yes') {
            setIsConversationLocked(true);
            setOutputStageWithDelay('waio_mine_plan_retrofit', 1000);
          }
          break;
          
        case 'waio_q10':
          if (optionId === 'yes') {
            setIsConversationLocked(true);
            setOutputStageWithDelay('waio_publish_to_systems', 800);
          } else {
            // User chose not to publish - still advance to complete
            setCurrentQuestionId('waio_complete');
          }
          break;
      }
      return;
    }

    // Handle MRO question flows
    if (domainMode === DOMAIN_MODE_IDS.MRO_SUPPLY_CHAIN) {
      switch (questionId) {
        case 'mro_q1':
          if (optionId === 'yes') {
            setCurrentQuestionId('mro_q2');
            setOutputStageWithDelay('mro_agent_network', 600);
          }
          break;
        case 'mro_q2':
          if (optionId === 'yes' || optionId === 'detailed') {
            setIsConversationLocked(true);
            setOutputStageWithDelay('mro_control_tower', 800);
          }
          break;
        case 'mro_q3':
          if (optionId === 'yes' || optionId === 'ask') {
            setIsConversationLocked(true);
            setOutputStageWithDelay('mro_aip_agent', 900);
          }
          break;
        case 'mro_q4':
          // Alert selection
          setIsConversationLocked(true);
          setOutputStageWithDelay('mro_alert_triage', 800);
          break;
        case 'mro_q5':
          if (optionId === 'yes' || optionId === 'explore') {
            setIsConversationLocked(true);
            setOutputStageWithDelay('mro_alert_detail', 1000);
          }
          break;
        case 'mro_q6':
          // Scenario option selected
          setSelectedPlan(optionId);
          setIsConversationLocked(true);
          setOutputStageWithDelay('mro_scenario_builder', 800);
          break;
        case 'mro_q7':
          if (optionId === 'yes') {
            setIsConversationLocked(true);
            setOutputStageWithDelay('mro_action_pack', 800);
          }
          break;
        case 'mro_q8':
          if (optionId === 'mbh') {
            // Show approval gate first, then auto-chain to MBH dashboard after approval
            setIsConversationLocked(true);
            setOutputStageWithDelay('mro_approval', 800);
          } else if (optionId === 'automation') {
            setIsConversationLocked(true);
            setOutputStageWithDelay('mro_automation', 800);
          }
          // complete → do nothing (cycle ends)
          break;
        case 'mro_q9':
          if (optionId === 'yes' || optionId === 'overview') {
            setIsConversationLocked(true);
            setOutputStageWithDelay('mro_mbh_dashboard', 900);
          }
          break;
        case 'mro_q10':
          if (optionId === 'yes' || optionId === 'review') {
            setIsConversationLocked(true);
            setOutputStageWithDelay('mro_mbh_resolve', 800);
          }
          break;
        case 'mro_q11':
          if (optionId === 'yes') {
            setIsConversationLocked(true);
            setOutputStageWithDelay('mro_automation', 800);
          }
          break;
        case 'mro_q12':
          if (optionId === 'finalize') {
            setCurrentQuestionId('mro_complete');
          } else {
            setIsConversationLocked(true);
            setOutputStageWithDelay('mro_automation', 800);
          }
          break;
      }
      return;
    }

    // Handle maintenance mode question flows
    switch (questionId) {
      case 'q1':
        if (optionId === 'yes') {
          setCurrentQuestionId('q2');
          // Show agent network visualization
          setOutputStage('agent_network');
        }
        break;
        
      case 'q2':
        if (optionId === 'yes') {
          // Lock conversation and start initial analysis
          setIsConversationLocked(true);
          setOutputStage('initial_analysis');
        }
        break;
        
      case 'q3':
        // User selected a scenario from fault tree
        setSelectedScenario(optionId);
        setIsConversationLocked(true);
        setOutputStage('trusted_huddle');
        break;
        
      case 'q4':
        if (optionId === 'yes') {
          // Show knowledge graph
          setShowKnowledgeGraph(true);
        }
        setCurrentQuestionId('q5');
        break;
        
      case 'q5':
        if (optionId === 'yes') {
          setIsConversationLocked(true);
          setOutputStage('recommendations');
        }
        break;
        
      case 'q6':
        if (optionId === 'yes') {
          setIsConversationLocked(true);
          setOutputStage('work_order');
        }
        break;
    }
  }, [domainMode]);

  // Handle stage completion from output console
  const handleStageComplete = useCallback((stage) => {
    // Handle WAIO stages
    if (domainMode === DOMAIN_MODE_IDS.WAIO_SHIFT_OPTIMISER) {
      switch (stage) {
        case 'waio_agent_network':
          // Continue to next question
          break;
          
        case 'waio_deviation_trace':
          setIsConversationLocked(false);
          setCurrentQuestionId('waio_q3');
          break;
          
        case 'waio_parallel_huddle':
          setIsConversationLocked(false);
          setCurrentQuestionId('waio_q5');
          setOutputStage('waio_plan_options');
          break;
          
        case 'waio_plan_options':
          // Wait for user selection
          break;
          
        case 'waio_shift_plan':
          // Wait for user to publish
          break;
          
        case 'waio_publish':
          setIsConversationLocked(false);
          setCurrentQuestionId('waio_q7');
          break;
          
        case 'waio_monitor':
          // Monitor stage complete - continue to Q8 (reconciliation)
          setIsConversationLocked(false);
          setCurrentQuestionId('waio_q8');
          break;
          
        // ============================================================================
        // CLOSED-LOOP MINE PLANNING STAGE HANDLERS
        // ============================================================================
          
        case 'waio_reconciliation':
          setIsConversationLocked(false);
          setCurrentQuestionId('waio_q9');
          break;
          
        case 'waio_mine_plan_retrofit':
          setIsConversationLocked(false);
          setCurrentQuestionId('waio_q10');
          break;
          
        case 'waio_publish_to_systems':
          // Final stage - transition to complete state
          setIsConversationLocked(false);
          setCurrentQuestionId('waio_complete');
          break;
      }
      return;
    }

    // Handle MRO stages
    if (domainMode === DOMAIN_MODE_IDS.MRO_SUPPLY_CHAIN) {
      switch (stage) {
        case 'mro_agent_network':
          setIsConversationLocked(false);
          setCurrentQuestionId('mro_q2');
          setOutputStageWithDelay('mro_control_tower', 600);
          break;
        case 'mro_control_tower':
          setIsConversationLocked(false);
          setCurrentQuestionId('mro_q3');
          setOutputStageWithDelay('mro_aip_agent', 600);
          break;
        case 'mro_aip_agent':
          setIsConversationLocked(false);
          setCurrentQuestionId('mro_q4');
          setOutputStageWithDelay('mro_alert_triage', 600);
          break;
        case 'mro_alert_triage':
          setIsConversationLocked(false);
          setCurrentQuestionId('mro_q5');
          setOutputStageWithDelay('mro_alert_detail', 600);
          break;
        case 'mro_alert_detail':
          // User answered q5 → alert detail shown → user clicks Continue → unlock q6 for scenario selection
          setIsConversationLocked(false);
          setCurrentQuestionId('mro_q6');
          setOutputStageWithDelay('mro_scenario_builder', 600);
          break;
        case 'mro_scenario_builder':
          // Scenario simulation done → user clicks Continue → unlock q7 for action pack submission
          setIsConversationLocked(false);
          setCurrentQuestionId('mro_q7');
          setOutputStageWithDelay('mro_action_pack', 600);
          break;
        case 'mro_action_pack':
          // Action pack executed → user clicks Continue → unlock q8 for approval/MBH/complete choice
          setIsConversationLocked(false);
          setCurrentQuestionId('mro_q8');
          setOutputStageWithDelay('mro_approval', 600);
          break;
        case 'mro_approval':
          // Approval complete → auto-chain to MBH dashboard (core flow: spares → revenue assurance)
          setIsConversationLocked(false);
          setCurrentQuestionId('mro_q9');
          setOutputStageWithDelay('mro_mbh_dashboard', 800);
          break;
        case 'mro_mbh_dashboard':
          // MBH dashboard reviewed → unlock q10 for billing correction
          setIsConversationLocked(false);
          setCurrentQuestionId('mro_q10');
          setOutputStageWithDelay('mro_mbh_resolve', 600);
          break;
        case 'mro_mbh_resolve':
          // Revenue resolved → unlock q11 for automation review
          setIsConversationLocked(false);
          setCurrentQuestionId('mro_q11');
          setOutputStageWithDelay('mro_automation', 600);
          break;
        case 'mro_automation':
          // Automation configured → unlock q12 for finalize
          setIsConversationLocked(false);
          setCurrentQuestionId('mro_q12');
          break;
      }
      return;
    }

    // Handle maintenance stages
    switch (stage) {
      case 'initial_analysis':
        // Show Q3 with dynamic options
        setIsConversationLocked(false);
        setCurrentQuestionId('q3');
        break;
        
      case 'trusted_huddle':
        // Show Q4 (knowledge graph question)
        setIsConversationLocked(false);
        setCurrentQuestionId('q4');
        break;
        
      case 'recommendations':
        // Show Q6 (work order question)
        setIsConversationLocked(false);
        setCurrentQuestionId('q6');
        break;
    }
  }, [domainMode]);

  // Handle scenario selection from fault tree in output console
  const handleSelectScenario = useCallback((scenario) => {
    // This is handled by Q3 answer, but we can use this for direct clicking on fault tree
    if (!selectedScenario && currentQuestionId === 'q3') {
      handleAnswer('q3', scenario.id);
    }
  }, [selectedScenario, currentQuestionId, handleAnswer]);

  // Handle chatbot responses - display in Output Console with visualizations
  const handleChatResponse = useCallback((response) => {
    setChatResponse(response);
    // Set output stage to chat_response to trigger display
    setOutputStage('chat_response');
  }, []);

  // Handle stage actions - append system message to conversation
  const handleStageAction = useCallback((actionDescription) => {
    const timestamp = new Date().toLocaleTimeString();
    setAnsweredQuestions(prev => [...prev, {
      questionId: 'system_action',
      question: null,
      answer: actionDescription,
      timestamp,
      isSystemMessage: true
    }]);
  }, []);

  return (
    <div className="cerebra-container" style={{ 
      position: "fixed", 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      zIndex: 9999, 
      overflow: "hidden",
      display: "flex",
      flexDirection: "column"
    }}>
      {/* Login Scene */}
      {currentScene === SCENES.LOGIN && (
        <LoginScreen onLogin={handleLogin} />
      )}

      {/* Overview Scene - Digital Twin */}
      {currentScene === SCENES.OVERVIEW && (
        <>
          <CerebraHeader
            title={activeDomain.headerTitle}
            onNotificationClick={() => setShowNotifications(!showNotifications)}
            notificationCount={getActiveNotifications().filter((n) => n.severity === "critical").length}
            showGraphButton={false} // Only show Ontology in assistant area, not digital twin
            onGraphClick={() => handleOpenGraph()}
            // Domain mode props
            domainMode={domainMode}
            domainModes={Object.values(DOMAIN_MODES)}
            onDomainModeChange={handleDomainModeSwitch}
          />
          <main style={{ 
            flex: 1, 
            padding: '16px',
            overflow: 'auto',
            background: '#F5F7FA',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {/* WAIO KPI Strip (only in WAIO mode) - Compact version */}
            {domainMode === DOMAIN_MODE_IDS.WAIO_SHIFT_OPTIMISER && (
              <WAIOKPIStrip kpis={waioShift.kpis} compact={true} />
            )}

            {/* MRO KPI Strip (only in MRO mode) - Compact version */}
            {domainMode === DOMAIN_MODE_IDS.MRO_SUPPLY_CHAIN && (
              <MROKPIStrip compact={true} />
            )}

            {/* DIGITAL TWIN - Process Flow SVG Diagram */}
            <div style={{ flex: 1 }}>
              {domainMode === DOMAIN_MODE_IDS.MRO_SUPPLY_CHAIN ? (
                <MROOperationsFlowDiagram
                  onEquipmentClick={handleEquipmentClick}
                  mode={domainMode}
                />
              ) : (
                <MiningProcessFlowDiagram
                  onEquipmentClick={handleEquipmentClick}
                  mode={domainMode}
                />
              )}
            </div>
          </main>
          <NotificationPanel
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
            notifications={getActiveNotifications()}
            onNotificationClick={handleNotificationClick}
          />
        </>
      )}

      {/* Analysis Scene - Split Panel */}
      {currentScene === SCENES.ANALYSIS && (
        <>
          <CerebraHeader
            title={activeDomain.analysisTitle}
            showBackButton
            onBack={() => setCurrentScene(SCENES.OVERVIEW)}
            showGraphButton={domainMode === DOMAIN_MODE_IDS.WAIO_SHIFT_OPTIMISER || domainMode === DOMAIN_MODE_IDS.MRO_SUPPLY_CHAIN}
            onGraphClick={() => handleOpenGraph()}
            showControlTowerButton={domainMode === DOMAIN_MODE_IDS.MRO_SUPPLY_CHAIN}
            onControlTowerClick={() => setShowControlTowerOverlay(!showControlTowerOverlay)}
            controlTowerActive={showControlTowerOverlay}
          />
          <main className="cerebra-main" style={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: '380px 1fr',
            gap: '16px',
            padding: '16px',
            overflow: 'hidden',
            minHeight: 0
          }}>
            {/* Left Panel - Conversation */}
            <div style={{ 
              background: 'white',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              minHeight: 0
            }}>
              <ConversationPanel
                currentQuestion={getCurrentQuestion()}
                onAnswer={handleAnswer}
                answeredQuestions={answeredQuestions}
                isLocked={isConversationLocked}
                dynamicOptions={currentQuestionId === 'q3' ? faultTreeOptions.map(opt => ({
                  id: opt.id,
                  label: opt.label,
                  probability: opt.probability,
                  evidence: opt.evidence,
                  color: opt.color
                })) : null}
                onChatResponse={handleChatResponse}
                domainMode={domainMode}
              />
            </div>

            {/* Right Panel - Output Console */}
            <div style={{ 
              background: 'white',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              minHeight: 0
            }}>
              <OutputConsole
                currentStage={outputStage}
                onStageComplete={handleStageComplete}
                onSelectScenario={handleSelectScenario}
                selectedScenario={selectedScenario}
                showKnowledgeGraph={showKnowledgeGraph}
                setShowKnowledgeGraph={setShowKnowledgeGraph}
                dynamicAgentResponses={agentResponses}
                activeAgent={activeAgent}
                queryAgent={queryAgent}
                runHuddleWorkflow={runHuddleWorkflow}
                chatResponse={chatResponse}
                // WAIO props
                domainMode={domainMode}
                selectedObjective={selectedObjective}
                selectedPlan={selectedPlan}
                onSelectPlan={setSelectedPlan}
                // Processing state
                isProcessingStage={isProcessingStage}
                // Graph and publish handlers
                onOpenGraph={handleOpenGraph}
                onPublish={() => setOutputStageWithDelay('waio_publish_to_systems', 800)}
                // Navigation and action tracking
                onBack={handleStageBack}
                onStageAction={handleStageAction}
                // Control Tower overlay
                showControlTowerOverlay={showControlTowerOverlay}
                onCloseControlTower={() => setShowControlTowerOverlay(false)}
              />
            </div>
          </main>

          {/* Footer */}
          <footer style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 20px',
            background: '#1a1a2e',
            color: '#9ca3af',
            fontSize: '11px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#0078D4">
                <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/>
              </svg>
              <span>Powered by Azure AI Services</span>
            </div>
            <div>
              <span>AIIS Command Center v2.1.0</span>
              <span style={{ marginLeft: "12px", color: '#6b7280' }}>(c) 2025 Accenture</span>
            </div>
          </footer>
        </>
      )}
      
      {/* P2C Ontology Graph Modal - Always available in WAIO mode */}
      {domainMode === DOMAIN_MODE_IDS.WAIO_SHIFT_OPTIMISER && (
        <P2COntologyGraphModal
          isOpen={showP2CGraph}
          onClose={handleCloseGraph}
          initialFocusId={graphFocusId}
          mode={graphMode}
        />
      )}

      {/* MRO Ontology Graph Modal - Always available in MRO mode */}
      {domainMode === DOMAIN_MODE_IDS.MRO_SUPPLY_CHAIN && (
        <MROOntologyGraphModal
          isOpen={showP2CGraph}
          onClose={handleCloseGraph}
        />
      )}
    </div>
  );
}
