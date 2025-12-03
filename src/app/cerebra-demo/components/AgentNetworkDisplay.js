"use client";

import React from 'react';

// Agent data organized by category
const activeAgents = [
  { id: 'RO', name: 'Resource Orchestration', color: '#F59E0B', desc: 'Crew & scheduling' },
  { id: 'TA', name: 'Timeseries Analysis', color: '#EF4444', desc: 'Sensor trends' },
  { id: 'MI', name: 'Maintenance Intelligence', color: '#8B5CF6', desc: 'Reliability eng.' },
  { id: 'IL', name: 'Inventory & Logistics', color: '#10B981', desc: 'Parts availability' },
  { id: 'LD', name: 'Liner Diagnostics', color: '#3B82F6', desc: 'Wear analysis' },
];

const comingSoonAgents = [
  { id: 'SP', name: 'Safety & Permits', color: '#6B7280', desc: 'Compliance' },
  { id: 'QC', name: 'Quality Control', color: '#6B7280', desc: 'Standards' },
  { id: 'EN', name: 'Energy Optimization', color: '#6B7280', desc: 'Efficiency' },
  { id: 'PR', name: 'Procurement', color: '#6B7280', desc: 'Sourcing' },
  { id: 'WF', name: 'Workforce Planning', color: '#6B7280', desc: 'Capacity' },
  { id: 'EM', name: 'Environmental', color: '#6B7280', desc: 'Sustainability' },
];

function AgentTile({ agent, isActive = true, size = 'normal' }) {
  const isSmall = size === 'small';
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: isSmall ? '6px' : '8px',
      background: isActive ? 'white' : '#f9fafb',
      borderRadius: '6px',
      border: `1px solid ${isActive ? agent.color + '40' : '#e5e7eb'}`,
      opacity: isActive ? 1 : 0.5,
      minWidth: isSmall ? '60px' : '72px',
      transition: 'all 0.2s ease',
    }}>
      {/* Agent ID Badge */}
      <div style={{
        width: isSmall ? '28px' : '36px',
        height: isSmall ? '28px' : '36px',
        borderRadius: '6px',
        background: isActive 
          ? `linear-gradient(135deg, ${agent.color}20 0%, ${agent.color}10 100%)`
          : '#f3f4f6',
        border: `2px solid ${isActive ? agent.color : '#d1d5db'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '4px',
      }}>
        <span style={{
          fontSize: isSmall ? '10px' : '12px',
          fontWeight: '700',
          color: isActive ? agent.color : '#9ca3af',
          letterSpacing: '0.5px',
        }}>
          {agent.id}
        </span>
      </div>
      
      {/* Agent Name */}
      <div style={{
        fontSize: isSmall ? '8px' : '9px',
        fontWeight: '600',
        color: isActive ? '#374151' : '#9ca3af',
        textAlign: 'center',
        lineHeight: '1.2',
        maxWidth: isSmall ? '55px' : '65px',
      }}>
        {agent.name.split(' ').slice(0, 2).join(' ')}
      </div>
      
      {/* Description */}
      {!isSmall && (
        <div style={{
          fontSize: '7px',
          color: isActive ? '#6b7280' : '#d1d5db',
          textAlign: 'center',
          marginTop: '2px',
        }}>
          {agent.desc}
        </div>
      )}
    </div>
  );
}

export default function AgentNetworkDisplay({ isActive }) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      overflow: 'hidden',
    }}>
      {/* Compact Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%)',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Super Agent Icon */}
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: '#A100FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{ color: 'white', fontSize: '11px', fontWeight: '700' }}>CA</span>
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: 'white' }}>
              Super Agent Network
            </div>
            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.6)' }}>
              Specialized AI agents for predictive maintenance
            </div>
          </div>
        </div>
        <div style={{
          fontSize: '9px',
          color: '#10B981',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} />
          {activeAgents.length} Active
        </div>
      </div>

      {/* Agent Grid - Periodic Table Style */}
      <div style={{ padding: '16px' }}>
        {/* Active Agents Section */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{
            fontSize: '9px',
            fontWeight: '600',
            color: '#A100FF',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '8px',
          }}>
            Active for This Analysis
          </div>
          
          <div style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
          }}>
            {activeAgents.map(agent => (
              <AgentTile key={agent.id} agent={agent} isActive={true} />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, #e2e8f0, transparent)',
          margin: '12px 0',
        }} />

        {/* Coming Soon Agents */}
        <div>
          <div style={{
            fontSize: '9px',
            fontWeight: '600',
            color: '#9ca3af',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            Extended Network
            <span style={{
              fontSize: '7px',
              background: '#f3f4f6',
              padding: '2px 6px',
              borderRadius: '10px',
              color: '#6b7280',
            }}>
              Coming Soon
            </span>
          </div>
          
          <div style={{
            display: 'flex',
            gap: '6px',
            flexWrap: 'wrap',
          }}>
            {comingSoonAgents.map(agent => (
              <AgentTile key={agent.id} agent={agent} isActive={false} size="small" />
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: '10px 16px',
        background: '#fafafa',
        borderTop: '1px solid #f0f0f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ fontSize: '9px', color: '#6b7280' }}>
          Agents collaborate through <strong>Trusted Huddle</strong> protocol
        </div>
        <div style={{
          fontSize: '8px',
          color: '#9ca3af',
        }}>
          Select analysis to activate →
        </div>
      </div>
    </div>
  );
}
