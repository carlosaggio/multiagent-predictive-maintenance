import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// In-memory cache for responses (in production, use Redis or similar)
const responseCache = new Map();
const CACHE_TTL = 3600000; // 1 hour in milliseconds

// Agent system prompts with domain expertise
const AGENT_PROMPTS = {
  RO: {
    name: 'Resource Orchestration Agent',
    systemPrompt: `You are an expert Resource Orchestration Agent for mining operations. Your role is to:
- Analyze crew availability and scheduling
- Review maintenance history and work order backlogs
- Coordinate resource allocation for maintenance activities
- Identify scheduling conflicts and optimization opportunities

You have access to SAP PM data, crew management systems, and historical maintenance records.
Keep responses concise (2-3 sentences) and actionable. Reference specific data points when available.
Format findings as: "✓ [Action taken]: [Key finding with specific data]"`,
  },
  TA: {
    name: 'Timeseries Analysis Agent',
    systemPrompt: `You are an expert Timeseries Analysis Agent specializing in equipment performance monitoring. Your role is to:
- Analyze efficiency trends and anomalies
- Correlate performance metrics with operational parameters
- Identify degradation patterns in time-series data
- Calculate statistical measures (rolling averages, standard deviations, correlations)

You work with sensor data, historian systems, and performance databases.
Keep responses concise (2-3 sentences) and data-driven. Include specific metrics and percentages.
Format findings as: "✓ [Analysis type]: [Finding with specific numbers/percentages]"`,
  },
  MI: {
    name: 'Maintenance Intelligence Agent',
    systemPrompt: `You are an expert Maintenance Intelligence Agent for industrial equipment. Your role is to:
- Analyze failure modes and effects (FMEA)
- Review maintenance procedures and best practices
- Assess equipment lifecycle and reliability metrics
- Recommend maintenance strategies (predictive, preventive, corrective)

You have expertise in crusher operations, wear patterns, and industrial maintenance standards.
Keep responses concise (2-3 sentences) and technically accurate. Reference industry standards when relevant.
Format findings as: "✓ [Assessment area]: [Technical finding with lifecycle/reliability data]"`,
  },
  IL: {
    name: 'Inventory & Logistics Agent',
    systemPrompt: `You are an expert Inventory & Logistics Agent for mining supply chain. Your role is to:
- Check spare parts availability and lead times
- Analyze inventory levels and reorder points
- Coordinate logistics for critical components
- Optimize stock levels based on criticality and usage patterns

You interface with SAP MM, warehouse management, and supplier systems.
Keep responses concise (2-3 sentences) and include specific part numbers and quantities.
Format findings as: "✓ [Inventory check]: [Part availability with quantities and lead times]"`,
  },
  LD: {
    name: 'Liner Diagnostics Agent',
    systemPrompt: `You are an expert Liner Diagnostics Agent specializing in crusher liner wear analysis. Your role is to:
- Analyze liner wear patterns and profiles
- Predict remaining useful life based on wear rates
- Assess impact of ore characteristics on wear
- Recommend optimal replacement timing

You have expertise in metallurgy, wear mechanics, and crusher operations.
Keep responses concise (2-3 sentences) and include specific wear percentages and predictions.
Format findings as: "✓ [Diagnostic result]: [Wear assessment with percentages and timeline]"`,
  },
  CA: {
    name: 'Crusher Analysis Agent',
    systemPrompt: `You are the lead Crusher Analysis Agent coordinating a multi-agent root cause analysis. Your role is to:
- Synthesize findings from all specialist agents
- Determine probable root causes with confidence levels
- Formulate actionable recommendations
- Initiate collaborative "huddle" sessions with other agents

You are the primary interface with the user and coordinate the analysis workflow.
Provide balanced, well-reasoned conclusions based on evidence from multiple sources.`,
  },
};

// Mining context data for grounding responses
const MINING_CONTEXT = {
  equipment: {
    id: 'CRUSHER-001',
    type: 'Primary Jaw Crusher',
    manufacturer: 'Metso',
    model: 'C160',
    location: 'MINE-01-CRUSH-001',
    currentEfficiency: 82,
    targetEfficiency: 89,
    lastLinerReplacement: '4 months ago',
    linerCondition: '65% remaining',
  },
  recentMetrics: {
    efficiencyDrop: '7% over 30 days',
    vibrationIncrease: '12% above baseline',
    throughputVariance: '±15%',
    oreHardnessIncrease: '15% (Bond Work Index)',
  },
  inventory: {
    linerPartsAvailable: 4,
    partNumbers: ['CJ-8845', 'CJ-8846'],
    leadTime: '2-3 days for standard, 1 day expedited',
    storageLocation: 'WH-02',
  },
  maintenance: {
    lastPM: '2 weeks ago',
    scheduledShutdown: 'Next Monday 06:00',
    estimatedRepairTime: '8 hours',
    crewAvailable: 'Team A (4 fitters)',
  },
};

// Generate cache key
function getCacheKey(agentId, query, context) {
  return `${agentId}-${query.slice(0, 50)}-${JSON.stringify(context).slice(0, 100)}`;
}

// Check cache validity
function getCachedResponse(key) {
  const cached = responseCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.response;
  }
  responseCache.delete(key);
  return null;
}

// Set cache
function setCachedResponse(key, response) {
  responseCache.set(key, {
    response,
    timestamp: Date.now(),
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { agentId, query, conversationHistory = [], useCache = true } = body;

    // Validate agent ID
    if (!AGENT_PROMPTS[agentId]) {
      return NextResponse.json(
        { error: `Unknown agent: ${agentId}` },
        { status: 400 }
      );
    }

    // Check cache first
    if (useCache) {
      const cacheKey = getCacheKey(agentId, query, conversationHistory);
      const cachedResponse = getCachedResponse(cacheKey);
      if (cachedResponse) {
        return NextResponse.json({
          ...cachedResponse,
          cached: true,
        });
      }
    }

    const agent = AGENT_PROMPTS[agentId];

    // Build messages array
    const messages = [
      {
        role: 'system',
        content: `${agent.systemPrompt}

CURRENT EQUIPMENT CONTEXT:
${JSON.stringify(MINING_CONTEXT, null, 2)}

Respond as a professional maintenance engineer would. Be specific, data-driven, and actionable.`,
      },
      ...conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
      {
        role: 'user',
        content: query,
      },
    ];

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Cost-effective for agent responses
      messages,
      max_tokens: 300,
      temperature: 0.7,
    });

    const response = {
      agentId,
      agentName: agent.name,
      content: completion.choices[0].message.content,
      timestamp: new Date().toISOString(),
      usage: completion.usage,
    };

    // Cache the response
    if (useCache) {
      const cacheKey = getCacheKey(agentId, query, conversationHistory);
      setCachedResponse(cacheKey, response);
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Agent API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process agent request' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve agent info
export async function GET() {
  return NextResponse.json({
    agents: Object.entries(AGENT_PROMPTS).map(([id, agent]) => ({
      id,
      name: agent.name,
    })),
    context: MINING_CONTEXT,
  });
}



