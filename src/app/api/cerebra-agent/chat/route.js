import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Session storage for conversation context (in production, use Redis)
const sessionStore = new Map();

// Equipment and operational context
const OPERATIONAL_CONTEXT = {
  site: 'Copper Mine Operations - Site Alpha',
  equipment: {
    primaryCrusher: {
      id: 'CRUSHER-001',
      type: 'Metso C160 Jaw Crusher',
      status: 'Degraded Performance',
      efficiency: '82%',
      targetEfficiency: '89%',
      issues: [
        'Liner wear at 65% (critical threshold)',
        'Efficiency dropped 7% over 30 days',
        'Vibration readings 12% above baseline',
      ],
    },
    stockpileConveyor: {
      id: 'CONV-SF-001',
      type: 'Stockpile Feed Conveyor',
      status: 'Alert - Belt Tracking',
      notes: 'Minor belt tracking issue detected',
    },
  },
  currentAnalysis: {
    rootCauses: [
      { rank: 1, cause: 'Liner wear degradation', likelihood: 85, evidence: '4 months since replacement, 65% remaining' },
      { rank: 2, cause: 'Hard ore feed composition', likelihood: 75, evidence: 'Geological survey shows harder ore zone' },
      { rank: 3, cause: 'Bearing degradation', likelihood: 60, evidence: 'Elevated vibration readings' },
      { rank: 4, cause: 'Feed rate overload', likelihood: 35, evidence: 'Control logs show ±15% variation' },
    ],
    recommendation: 'Schedule immediate liner replacement during next planned shutdown',
    estimatedCost: '$15,700',
    estimatedDowntime: '8 hours',
  },
  recentMaintenance: [
    { date: '2025-01-01', type: 'Preventive', description: 'Routine PM inspection' },
    { date: '2024-10-15', type: 'Corrective', description: 'Liner replacement' },
    { date: '2024-09-20', type: 'Predictive', description: 'Vibration analysis' },
  ],
  inventory: {
    linerPlates: { available: 4, partNumber: 'CJ-8845/8846', location: 'WH-02' },
    bolts: { available: 48, partNumber: 'BT-M24X80', location: 'WH-02' },
    bearings: { available: 2, partNumber: 'SKF-22320', location: 'WH-01' },
  },
};

const CHAT_SYSTEM_PROMPT = `You are Cerebra, an AI-powered predictive maintenance assistant for copper mining operations. You help maintenance engineers, reliability managers, and operations staff understand equipment health and make informed decisions.

CURRENT OPERATIONAL CONTEXT:
${JSON.stringify(OPERATIONAL_CONTEXT, null, 2)}

Guidelines:
- Be professional and concise
- Reference specific data from the context when answering
- If asked about something not in the context, acknowledge limitations
- Suggest related insights proactively when relevant
- Use bullet points for lists
- Include specific numbers, percentages, and part numbers when available
- For technical questions, explain in practical terms

You can answer questions about:
- Equipment status and health
- Root cause analysis findings
- Maintenance recommendations
- Spare parts and inventory
- Scheduling and planning
- Historical maintenance data
- Cost estimates and downtime impact`;

export async function POST(request) {
  try {
    const body = await request.json();
    const { message, sessionId = 'default', conversationHistory = [] } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Get or create session
    let session = sessionStore.get(sessionId);
    if (!session) {
      session = {
        id: sessionId,
        history: [],
        createdAt: new Date().toISOString(),
      };
      sessionStore.set(sessionId, session);
    }

    // Build messages with history
    const messages = [
      { role: 'system', content: CHAT_SYSTEM_PROMPT },
      ...session.history.slice(-10), // Keep last 10 messages for context
      { role: 'user', content: message },
    ];

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    const assistantMessage = completion.choices[0].message.content;

    // Update session history
    session.history.push({ role: 'user', content: message });
    session.history.push({ role: 'assistant', content: assistantMessage });

    // Keep history manageable
    if (session.history.length > 20) {
      session.history = session.history.slice(-20);
    }

    return NextResponse.json({
      message: assistantMessage,
      sessionId: session.id,
      timestamp: new Date().toISOString(),
      usage: completion.usage,
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process chat message' },
      { status: 500 }
    );
  }
}

// GET - retrieve session info
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');

  if (sessionId) {
    const session = sessionStore.get(sessionId);
    if (session) {
      return NextResponse.json({
        sessionId: session.id,
        messageCount: session.history.length,
        createdAt: session.createdAt,
      });
    }
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  return NextResponse.json({
    activeSessions: sessionStore.size,
    context: OPERATIONAL_CONTEXT,
  });
}



