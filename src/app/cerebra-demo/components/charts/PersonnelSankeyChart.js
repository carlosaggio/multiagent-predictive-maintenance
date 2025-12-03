"use client";

import React from 'react';
import { ResponsiveSankey } from '@nivo/sankey';

// Personnel flow data - technicians → teams → job assignments
const personnelData = {
  nodes: [
    { id: "Technicians" },
    { id: "Team A" },
    { id: "Team B" },
    { id: "Reserve" },
    { id: "Crusher Job" },
    { id: "Other Tasks" },
    { id: "Standby" }
  ],
  links: [
    { source: "Technicians", target: "Team A", value: 4 },
    { source: "Technicians", target: "Team B", value: 2 },
    { source: "Technicians", target: "Reserve", value: 2 },
    { source: "Team A", target: "Crusher Job", value: 4 },
    { source: "Team B", target: "Crusher Job", value: 1 },
    { source: "Team B", target: "Other Tasks", value: 1 },
    { source: "Reserve", target: "Standby", value: 2 }
  ]
};

export default function PersonnelSankeyChart() {
  return (
    <div style={{
      background: 'white',
      borderRadius: '8px',
      padding: '16px',
      border: '1px solid #e2e8f0'
    }}>
      <div style={{ 
        fontSize: '12px', 
        fontWeight: '600', 
        color: '#374151',
        marginBottom: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <span>Crew Resource Allocation</span>
        <span style={{ 
          fontSize: '10px', 
          color: '#6b7280',
          fontWeight: '400'
        }}>
          Jan 20, 2025
        </span>
      </div>
      
      <div style={{ height: '180px' }}>
        <ResponsiveSankey
          data={personnelData}
          margin={{ top: 10, right: 120, bottom: 10, left: 10 }}
          align="justify"
          colors={['#F59E0B', '#10B981', '#3B82F6', '#94A3B8', '#EF4444', '#8B5CF6', '#CBD5E1']}
          nodeOpacity={1}
          nodeHoverOthersOpacity={0.35}
          nodeThickness={16}
          nodeSpacing={20}
          nodeBorderWidth={0}
          nodeBorderRadius={3}
          linkOpacity={0.5}
          linkHoverOpacity={0.8}
          linkHoverOthersOpacity={0.1}
          linkContract={3}
          enableLinkGradient={true}
          labelPosition="outside"
          labelOrientation="horizontal"
          labelPadding={10}
          labelTextColor={{ from: 'color', modifiers: [['darker', 1.5]] }}
          animate={true}
          motionConfig="gentle"
          theme={{
            labels: {
              text: {
                fontSize: 10,
                fontWeight: 500
              }
            }
          }}
        />
      </div>

      {/* Key Insights */}
      <div style={{
        marginTop: '12px',
        paddingTop: '12px',
        borderTop: '1px solid #f0f0f0',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
      }}>
        {[
          { value: '4', label: 'Team A Assigned', color: '#10B981' },
          { value: '95%', label: 'Skill Match', color: '#3B82F6' },
          { value: '8h', label: 'Est. Duration', color: '#F59E0B' },
        ].map((stat, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '16px', fontWeight: '700', color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: '9px', color: '#6b7280' }}>{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
