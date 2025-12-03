"use client";

import { useState, useCallback, useRef } from 'react';

// Hook for interacting with the Cerebra agent chat API
export function useAgentChat() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const sessionIdRef = useRef(`session-${Date.now()}`);

  const sendMessage = useCallback(async (userMessage) => {
    if (!userMessage.trim()) return null;

    setIsLoading(true);
    setError(null);

    // Add user message immediately
    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);

    try {
      const response = await fetch('/api/cerebra-agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          sessionId: sessionIdRef.current,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      const assistantMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.message,
        timestamp: data.timestamp,
      };
      setMessages(prev => [...prev, assistantMsg]);

      return assistantMsg;
    } catch (err) {
      setError(err.message);
      console.error('Chat error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    sessionIdRef.current = `session-${Date.now()}`;
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  };
}

// Hook for agent-specific queries during the huddle
export function useAgentQuery() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const cacheRef = useRef(new Map());

  const queryAgent = useCallback(async (agentId, query, options = {}) => {
    const { useCache = true, conversationHistory = [] } = options;
    
    // Check local cache first
    const cacheKey = `${agentId}-${query}`;
    if (useCache && cacheRef.current.has(cacheKey)) {
      return cacheRef.current.get(cacheKey);
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/cerebra-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId,
          query,
          conversationHistory,
          useCache,
        }),
      });

      if (!response.ok) {
        throw new Error(`Agent API error: ${response.status}`);
      }

      const data = await response.json();

      // Cache successful responses
      if (useCache) {
        cacheRef.current.set(cacheKey, data);
      }

      return data;
    } catch (err) {
      setError(err.message);
      console.error('Agent query error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearCache = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  return {
    isLoading,
    error,
    queryAgent,
    clearCache,
  };
}

// Predefined agent queries for the workflow
export const AGENT_WORKFLOW_QUERIES = {
  RO: {
    initial: "Analyze maintenance history and crew availability for primary crusher CRUSHER-001. What's the last liner replacement date and current team availability?",
    followUp: "What's the optimal scheduling window considering current operations?",
  },
  TA: {
    initial: "Analyze efficiency timeseries for primary crusher CRUSHER-001 over the last 30 days. Identify correlations between efficiency drop and operational parameters.",
    followUp: "What's the correlation coefficient between liner age and efficiency decline?",
  },
  MI: {
    initial: "Assess failure modes for primary crusher with 65% liner remaining and 82% efficiency. Calculate remaining useful life and reliability metrics.",
    followUp: "Based on FMEA analysis, what's the risk probability and recommended maintenance strategy?",
  },
  IL: {
    initial: "Check spare parts availability for primary crusher liner replacement. Include part numbers CJ-8845 and CJ-8846, lead times, and current stock levels.",
    followUp: "Are there any alternative suppliers or expedited options available?",
  },
  LD: {
    initial: "Diagnose liner wear pattern for primary crusher. Analyze wear rate, predict remaining life, and assess impact of ore hardness increase.",
    followUp: "What wear zones are most critical and require priority inspection?",
  },
};

export default useAgentChat;

