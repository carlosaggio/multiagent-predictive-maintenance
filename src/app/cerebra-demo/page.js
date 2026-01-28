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
import { waioWorkflowQuestions, waioStageConfig, waioObjectiveWeights } from "./data/waio/waioWorkflowQuestions";
import { waioShift } from "./data/waio/waioScenarioContext";
import { WAIOKPIStrip } from "./components/waio";

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
  const [showKnowledgeGraph, setShowKnowledgeGraph] = useState(false);
  
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
    return domainMode === DOMAIN_MODE_IDS.WAIO_SHIFT_OPTIMISER 
      ? waioWorkflowQuestions 
      : workflowQuestions;
  };
  
  // Helper to get active notifications based on domain
  const getActiveNotifications = () => {
    return domainMode === DOMAIN_MODE_IDS.WAIO_SHIFT_OPTIMISER
      ? waioNotifications
      : notifications;
  };
  
  // Handle domain mode switch
  const handleDomainModeSwitch = useCallback((newMode) => {
    if (newMode === domainMode) return;
    
    setDomainMode(newMode);
    
    // Reset all conversation and workflow state
    setCurrentQuestionId(newMode === DOMAIN_MODE_IDS.WAIO_SHIFT_OPTIMISER ? 'waio_q1' : 'q1');
    setAnsweredQuestions([]);
    setIsConversationLocked(false);
    setSelectedScenario(null);
    setSelectedObjective(null);
    setSelectedPlan(null);
    setOutputStage(null);
    setShowKnowledgeGraph(false);
    setChatResponse(null);
    resetAgents();
  }, [domainMode, resetAgents]);

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
    // In WAIO mode, any clickable element triggers the WAIO workflow
    // In maintenance mode, only primary_crusher triggers analysis
    const shouldTrigger = domainMode === DOMAIN_MODE_IDS.WAIO_SHIFT_OPTIMISER || equipmentId === 'primary_crusher';
    
    if (shouldTrigger) {
      // Reset analysis state - use correct starting question based on domain mode
      const startingQuestion = domainMode === DOMAIN_MODE_IDS.WAIO_SHIFT_OPTIMISER ? 'waio_q1' : 'q1';
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
    if (notification.severity === "critical") {
      setShowNotifications(false);
      handleEquipmentClick('primary_crusher');
    }
  }, [handleEquipmentClick]);

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
            setOutputStage('waio_agent_network');
          }
          break;
          
        case 'waio_q2':
          if (optionId === 'yes') {
            setIsConversationLocked(true);
            setOutputStage('waio_deviation_trace');
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
            setOutputStage('waio_parallel_huddle');
          }
          break;
          
        case 'waio_q5':
          // User selected a plan option
          setSelectedPlan(optionId === 'plan_a' ? 'PLAN-A' : optionId === 'plan_b' ? 'PLAN-B' : 'PLAN-C');
          setCurrentQuestionId('waio_q6');
          setOutputStage('waio_shift_plan');
          break;
          
        case 'waio_q6':
          if (optionId === 'yes') {
            setIsConversationLocked(true);
            setOutputStage('waio_publish');
          } else {
            setCurrentQuestionId('waio_q5');
            setOutputStage('waio_plan_options');
          }
          break;
          
        case 'waio_q7':
          if (optionId === 'yes') {
            setOutputStage('waio_monitor');
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
          // Final stage - demo complete
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
          />
          <main style={{ 
            flex: 1, 
            padding: '16px',
            overflow: 'auto',
            background: '#F5F7FA',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {/* Domain Mode Toggle */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '16px',
            }}>
              <div style={{
                display: 'inline-flex',
                background: 'white',
                borderRadius: '8px',
                padding: '4px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}>
                {Object.values(DOMAIN_MODES).map(mode => (
                  <button
                    key={mode.id}
                    onClick={() => handleDomainModeSwitch(mode.id)}
                    style={{
                      padding: '10px 20px',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      background: domainMode === mode.id ? '#A100FF' : 'transparent',
                      color: domainMode === mode.id ? 'white' : '#6B7280',
                    }}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* WAIO KPI Strip (only in WAIO mode) */}
            {domainMode === DOMAIN_MODE_IDS.WAIO_SHIFT_OPTIMISER && (
              <WAIOKPIStrip kpis={waioShift.kpis} />
            )}
            
            {/* DIGITAL TWIN - Mining Process Flow SVG Diagram */}
            <div style={{ flex: 1 }}>
              <MiningProcessFlowDiagram 
                onEquipmentClick={handleEquipmentClick}
                mode={domainMode}
              />
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
              <span style={{ color: '#4b5563' }}>|</span>
              <span>Azure OpenAI</span>
              <span style={{ color: '#4b5563' }}>|</span>
              <span>Azure Cosmos DB</span>
              <span style={{ color: '#4b5563' }}>|</span>
              <span>SAP Integration</span>
            </div>
            <div>
              <span>AIIS Command Center v2.1.0</span>
              <span style={{ marginLeft: "12px", color: '#6b7280' }}>(c) 2025 Accenture</span>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}
