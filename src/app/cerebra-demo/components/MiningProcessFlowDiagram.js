"use client";

import React, { useState, useEffect } from 'react';

/**
 * Mining Process Flow Diagram Component
 * 
 * A professional, exportable diagram showing the complete mining value chain
 * from ore extraction to product shipping.
 */

// Equipment icon components with isometric 3D styling
const EquipmentIcons = {
  // Haul truck - mining vehicle
  HaulTruck: () => (
    <g>
      {/* Truck bed */}
      <path d="M8 12 L8 32 L52 32 L58 22 L58 12 Z" fill="#7eb8d8" stroke="#5a9bc2" strokeWidth="0.5"/>
      <path d="M8 32 L8 12 L2 18 L2 32 Z" fill="#5a9bc2"/>
      {/* Cab */}
      <path d="M52 32 L52 22 L58 22 L62 18 L62 32 Z" fill="#9ed0eb"/>
      <rect x="54" y="24" width="6" height="6" fill="#c5e4f5" rx="1"/>
      {/* Wheels */}
      <ellipse cx="18" cy="34" rx="8" ry="4" fill="#4a8ab0"/>
      <ellipse cx="44" cy="34" rx="8" ry="4" fill="#4a8ab0"/>
      <ellipse cx="18" cy="34" rx="4" ry="2" fill="#3d7a9e"/>
      <ellipse cx="44" cy="34" rx="4" ry="2" fill="#3d7a9e"/>
    </g>
  ),

  // Primary crusher with hopper
  PrimaryCrusher: () => (
    <g>
      {/* Hopper top */}
      <polygon points="10,2 60,2 55,18 15,18" fill="#9ed0eb" stroke="#5a9bc2" strokeWidth="0.5"/>
      {/* Main body */}
      <rect x="15" y="18" width="40" height="35" fill="#7eb8d8" stroke="#5a9bc2" strokeWidth="0.5"/>
      <path d="M15 18 L15 53 L8 48 L8 12 Z" fill="#5a9bc2"/>
      {/* Discharge */}
      <rect x="25" y="53" width="20" height="10" fill="#4a8ab0"/>
      {/* Motor */}
      <circle cx="35" cy="8" r="4" fill="#4a8ab0"/>
    </g>
  ),

  // Cone crusher
  ConeCrusher: () => (
    <g>
      {/* Top cone opening */}
      <ellipse cx="35" cy="10" rx="28" ry="8" fill="#9ed0eb" stroke="#5a9bc2" strokeWidth="0.5"/>
      {/* Body */}
      <path d="M7 10 L7 40 L63 40 L63 10" fill="#7eb8d8" stroke="#5a9bc2" strokeWidth="0.5"/>
      {/* Bottom */}
      <ellipse cx="35" cy="40" rx="28" ry="6" fill="#5a9bc2"/>
      {/* Inner cone */}
      <ellipse cx="35" cy="10" rx="12" ry="4" fill="#4a8ab0"/>
    </g>
  ),

  // SAG Mill - large rotating drum
  SagMill: () => (
    <g>
      {/* Drum end */}
      <ellipse cx="40" cy="18" rx="32" ry="14" fill="#9ed0eb" stroke="#5a9bc2" strokeWidth="0.5"/>
      {/* Drum body */}
      <rect x="8" y="18" width="64" height="28" fill="#7eb8d8" stroke="#5a9bc2" strokeWidth="0.5"/>
      {/* Bottom curve */}
      <ellipse cx="40" cy="46" rx="32" ry="8" fill="#5a9bc2"/>
      {/* Drive motor */}
      <rect x="70" y="14" width="12" height="18" fill="#4a8ab0" rx="2"/>
      {/* Trunnion */}
      <rect x="2" y="22" width="8" height="10" fill="#4a8ab0"/>
    </g>
  ),

  // Conveyor belt
  Conveyor: ({ angle = 0 }) => (
    <g transform={`rotate(${angle}, 50, 25)`}>
      {/* Belt */}
      <rect x="5" y="18" width="90" height="14" fill="#7eb8d8" stroke="#5a9bc2" strokeWidth="0.5" rx="2"/>
      {/* Pulleys */}
      <ellipse cx="12" cy="25" rx="10" ry="6" fill="#4a8ab0"/>
      <ellipse cx="88" cy="25" rx="10" ry="6" fill="#4a8ab0"/>
      {/* Support structure */}
      <rect x="45" y="32" width="10" height="15" fill="#5a9bc2"/>
    </g>
  ),

  // Conveyor with support frame
  ConveyorWithFrame: () => (
    <g>
      {/* Angled belt */}
      <rect x="5" y="15" width="100" height="12" fill="#7eb8d8" stroke="#5a9bc2" strokeWidth="0.5" rx="2" transform="rotate(-12, 55, 21)"/>
      {/* Head pulley */}
      <ellipse cx="12" cy="32" rx="10" ry="6" fill="#4a8ab0"/>
      {/* Tail pulley */}
      <ellipse cx="98" cy="12" rx="10" ry="6" fill="#4a8ab0"/>
      {/* Support frame */}
      <rect x="40" y="38" width="30" height="18" fill="#5a9bc2" rx="2"/>
    </g>
  ),

  // Vibrating screen
  VibratingScreen: () => (
    <g>
      {/* Screen housing */}
      <rect x="5" y="8" width="60" height="38" fill="#7eb8d8" stroke="#5a9bc2" strokeWidth="0.5" rx="2"/>
      {/* Screen decks */}
      <line x1="10" y1="18" x2="60" y2="18" stroke="#4a8ab0" strokeWidth="2"/>
      <line x1="10" y1="28" x2="60" y2="28" stroke="#4a8ab0" strokeWidth="2"/>
      <line x1="10" y1="38" x2="60" y2="38" stroke="#4a8ab0" strokeWidth="2"/>
      {/* Springs */}
      <rect x="8" y="46" width="8" height="6" fill="#5a9bc2"/>
      <rect x="54" y="46" width="8" height="6" fill="#5a9bc2"/>
    </g>
  ),

  // Stockpile - conical ore pile
  Stockpile: () => (
    <g>
      {/* Left pile */}
      <polygon points="5,45 35,8 65,45" fill="#7eb8d8"/>
      {/* Right pile (overlapping) */}
      <polygon points="30,45 60,12 90,45" fill="#9ed0eb"/>
      {/* Shadow/depth */}
      <polygon points="35,8 35,45 5,45" fill="#5a9bc2" opacity="0.3"/>
    </g>
  ),

  // Stacker/reclaimer
  Stacker: () => (
    <g>
      {/* Boom */}
      <rect x="5" y="28" width="65" height="14" fill="#7eb8d8" stroke="#5a9bc2" strokeWidth="0.5"/>
      {/* Boom tip */}
      <polygon points="70,28 70,16 40,28" fill="#9ed0eb" stroke="#5a9bc2" strokeWidth="0.5"/>
      {/* Tower */}
      <rect x="30" y="10" width="14" height="18" fill="#5a9bc2"/>
      {/* Base */}
      <ellipse cx="37" cy="48" rx="20" ry="6" fill="#4a8ab0"/>
    </g>
  ),

  // Thickener tank
  Thickener: ({ large = false }) => {
    const scale = large ? 1.1 : 1;
    return (
      <g transform={`scale(${scale})`}>
        {/* Tank top */}
        <ellipse cx="42" cy="12" rx="36" ry="10" fill="#9ed0eb" stroke="#5a9bc2" strokeWidth="0.5"/>
        {/* Tank wall */}
        <rect x="6" y="12" width="72" height="32" fill="#7eb8d8" stroke="#5a9bc2" strokeWidth="0.5"/>
        {/* Tank bottom */}
        <ellipse cx="42" cy="44" rx="36" ry="8" fill="#5a9bc2"/>
        {/* Center column */}
        <rect x="38" y="8" width="8" height="40" fill="#4a8ab0"/>
      </g>
    );
  },

  // Flotation cell bank
  FlotationCell: () => (
    <g>
      {/* Cell bank base */}
      <rect x="5" y="22" width="95" height="35" fill="#7eb8d8" stroke="#5a9bc2" strokeWidth="0.5" rx="2"/>
      {/* Individual cells */}
      <rect x="10" y="28" width="18" height="24" fill="#5a9bc2"/>
      <rect x="32" y="28" width="18" height="24" fill="#5a9bc2"/>
      <rect x="54" y="28" width="18" height="24" fill="#5a9bc2"/>
      <rect x="76" y="28" width="18" height="24" fill="#5a9bc2"/>
      {/* Mechanism housing */}
      <rect x="25" y="8" width="55" height="14" fill="#9ed0eb" stroke="#5a9bc2" strokeWidth="0.5" rx="2"/>
    </g>
  ),

  // Tailing dam
  TailingDam: () => (
    <g>
      {/* Dam embankment */}
      <polygon points="5,48 50,12 95,48" fill="#7eb8d8"/>
      {/* Water surface */}
      <ellipse cx="50" cy="35" rx="35" ry="8" fill="#9ed0eb" opacity="0.6"/>
      {/* Dam face */}
      <rect x="15" y="48" width="70" height="8" fill="#5a9bc2"/>
    </g>
  ),

  // Fluid transport (pipeline)
  FluidTransport: () => (
    <g>
      {/* Main pipe */}
      <rect x="5" y="20" width="85" height="14" fill="#7eb8d8" stroke="#5a9bc2" strokeWidth="0.5" rx="7"/>
      {/* Pump housings */}
      <ellipse cx="18" cy="27" rx="12" ry="8" fill="#4a8ab0"/>
      <ellipse cx="77" cy="27" rx="12" ry="8" fill="#4a8ab0"/>
      {/* Flanges */}
      <rect x="40" y="18" width="15" height="18" fill="#5a9bc2" rx="2"/>
    </g>
  ),

  // Filter press
  Filter: () => (
    <g>
      {/* Frame */}
      <rect x="12" y="5" width="55" height="52" fill="#7eb8d8" stroke="#5a9bc2" strokeWidth="0.5" rx="2"/>
      {/* Filter plates */}
      <rect x="18" y="10" width="16" height="42" fill="#5a9bc2"/>
      <rect x="38" y="10" width="16" height="42" fill="#5a9bc2"/>
      <rect x="58" y="10" width="6" height="42" fill="#5a9bc2"/>
      {/* Base */}
      <rect x="5" y="57" width="70" height="10" fill="#4a8ab0" rx="2"/>
    </g>
  ),

  // Load out bin/hopper
  LoadOutBin: () => (
    <g>
      {/* Hopper body */}
      <polygon points="8,5 72,5 80,42 0,42" fill="#7eb8d8" stroke="#5a9bc2" strokeWidth="0.5"/>
      {/* Discharge chute */}
      <rect x="30" y="42" width="20" height="12" fill="#5a9bc2"/>
      {/* Top edge */}
      <rect x="8" y="2" width="64" height="6" fill="#9ed0eb" rx="1"/>
    </g>
  ),

  // Ship/vessel
  Ship: () => (
    <g>
      {/* Hull */}
      <polygon points="5,40 85,40 75,22 15,22" fill="#7eb8d8" stroke="#5a9bc2" strokeWidth="0.5"/>
      {/* Superstructure */}
      <rect x="30" y="8" width="25" height="16" fill="#5a9bc2" rx="2"/>
      {/* Mast */}
      <line x1="42" y1="0" x2="42" y2="8" stroke="#4a8ab0" strokeWidth="3"/>
      {/* Water line */}
      <rect x="5" y="45" width="80" height="8" fill="#9ed0eb" opacity="0.5"/>
      {/* Deck */}
      <rect x="15" y="20" width="60" height="4" fill="#9ed0eb"/>
    </g>
  ),
};

// Equipment box wrapper component
const EquipmentBox = ({ 
  x, y, width, height, 
  label, 
  children, 
  iconX = 12, 
  iconY = 8,
  isHighlighted = false,
  highlightColor = '#dc2626',
  onClick,
  id
}) => {
  const labels = Array.isArray(label) ? label : [label];
  const labelY = height - (labels.length * 11) - 4;
  
  return (
    <g 
      transform={`translate(${x}, ${y})`}
      onClick={onClick ? () => onClick(id) : undefined}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      data-equipment-id={id}
    >
      {/* Box background */}
      <rect 
        x={0} y={0} 
        width={width} height={height} 
        rx={4}
        fill={isHighlighted ? '#fef2f2' : '#f8fafc'}
        stroke={isHighlighted ? highlightColor : '#e2e8f0'}
        strokeWidth={isHighlighted ? 2.5 : 1}
      />
      {/* Equipment icon */}
      <g transform={`translate(${iconX}, ${iconY})`}>
        {children}
      </g>
      {/* Labels */}
      {labels.map((line, i) => (
        <text 
          key={i}
          x={width / 2} 
          y={labelY + (i * 11)}
          fontSize={8}
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
          fontWeight={500}
          fill="#475569"
          textAnchor="middle"
        >
          {line.toUpperCase()}
        </text>
      ))}
    </g>
  );
};

// Section header component
const SectionHeader = ({ x, y, number, title }) => (
  <g transform={`translate(${x}, ${y})`}>
    <circle cx={12} cy={12} r={12} fill="none" stroke="#94a3b8" strokeWidth={1.5}/>
    <text x={12} y={16} fontSize={12} fontFamily="system-ui" fill="#64748b" textAnchor="middle" fontWeight={500}>
      {number}
    </text>
    <text x={32} y={16} fontSize={11} fontFamily="system-ui" fill="#475569" fontWeight={600} letterSpacing={1}>
      {title}
    </text>
  </g>
);

// Flow arrow component
const FlowArrow = ({ d }) => (
  <path 
    d={d}
    fill="none"
    stroke="#3b82f6"
    strokeWidth={2}
    markerEnd="url(#flowArrow)"
  />
);

// KPI Card Component for the header
const KPICard = ({ icon, label, value, unit, change, isUp, isAlert }) => (
  <div style={{
    background: isAlert ? '#FEF2F2' : 'white',
    borderRadius: '4px',
    padding: '12px 16px',
    border: `1px solid ${isAlert ? '#FECACA' : '#e2e8f0'}`,
    minWidth: '180px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    transition: 'all 0.3s ease',
  }}>
    <div style={{
      width: '36px',
      height: '36px',
      background: isAlert ? '#FEE2E2' : '#F3F4F6',
      borderRadius: '6px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}>
      {icon}
    </div>
    <div>
      <div style={{ fontSize: '11px', color: isAlert ? '#DC2626' : '#6B7280', marginBottom: '4px', fontWeight: isAlert ? '600' : '400' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '24px', fontWeight: '700', color: isAlert ? '#DC2626' : '#1A1A2E', transition: 'color 0.3s ease' }}>{value}</span>
        <span style={{ fontSize: '11px', color: isAlert ? '#991B1B' : '#6B7280' }}>{unit}</span>
        <span style={{ 
          fontSize: '11px', 
          fontWeight: '600',
          color: isAlert ? '#DC2626' : (isUp ? '#10B981' : '#EF4444'),
          display: 'flex',
          alignItems: 'center',
          gap: '2px'
        }}>
          {isAlert ? '⚠' : (isUp ? '↑' : '↓')}{change}
          {!isAlert && <span style={{ color: '#9CA3AF', fontWeight: '400', marginLeft: '2px' }}>MoM</span>}
        </span>
      </div>
    </div>
  </div>
);

// Toggle Button Component
const ToggleButton = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: '8px 16px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      background: isActive ? '#A100FF' : 'transparent',
      border: `1px solid #A100FF`,
      color: isActive ? 'white' : '#A100FF',
    }}
  >
    {label}
  </button>
);

// Image-based Digital Twin Component (uses designed image)
const ImageDigitalTwin = ({ onEquipmentClick, highlightedIds = [], highlightColor = '#dc2626' }) => {
  const handleClick = (id) => {
    if (onEquipmentClick) {
      if (id === 'rom-bin-primary-crusher') {
        onEquipmentClick('primary_crusher');
      } else {
        onEquipmentClick(id);
      }
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* The designed image */}
      <img 
        src="/images/mining-process-flow-designed.png" 
        alt="Mining Process Flow Diagram"
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
        }}
      />
      
      {/* Clickable hotspots overlay */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
        {/* ROM Bin & Primary Crusher - clickable area */}
        <div
          onClick={() => handleClick('rom-bin-primary-crusher')}
          style={{
            position: 'absolute',
            left: '13%',
            top: '5%',
            width: '7%',
            height: '20%',
            cursor: 'pointer',
            border: highlightedIds.includes('rom-bin-primary-crusher') ? `3px solid ${highlightColor}` : 'none',
            borderRadius: '4px',
            background: highlightedIds.includes('rom-bin-primary-crusher') ? 'rgba(220, 38, 38, 0.1)' : 'transparent',
            transition: 'all 0.2s ease',
          }}
          title="ROM Bin & Primary Crusher"
        />
        
        {/* Stockpile Feed Conveyor - clickable area */}
        <div
          onClick={() => handleClick('stockpile-feed-conveyor')}
          style={{
            position: 'absolute',
            left: '14%',
            top: '52%',
            width: '9%',
            height: '14%',
            cursor: 'pointer',
            border: highlightedIds.includes('stockpile-feed-conveyor') ? `3px solid ${highlightColor}` : 'none',
            borderRadius: '4px',
            background: highlightedIds.includes('stockpile-feed-conveyor') ? 'rgba(220, 38, 38, 0.1)' : 'transparent',
            transition: 'all 0.2s ease',
          }}
          title="Stockpile Feed Conveyor"
        />

        {/* Secondary Crusher */}
        <div
          onClick={() => handleClick('secondary-crusher')}
          style={{
            position: 'absolute',
            left: '25%',
            top: '8%',
            width: '7%',
            height: '15%',
            cursor: 'pointer',
            borderRadius: '4px',
            transition: 'all 0.2s ease',
          }}
          title="Secondary Crusher"
        />

        {/* SAG Mill */}
        <div
          onClick={() => handleClick('sag-mill')}
          style={{
            position: 'absolute',
            left: '41%',
            top: '5%',
            width: '10%',
            height: '15%',
            cursor: 'pointer',
            borderRadius: '4px',
            transition: 'all 0.2s ease',
          }}
          title="SAG Mill"
        />

        {/* Flotation Cell */}
        <div
          onClick={() => handleClick('flotation-cell')}
          style={{
            position: 'absolute',
            left: '56%',
            top: '25%',
            width: '10%',
            height: '15%',
            cursor: 'pointer',
            borderRadius: '4px',
            transition: 'all 0.2s ease',
          }}
          title="Flotation Cell"
        />

        {/* Thickener */}
        <div
          onClick={() => handleClick('thickener')}
          style={{
            position: 'absolute',
            left: '76%',
            top: '8%',
            width: '8%',
            height: '12%',
            cursor: 'pointer',
            borderRadius: '4px',
            transition: 'all 0.2s ease',
          }}
          title="Thickener"
        />
      </div>
    </div>
  );
};

// Main diagram component
const MiningProcessFlowDiagram = ({ 
  onEquipmentClick,
  highlightedIds = ['rom-bin-primary-crusher'],
  highlightColor = '#dc2626',
  useDesignedImage = true  // Default to designed image
}) => {
  const [activeView, setActiveView] = useState('shift');  // Default to Shift Performance
  const [viewMode, setViewMode] = useState('designed');  // Default to designed view
  
  // Dynamic KPIs - aligned with scenario (250 t/h production loss = 6,000 t/day)
  // Large-scale copper mine: 145,000 ROM → 125,000 processed → 625 Cu produced
  const [kpis, setKpis] = useState({
    rom: 145280,           // Run of Mine tonnes/day
    oreProcessed: 124850,  // After crusher/mill processing
    copperProduced: 624,   // Copper concentrate tonnes/day  
    productionLoss: 6125   // 250 t/h × 24.5h effective = ~6,125 t/day
  });

  // Simulate live data fluctuations (subtle ±0.1-0.3%)
  useEffect(() => {
    const interval = setInterval(() => {
      setKpis(prev => ({
        rom: Math.round(prev.rom + (Math.random() - 0.5) * 200),
        oreProcessed: Math.round(prev.oreProcessed + (Math.random() - 0.5) * 150),
        copperProduced: Math.round((prev.copperProduced + (Math.random() - 0.5) * 2) * 10) / 10,
        productionLoss: Math.round(prev.productionLoss + (Math.random() - 0.5) * 50)
      }));
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  // Format numbers with commas
  const formatNumber = (num) => {
    return num.toLocaleString('en-US');
  };
  
  const isHighlighted = (id) => activeView === 'lpo' && highlightedIds.includes(id);

  // Map equipment IDs to the expected format for the parent component
  const handleClick = (id) => {
    if (onEquipmentClick) {
      // Map to parent's expected ID format
      if (id === 'rom-bin-primary-crusher') {
        onEquipmentClick('primary_crusher');
      } else {
        onEquipmentClick(id);
      }
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
      background: '#F8FAFC',
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      {/* KPI Header */}
      <div style={{ 
        display: 'flex', 
        gap: '16px', 
        padding: '16px',
        background: 'white',
        borderBottom: '1px solid #e2e8f0',
        flexWrap: 'wrap'
      }}>
        <KPICard
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>}
          label="Run of Mine (ROM)"
          value={formatNumber(kpis.rom)}
          unit="t/day"
          change="2.1%"
          isUp={true}
        />
        <KPICard
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>}
          label="Ore Processed"
          value={formatNumber(kpis.oreProcessed)}
          unit="t/day"
          change="4.8%"
          isUp={false}
        />
        <KPICard
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>}
          label="Copper Produced"
          value={formatNumber(kpis.copperProduced)}
          unit="t/day"
          change="4.8%"
          isUp={false}
        />
        <KPICard
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>}
          label="Est. Production Loss"
          value={formatNumber(kpis.productionLoss)}
          unit="t/day"
          change="≈250 t/h"
          isUp={true}
          isAlert={true}
        />
      </div>

      {/* Toggle Buttons */}
      <div style={{ 
        display: 'flex', 
        gap: '12px', 
        padding: '12px 16px',
        background: 'white',
        borderBottom: '1px solid #e2e8f0',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <ToggleButton 
            label="Shift Performance" 
            isActive={activeView === 'shift'} 
            onClick={() => setActiveView('shift')}
          />
          <ToggleButton 
            label="LPO Hotspots" 
            isActive={activeView === 'lpo'} 
            onClick={() => setActiveView('lpo')}
          />
        </div>
        
        {/* View Mode Toggle */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', color: '#6B7280' }}>View:</span>
          <button
            onClick={() => setViewMode('svg')}
            style={{
              padding: '4px 10px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: '500',
              cursor: 'pointer',
              background: viewMode === 'svg' ? '#A100FF' : '#f3f4f6',
              border: 'none',
              color: viewMode === 'svg' ? 'white' : '#6B7280',
            }}
          >
            Interactive
          </button>
          <button
            onClick={() => setViewMode('designed')}
            style={{
              padding: '4px 10px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: '500',
              cursor: 'pointer',
              background: viewMode === 'designed' ? '#A100FF' : '#f3f4f6',
              border: 'none',
              color: viewMode === 'designed' ? 'white' : '#6B7280',
            }}
          >
            Designed
          </button>
        </div>
      </div>

      {/* Diagram Content - switches between SVG and Image */}
      <div style={{ 
        flex: 1, 
        padding: '16px', 
        overflow: 'auto',
        background: '#F8FAFC'
      }}>
        {viewMode === 'designed' ? (
          <ImageDigitalTwin 
            onEquipmentClick={onEquipmentClick}
            highlightedIds={activeView === 'lpo' ? highlightedIds : []}
            highlightColor={highlightColor}
          />
        ) : (
        <div style={{ 
          background: 'white', 
          borderRadius: '8px', 
          border: '1px solid #e2e8f0',
          padding: '16px',
          minWidth: '1400px'
        }}>
          <svg 
            viewBox="0 0 1500 700" 
            style={{ width: '100%', height: 'auto' }}
          >
            {/* Arrow marker definition */}
            <defs>
              <marker 
                id="flowArrow" 
                markerWidth={8} 
                markerHeight={6} 
                refX={7} 
                refY={3} 
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#3b82f6"/>
              </marker>
            </defs>

            {/* ========== SECTION 1: MINING ========== */}
            <SectionHeader x={25} y={15} number={1} title="MINING" />
            
            <EquipmentBox 
              x={25} y={50} width={100} height={90} 
              label="Loading & Hauling"
              id="loading-hauling"
              onClick={handleClick}
              isHighlighted={isHighlighted('loading-hauling')}
              highlightColor={highlightColor}
            >
              <EquipmentIcons.HaulTruck />
            </EquipmentBox>

            <FlowArrow d="M 130 95 L 165 95" />

            <EquipmentBox 
              x={170} y={40} width={115} height={110} 
              label={["ROM Bin &", "Primary Crusher"]}
              iconX={18} iconY={10}
              id="rom-bin-primary-crusher"
              onClick={handleClick}
              isHighlighted={isHighlighted('rom-bin-primary-crusher')}
              highlightColor={highlightColor}
            >
              <EquipmentIcons.PrimaryCrusher />
            </EquipmentBox>

            <FlowArrow d="M 290 95 L 325 95" />

            <EquipmentBox 
              x={330} y={50} width={100} height={90} 
              label={["Secondary", "Crusher"]}
              iconX={15} iconY={12}
              id="secondary-crusher"
              onClick={handleClick}
              isHighlighted={isHighlighted('secondary-crusher')}
              highlightColor={highlightColor}
            >
              <EquipmentIcons.ConeCrusher />
            </EquipmentBox>

            {/* ========== SECTION 2: CONCENTRATING ========== */}
            <SectionHeader x={25} y={195} number={2} title="CONCENTRATING" />

            <EquipmentBox 
              x={330} y={160} width={100} height={85} 
              label="Vibrating Screen"
              iconX={15} iconY={10}
              id="vibrating-screen"
              onClick={handleClick}
              isHighlighted={isHighlighted('vibrating-screen')}
              highlightColor={highlightColor}
            >
              <EquipmentIcons.VibratingScreen />
            </EquipmentBox>

            <FlowArrow d="M 380 145 L 380 155" />
            <FlowArrow d="M 380 250 L 380 285 L 275 285 L 275 300" />

            <EquipmentBox 
              x={195} y={305} width={160} height={100} 
              label={["Stockpile Feed", "Conveyor"]}
              iconX={25} iconY={12}
              id="stockpile-feed-conveyor"
              onClick={handleClick}
              isHighlighted={isHighlighted('stockpile-feed-conveyor')}
              highlightColor={highlightColor}
            >
              <EquipmentIcons.ConveyorWithFrame />
            </EquipmentBox>

            <FlowArrow d="M 195 355 L 95 355 L 95 430" />

            <EquipmentBox 
              x={25} y={435} width={120} height={85} 
              label="Stockpile"
              iconX={15} iconY={15}
              id="stockpile"
              onClick={handleClick}
              isHighlighted={isHighlighted('stockpile')}
              highlightColor={highlightColor}
            >
              <EquipmentIcons.Stockpile />
            </EquipmentBox>

            <FlowArrow d="M 150 477 L 190 477" />

            <EquipmentBox 
              x={195} y={435} width={105} height={85} 
              label="Stacker"
              iconX={18} iconY={18}
              id="stacker-1"
              onClick={handleClick}
              isHighlighted={isHighlighted('stacker-1')}
              highlightColor={highlightColor}
            >
              <EquipmentIcons.Stacker />
            </EquipmentBox>

            <FlowArrow d="M 305 477 L 515 477 L 515 95 L 610 95" />

            {/* ========== SECTION 3: ORE BENEFICIATION ========== */}
            <SectionHeader x={580} y={15} number={3} title="ORE BENEFICIATION" />

            <EquipmentBox 
              x={615} y={50} width={105} height={90} 
              label="SAG Mill"
              iconX={10} iconY={10}
              id="sag-mill"
              onClick={handleClick}
              isHighlighted={isHighlighted('sag-mill')}
              highlightColor={highlightColor}
            >
              <EquipmentIcons.SagMill />
            </EquipmentBox>

            <FlowArrow d="M 667 145 L 667 175" />

            <EquipmentBox 
              x={585} y={180} width={165} height={85} 
              label={["Feed Conveyor for", "Floatation Cell"]}
              iconX={30} iconY={12}
              id="feed-conveyor-floatation"
              onClick={handleClick}
              isHighlighted={isHighlighted('feed-conveyor-floatation')}
              highlightColor={highlightColor}
            >
              <EquipmentIcons.Conveyor angle={-10} />
            </EquipmentBox>

            <FlowArrow d="M 755 222 L 800 222" />

            <EquipmentBox 
              x={805} y={170} width={135} height={105} 
              label="Floatation Cell"
              iconX={15} iconY={12}
              id="floatation-cell"
              onClick={handleClick}
              isHighlighted={isHighlighted('floatation-cell')}
              highlightColor={highlightColor}
            >
              <EquipmentIcons.FlotationCell />
            </EquipmentBox>

            {/* ========== SECTION 4: ORE CONCENTRATE ========== */}
            <SectionHeader x={580} y={315} number={4} title="ORE CONCENTRATE" />

            <FlowArrow d="M 872 280 L 872 320 L 690 320 L 690 355" />

            <EquipmentBox 
              x={620} y={360} width={140} height={80} 
              label={["Concentrated Ore", "Conveyor"]}
              iconX={20} iconY={12}
              id="concentrated-ore-conveyor"
              onClick={handleClick}
              isHighlighted={isHighlighted('concentrated-ore-conveyor')}
              highlightColor={highlightColor}
            >
              <EquipmentIcons.Conveyor />
            </EquipmentBox>

            <FlowArrow d="M 620 400 L 565 400 L 565 517 L 600 517" />

            <EquipmentBox 
              x={605} y={475} width={105} height={85} 
              label="Stacker"
              iconX={18} iconY={18}
              id="stacker-2"
              onClick={handleClick}
              isHighlighted={isHighlighted('stacker-2')}
              highlightColor={highlightColor}
            >
              <EquipmentIcons.Stacker />
            </EquipmentBox>

            <FlowArrow d="M 765 400 L 800 400" />

            <EquipmentBox 
              x={805} y={355} width={135} height={95} 
              label="Thickener"
              iconX={20} iconY={10}
              id="thickener-concentrate"
              onClick={handleClick}
              isHighlighted={isHighlighted('thickener-concentrate')}
              highlightColor={highlightColor}
            >
              <EquipmentIcons.Thickener large />
            </EquipmentBox>

            <FlowArrow d="M 715 517 L 800 517" />

            <EquipmentBox 
              x={805} y={475} width={135} height={85} 
              label={["Concentrated Ore", "Stockpile"]}
              iconX={20} iconY={15}
              id="concentrated-ore-stockpile"
              onClick={handleClick}
              isHighlighted={isHighlighted('concentrated-ore-stockpile')}
              highlightColor={highlightColor}
            >
              <EquipmentIcons.Stockpile />
            </EquipmentBox>

            {/* ========== SECTION 5: TAILINGS ========== */}
            <SectionHeader x={1080} y={15} number={5} title="TAILINGS" />

            <FlowArrow d="M 945 222 L 985 222 L 985 95 L 1085 95" />

            <EquipmentBox 
              x={1090} y={50} width={125} height={90} 
              label="Thickener"
              iconX={18} iconY={12}
              id="thickener-tailings"
              onClick={handleClick}
              isHighlighted={isHighlighted('thickener-tailings')}
              highlightColor={highlightColor}
            >
              <EquipmentIcons.Thickener />
            </EquipmentBox>

            <FlowArrow d="M 1220 95 L 1265 95" />

            <EquipmentBox 
              x={1270} y={50} width={115} height={90} 
              label={["Rejects", "Conveyor"]}
              iconX={12} iconY={12}
              id="rejects-conveyor"
              onClick={handleClick}
              isHighlighted={isHighlighted('rejects-conveyor')}
              highlightColor={highlightColor}
            >
              <EquipmentIcons.Conveyor angle={-15} />
            </EquipmentBox>

            <FlowArrow d="M 1152 145 L 1152 180" />

            <EquipmentBox 
              x={1080} y={185} width={145} height={85} 
              label="Tailing Dam"
              iconX={22} iconY={15}
              id="tailing-dam"
              onClick={handleClick}
              isHighlighted={isHighlighted('tailing-dam')}
              highlightColor={highlightColor}
            >
              <EquipmentIcons.TailingDam />
            </EquipmentBox>

            <FlowArrow d="M 1230 227 L 1270 227" />

            <EquipmentBox 
              x={1275} y={185} width={135} height={85} 
              label={["Tailing Fluid", "Transport"]}
              iconX={22} iconY={18}
              id="tailing-fluid-transport"
              onClick={handleClick}
              isHighlighted={isHighlighted('tailing-fluid-transport')}
              highlightColor={highlightColor}
            >
              <EquipmentIcons.FluidTransport />
            </EquipmentBox>

            {/* ========== SECTION 6: PRODUCTS ========== */}
            <SectionHeader x={1130} y={315} number={6} title="PRODUCTS" />

            <FlowArrow d="M 945 402 L 980 402 L 980 477 L 1000 477" />

            <EquipmentBox 
              x={1005} y={430} width={125} height={100} 
              label="Filtering"
              iconX={22} iconY={12}
              id="filtering"
              onClick={handleClick}
              isHighlighted={isHighlighted('filtering')}
              highlightColor={highlightColor}
            >
              <EquipmentIcons.Filter />
            </EquipmentBox>

            <FlowArrow d="M 1135 480 L 1155 480 L 1155 400 L 1175 400" />

            <EquipmentBox 
              x={1180} y={355} width={140} height={80} 
              label={["Dispatch Feed", "Conveyor"]}
              iconX={22} iconY={12}
              id="dispatch-feed-conveyor"
              onClick={handleClick}
              isHighlighted={isHighlighted('dispatch-feed-conveyor')}
              highlightColor={highlightColor}
            >
              <EquipmentIcons.Conveyor angle={-10} />
            </EquipmentBox>

            <FlowArrow d="M 1250 440 L 1250 465" />

            <EquipmentBox 
              x={1185} y={470} width={130} height={85} 
              label="Load Out Bin"
              iconX={25} iconY={15}
              id="load-out-bin"
              onClick={handleClick}
              isHighlighted={isHighlighted('load-out-bin')}
              highlightColor={highlightColor}
            >
              <EquipmentIcons.LoadOutBin />
            </EquipmentBox>

            <FlowArrow d="M 1250 560 L 1250 585" />

            <EquipmentBox 
              x={1185} y={590} width={130} height={95} 
              label="Ship Stackers"
              iconX={22} iconY={18}
              id="ship-stackers"
              onClick={handleClick}
              isHighlighted={isHighlighted('ship-stackers')}
              highlightColor={highlightColor}
            >
              <EquipmentIcons.Ship />
            </EquipmentBox>

          </svg>
        </div>
        )}
      </div>
    </div>
  );
};

export default MiningProcessFlowDiagram;

