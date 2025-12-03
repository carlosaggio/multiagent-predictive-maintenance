"use client";

import { useState, useCallback, useRef } from 'react';

// Agent configuration - colors aligned with HuddleBanner
const AGENT_CONFIG = {
  RO: {
    id: 'RO',
    name: 'Resource Orchestration',
    color: '#F59E0B', // Orange
  },
  TA: {
    id: 'TA',
    name: 'Timeseries Analysis',
    color: '#EF4444', // Red
  },
  MI: {
    id: 'MI',
    name: 'Maintenance Intelligence',
    color: '#8B5CF6', // Purple
  },
  IL: {
    id: 'IL',
    name: 'Inventory & Logistics',
    color: '#10B981', // Green
  },
  LD: {
    id: 'LD',
    name: 'Liner Diagnostics',
    color: '#3B82F6', // Blue
  },
};

// CURATED RESPONSES - ONE per agent, fully consistent with scenario
// Source of truth: Liner replaced May 2024 (8 months), 65% remaining, RUL 5-7 days, RPN 432
// Each agent has UNIQUE insights - no overlap between agents
const CURATED_RESPONSES = {
  RO: {
    content: "Last replacement: May 15, 2024 (8 months ago) • Team A confirmed Jan 20, 06:00 • Lead: James Morrison (47 jobs, 95% match) • 4 fitters assigned • Est. duration: 8 hours",
    isAI: true,
  },
  TA: {
    content: "Efficiency: 89% → 82% over 30 days • Correlation (wear-efficiency): r=0.92 • Degradation rate: 0.23%/day • 80% threshold in ~9 days • Pitman vib +120%, Motor current +41%",
    isAI: true,
  },
  MI: {
    content: "Weibull β=2.1 (wear-out phase) • Lifecycle: 133% exceeded (8mo vs 6mo design) • RPN=432 (S:8 × O:6 × D:9) • P(Failure) in 7 days: 38%",
    isAI: true,
  },
  IL: {
    content: "CJ-8845 Fixed Liner: 4 units in stock @ WH-02 • CJ-8846 Movable: 3 units in stock • Total material: $16,494 • Lead time: 0 days (ready to issue)",
    isAI: true,
  },
  LD: {
    content: "Zone B (feed side): 65% remaining - CRITICAL • Asymmetric wear → jaw misalignment suspected • Wear rate: 8.75%/month • RUL: 5-7 days at current load",
    isAI: true,
  },
};

export function useDynamicAgents() {
  const [agentResponses, setAgentResponses] = useState({});
  const [activeAgent, setActiveAgent] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const processedAgents = useRef(new Set());

  // Query an individual agent - returns CURATED response (consistent with scenario)
  const queryAgent = useCallback(async (agentId) => {
    const agent = AGENT_CONFIG[agentId];
    if (!agent) return null;

    // If already processed this agent, return cached
    if (processedAgents.current.has(agentId)) {
      return agentResponses[agentId]?.[0];
    }

    setIsProcessing(true);
    setActiveAgent(agentId);
    setError(null);

    // Use curated response (guaranteed consistent)
    const curatedResponse = CURATED_RESPONSES[agentId];
    
    const result = {
      agentId,
      agentName: agent.name,
      content: curatedResponse.content,
      timestamp: new Date().toISOString(),
      isAI: curatedResponse.isAI,
    };

    processedAgents.current.add(agentId);
    
    // Update responses state - only ONE response per agent
    setAgentResponses(prev => ({
      ...prev,
      [agentId]: [result], // Single response array
    }));

    setIsProcessing(false);
    setActiveAgent(null);

    return result;
  }, [agentResponses]);

  // Run full huddle workflow with all agents
  const runHuddleWorkflow = useCallback(async (agents = ['RO', 'TA', 'MI', 'IL', 'LD']) => {
    const results = [];
    
    for (const agentId of agents) {
      // Query each agent - only ONE response per agent
      const result = await queryAgent(agentId);
      if (result) {
        results.push(result);
      }
      // Add delay between agents for visual effect
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    return results;
  }, [queryAgent]);

  // Clear cache and responses
  const reset = useCallback(() => {
    processedAgents.current.clear();
    setAgentResponses({});
    setActiveAgent(null);
    setIsProcessing(false);
    setError(null);
  }, []);

  return {
    agentResponses,
    activeAgent,
    isProcessing,
    error,
    queryAgent,
    runHuddleWorkflow,
    reset,
    AGENT_CONFIG,
  };
}

export { AGENT_CONFIG, CURATED_RESPONSES };
export default useDynamicAgents;
