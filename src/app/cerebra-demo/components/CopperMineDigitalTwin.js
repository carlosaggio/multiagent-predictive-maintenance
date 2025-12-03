"use client";

import React, { useState } from 'react';

// KPI Card Component
const KPICard = ({ label, value, unit, change, isNegative, isHighlight }) => (
  <div style={{
    background: 'white',
    borderRadius: '8px',
    padding: '14px 18px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    border: isHighlight ? '2px solid #EF4444' : '1px solid #e2e8f0',
    minWidth: '150px',
  }}>
    <div style={{ fontSize: '11px', color: '#718096', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>{label}</div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
      <span style={{ fontSize: '22px', fontWeight: '700', color: '#1a1a2e' }}>{value}</span>
      <span style={{ fontSize: '12px', color: '#718096' }}>{unit}</span>
    </div>
    {change && (
      <div style={{ 
        fontSize: '11px', 
        color: isNegative ? '#EF4444' : '#10B981',
        marginTop: '4px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
          {isNegative ? 
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/> :
            <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
          }
        </svg>
        {change}
      </div>
    )}
  </div>
);

// Sidebar Icon Button
const SidebarIcon = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    title={label}
    style={{
      width: '36px',
      height: '36px',
      border: 'none',
      background: isActive ? '#A100FF' : 'transparent',
      borderRadius: '6px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: isActive ? 'white' : '#718096',
      transition: 'all 0.15s ease',
    }}
  >
    {icon}
  </button>
);

// Toggle Button Component
const ToggleButton = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: '8px 16px',
      background: isActive ? '#1a1a2e' : 'white',
      color: isActive ? 'white' : '#4b5563',
      border: '1px solid #e2e8f0',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.15s ease',
    }}
  >
    {label}
  </button>
);

// Section Label Component (numbered sections)
const SectionLabel = ({ number, title, color = '#E67E22' }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
  }}>
    <div style={{
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      background: color,
      color: 'white',
      fontSize: '12px',
      fontWeight: '700',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {number}
    </div>
    <span style={{ fontSize: '13px', fontWeight: '600', color: '#1a1a2e' }}>{title}</span>
  </div>
);

// Equipment Card Component (non-overlapping)
const EquipmentCard = ({ title, efficiency, status, showAlert, onClick }) => (
  <div
    onClick={onClick}
    style={{
      background: 'white',
      borderRadius: '8px',
      padding: '12px 16px',
      border: status === 'critical' ? '2px solid #EF4444' : '1px solid #e2e8f0',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'all 0.15s ease',
      boxShadow: showAlert ? '0 0 0 4px rgba(239,68,68,0.2)' : '0 2px 4px rgba(0,0,0,0.05)',
      animation: showAlert ? 'pulse 2s infinite' : 'none',
    }}
  >
    <div style={{ fontSize: '11px', color: '#718096', marginBottom: '4px' }}>{title}</div>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ 
        fontSize: '18px', 
        fontWeight: '700', 
        color: status === 'critical' ? '#EF4444' : status === 'warning' ? '#F59E0B' : '#10B981'
      }}>
        {efficiency}%
      </span>
      {showAlert && (
        <span style={{
          background: '#EF4444',
          color: 'white',
          padding: '2px 8px',
          borderRadius: '4px',
          fontSize: '9px',
          fontWeight: '600',
        }}>
          ALERT
        </span>
      )}
    </div>
  </div>
);

// Process Flow SVG - Simplified clean schematic
const ProcessFlowSVG = () => (
  <svg viewBox="0 0 800 200" style={{ width: '100%', height: '140px' }}>
    <defs>
      <linearGradient id="flowLine" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#E67E22" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="#E67E22" />
      </marker>
    </defs>

    {/* Flow lines */}
    <path d="M 50,100 L 170,100" stroke="url(#flowLine)" strokeWidth="3" markerEnd="url(#arrowhead)" />
    <path d="M 230,100 L 350,100" stroke="url(#flowLine)" strokeWidth="3" markerEnd="url(#arrowhead)" />
    <path d="M 410,100 L 530,100" stroke="url(#flowLine)" strokeWidth="3" markerEnd="url(#arrowhead)" />
    <path d="M 590,100 L 710,100" stroke="url(#flowLine)" strokeWidth="3" markerEnd="url(#arrowhead)" />

    {/* Stage boxes */}
    {/* Mining */}
    <g transform="translate(0, 60)">
      <rect x="0" y="0" width="50" height="80" rx="4" fill="#F3F4F6" stroke="#E2E8F0" />
      <text x="25" y="45" textAnchor="middle" fontSize="9" fill="#4b5563">ROM</text>
    </g>

    {/* Primary Crusher - Highlighted */}
    <g transform="translate(170, 50)">
      <rect x="0" y="0" width="60" height="100" rx="4" fill="#FEF2F2" stroke="#EF4444" strokeWidth="2" />
      <text x="30" y="40" textAnchor="middle" fontSize="8" fill="#991B1B" fontWeight="600">PRIMARY</text>
      <text x="30" y="52" textAnchor="middle" fontSize="8" fill="#991B1B" fontWeight="600">CRUSHER</text>
      <text x="30" y="72" textAnchor="middle" fontSize="14" fill="#EF4444" fontWeight="700">82%</text>
    </g>

    {/* Screen */}
    <g transform="translate(350, 60)">
      <rect x="0" y="0" width="60" height="80" rx="4" fill="#F0FDF4" stroke="#10B981" />
      <text x="30" y="35" textAnchor="middle" fontSize="9" fill="#059669">SCREEN</text>
      <text x="30" y="55" textAnchor="middle" fontSize="12" fill="#10B981" fontWeight="700">92%</text>
    </g>

    {/* Secondary Crusher */}
    <g transform="translate(530, 60)">
      <rect x="0" y="0" width="60" height="80" rx="4" fill="#F0FDF4" stroke="#10B981" />
      <text x="30" y="30" textAnchor="middle" fontSize="8" fill="#059669">SECONDARY</text>
      <text x="30" y="42" textAnchor="middle" fontSize="8" fill="#059669">CRUSHER</text>
      <text x="30" y="62" textAnchor="middle" fontSize="12" fill="#10B981" fontWeight="700">94%</text>
    </g>

    {/* Stockpile */}
    <g transform="translate(710, 60)">
      <path d="M 0,80 L 40,20 L 80,80 Z" fill="#FEF3C7" stroke="#F59E0B" />
      <text x="40" y="55" textAnchor="middle" fontSize="9" fill="#92400E">STOCKPILE</text>
    </g>
  </svg>
);

export default function CopperMineDigitalTwin({ onEquipmentClick }) {
  const [activeView, setActiveView] = useState('lpo'); // 'performance' or 'lpo'

  return (
    <div style={{ 
      display: 'flex',
      height: '100%',
      minHeight: '500px',
      background: 'white',
      borderRadius: '8px',
      overflow: 'hidden',
      border: '1px solid #e2e8f0',
    }}>
      {/* Left Sidebar */}
      <div style={{
        width: '52px',
        background: '#fafafa',
        borderRight: '1px solid #e2e8f0',
        padding: '16px 8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}>
        <SidebarIcon
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>}
          label="Dashboard"
          isActive={true}
        />
        <SidebarIcon
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>}
          label="Reports"
          isActive={false}
        />
        <SidebarIcon
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>}
          label="Alerts"
          isActive={false}
        />
        <SidebarIcon
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/></svg>}
          label="Settings"
          isActive={false}
        />
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header with KPIs */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #e2e8f0',
          background: '#fafafa',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            {/* KPI Cards */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <KPICard label="Run of Mine" value="124,500" unit="tpd" change="7.62%" isNegative />
              <KPICard label="Processed Ore" value="107,700" unit="tpd" change="7.68%" isNegative />
              <KPICard label="Recovery Rate" value="91.2" unit="%" />
              <KPICard label="Primary Crusher" value="82" unit="%" change="7%" isNegative isHighlight />
            </div>
          </div>

          {/* Toggle Buttons */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <ToggleButton 
              label="Shift Performance" 
              isActive={activeView === 'performance'}
              onClick={() => setActiveView('performance')}
            />
            <ToggleButton 
              label="LPO Hotspots" 
              isActive={activeView === 'lpo'}
              onClick={() => setActiveView('lpo')}
            />
          </div>
        </div>

        {/* Process Flow Area */}
        <div style={{ flex: 1, padding: '20px', position: 'relative' }}>
          {/* Section Labels */}
          <div style={{ display: 'flex', gap: '40px', marginBottom: '20px' }}>
            <SectionLabel number="1" title="Mining" />
            <SectionLabel number="2" title="Primary Crushing" color="#EF4444" />
            <SectionLabel number="3" title="Screening" color="#10B981" />
            <SectionLabel number="4" title="Secondary Crushing" color="#10B981" />
            <SectionLabel number="5" title="Stockpile" color="#F59E0B" />
          </div>

          {/* Process Flow Diagram */}
          <div style={{ 
            background: '#fafafa', 
            borderRadius: '8px', 
            padding: '20px',
            border: '1px solid #e2e8f0',
            marginBottom: '20px',
          }}>
            <ProcessFlowSVG />
          </div>

          {/* Equipment Status Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(5, 1fr)', 
            gap: '12px',
            marginBottom: '20px',
          }}>
            <EquipmentCard title="ROM Bin" efficiency={95} status="normal" />
            <EquipmentCard 
              title="Primary Crusher" 
              efficiency={82} 
              status="critical" 
              showAlert={activeView === 'lpo'}
              onClick={() => onEquipmentClick && onEquipmentClick('primary_crusher')}
            />
            <EquipmentCard title="Vibrating Screen" efficiency={92} status="normal" />
            <EquipmentCard title="Secondary Crusher" efficiency={94} status="normal" />
            <EquipmentCard title="Conveyor System" efficiency={96} status="normal" />
          </div>

          {/* LPO Alert Panel - Only show in LPO view */}
          {activeView === 'lpo' && (
            <div style={{
              background: 'linear-gradient(135deg, #FEF2F2 0%, #FECACA 100%)',
              border: '1px solid #FECACA',
              borderRadius: '8px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: '#EF4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2L1 21h22L12 2zm0 3.83L19.53 19H4.47L12 5.83zM11 16h2v2h-2v-2zm0-6h2v4h-2v-4z"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#991B1B', marginBottom: '4px' }}>
                    Loss Profit Opportunity Detected
                  </div>
                  <div style={{ fontSize: '12px', color: '#7F1D1D', lineHeight: '1.4' }}>
                    Primary Crusher efficiency dropped from 89% to 82% over 30 days. Estimated loss: $47,500/day.
                  </div>
                </div>
              </div>
              <button
                onClick={() => onEquipmentClick && onEquipmentClick('primary_crusher')}
                style={{
                  padding: '10px 20px',
                  background: '#EF4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  whiteSpace: 'nowrap',
                }}
              >
                Analyze Now
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '10px 20px',
          borderTop: '1px solid #e2e8f0',
          background: '#fafafa',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '11px',
          color: '#9ca3af',
        }}>
          <span>Copper Mine - Crushing Circuit | Last updated: 2 min ago</span>
          <span>AIIS Digital Twin v2.1</span>
        </div>
      </div>

      {/* Pulse animation */}
      <style jsx>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
          70% { box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
      `}</style>
    </div>
  );
}
