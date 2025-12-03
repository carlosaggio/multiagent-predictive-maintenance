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

// Scene states
const SCENES = {
  LOGIN: "login",
  OVERVIEW: "overview",
  ANALYSIS: "analysis",
};

export default function CerebraDemo() {
  const [currentScene, setCurrentScene] = useState(SCENES.LOGIN);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Workflow state
  const [currentQuestionId, setCurrentQuestionId] = useState('q1');
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [isConversationLocked, setIsConversationLocked] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState(null);
  
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

  // Get current question object
  const getCurrentQuestion = () => {
    if (!currentQuestionId) return null;
    const question = workflowQuestions[currentQuestionId];
    
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

  // Handle clicking on equipment in digital twin
  const handleEquipmentClick = useCallback((equipmentId) => {
    if (equipmentId === 'primary_crusher') {
      setCurrentScene(SCENES.ANALYSIS);
      // Reset analysis state
      setCurrentQuestionId('q1');
      setAnsweredQuestions([]);
      setIsConversationLocked(false);
      setSelectedScenario(null);
      setOutputStage(null);
      // Reset dynamic agents
      resetAgents();
    }
  }, [resetAgents]);

  // Handle notification click
  const handleNotificationClick = useCallback((notification) => {
    if (notification.severity === "critical") {
      setShowNotifications(false);
      handleEquipmentClick('primary_crusher');
    }
  }, [handleEquipmentClick]);

  // Handle answer in conversation panel
  const handleAnswer = useCallback((questionId, optionId) => {
    const question = workflowQuestions[questionId];
    const timestamp = new Date().toLocaleTimeString();
    
    // Record the answer
    setAnsweredQuestions(prev => [...prev, {
      questionId,
      question,
      answer: optionId,
      timestamp
    }]);

    // Handle different question flows
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
  }, []);

  // Handle stage completion from output console
  const handleStageComplete = useCallback((stage) => {
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
  }, []);

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
            title="Copper Mine Operations Center - Digital Twin"
            onNotificationClick={() => setShowNotifications(!showNotifications)}
            notificationCount={notifications.filter((n) => n.severity === "critical").length}
          />
          <main style={{ 
            flex: 1, 
            padding: '16px',
            overflow: 'auto',
            background: '#F5F7FA'
          }}>
            {/* DIGITAL TWIN - Mining Process Flow SVG Diagram */}
            <MiningProcessFlowDiagram onEquipmentClick={handleEquipmentClick} />
          </main>
          <NotificationPanel
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
            notifications={notifications}
            onNotificationClick={handleNotificationClick}
          />
        </>
      )}

      {/* Analysis Scene - Split Panel */}
      {currentScene === SCENES.ANALYSIS && (
        <>
          <CerebraHeader
            title="Primary Crusher Efficiency Analysis"
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
