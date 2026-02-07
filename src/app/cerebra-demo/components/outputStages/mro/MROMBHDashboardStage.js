'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { mroKPIs, mroKPITimeSeries } from '../../../data/mro/mroKPIData';
import { mroMBHDashboard } from '../../../data/mro/mroMBHData';

// Dynamic imports for Nivo charts to avoid SSR issues
const ResponsiveLine = dynamic(() => import('@nivo/line').then(m => m.ResponsiveLine), { ssr: false });
const ResponsiveBar = dynamic(() => import('@nivo/bar').then(m => m.ResponsiveBar), { ssr: false });
const ResponsivePie = dynamic(() => import('@nivo/pie').then(m => m.ResponsivePie), { ssr: false });

export default function MROMBHDashboardStage({ onBack, onStageAction, onComplete }) {
  const [showHeader, setShowHeader] = useState(false);
  const [showKPIs, setShowKPIs] = useState(false);
  const [showTrendChart, setShowTrendChart] = useState(false);
  const [showExceptionChart, setShowExceptionChart] = useState(false);
  const [showContractPie, setShowContractPie] = useState(false);
  const [showExceptionTable, setShowExceptionTable] = useState(false);
  const [showRecoveryActions, setShowRecoveryActions] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [expandedException, setExpandedException] = useState(null);
  const [selectedException, setSelectedException] = useState(null);

  useEffect(() => {
    setTimeout(() => setShowHeader(true), 200);
    setTimeout(() => setShowKPIs(true), 600);
    setTimeout(() => setShowTrendChart(true), 1000);
    setTimeout(() => setShowExceptionChart(true), 1200);
    setTimeout(() => setShowContractPie(true), 1400);
    setTimeout(() => setShowExceptionTable(true), 1600);
    setTimeout(() => setShowRecoveryActions(true), 1800);

    setTimeout(() => {
      setAnimationComplete(true);
    }, 2400);
  }, []);

  // Nivo Chart Theme
  const nivoTheme = {
    background: 'transparent',
    textColor: '#94A3B8',
    grid: { line: { stroke: '#2D3748' } },
    axis: {
      domain: { line: { stroke: '#2D3748' } },
      legend: { text: { fill: '#94A3B8' } },
      ticks: { line: { stroke: '#2D3748', strokeWidth: 1 }, text: { fill: '#94A3B8', fontSize: 11 } },
    },
    legends: { text: { fill: '#94A3B8' } },
  };

  // Monthly Revenue Trend Data (12 months)
  const revenueMonthlyData = [
    { month: 'Jan', contracted: 3200, actual: 3150, gap: 50 },
    { month: 'Feb', contracted: 3200, actual: 3160, gap: 40 },
    { month: 'Mar', contracted: 3200, actual: 3180, gap: 20 },
    { month: 'Apr', contracted: 3200, actual: 3200, gap: 0 },
    { month: 'May', contracted: 3200, actual: 3210, gap: -10 },
    { month: 'Jun', contracted: 3200, actual: 3180, gap: 20 },
    { month: 'Jul', contracted: 3200, actual: 3140, gap: 60 },
    { month: 'Aug', contracted: 3200, actual: 3100, gap: 100 },
    { month: 'Sep', contracted: 3200, actual: 3120, gap: 80 },
    { month: 'Oct', contracted: 3200, actual: 3090, gap: 110 },
    { month: 'Nov', contracted: 3200, actual: 3050, gap: 150 },
    { month: 'Dec', contracted: 3200, actual: 2920, gap: 280 },
  ];

  const revenueLineData = [
    {
      id: 'Contracted',
      data: revenueMonthlyData.map(d => ({ x: d.month, y: d.contracted })),
    },
    {
      id: 'Actual Billed',
      data: revenueMonthlyData.map(d => ({ x: d.month, y: d.actual })),
    },
  ];

  // Exception Breakdown by Category
  const exceptionCategoryData = [
    { category: 'Flying Hours\nVariance', value: 180 },
    { category: 'Spare Parts\nBilling', value: 35 },
    { category: 'Contract\nAmendments', value: 18 },
    { category: 'Rate\nAdjustments', value: 7 },
  ];

  // Contract Revenue Distribution
  const contractPercentages = [
    { id: 'Alpha', label: 'Alpha (45%)', value: 45 },
    { id: 'Beta', label: 'Beta (30%)', value: 30 },
    { id: 'Gamma', label: 'Gamma (25%)', value: 25 },
  ];

  // Consolidated Exceptions with all details
  const allExceptions = [
    {
      id: 'EXC-001',
      contract: 'CONTRACT-BETA',
      type: 'Flying Hours Variance',
      amount: 180000,
      rootCause: 'Operator route change notification delay',
      status: 'Pending',
      ageDays: 12,
      highlighted: false,
    },
    {
      id: 'EXC-002',
      contract: 'CONTRACT-BETA',
      type: 'Spare Parts Billing',
      amount: 60000,
      rootCause: 'Manual data entry gap between component shop and billing',
      status: 'Pending',
      ageDays: 8,
      highlighted: true, // This is the main $240K variance from the alert
    },
    {
      id: 'EXC-003',
      contract: 'CONTRACT-GAMMA',
      type: 'Contract Amendment',
      amount: 35000,
      rootCause: 'Rate schedule update pending operator approval',
      status: 'In Progress',
      ageDays: 5,
      highlighted: false,
    },
    {
      id: 'EXC-004',
      contract: 'CONTRACT-ALPHA',
      type: 'Flying Hours Variance',
      amount: 12500,
      rootCause: 'Historical data correction needed',
      status: 'Resolved',
      ageDays: 2,
      highlighted: false,
    },
    {
      id: 'EXC-005',
      contract: 'CONTRACT-GAMMA',
      type: 'Rate Adjustment',
      amount: 8000,
      rootCause: 'Fuel surcharge reconciliation',
      status: 'Pending',
      ageDays: 3,
      highlighted: false,
    },
  ];

  // Revenue Recovery Actions
  const recoveryActions = [
    { id: 'RA-001', action: 'Adjust Beta accrual model for route change', impact: 180000, priority: 'High', status: 'In Progress', owner: 'Revenue Team' },
    { id: 'RA-002', action: 'Create billing correction for APU swap', impact: 60000, priority: 'High', status: 'Pending', owner: 'Billing Team' },
    { id: 'RA-003', action: 'Request operator utilisation update', impact: 35000, priority: 'Medium', status: 'Pending', owner: 'Operations' },
    { id: 'RA-004', action: 'Resolve Gamma rate schedule with operator', impact: 8000, priority: 'Medium', status: 'In Progress', owner: 'Contracts' },
    { id: 'RA-005', action: 'Implement automated billing sync system', impact: 95000, priority: 'Medium', status: 'Planning', owner: 'IT/Systems' },
  ];

  const handleExportReport = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      kpis: {
        contractValue: 42600000,
        billedYTD: 38200000,
        variance: -240000,
        collectionRate: 0.972,
      },
      exceptions: allExceptions,
      recoveryActions: recoveryActions,
    };
    console.log('Revenue Assurance Report exported:', reportData);
  };

  return (
    <div style={{ padding: '0', background: '#1a1a2e', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
        @keyframes slideDown { from { height: 0; opacity: 0; } to { height: auto; opacity: 1; } }
      `}</style>

      {/* Header */}
      {showHeader && (
        <div style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          padding: '16px 20px',
          borderRadius: '0',
          borderBottom: '2px solid #A100FF',
          animation: 'fadeSlideUp 0.4s ease-out',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#A100FF',
              animation: 'pulse 1.5s infinite',
            }} />
            <span style={{
              color: '#A100FF',
              fontSize: '14px',
              fontWeight: '700',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}>
              Revenue Assurance Dashboard
            </span>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px' }}>
            MBH Contract Performance, Revenue Tracking & Exception Management
          </div>
        </div>
      )}

      <div style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
        {/* Revenue KPIs Strip */}
        {showKPIs && (
          <div style={{
            animation: 'fadeSlideUp 0.4s ease-out',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
            marginBottom: '24px',
          }}>
            {/* MBH Contract Value */}
            <div style={{
              background: '#16213e',
              border: '1px solid #2D3748',
              borderRadius: '8px',
              padding: '16px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#A100FF';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(161,0,255,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#2D3748';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <div style={{ fontSize: '10px', color: '#94A3B8', fontWeight: '600', marginBottom: '6px', textTransform: 'uppercase' }}>
                Contract Value
              </div>
              <div style={{ fontSize: '22px', fontWeight: '700', color: '#F1F5F9', marginBottom: '4px' }}>
                $42.6M
              </div>
              <div style={{ fontSize: '10px', color: '#10B981', fontWeight: '600' }}>
                MBH Annual
              </div>
            </div>

            {/* Billed YTD */}
            <div style={{
              background: '#16213e',
              border: '1px solid #2D3748',
              borderRadius: '8px',
              padding: '16px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#A100FF';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(161,0,255,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#2D3748';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <div style={{ fontSize: '10px', color: '#94A3B8', fontWeight: '600', marginBottom: '6px', textTransform: 'uppercase' }}>
                Billed YTD
              </div>
              <div style={{ fontSize: '22px', fontWeight: '700', color: '#F1F5F9', marginBottom: '4px' }}>
                $38.2M
              </div>
              <div style={{ fontSize: '10px', color: '#10B981', fontWeight: '600' }}>
                89.7% of contract
              </div>
            </div>

            {/* Variance */}
            <div style={{
              background: '#16213e',
              border: '2px solid #EF4444',
              borderRadius: '8px',
              padding: '16px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(239,68,68,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <div style={{ fontSize: '10px', color: '#94A3B8', fontWeight: '600', marginBottom: '6px', textTransform: 'uppercase' }}>
                Variance
              </div>
              <div style={{ fontSize: '22px', fontWeight: '700', color: '#EF4444', marginBottom: '4px' }}>
                -$240K
              </div>
              <div style={{ fontSize: '10px', color: '#EF4444', fontWeight: '600' }}>
                Requires action
              </div>
            </div>

            {/* Collection Rate */}
            <div style={{
              background: '#16213e',
              border: '1px solid #2D3748',
              borderRadius: '8px',
              padding: '16px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#A100FF';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(161,0,255,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#2D3748';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <div style={{ fontSize: '10px', color: '#94A3B8', fontWeight: '600', marginBottom: '6px', textTransform: 'uppercase' }}>
                Collection Rate
              </div>
              <div style={{ fontSize: '22px', fontWeight: '700', color: '#F1F5F9', marginBottom: '4px' }}>
                97.2%
              </div>
              <div style={{ fontSize: '10px', color: '#10B981', fontWeight: '600' }}>
                On target
              </div>
            </div>
          </div>
        )}

        {/* Charts Grid - 2 Columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}>
          {/* Revenue Trend Chart */}
          {showTrendChart && (
            <div style={{
              animation: 'fadeSlideUp 0.4s ease-out',
              background: '#16213e',
              border: '1px solid #2D3748',
              borderRadius: '8px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
            }}>
              <div style={{
                fontSize: '13px',
                fontWeight: '700',
                color: '#F1F5F9',
                marginBottom: '12px',
              }}>
                Revenue Trend: Contracted vs Actual (12 Months)
              </div>
              <div style={{ height: '300px', flex: 1 }}>
                <ResponsiveLine
                  data={revenueLineData}
                  margin={{ top: 20, right: 20, bottom: 40, left: 60 }}
                  xScale={{ type: 'point' }}
                  yScale={{ type: 'linear', min: 2800, max: 3300 }}
                  curve="monotoneX"
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: -45,
                    legend: 'Month',
                    legendPosition: 'bottom',
                    legendOffset: 36,
                  }}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    legend: 'Revenue ($K)',
                    legendPosition: 'middle',
                    legendOffset: -45,
                  }}
                  colors={['#A100FF', '#10B981']}
                  enablePoints={true}
                  pointSize={6}
                  pointBorderWidth={1}
                  pointBorderColor={{ from: 'serieColor', modifiers: [['darker', 0.3]] }}
                  enableGridX={false}
                  enableGridY={true}
                  lineWidth={2}
                  theme={nivoTheme}
                  legends={[
                    {
                      anchor: 'top-right',
                      direction: 'column',
                      justify: false,
                      translateX: 0,
                      translateY: 0,
                      itemsSpacing: 8,
                      itemDirection: 'left-to-right',
                      itemWidth: 120,
                      itemHeight: 20,
                      symbolSize: 12,
                      symbolShape: 'circle',
                    },
                  ]}
                  animate={true}
                  motionConfig="gentle"
                />
              </div>
            </div>
          )}

          {/* Exception Breakdown Chart */}
          {showExceptionChart && (
            <div style={{
              animation: 'fadeSlideUp 0.4s ease-out 0.2s backwards',
              background: '#16213e',
              border: '1px solid #2D3748',
              borderRadius: '8px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
            }}>
              <div style={{
                fontSize: '13px',
                fontWeight: '700',
                color: '#F1F5F9',
                marginBottom: '12px',
              }}>
                Exception Breakdown by Category ($K)
              </div>
              <div style={{ height: '300px', flex: 1 }}>
                <ResponsiveBar
                  data={exceptionCategoryData}
                  keys={['value']}
                  indexBy="category"
                  margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
                  padding={0.4}
                  valueScale={{ type: 'linear' }}
                  indexScale={{ type: 'band', round: true }}
                  colors={['#F59E0B']}
                  borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                  axisBottom={{
                    tickSize: 0,
                    tickPadding: 8,
                    tickRotation: 0,
                  }}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    legend: 'Amount ($K)',
                    legendPosition: 'middle',
                    legendOffset: -45,
                  }}
                  label={(d) => `$${d.value}K`}
                  labelTextColor="#1F2937"
                  enableLabel={true}
                  theme={nivoTheme}
                  animate={true}
                  motionConfig="gentle"
                />
              </div>
            </div>
          )}
        </div>

        {/* Contract Distribution Pie */}
        {showContractPie && (
          <div style={{
            animation: 'fadeSlideUp 0.4s ease-out 0.4s backwards',
            background: '#16213e',
            border: '1px solid #2D3748',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px',
          }}>
            <div style={{
              fontSize: '13px',
              fontWeight: '700',
              color: '#F1F5F9',
              marginBottom: '12px',
            }}>
              Contract Revenue Distribution
            </div>
            <div style={{ height: '250px' }}>
              <ResponsivePie
                data={contractPercentages}
                margin={{ top: 20, right: 80, bottom: 20, left: 80 }}
                innerRadius={0.5}
                cornerRadius={4}
                colors={['#A100FF', '#8B00E0', '#6B0CC0']}
                borderColor={{ from: 'color', modifiers: [['darker', 0.6]] }}
                arcLinkLabelsTextColor="#F1F5F9"
                arcLinkLabelsThickness={2}
                arcLinkLabelsDiagonalLength={16}
                arcLinkLabelsColor={{ from: 'color' }}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor="#1a1a2e"
                arcLabelsTextSize={12}
                arcLabelsTextWeight="700"
                legends={[
                  {
                    anchor: 'right',
                    direction: 'column',
                    justify: false,
                    translateX: 0,
                    translateY: 0,
                    itemsSpacing: 8,
                    itemWidth: 100,
                    itemHeight: 18,
                    itemTextColor: '#94A3B8',
                    symbolSize: 12,
                    symbolShape: 'circle',
                  },
                ]}
                animate={true}
                motionConfig="gentle"
              />
            </div>
          </div>
        )}

        {/* Open Exceptions Table */}
        {showExceptionTable && (
          <div style={{
            animation: 'fadeSlideUp 0.4s ease-out 0.6s backwards',
            background: '#16213e',
            border: '1px solid #2D3748',
            borderRadius: '8px',
            overflow: 'hidden',
            marginBottom: '24px',
          }}>
            <div style={{
              padding: '16px',
              borderBottom: '1px solid #2D3748',
              fontSize: '13px',
              fontWeight: '700',
              color: '#F1F5F9',
            }}>
              Open Billing Exceptions (5 items)
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '12px',
              }}>
                <thead>
                  <tr style={{ background: '#1a1a2e', borderBottom: '1px solid #2D3748' }}>
                    <th style={{ padding: '12px 12px', textAlign: 'left', fontWeight: '600', color: '#94A3B8' }}>Exception ID</th>
                    <th style={{ padding: '12px 12px', textAlign: 'left', fontWeight: '600', color: '#94A3B8' }}>Contract</th>
                    <th style={{ padding: '12px 12px', textAlign: 'left', fontWeight: '600', color: '#94A3B8' }}>Type</th>
                    <th style={{ padding: '12px 12px', textAlign: 'left', fontWeight: '600', color: '#94A3B8' }}>Amount</th>
                    <th style={{ padding: '12px 12px', textAlign: 'left', fontWeight: '600', color: '#94A3B8' }}>Root Cause</th>
                    <th style={{ padding: '12px 12px', textAlign: 'left', fontWeight: '600', color: '#94A3B8' }}>Status</th>
                    <th style={{ padding: '12px 12px', textAlign: 'center', fontWeight: '600', color: '#94A3B8' }}>Age (days)</th>
                  </tr>
                </thead>
                <tbody>
                  {allExceptions.map((exc, idx) => {
                    const isExpanded = expandedException === exc.id;
                    const isHighlighted = exc.highlighted;

                    return (
                      <tbody key={exc.id} style={{ display: 'contents' }}>
                        <tr
                          onClick={() => setExpandedException(isExpanded ? null : exc.id)}
                          style={{
                            borderBottom: '1px solid #2D3748',
                            cursor: 'pointer',
                            background: isHighlighted ? 'rgba(239,68,68,0.15)' : isExpanded ? '#1a3a3a' : 'transparent',
                            transition: 'all 0.2s ease',
                            borderLeft: isHighlighted ? '3px solid #EF4444' : '3px solid transparent',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = isHighlighted ? 'rgba(239,68,68,0.25)' : '#1a3a3a';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = isHighlighted ? 'rgba(239,68,68,0.15)' : isExpanded ? '#1a3a3a' : 'transparent';
                          }}
                        >
                          <td style={{ padding: '12px 12px', color: '#F1F5F9', fontWeight: '600', fontSize: '11px' }}>
                            {exc.id}
                          </td>
                          <td style={{ padding: '12px 12px', color: '#F1F5F9', fontWeight: '500' }}>
                            {exc.contract}
                          </td>
                          <td style={{ padding: '12px 12px', color: '#A100FF', fontSize: '11px', fontWeight: '600' }}>
                            {exc.type}
                          </td>
                          <td style={{ padding: '12px 12px', color: isHighlighted ? '#EF4444' : '#F1F5F9', fontWeight: '700', fontSize: '12px' }}>
                            ${exc.amount.toLocaleString()}
                          </td>
                          <td style={{ padding: '12px 12px', color: '#94A3B8', fontSize: '11px' }}>
                            {exc.rootCause}
                          </td>
                          <td style={{ padding: '12px 12px' }}>
                            <div style={{
                              background: exc.status === 'Resolved' ? 'rgba(16,185,129,0.2)' : exc.status === 'In Progress' ? 'rgba(59,130,246,0.2)' : '#FFFBEB',
                              color: exc.status === 'Resolved' ? '#10B981' : exc.status === 'In Progress' ? '#3B82F6' : '#92400E',
                              padding: '4px 10px',
                              borderRadius: '4px',
                              fontSize: '10px',
                              fontWeight: '600',
                              display: 'inline-block',
                            }}>
                              {exc.status}
                            </div>
                          </td>
                          <td style={{ padding: '12px 12px', textAlign: 'center', color: '#94A3B8', fontWeight: '500' }}>
                            {exc.ageDays}
                          </td>
                        </tr>

                        {/* Expanded detail row */}
                        {isExpanded && (
                          <tr style={{ borderBottom: '1px solid #2D3748', display: 'table-row', background: '#1a1a2e' }}>
                            <td colSpan="7" style={{
                              padding: '16px 12px',
                              animation: 'slideDown 0.2s ease-out',
                            }}>
                              <div style={{
                                background: '#16213e',
                                border: `1px solid ${isHighlighted ? '#EF4444' : '#2D3748'}`,
                                borderRadius: '6px',
                                padding: '14px',
                              }}>
                                <div style={{
                                  display: 'grid',
                                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                  gap: '14px',
                                }}>
                                  <div>
                                    <div style={{ fontSize: '10px', color: '#94A3B8', marginBottom: '4px', fontWeight: '600', textTransform: 'uppercase' }}>
                                      Exception Details
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#F1F5F9' }}>
                                      <strong>ID:</strong> {exc.id}
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#F1F5F9', marginTop: '6px' }}>
                                      <strong>Type:</strong> {exc.type}
                                    </div>
                                  </div>
                                  <div>
                                    <div style={{ fontSize: '10px', color: '#94A3B8', marginBottom: '4px', fontWeight: '600', textTransform: 'uppercase' }}>
                                      Financial Impact
                                    </div>
                                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#EF4444' }}>
                                      ${exc.amount.toLocaleString()}
                                    </div>
                                    <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>
                                      Open for {exc.ageDays} days
                                    </div>
                                  </div>
                                  <div>
                                    <div style={{ fontSize: '10px', color: '#94A3B8', marginBottom: '4px', fontWeight: '600', textTransform: 'uppercase' }}>
                                      Recovery Action
                                    </div>
                                    <div style={{
                                      background: 'rgba(161,0,255,0.1)',
                                      border: '1px solid rgba(161,0,255,0.3)',
                                      borderRadius: '4px',
                                      padding: '8px',
                                      fontSize: '11px',
                                      color: '#A100FF',
                                      fontWeight: '600',
                                    }}>
                                      {exc.id === 'EXC-001' && 'Update utilisation report'}
                                      {exc.id === 'EXC-002' && 'Create billing correction'}
                                      {exc.id === 'EXC-003' && 'Approve rate schedule'}
                                      {exc.id === 'EXC-004' && 'Complete'}
                                      {exc.id === 'EXC-005' && 'Reconcile surcharge'}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Revenue Recovery Actions */}
        {showRecoveryActions && (
          <div style={{
            animation: 'fadeSlideUp 0.4s ease-out 0.8s backwards',
            background: '#16213e',
            border: '1px solid #2D3748',
            borderRadius: '8px',
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '16px',
              borderBottom: '1px solid #2D3748',
              fontSize: '13px',
              fontWeight: '700',
              color: '#F1F5F9',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: '#A100FF',
                color: 'white',
                fontSize: '11px',
                fontWeight: 'bold',
              }}>
                !
              </span>
              Revenue Recovery Actions to Close the Gap
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '12px',
              }}>
                <thead>
                  <tr style={{ background: '#1a1a2e', borderBottom: '1px solid #2D3748' }}>
                    <th style={{ padding: '12px 12px', textAlign: 'left', fontWeight: '600', color: '#94A3B8' }}>Action</th>
                    <th style={{ padding: '12px 12px', textAlign: 'left', fontWeight: '600', color: '#94A3B8' }}>Revenue Impact</th>
                    <th style={{ padding: '12px 12px', textAlign: 'left', fontWeight: '600', color: '#94A3B8' }}>Priority</th>
                    <th style={{ padding: '12px 12px', textAlign: 'left', fontWeight: '600', color: '#94A3B8' }}>Status</th>
                    <th style={{ padding: '12px 12px', textAlign: 'left', fontWeight: '600', color: '#94A3B8' }}>Owner</th>
                  </tr>
                </thead>
                <tbody>
                  {recoveryActions.map((action) => (
                    <tr
                      key={action.id}
                      onClick={() => setSelectedException(selectedException === action.id ? null : action.id)}
                      style={{
                        borderBottom: '1px solid #2D3748',
                        cursor: 'pointer',
                        background: selectedException === action.id ? '#1a3a3a' : 'transparent',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#1a3a3a';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = selectedException === action.id ? '#1a3a3a' : 'transparent';
                      }}
                    >
                      <td style={{ padding: '12px 12px', color: '#F1F5F9', fontWeight: '500', fontSize: '12px' }}>
                        {action.action}
                      </td>
                      <td style={{ padding: '12px 12px', fontWeight: '700', fontSize: '12px' }}>
                        <span style={{
                          color: action.impact > 50000 ? '#10B981' : '#3B82F6',
                          fontSize: '13px',
                        }}>
                          ${action.impact.toLocaleString()}
                        </span>
                      </td>
                      <td style={{ padding: '12px 12px' }}>
                        <div style={{
                          background: action.priority === 'High' ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)',
                          color: action.priority === 'High' ? '#EF4444' : '#F59E0B',
                          padding: '4px 10px',
                          borderRadius: '4px',
                          fontSize: '10px',
                          fontWeight: '600',
                          display: 'inline-block',
                        }}>
                          {action.priority}
                        </div>
                      </td>
                      <td style={{ padding: '12px 12px' }}>
                        <div style={{
                          background: action.status === 'In Progress' ? 'rgba(59,130,246,0.2)' : action.status === 'Planning' ? 'rgba(148,163,184,0.2)' : '#FFFBEB',
                          color: action.status === 'In Progress' ? '#3B82F6' : action.status === 'Planning' ? '#94A3B8' : '#92400E',
                          padding: '4px 10px',
                          borderRadius: '4px',
                          fontSize: '10px',
                          fontWeight: '600',
                          display: 'inline-block',
                        }}>
                          {action.status}
                        </div>
                      </td>
                      <td style={{ padding: '12px 12px', color: '#94A3B8', fontSize: '11px' }}>
                        {action.owner}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{
              padding: '12px 16px',
              background: '#1a1a2e',
              borderTop: '1px solid #2D3748',
              fontSize: '11px',
              color: '#94A3B8',
            }}>
              Total recovery potential: <span style={{ color: '#10B981', fontWeight: '700' }}>$383,500</span> (160% of variance)
            </div>
          </div>
        )}
      </div>

      {/* Stage Footer */}
      {animationComplete && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderTop: '1px solid #2D3748',
          background: 'rgba(26,26,46,0.95)',
          gap: '12px',
          animation: 'fadeIn 0.3s ease-out',
        }}>
          <button
            onClick={() => onBack?.()}
            style={{
              padding: '8px 16px',
              background: 'transparent',
              border: '1px solid #4A5568',
              borderRadius: '6px',
              color: '#94A3B8',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            ← Back
          </button>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleExportReport}
              style={{
                padding: '10px 16px',
                background: '#16213e',
                border: '1px solid #2D3748',
                borderRadius: '6px',
                color: '#F1F5F9',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#A100FF'; e.currentTarget.style.color = '#A100FF'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#2D3748'; e.currentTarget.style.color = '#F1F5F9'; }}
            >
              Export Report
            </button>
          </div>
          <button
            onClick={() => onComplete?.()}
            style={{
              padding: '10px 24px',
              background: '#A100FF',
              border: 'none',
              borderRadius: '6px',
              color: 'white',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(161,0,255,0.3)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#8B00E0'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#A100FF'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            Continue →
          </button>
        </div>
      )}
    </div>
  );
}
