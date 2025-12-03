"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { scenarioContext, getContextByTopic } from "../data/scenarioContext";

// Simple in-memory cache for API responses (persists during session)
const responseCache = new Map();
const CACHE_KEY_PREFIX = 'cerebra_chat_';

// Try to load from localStorage on init
const loadCacheFromStorage = () => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(CACHE_KEY_PREFIX + 'responses');
      if (stored) {
        const parsed = JSON.parse(stored);
        Object.entries(parsed).forEach(([key, value]) => {
          responseCache.set(key, value);
        });
      }
    } catch (e) {
      console.log('Cache load failed:', e);
    }
  }
};

// Save cache to localStorage
const saveCacheToStorage = () => {
  if (typeof window !== 'undefined') {
    try {
      const cacheObj = {};
      responseCache.forEach((value, key) => {
        cacheObj[key] = value;
      });
      localStorage.setItem(CACHE_KEY_PREFIX + 'responses', JSON.stringify(cacheObj));
    } catch (e) {
      console.log('Cache save failed:', e);
    }
  }
};

// Thinking stages for realistic animation
const THINKING_STAGES = [
  { text: 'Analyzing query...', duration: 800 },
  { text: 'Identifying relevant agent...', duration: 600 },
  { text: 'Preparing tool invocation...', duration: 500 },
];

export default function ConversationPanel({
  currentQuestion,
  onAnswer,
  answeredQuestions,
  isLocked,
  dynamicOptions,
  enableChat = true,
  onTriggerAgent,
  onChatResponse, // Send responses to Output Console
}) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatEnabled, setChatEnabled] = useState(false);
  const [activeToolCall, setActiveToolCall] = useState(null);
  const [thinkingStage, setThinkingStage] = useState(null);
  const [useCachePreference, setUseCachePreference] = useState(true);
  const [showCachePrompt, setShowCachePrompt] = useState(false);
  const [pendingQuery, setPendingQuery] = useState(null);
  const bottomRef = useRef(null);
  const sessionIdRef = useRef(`session-${Date.now()}`);

  // Load cache on mount
  useEffect(() => {
    loadCacheFromStorage();
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [answeredQuestions, currentQuestion, chatMessages, thinkingStage]);

  // Enable chat once workflow progresses
  useEffect(() => {
    if (enableChat && answeredQuestions.length >= 2) {
      setChatEnabled(true);
    }
  }, [answeredQuestions, enableChat]);

  // Comprehensive local response generator - Deep maintenance knowledge
  const generateLocalResponse = useCallback((message, contextInfo) => {
    const msgLower = message.toLowerCase();
    const ctx = scenarioContext;
    
    // ========== WORK ORDER QUERIES ==========
    if (msgLower.includes('work order') || msgLower.includes('wo number') || msgLower.includes('wo-') || msgLower.includes('4000') || msgLower.includes('sap') || msgLower.includes('order number') || msgLower.includes('released')) {
      const wo = ctx.workOrder;
      if (msgLower.includes('status') || msgLower.includes('released')) {
        return `The work order **${wo.number}** is currently in **${wo.status} (${wo.statusText})** status.\n\nThis means it has been released and submitted for scheduling approval. The maintenance team has been notified.\n\n**Next Steps:**\n1. Scheduler confirms resources\n2. Parts reservation finalized\n3. Execution: ${wo.scheduledStart}`;
      }
      if (msgLower.includes('cost') || msgLower.includes('budget') || msgLower.includes('price')) {
        return `**Work Order ${wo.number} - Cost Breakdown:**\n\n• **Labor:** ${wo.costBreakdown.labor}\n• **Materials:** ${wo.costBreakdown.materials}\n• **Overhead:** ${wo.costBreakdown.overhead}\n• **Total:** ${wo.estimatedCost}`;
      }
      return `**Work Order ${wo.number}:**\n\n• **Status:** ${wo.status} (${wo.statusText})\n• **Type:** ${wo.type}\n• **Priority:** ${wo.priority}\n• **Schedule:** ${wo.scheduledStart}\n• **Duration:** ${wo.estimatedDuration}\n• **Cost:** ${wo.estimatedCost}`;
    }

    // ========== EQUIPMENT QUERIES ==========
    if (msgLower.includes('equipment') || msgLower.includes('crusher') || msgLower.includes('metso') || msgLower.includes('c160') || msgLower.includes('machine') || msgLower.includes('asset')) {
      const eq = ctx.equipment;
      if (msgLower.includes('spec') || msgLower.includes('detail') || msgLower.includes('technical')) {
        return `**${eq.fullName}:**\n\n• **Model:** ${eq.model}\n• **Serial:** ${eq.serialNumber}\n• **Location:** ${eq.location}\n• **Capacity:** ${eq.specifications.capacity}\n• **Motor:** ${eq.specifications.motorPower}\n• **Hours:** ${eq.operatingHours.toLocaleString()}`;
      }
      if (msgLower.includes('efficiency') || msgLower.includes('performance')) {
        return `**${eq.name} Performance:**\n\n• **Current:** ${eq.currentEfficiency}\n• **Target:** ${eq.targetEfficiency}\n• **Drop:** ${eq.efficiencyDrop}\n• **Daily Loss:** ${eq.productionLoss}\n\nCorrelation with liner wear: r=0.92 (strong)`;
      }
      return `**${eq.name}:**\n\n• **ID:** ${eq.id}\n• **Criticality:** ${eq.criticality}\n• **Efficiency:** ${eq.currentEfficiency} (target: ${eq.targetEfficiency})\n• **Hours:** ${eq.operatingHours.toLocaleString()}\n• **Last Overhaul:** ${eq.lastMajorOverhaul}`;
    }

    // ========== LINER / WEAR QUERIES ==========
    if (msgLower.includes('liner') || msgLower.includes('wear') || msgLower.includes('thickness') || msgLower.includes('diagnostic')) {
      const liner = ctx.linerDetails;
      if (msgLower.includes('zone') || msgLower.includes('pattern')) {
        return `**Liner Wear by Zone:**\n\n• Zone A: ${liner.zones.A.wear} (${liner.zones.A.status})\n• **Zone B: ${liner.zones.B.wear} (${liner.zones.B.status})**\n• Zone C: ${liner.zones.C.wear} (${liner.zones.C.status})\n• Zone D: ${liner.zones.D.wear} (${liner.zones.D.status})\n\nZone B is critical with asymmetric wear pattern.`;
      }
      if (msgLower.includes('remaining') || msgLower.includes('life') || msgLower.includes('replace')) {
        return `**Liner RUL Assessment:**\n\n• **Current:** ${liner.currentThickness}\n• **Critical:** ${liner.criticalThreshold}\n• **Wear Rate:** ${liner.wearRate}\n• **Remaining Life:** 5-7 days\n\n**Recommendation:** Replace within 5 days`;
      }
      return `**Liner Diagnostics:**\n\n• **Thickness:** ${liner.currentThickness}\n• **Critical Zone:** B (${liner.zones.B.wear})\n• **Pattern:** ${liner.wearPattern}\n• **RUL:** 5-7 days\n• **Parts:** ${liner.partNumbers.fixed}, ${liner.partNumbers.movable}`;
    }

    // ========== ROOT CAUSE / FMEA QUERIES ==========
    if (msgLower.includes('root cause') || msgLower.includes('rca') || msgLower.includes('fmea') || msgLower.includes('why') || msgLower.includes('cause') || msgLower.includes('failure mode')) {
      const rca = ctx.rootCauseAnalysis;
      return `**Root Cause Analysis:**\n\n1. **${rca.rankedCauses[0].cause}** - ${rca.rankedCauses[0].probability}%\n2. **${rca.rankedCauses[1].cause}** - ${rca.rankedCauses[1].probability}%\n3. **${rca.rankedCauses[2].cause}** - ${rca.rankedCauses[2].probability}%\n\n**Primary:** ${rca.primaryCause} (${rca.likelihood})`;
    }

    // ========== RELIABILITY QUERIES ==========
    if (msgLower.includes('reliability') || msgLower.includes('weibull') || msgLower.includes('rpn') || msgLower.includes('mtbf') || msgLower.includes('failure probability')) {
      const rel = ctx.reliabilityMetrics;
      if (msgLower.includes('weibull')) {
        return `**Weibull Analysis:**\n\n• **β (Shape):** ${rel.weibull.beta}\n• **η (Scale):** ${rel.weibull.eta} hrs\n• **R²:** ${rel.weibull.r2}\n\nβ > 1 indicates wear-out failure mode.\n\n**Time-to-Failure:**\n• P10: ${rel.timeToFailure.p10}\n• P50: ${rel.timeToFailure.p50}`;
      }
      return `**Reliability Metrics:**\n\n• **P(Failure):** ${rel.failureProbability}\n• **MTBF:** ${rel.mtbf}\n• **MTTR:** ${rel.mttr}\n• **RPN:** ${rel.rpn}\n• **Weibull β:** ${rel.weibull.beta}\n• **RUL:** ${rel.remainingUsefulLife}`;
    }

    // ========== PARTS / INVENTORY ==========
    if (msgLower.includes('part') || msgLower.includes('inventory') || msgLower.includes('stock') || msgLower.includes('material') || msgLower.includes('cj-')) {
      const parts = ctx.parts;
      return `**Parts Status:**\n\n${parts.slice(0, 4).map(p => `• **${p.id}:** ${p.available} available @ ${p.location}`).join('\n')}\n\n✓ All parts in stock for scheduled replacement`;
    }

    // ========== LABOR / CREW ==========
    if (msgLower.includes('labor') || msgLower.includes('crew') || msgLower.includes('technician') || msgLower.includes('team') || msgLower.includes('james')) {
      const labor = ctx.labor;
      return `**Crew Assignment:**\n\n• **Lead:** ${labor.lead} (${labor.skillMatch} match)\n• **Team:** ${labor.crewName}\n• **Size:** ${labor.crewSize} members\n• **Hours:** ${labor.estimatedHours}\n• **Cost:** ${labor.totalLaborCost}\n• **Shift:** ${labor.shift}`;
    }

    // ========== SAFETY ==========
    if (msgLower.includes('safety') || msgLower.includes('permit') || msgLower.includes('loto') || msgLower.includes('hazard') || msgLower.includes('ppe')) {
      const safety = ctx.safety;
      return `**Safety Requirements:**\n\n**Permits:**\n${safety.permits.filter(p => p.status === 'Required').map(p => `• ${p.type}: ${p.number || 'Required'}`).join('\n')}\n\n**PPE:** ${safety.ppe.slice(0, 4).join(', ')}\n\n**JSA:** ${safety.jsaNumber} (${safety.jsaStatus})`;
    }

    // ========== HISTORY ==========
    if (msgLower.includes('history') || msgLower.includes('previous') || msgLower.includes('past')) {
      const history = ctx.maintenanceHistory;
      return `**Maintenance History:**\n\n${history.slice(0, 4).map(h => `• **${h.date}:** ${h.description}${h.cost ? ` (${h.cost})` : ''}`).join('\n')}`;
    }

    // ========== SCHEDULE ==========
    if (msgLower.includes('schedule') || msgLower.includes('when') || msgLower.includes('date') || msgLower.includes('time')) {
      const wo = ctx.workOrder;
      return `**Schedule:**\n\n• **Start:** ${wo.scheduledStart}\n• **Finish:** ${wo.scheduledFinish}\n• **Duration:** ${wo.estimatedDuration}\n• **Alert:** ${ctx.currentScenario.alertTriggeredDate}\n• **Shutdown Window:** ${ctx.operations.shutdownWindow}`;
    }

    // ========== RECOMMENDATIONS ==========
    if (msgLower.includes('recommend') || msgLower.includes('action') || msgLower.includes('what should') || msgLower.includes('next step')) {
      const recs = ctx.recommendations;
      return `**Recommendations:**\n\n${recs.slice(0, 3).map((r, i) => `${i + 1}. **${r.action}**\n   ${r.timeline} | ${r.impact}`).join('\n\n')}`;
    }

    // ========== AGENTS ==========
    if (msgLower.includes('agent') || msgLower.includes('huddle') || msgLower.includes('who analyzed')) {
      const agents = ctx.agents;
      return `**Agent Contributions:**\n\n${Object.entries(agents).map(([id, a]) => `• **${id}:** ${a.findings[0]}`).join('\n')}`;
    }

    // ========== HELP ==========
    if (msgLower.includes('help') || msgLower.includes('what can i ask')) {
      return `I can help with:\n\n• **Work Order** - WO ${ctx.workOrder.number} status, costs\n• **Equipment** - Crusher specs, performance\n• **Liner** - Wear patterns, RUL\n• **Root Cause** - FMEA analysis\n• **Reliability** - Weibull, RPN, MTBF\n• **Parts** - Inventory status\n• **Labor** - Crew assignments\n• **Safety** - Permits, PPE\n• **Recommendations** - Action items\n\nJust ask naturally!`;
    }

    // ========== DEFAULT ==========
    const scenario = ctx.currentScenario;
    return `**Current Scenario:**\n\n• **Equipment:** ${scenario.equipment}\n• **Issue:** ${scenario.issue}\n• **Root Cause:** ${scenario.rootCause}\n• **Work Order:** ${ctx.workOrder.number} (${ctx.workOrder.statusText})\n\nWhat specifically would you like to know?`;
  }, []);

  // Handle sending chat message with staged animations
  const handleSendMessage = useCallback(async (useCache = null) => {
    const messageToProcess = pendingQuery || chatInput.trim();
    if (!messageToProcess || isChatLoading) return;

    // Clear pending and input
    setPendingQuery(null);
    setShowCachePrompt(false);
    setChatInput('');
    setIsChatLoading(true);

    // Add user message to chat (only if not from cache prompt)
    if (!pendingQuery) {
      const userMsg = {
        id: Date.now(),
        role: 'user',
        content: messageToProcess,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages(prev => [...prev, userMsg]);
    }

    // Check context and tools needed
    const contextInfo = getContextByTopic(messageToProcess);
    const cacheKey = messageToProcess.toLowerCase().trim().substring(0, 100);
    const hasCachedResponse = responseCache.has(cacheKey);

    // If cache exists and we haven't asked yet, prompt user (only once per session type)
    if (hasCachedResponse && useCache === null && !pendingQuery) {
      setPendingQuery(messageToProcess);
      setShowCachePrompt(true);
      setIsChatLoading(false);
      return;
    }

    // Use cache if user chose it
    if (useCache === true && hasCachedResponse) {
      // Show brief "retrieving from cache" message
      setThinkingStage('Retrieving from cache...');
      await new Promise(resolve => setTimeout(resolve, 600));
      setThinkingStage(null);
      
      const response = responseCache.get(cacheKey);
      
      // Send to Output Console
      if (onChatResponse) {
        onChatResponse({
          query: messageToProcess,
          content: response,
          topic: contextInfo.topic,
          agent: contextInfo.agent,
          toolUsed: contextInfo.toolToInvoke,
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          cached: true,
        });
        
        const confirmMsg = {
          id: Date.now() + 1,
          role: 'assistant',
          content: `Response displayed in Output Console →`,
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          isRedirect: true,
        };
        setChatMessages(prev => [...prev, confirmMsg]);
      } else {
        const assistantMsg = {
          id: Date.now() + 1,
          role: 'assistant',
          content: response,
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          contextUsed: contextInfo.topic,
          cached: true,
        };
        setChatMessages(prev => [...prev, assistantMsg]);
      }
      
      setIsChatLoading(false);
      return;
    }

    // Full processing flow with animations
    
    // Stage 1: Thinking animation
    for (const stage of THINKING_STAGES) {
      setThinkingStage(stage.text);
      await new Promise(resolve => setTimeout(resolve, stage.duration));
    }

    // Stage 2: Show agent selection
    if (contextInfo.agent) {
      const agentSelectMsg = {
        id: Date.now() + 0.3,
        role: 'system',
        type: 'agent_select',
        agentId: contextInfo.agent,
        agentName: scenarioContext.agents[contextInfo.agent]?.name || contextInfo.agent,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages(prev => [...prev, agentSelectMsg]);
      setThinkingStage(`${contextInfo.agent} agent activated`);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    // Stage 3: Show tool invocation
    if (contextInfo.toolToInvoke) {
      setThinkingStage(null);
      setActiveToolCall({
        tool: contextInfo.toolToInvoke,
        agent: contextInfo.agent,
        status: 'running'
      });
      
      const toolCallMsg = {
        id: Date.now() + 0.5,
        role: 'tool',
        toolName: contextInfo.toolToInvoke,
        agentName: scenarioContext.agents[contextInfo.agent]?.name || contextInfo.agent,
        status: 'running',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages(prev => [...prev, toolCallMsg]);
      
      // Trigger agent in output console if callback exists
      if (onTriggerAgent && contextInfo.agent) {
        onTriggerAgent(contextInfo.agent, contextInfo.toolToInvoke);
      }
      
      // Simulate tool execution
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update tool call to complete
      setChatMessages(prev => prev.map(msg => 
        msg.id === toolCallMsg.id ? { ...msg, status: 'complete' } : msg
      ));
      setActiveToolCall(prev => prev ? { ...prev, status: 'complete' } : null);
      
      await new Promise(resolve => setTimeout(resolve, 400));
    }

    // Stage 4: Composing response
    setThinkingStage('Composing response...');
    await new Promise(resolve => setTimeout(resolve, 800));
    setThinkingStage(null);

    // Generate response
    const response = generateLocalResponse(messageToProcess, contextInfo);
    
    // Cache the response
    responseCache.set(cacheKey, response);
    saveCacheToStorage();

    // Send response to Output Console if callback provided
    if (onChatResponse) {
      onChatResponse({
        query: messageToProcess,
        content: response,
        topic: contextInfo.topic,
        agent: contextInfo.agent,
        toolUsed: contextInfo.toolToInvoke,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        cached: false,
      });
      
      // Add a brief confirmation in chat
      const confirmMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `Response displayed in Output Console →`,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        isRedirect: true,
      };
      setChatMessages(prev => [...prev, confirmMsg]);
    } else {
      // Fallback: show in chat if no callback
      const assistantMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        contextUsed: contextInfo.topic,
        cached: false,
      };
      setChatMessages(prev => [...prev, assistantMsg]);
    }
    
    setIsChatLoading(false);
    setActiveToolCall(null);
  }, [chatInput, isChatLoading, onTriggerAgent, generateLocalResponse, pendingQuery, onChatResponse]);

  // Handle cache choice
  const handleCacheChoice = useCallback((useCache) => {
    handleSendMessage(useCache);
  }, [handleSendMessage]);

  // Handle Enter key
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(null);
    }
  }, [handleSendMessage]);

  const handleOptionSelect = (optionId) => {
    if (isLocked || isSubmitting) return;
    setSelectedOption(optionId);
    setIsSubmitting(true);
    
    setTimeout(() => {
      onAnswer(currentQuestion.id, optionId);
      setSelectedOption(null);
      setIsSubmitting(false);
    }, 500);
  };

  const getOptions = (question) => {
    if (question.isDynamic && dynamicOptions && dynamicOptions.length > 0) {
      return dynamicOptions;
    }
    return question.options || [];
  };

  return (
    <div className="conversation-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        background: '#A100FF',
        padding: '14px 20px',
        borderRadius: '8px 8px 0 0',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
        </svg>
        <span style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>Maintenance Assistant</span>
        <div style={{ 
          marginLeft: 'auto', 
          fontSize: '10px', 
          color: 'rgba(255,255,255,0.7)',
          background: 'rgba(255,255,255,0.15)',
          padding: '3px 8px',
          borderRadius: '10px'
        }}>
          AI-Powered
        </div>
      </div>

      {/* Messages container */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        background: '#fafafa'
      }}>
        {/* Answered Questions */}
        {answeredQuestions.map((answered, index) => (
          <QuestionMessage
            key={`answered-${answered.questionId}-${index}`}
            question={answered.question}
            options={getOptions(answered.question)}
            selectedOption={answered.answer}
            isAnswered={true}
            timestamp={answered.timestamp}
          />
        ))}

        {/* Current Question - with LLM generation simulation */}
        {currentQuestion && !isLocked && (
          <QuestionGenerator
            key={`current-${currentQuestion.id}`}
            question={currentQuestion}
            options={getOptions(currentQuestion)}
            selectedOption={selectedOption}
            onSelect={handleOptionSelect}
            isSubmitting={isSubmitting}
            isFirstQuestion={answeredQuestions.length === 0}
          />
        )}

        {/* Waiting indicator */}
        {isLocked && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 16px',
            background: 'white',
            borderRadius: '8px',
            marginTop: '12px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#A100FF',
              animation: 'pulse 1.5s infinite'
            }} />
            <span style={{ fontSize: '12px', color: '#718096' }}>
              Processing... Please wait for analysis to complete.
            </span>
          </div>
        )}

        {/* Dynamic Chat Messages */}
        {chatMessages.length > 0 && (
          <div style={{ marginTop: '16px', borderTop: '1px dashed #e2e8f0', paddingTop: '16px' }}>
            <div style={{ 
              fontSize: '11px', 
              color: '#9CA3AF', 
              marginBottom: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Follow-up Questions
            </div>
            {chatMessages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            
            {/* Thinking Animation */}
            {thinkingStage && (
              <ThinkingIndicator stage={thinkingStage} />
            )}
            
            {/* Cache Prompt */}
            {showCachePrompt && (
              <CachePrompt onChoice={handleCacheChoice} />
            )}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Query Input */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid #e2e8f0',
        background: 'white',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: chatEnabled ? 'white' : '#F9FAFB',
          border: `1px solid ${chatEnabled ? '#A100FF' : '#E2E8F0'}`,
          borderRadius: '24px',
          padding: '10px 16px',
          transition: 'all 0.2s ease'
        }}>
          <input
            type="text"
            placeholder={chatEnabled ? "Ask about WO status, parts, liner, reliability..." : "Complete workflow to enable chat"}
            disabled={!chatEnabled || isChatLoading || showCachePrompt}
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              fontSize: '13px',
              color: chatEnabled ? '#1a1a2e' : '#9CA3AF',
              outline: 'none',
            }}
          />
          <button
            onClick={() => handleSendMessage(null)}
            disabled={!chatEnabled || !chatInput.trim() || isChatLoading || showCachePrompt}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: chatEnabled && chatInput.trim() ? '#A100FF' : '#E2E8F0',
              border: 'none',
              cursor: chatEnabled && chatInput.trim() ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>
        {chatEnabled && (
          <div style={{ 
            marginTop: '6px', 
            fontSize: '10px', 
            color: '#9CA3AF',
            textAlign: 'center'
          }}>
            Cached responses enabled
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes blink {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// Thinking Indicator Component
function ThinkingIndicator({ stage }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '12px 16px',
      marginBottom: '8px',
      animation: 'fadeIn 0.3s ease-out'
    }}>
      <div style={{
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #A100FF 0%, #7C3AED 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '12px',
          height: '12px',
          border: '2px solid white',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ 
          fontSize: '12px', 
          color: '#6b7280',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span>{stage}</span>
          <span style={{ display: 'flex', gap: '2px' }}>
            {[0, 1, 2].map(i => (
              <span 
                key={i}
                style={{
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  background: '#A100FF',
                  animation: `blink 1.4s infinite ${i * 0.2}s`,
                }}
              />
            ))}
          </span>
        </div>
      </div>
    </div>
  );
}

// Cache Prompt Component
function CachePrompt({ onChoice }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      padding: '12px 16px',
      marginBottom: '12px',
      animation: 'fadeIn 0.3s ease-out'
    }}>
      <div style={{ 
        fontSize: '11px', 
        color: '#475569',
        marginBottom: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A100FF" strokeWidth="2">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
        I have a cached response for this query. Would you like to use it for faster results?
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => onChoice(true)}
          style={{
            flex: 1,
            padding: '8px 12px',
            fontSize: '11px',
            fontWeight: '600',
            background: '#A100FF',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
            <path d="M13 2.05v3.03c3.39.49 6 3.39 6 6.92 0 .9-.18 1.75-.48 2.54l2.6 1.53c.56-1.24.88-2.62.88-4.07 0-5.18-3.95-9.45-9-9.95zM12 19c-3.87 0-7-3.13-7-7 0-3.53 2.61-6.43 6-6.92V2.05c-5.06.5-9 4.76-9 9.95 0 5.52 4.47 10 9.99 10 3.31 0 6.24-1.61 8.06-4.09l-2.6-1.53C16.17 17.98 14.21 19 12 19z"/>
          </svg>
          Use Cache (faster)
        </button>
        <button
          onClick={() => onChoice(false)}
          style={{
            flex: 1,
            padding: '8px 12px',
            fontSize: '11px',
            fontWeight: '600',
            background: 'white',
            color: '#475569',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 4v6h-6M1 20v-6h6"/>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
          </svg>
          Fresh Response
        </button>
      </div>
    </div>
  );
}

// LLM Generation stages - shown before question appears
const GENERATION_STAGES = [
  { text: 'Super Agent processing context...', icon: 'brain', duration: 1100 },
  { text: 'Analyzing maintenance scenario...', icon: 'analyze', duration: 950 },
  { text: 'Generating response...', icon: 'generate', duration: 1200 },
];

// Question Generator - shows LLM-style generation before the question
function QuestionGenerator({
  question,
  options,
  selectedOption,
  onSelect,
  isSubmitting,
  isFirstQuestion
}) {
  const [phase, setPhase] = useState('generating'); // 'generating' | 'streaming' | 'complete'
  const [generationStage, setGenerationStage] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;

    // Skip generation animation for first question (it should appear quickly)
    if (isFirstQuestion) {
      // Just do a brief thinking then stream
      setTimeout(() => {
        setPhase('streaming');
        streamText();
      }, 800);
      return;
    }

    // Full generation sequence for subsequent questions
    let stageIndex = 0;
    setPhase('generating');

    const runStages = () => {
      if (stageIndex < GENERATION_STAGES.length) {
        setGenerationStage(stageIndex);
        const currentStage = GENERATION_STAGES[stageIndex];
        stageIndex++;
        setTimeout(runStages, currentStage.duration);
      } else {
        // Done with generation stages, start streaming
        setPhase('streaming');
        streamText();
      }
    };

    // Start generation stages
    runStages();
  }, [question.id, isFirstQuestion]);

  const streamText = () => {
    const fullText = question.text;
    const words = fullText.split(' ');
    let wordIndex = 0;
    let currentText = '';

    const streamInterval = setInterval(() => {
      if (wordIndex < words.length) {
        // Add 1-2 words at a time for natural feel
        const wordsToAdd = Math.min(Math.floor(Math.random() * 2) + 1, words.length - wordIndex);
        const chunk = words.slice(wordIndex, wordIndex + wordsToAdd).join(' ');
        currentText = currentText + (currentText ? ' ' : '') + chunk;
        setDisplayedText(currentText);
        wordIndex += wordsToAdd;
      } else {
        clearInterval(streamInterval);
        setPhase('complete');
        setTimeout(() => setShowOptions(true), 300);
      }
    }, 55 + Math.random() * 45); // Slightly slower streaming
  };

  // Generation phase UI
  if (phase === 'generating') {
    const stage = GENERATION_STAGES[generationStage] || GENERATION_STAGES[0];
    return (
      <div style={{
        marginBottom: '16px',
        animation: 'fadeIn 0.3s ease-out'
      }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #A100FF 0%, #7C3AED 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            animation: 'pulse 1.5s infinite'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" 
                stroke="white" strokeWidth="2" fill="none"/>
            </svg>
          </div>

          <div style={{
            flex: 1,
            background: 'linear-gradient(135deg, #faf5ff 0%, #f5f3ff 100%)',
            borderRadius: '8px',
            border: '1px solid #e9d5ff',
            borderLeft: '3px solid #A100FF',
            padding: '16px',
            boxShadow: '0 2px 8px rgba(161, 0, 255, 0.08)',
          }}>
            {/* Generation header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '12px',
              paddingBottom: '10px',
              borderBottom: '1px dashed #e9d5ff'
            }}>
              <div style={{
                width: '18px',
                height: '18px',
                border: '2px solid #A100FF',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 0.7s linear infinite'
              }} />
              <span style={{ 
                fontSize: '11px', 
                fontWeight: '600',
                color: '#7c3aed',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Generating Question
              </span>
            </div>

            {/* Current stage */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}>
              {stage.icon === 'brain' && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A100FF" strokeWidth="2">
                  <path d="M12 2a9 9 0 0 1 9 9c0 3.6-3.6 6-5 8-1 1.5-1 3-4 3s-3-1.5-4-3c-1.4-2-5-4.4-5-8a9 9 0 0 1 9-9z"/>
                  <path d="M12 8v4M10 10h4"/>
                </svg>
              )}
              {stage.icon === 'analyze' && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A100FF" strokeWidth="2">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
              )}
              {stage.icon === 'generate' && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A100FF" strokeWidth="2">
                  <path d="M12 19V5M5 12l7-7 7 7"/>
                </svg>
              )}
              <span style={{ fontSize: '12px', color: '#6b7280' }}>
                {stage.text}
              </span>
              <span style={{ display: 'flex', gap: '3px', marginLeft: 'auto' }}>
                {[0, 1, 2].map(i => (
                  <span 
                    key={i}
                    style={{
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      background: '#A100FF',
                      animation: `blink 1.2s infinite ${i * 0.15}s`,
                    }}
                  />
                ))}
              </span>
            </div>

            {/* Stage progress */}
            <div style={{
              marginTop: '12px',
              display: 'flex',
              gap: '4px'
            }}>
              {GENERATION_STAGES.map((_, idx) => (
                <div 
                  key={idx}
                  style={{
                    flex: 1,
                    height: '3px',
                    borderRadius: '2px',
                    background: idx <= generationStage ? '#A100FF' : '#e9d5ff',
                    transition: 'background 0.3s ease'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Streaming/Complete phase - show the actual question
  return (
    <QuestionMessage
      question={question}
      options={options}
      selectedOption={selectedOption}
      isAnswered={false}
      onSelect={onSelect}
      isSubmitting={isSubmitting}
      displayedTextOverride={displayedText}
      isStreamingOverride={phase === 'streaming'}
      showOptionsOverride={showOptions}
    />
  );
}

// Question Message Component with streaming text animation
function QuestionMessage({ 
  question, 
  options, 
  selectedOption, 
  isAnswered, 
  onSelect,
  isSubmitting,
  timestamp,
  // Override props from QuestionGenerator
  displayedTextOverride,
  isStreamingOverride,
  showOptionsOverride
}) {
  // Use overrides if provided (controlled by QuestionGenerator), otherwise use internal state
  const useOverrides = displayedTextOverride !== undefined;
  
  const [internalDisplayedText, setInternalDisplayedText] = useState(isAnswered ? question.text : '');
  const [internalIsStreaming, setInternalIsStreaming] = useState(false);
  const [internalShowOptions, setInternalShowOptions] = useState(isAnswered);
  
  const displayedText = useOverrides ? displayedTextOverride : internalDisplayedText;
  const isStreaming = useOverrides ? isStreamingOverride : internalIsStreaming;
  const showOptions = useOverrides ? showOptionsOverride : internalShowOptions;

  // For answered questions, show everything immediately
  useEffect(() => {
    if (isAnswered) {
      setInternalDisplayedText(question.text);
      setInternalShowOptions(true);
      setInternalIsStreaming(false);
    }
  }, [isAnswered, question.text]);

  return (
    <div style={{
      marginBottom: '16px',
      animation: 'fadeIn 0.3s ease-out'
    }}>
      <div style={{ display: 'flex', gap: '10px' }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: '#A100FF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>

        <div style={{
          flex: 1,
          background: 'white',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          borderLeft: '3px solid #A100FF',
          overflow: 'hidden',
          opacity: isAnswered ? 0.85 : 1,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}>
          {/* Question text area */}
          <div style={{ 
            padding: '14px 16px',
            fontSize: '13px',
            color: '#1a1a2e',
            lineHeight: '1.5',
            borderBottom: '1px solid #f0f0f0',
            minHeight: '44px'
          }}>
            {displayedText || question.text}
            {isStreaming && (
              <span style={{
                display: 'inline-block',
                width: '2px',
                height: '14px',
                background: '#A100FF',
                marginLeft: '2px',
                verticalAlign: 'text-bottom',
                animation: 'blink 0.7s infinite'
              }} />
            )}
          </div>

          {/* Options - show after streaming completes */}
          {showOptions && (
            <div style={{ 
              padding: '12px 16px',
              animation: 'fadeIn 0.4s ease-out'
            }}>
              {options.map((option, index) => (
                <label
                  key={option.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '10px 12px',
                    marginBottom: '8px',
                    borderRadius: '6px',
                    cursor: isAnswered ? 'default' : 'pointer',
                    background: selectedOption === option.id 
                      ? (option.color ? `${option.color}10` : '#F3F4F6')
                      : 'transparent',
                    border: `1px solid ${selectedOption === option.id 
                      ? (option.color || '#A100FF') 
                      : '#e2e8f0'}`,
                    transition: 'all 0.15s ease',
                    animation: `fadeIn 0.3s ease-out ${index * 0.08}s both`
                  }}
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    checked={selectedOption === option.id}
                    onChange={() => !isAnswered && onSelect && onSelect(option.id)}
                    disabled={isAnswered}
                    style={{
                      accentColor: option.color || '#A100FF',
                      marginTop: '2px'
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#1a1a2e',
                      fontWeight: selectedOption === option.id ? '600' : '400'
                    }}>
                      {option.label}
                    </div>
                    {option.probability && (
                      <div style={{ 
                        fontSize: '10px', 
                        color: option.color || '#718096',
                        marginTop: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <span style={{
                          display: 'inline-block',
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: option.color
                        }} />
                        {option.probability}% probability
                        {option.evidence && ` | ${option.evidence}`}
                      </div>
                    )}
                  </div>
                </label>
              ))}

              {!isAnswered && selectedOption && isSubmitting && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '10px',
                  marginTop: '8px',
                  background: '#f3f4f6',
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: '#A100FF'
                }}>
                  <span style={{
                    width: '12px',
                    height: '12px',
                    border: '2px solid #A100FF',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                  }} />
                  Submitting selection...
                </div>
              )}
            </div>
          )}

          {isAnswered && timestamp && (
            <div style={{
              padding: '8px 16px',
              background: '#f9fafb',
              fontSize: '10px',
              color: '#9ca3af'
            }}>
              Answered at {timestamp}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper to format message content with markdown
function formatMessageContent(content) {
  if (!content) return content;
  
  const lines = content.split('\n');
  
  return lines.map((line, lineIndex) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    const formatted = parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
    
    return (
      <React.Fragment key={lineIndex}>
        {formatted}
        {lineIndex < lines.length - 1 && <br />}
      </React.Fragment>
    );
  });
}

// Chat Message Component
function ChatMessage({ message }) {
  const isUser = message.role === 'user';
  const isTool = message.role === 'tool';
  const isAgentSelect = message.type === 'agent_select';
  
  // Agent Selection Display
  if (isAgentSelect) {
    return (
      <div style={{
        marginBottom: '8px',
        animation: 'fadeIn 0.3s ease-out'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          background: '#faf5ff',
          border: '1px solid #e9d5ff',
          borderRadius: '6px',
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            borderRadius: '4px',
            background: '#A100FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '9px',
            fontWeight: '700',
            color: 'white'
          }}>
            {message.agentId}
          </div>
          <div style={{ fontSize: '11px', color: '#7c3aed' }}>
            <span style={{ fontWeight: '600' }}>{message.agentName}</span>
            <span style={{ color: '#a78bfa', marginLeft: '6px' }}>selected for this query</span>
          </div>
        </div>
      </div>
    );
  }
  
  // Tool Call Display
  if (isTool) {
    return (
      <div style={{
        marginBottom: '12px',
        animation: 'fadeIn 0.3s ease-out'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 14px',
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          borderLeft: `3px solid ${message.status === 'complete' ? '#10B981' : '#F59E0B'}`
        }}>
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '4px',
            background: message.status === 'complete' ? '#10B981' : '#F59E0B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            {message.status === 'complete' ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                <polyline points="20 6 9 17 4 12" strokeWidth="3" stroke="white" fill="none"/>
              </svg>
            ) : (
              <div style={{
                width: '10px',
                height: '10px',
                border: '2px solid white',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
              }} />
            )}
          </div>
          
          <div style={{ flex: 1 }}>
            <div style={{ 
              fontSize: '11px', 
              fontWeight: '600', 
              color: '#4b5563',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span style={{ color: '#A100FF' }}>{message.agentName}</span>
              <span style={{ color: '#9ca3af' }}>→</span>
              <code style={{ 
                fontSize: '10px', 
                background: '#e2e8f0', 
                padding: '2px 6px', 
                borderRadius: '3px',
                fontFamily: 'monospace'
              }}>
                {message.toolName}
              </code>
            </div>
            <div style={{ 
              fontSize: '10px', 
              color: message.status === 'complete' ? '#10B981' : '#F59E0B',
              marginTop: '2px'
            }}>
              {message.status === 'complete' ? '✓ Data retrieved successfully' : 'Querying data source...'}
            </div>
          </div>
          
          <div style={{ fontSize: '9px', color: '#9ca3af' }}>
            {message.timestamp}
          </div>
        </div>
      </div>
    );
  }
  
  // Redirect Message (response shown in Output Console)
  if (message.isRedirect) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '12px',
        animation: 'fadeIn 0.3s ease-out'
      }}>
        <div style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #A100FF 0%, #7C3AED 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
            <path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
            <path d="M5 5v14h14v-7h-2v5H7V7h5V5H5z"/>
          </svg>
        </div>
        <div style={{
          flex: 1,
          background: 'linear-gradient(90deg, #A100FF10 0%, #7C3AED05 100%)',
          border: '1px solid #A100FF30',
          borderRadius: '8px',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ fontSize: '12px', color: '#7C3AED', fontWeight: '500' }}>
            {message.content}
          </span>
          <div style={{
            marginLeft: 'auto',
            background: '#A100FF',
            color: 'white',
            fontSize: '9px',
            padding: '3px 8px',
            borderRadius: '10px',
          }}>
            View Details
          </div>
        </div>
      </div>
    );
  }
  
  // User/Assistant Message
  return (
    <div style={{
      display: 'flex',
      gap: '10px',
      marginBottom: '12px',
      flexDirection: isUser ? 'row-reverse' : 'row',
      animation: 'fadeIn 0.3s ease-out'
    }}>
      <div style={{
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        background: '#A100FF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        {isUser ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
          </svg>
        )}
      </div>

      <div style={{
        flex: 1,
        maxWidth: '85%',
        background: isUser ? '#A100FF' : 'white',
        color: isUser ? 'white' : '#1a1a2e',
        borderRadius: isUser ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
        padding: '10px 14px',
        border: isUser ? 'none' : '1px solid #e2e8f0',
        boxShadow: isUser ? 'none' : '0 1px 2px rgba(0,0,0,0.05)',
      }}>
        <div style={{ 
          fontSize: '12px', 
          lineHeight: '1.6',
        }}>
          {formatMessageContent(message.content)}
        </div>
        {message.contextUsed && (
          <div style={{
            fontSize: '9px',
            color: isUser ? 'rgba(255,255,255,0.7)' : '#A100FF',
            marginTop: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
            {message.contextUsed} context
            {message.cached && (
              <span style={{ 
                marginLeft: '4px',
                background: isUser ? 'rgba(255,255,255,0.2)' : '#f3f4f6',
                padding: '1px 4px',
                borderRadius: '3px',
                fontSize: '8px'
              }}>
                cached
              </span>
            )}
          </div>
        )}
        <div style={{ 
          fontSize: '9px', 
          color: isUser ? 'rgba(255,255,255,0.7)' : '#9ca3af',
          marginTop: '4px',
          textAlign: isUser ? 'right' : 'left'
        }}>
          {message.timestamp}
        </div>
      </div>
    </div>
  );
}
