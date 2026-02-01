"use client";

import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

/**
 * WAIO Shift Brief PDF Document
 * 
 * Accenture-branded PDF template for WAIO Pit-to-Port shift briefs.
 * Matches the style of the maintenance work order PDF.
 */

// Define styles for PDF - Accenture branded
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 3,
    borderBottomColor: '#A100FF',
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#A100FF',
    letterSpacing: 2,
  },
  logoSubtext: {
    fontSize: 8,
    color: '#6B7280',
    marginTop: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A1A2E',
    textAlign: 'right',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  shiftId: {
    fontSize: 12,
    color: '#A100FF',
    fontWeight: 'bold',
    textAlign: 'right',
    marginTop: 4,
  },
  planBadge: {
    backgroundColor: '#10B981',
    color: '#ffffff',
    padding: '4 10',
    borderRadius: 4,
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'right',
    marginTop: 6,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#A100FF',
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    width: '38%',
    fontSize: 9,
    color: '#6B7280',
  },
  value: {
    width: '62%',
    fontSize: 9,
    color: '#1A1A2E',
  },
  valueGood: {
    color: '#10B981',
    fontWeight: 'bold',
  },
  valueWarning: {
    color: '#F59E0B',
    fontWeight: 'bold',
  },
  valueCritical: {
    color: '#EF4444',
    fontWeight: 'bold',
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#A100FF',
    padding: 8,
  },
  tableHeaderCell: {
    color: '#ffffff',
    fontSize: 8,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tableRowAlt: {
    backgroundColor: '#F9FAFB',
  },
  tableCell: {
    fontSize: 8,
    color: '#4B5563',
  },
  bulletList: {
    paddingLeft: 10,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  bullet: {
    width: 15,
    fontSize: 9,
    color: '#A100FF',
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    color: '#4B5563',
    lineHeight: 1.4,
  },
  kpiBox: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 4,
    marginTop: 8,
  },
  kpiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  kpiLabel: {
    fontSize: 9,
    color: '#6B7280',
  },
  kpiValue: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  riskBox: {
    padding: 10,
    borderRadius: 4,
    marginBottom: 8,
    borderLeftWidth: 4,
  },
  riskHigh: {
    backgroundColor: '#FEF2F2',
    borderLeftColor: '#EF4444',
  },
  riskMedium: {
    backgroundColor: '#FFFBEB',
    borderLeftColor: '#F59E0B',
  },
  riskLow: {
    backgroundColor: '#F0FDF4',
    borderLeftColor: '#10B981',
  },
  riskTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  riskText: {
    fontSize: 8,
    color: '#4B5563',
    lineHeight: 1.4,
  },
  descriptionBox: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 4,
    marginTop: 10,
  },
  descriptionText: {
    fontSize: 9,
    color: '#4B5563',
    lineHeight: 1.5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 10,
  },
  footerText: {
    fontSize: 8,
    color: '#9CA3AF',
  },
  aiAnalysis: {
    backgroundColor: '#F3E8FF',
    padding: 10,
    borderRadius: 4,
    marginTop: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#A100FF',
  },
  aiLabel: {
    fontSize: 9,
    color: '#7C3AED',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  aiText: {
    fontSize: 8,
    color: '#6B21A8',
    lineHeight: 1.4,
  },
  statusBadge: {
    padding: '2 6',
    borderRadius: 3,
    fontSize: 7,
    fontWeight: 'bold',
  },
  badgePending: {
    backgroundColor: '#FEF3C7',
    color: '#92400E',
  },
  badgeComplete: {
    backgroundColor: '#D1FAE5',
    color: '#065F46',
  },
  blendTable: {
    marginTop: 10,
    marginBottom: 10,
  },
  signatureSection: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 20,
  },
  signatureBox: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A2E',
    paddingBottom: 30,
  },
  signatureLabel: {
    fontSize: 8,
    color: '#6B7280',
  },
});

// Shift Brief PDF Document Component
const ShiftBriefPDF = ({ data }) => (
  <Document>
    {/* Page 1: Header, Objectives & Plan Summary */}
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>ACCENTURE</Text>
          <Text style={styles.logoSubtext}>Pit-to-Port Intelligence Suite</Text>
        </View>
        <View>
          <Text style={styles.title}>WAIO Shift Brief</Text>
          <Text style={styles.shiftId}>{data.shiftId}</Text>
          <View style={[styles.planBadge, { alignSelf: 'flex-end' }]}>
            <Text>{data.planName}</Text>
          </View>
        </View>
      </View>

      {/* Shift Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shift Details</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Date / Shift:</Text>
          <Text style={styles.value}>{data.date} — {data.shiftType}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Supervisor:</Text>
          <Text style={styles.value}>{data.supervisor}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Generated:</Text>
          <Text style={styles.value}>{data.generatedAt}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Optimisation Mode:</Text>
          <Text style={styles.value}>{data.optimisationMode}</Text>
        </View>
      </View>

      {/* Shift Objectives */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shift Objectives</Text>
        <View style={styles.bulletList}>
          {data.objectives.map((obj, idx) => (
            <View key={idx} style={styles.bulletItem}>
              <Text style={styles.bullet}>●</Text>
              <Text style={styles.bulletText}>{obj}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Plan KPIs */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Plan Summary — Key Metrics</Text>
        <View style={styles.kpiBox}>
          {data.kpis.map((kpi, idx) => (
            <View key={idx} style={styles.kpiRow}>
              <Text style={styles.kpiLabel}>{kpi.label}</Text>
              <Text style={[
                styles.kpiValue,
                kpi.status === 'good' && { color: '#10B981' },
                kpi.status === 'warning' && { color: '#F59E0B' },
                kpi.status === 'critical' && { color: '#EF4444' },
              ]}>
                {kpi.value} {kpi.status === 'good' && '✓'}
              </Text>
            </View>
          ))}
        </View>
        
        <View style={styles.descriptionBox}>
          <Text style={styles.descriptionText}>{data.planSummary}</Text>
        </View>
      </View>

      {/* AI Analysis Badge */}
      <View style={styles.aiAnalysis}>
        <Text style={styles.aiLabel}>AI-Optimised Shift Plan (Cerebra Agent)</Text>
        <Text style={styles.aiText}>
          Analysis ID: {data.analysisId} | Confidence: {data.confidence}% | 
          Constraints Cleared: {data.constraintsCleared}/{data.totalConstraints}
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Generated by AIIS (Accenture Industrial Intelligence Suite) — WAIO Module</Text>
        <Text style={styles.footerText}>Page 1 of 3</Text>
      </View>
    </Page>

    {/* Page 2: Blend Recipe, Train Schedule, Risks */}
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.logo}>ACCENTURE</Text>
        <Text style={styles.shiftId}>{data.shiftId}</Text>
      </View>

      {/* Blend Recipe */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Blend Recipe — Optimised Mix</Text>
        
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { width: '25%' }]}>Source</Text>
            <Text style={[styles.tableHeaderCell, { width: '15%' }]}>%</Text>
            <Text style={[styles.tableHeaderCell, { width: '15%' }]}>Fe %</Text>
            <Text style={[styles.tableHeaderCell, { width: '15%' }]}>SiO2 %</Text>
            <Text style={[styles.tableHeaderCell, { width: '30%' }]}>Notes</Text>
          </View>
          {data.blendRecipe.map((item, idx) => (
            <View key={idx} style={[styles.tableRow, idx % 2 === 1 ? styles.tableRowAlt : {}]}>
              <Text style={[styles.tableCell, { width: '25%', fontWeight: 'bold' }]}>{item.source}</Text>
              <Text style={[styles.tableCell, { width: '15%' }]}>{item.percentage}%</Text>
              <Text style={[styles.tableCell, { width: '15%' }]}>{item.fe}%</Text>
              <Text style={[styles.tableCell, { width: '15%' }]}>{item.sio2}%</Text>
              <Text style={[styles.tableCell, { width: '30%' }]}>{item.notes}</Text>
            </View>
          ))}
        </View>
        
        <View style={[styles.row, { marginTop: 10 }]}>
          <Text style={styles.label}>Blended Fe (Predicted):</Text>
          <Text style={[styles.value, styles.valueGood]}>{data.blendedFe}%</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Blended SiO2 (Predicted):</Text>
          <Text style={[styles.value, styles.valueGood]}>{data.blendedSiO2}%</Text>
        </View>
      </View>

      {/* Train Schedule */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Train Loading Schedule</Text>
        
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { width: '15%' }]}>Train</Text>
            <Text style={[styles.tableHeaderCell, { width: '20%' }]}>Load Time</Text>
            <Text style={[styles.tableHeaderCell, { width: '15%' }]}>Tonnes</Text>
            <Text style={[styles.tableHeaderCell, { width: '15%' }]}>Fe %</Text>
            <Text style={[styles.tableHeaderCell, { width: '20%' }]}>Vessel</Text>
            <Text style={[styles.tableHeaderCell, { width: '15%' }]}>Status</Text>
          </View>
          {data.trainSchedule.map((train, idx) => (
            <View key={idx} style={[styles.tableRow, idx % 2 === 1 ? styles.tableRowAlt : {}]}>
              <Text style={[styles.tableCell, { width: '15%', fontWeight: 'bold' }]}>{train.id}</Text>
              <Text style={[styles.tableCell, { width: '20%' }]}>{train.loadTime}</Text>
              <Text style={[styles.tableCell, { width: '15%' }]}>{train.tonnes}</Text>
              <Text style={[styles.tableCell, { width: '15%', color: train.feStatus === 'good' ? '#10B981' : '#F59E0B' }]}>
                {train.fe}%
              </Text>
              <Text style={[styles.tableCell, { width: '20%' }]}>{train.vessel}</Text>
              <Text style={[styles.tableCell, { width: '15%' }]}>{train.status}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Key Risks */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Key Risks & Mitigations</Text>
        
        {data.risks.map((risk, idx) => (
          <View key={idx} style={[
            styles.riskBox,
            risk.severity === 'high' && styles.riskHigh,
            risk.severity === 'medium' && styles.riskMedium,
            risk.severity === 'low' && styles.riskLow,
          ]}>
            <Text style={[styles.riskTitle, { 
              color: risk.severity === 'high' ? '#991B1B' : 
                     risk.severity === 'medium' ? '#92400E' : '#065F46' 
            }]}>
              [{risk.severity.toUpperCase()}] {risk.title}
            </Text>
            <Text style={styles.riskText}>
              {risk.description}
            </Text>
            <Text style={[styles.riskText, { fontWeight: 'bold', marginTop: 4 }]}>
              Mitigation: {risk.mitigation}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Generated by AIIS (Accenture Industrial Intelligence Suite) — WAIO Module</Text>
        <Text style={styles.footerText}>Page 2 of 3</Text>
      </View>
    </Page>

    {/* Page 3: Actions & Communications */}
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.logo}>ACCENTURE</Text>
        <Text style={styles.shiftId}>{data.shiftId}</Text>
      </View>

      {/* Action Checklist */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Action Checklist</Text>
        
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { width: '5%' }]}>#</Text>
            <Text style={[styles.tableHeaderCell, { width: '45%' }]}>Action</Text>
            <Text style={[styles.tableHeaderCell, { width: '20%' }]}>Owner</Text>
            <Text style={[styles.tableHeaderCell, { width: '15%' }]}>Due</Text>
            <Text style={[styles.tableHeaderCell, { width: '15%' }]}>Status</Text>
          </View>
          {data.actions.map((action, idx) => (
            <View key={idx} style={[styles.tableRow, idx % 2 === 1 ? styles.tableRowAlt : {}]}>
              <Text style={[styles.tableCell, { width: '5%' }]}>{idx + 1}</Text>
              <Text style={[styles.tableCell, { width: '45%' }]}>{action.description}</Text>
              <Text style={[styles.tableCell, { width: '20%' }]}>{action.owner}</Text>
              <Text style={[styles.tableCell, { width: '15%' }]}>{action.due}</Text>
              <Text style={[styles.tableCell, { width: '15%', color: '#92400E', fontWeight: 'bold' }]}>
                {action.status}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Equipment Assignments */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Equipment Assignments</Text>
        
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { width: '20%' }]}>Equipment</Text>
            <Text style={[styles.tableHeaderCell, { width: '25%' }]}>Assignment</Text>
            <Text style={[styles.tableHeaderCell, { width: '20%' }]}>Operator</Text>
            <Text style={[styles.tableHeaderCell, { width: '20%' }]}>Hours</Text>
            <Text style={[styles.tableHeaderCell, { width: '15%' }]}>Status</Text>
          </View>
          {data.equipment.map((eq, idx) => (
            <View key={idx} style={[styles.tableRow, idx % 2 === 1 ? styles.tableRowAlt : {}]}>
              <Text style={[styles.tableCell, { width: '20%', fontWeight: 'bold' }]}>{eq.id}</Text>
              <Text style={[styles.tableCell, { width: '25%' }]}>{eq.assignment}</Text>
              <Text style={[styles.tableCell, { width: '20%' }]}>{eq.operator}</Text>
              <Text style={[styles.tableCell, { width: '20%' }]}>{eq.hours}</Text>
              <Text style={[styles.tableCell, { width: '15%', color: '#10B981' }]}>{eq.status}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Communications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Communications</Text>
        
        <View style={styles.row}>
          <Text style={styles.label}>Pre-shift brief:</Text>
          <Text style={styles.value}>{data.comms.preShiftBrief}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Key message:</Text>
          <Text style={styles.value}>{data.comms.keyMessage}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Escalation:</Text>
          <Text style={[styles.value, { color: '#EF4444' }]}>{data.comms.escalation}</Text>
        </View>
      </View>

      {/* Signature Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acknowledgement</Text>
        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>Shift Supervisor</Text>
          </View>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>Pit Supervisor</Text>
          </View>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>Date / Time</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Generated by AIIS (Accenture Industrial Intelligence Suite) — WAIO Module</Text>
        <Text style={styles.footerText}>Page 3 of 3</Text>
      </View>
    </Page>
  </Document>
);

// Default data template for shift brief
export const defaultShiftBriefData = {
  shiftId: 'SHIFT-2025-01-15-DAY',
  planName: 'Option B: Balanced',
  date: '15 January 2025',
  shiftType: 'Day Shift (06:00 - 18:00)',
  supervisor: 'Sarah Mitchell',
  generatedAt: new Date().toLocaleString(),
  optimisationMode: 'Balanced (Value + Throughput)',
  
  objectives: [
    'Achieve ≥62.0% Fe on Train-07 and Train-08 loads',
    'Maintain throughput within 5% of 155kt target',
    'Clear Pit 3 Zone B assay lag issue',
    'Reconcile SP-3 volume discrepancy',
  ],
  
  kpis: [
    { label: 'Predicted Train-07 Fe', value: '62.05%', status: 'good' },
    { label: 'Predicted Train-08 Fe', value: '62.20%', status: 'good' },
    { label: 'Total Tonnes (Shift)', value: '151,000 t', status: 'warning' },
    { label: 'Compliance Probability', value: '82%', status: 'good' },
    { label: 'Value at Risk', value: '$580k', status: 'warning' },
  ],
  
  planSummary: 'Blend recipe optimised with 55% SP-2 (high-Fe), 35% SP-3, and 10% Pit 3 Zone C feed. Dig operations shifted from Zone B to Zone C to recover Fe grade. Truck allocation adjusted to compensate for TRK-12 downtime.',
  
  analysisId: 'ANA-2025-01-15-0847',
  confidence: 82,
  constraintsCleared: 5,
  totalConstraints: 6,
  
  blendRecipe: [
    { source: 'SP-2 (High Fe)', percentage: 55, fe: 62.9, sio2: 4.10, notes: 'Primary blend source' },
    { source: 'SP-3 (Blended)', percentage: 35, fe: 62.1, sio2: 4.35, notes: 'Reduced from 45%' },
    { source: 'Pit 3 Zone C', percentage: 10, fe: 61.8, sio2: 4.20, notes: 'Direct feed' },
  ],
  blendedFe: '62.15',
  blendedSiO2: '4.22',
  
  trainSchedule: [
    { id: 'Train-07', loadTime: '08:00 - 10:30', tonnes: '24,500', fe: '62.05', feStatus: 'good', vessel: 'MV Coral Bay', status: 'Scheduled' },
    { id: 'Train-08', loadTime: '11:00 - 13:30', tonnes: '24,500', fe: '62.20', feStatus: 'good', vessel: 'MV Coral Bay', status: 'Scheduled' },
    { id: 'Train-09', loadTime: '14:00 - 16:30', tonnes: '24,000', fe: '62.10', feStatus: 'good', vessel: 'MV Iron Duke', status: 'Planned' },
  ],
  
  risks: [
    {
      severity: 'high',
      title: 'TRK-12 Breakdown',
      description: 'Haul truck TRK-12 down for unscheduled maintenance. Haul capacity reduced by 8%.',
      mitigation: 'TRK-08 activated from standby. Route optimisation applied.',
    },
    {
      severity: 'medium',
      title: 'SP-3 Data Confidence',
      description: 'Stockpile SP-3 assay confidence at 72% due to 6-hour lag in sample results.',
      mitigation: 'Increased SP-2 blend ratio. Fast-tracked assay processing.',
    },
    {
      severity: 'low',
      title: 'Weather Window',
      description: 'Light rain forecast 15:00-17:00. May impact haul road conditions.',
      mitigation: 'Road maintenance crew on standby. Contingency route prepared.',
    },
  ],
  
  actions: [
    { description: 'Verify sample from PIT3-ZC before dig start', owner: 'Pit Supervisor', due: '09:30', status: 'Pending' },
    { description: 'Confirm SP-3 rehandle logged in system', owner: 'Stockyard', due: '08:00', status: 'Pending' },
    { description: 'Fast-track Pit 3 samples to lab', owner: 'Lab Supervisor', due: '10:00', status: 'Pending' },
    { description: 'Update truck routes for PIT3-ZC access', owner: 'Dispatch', due: '09:45', status: 'Pending' },
    { description: 'Brief crew on blend recipe changes', owner: 'Reclaimer Op', due: '07:30', status: 'Pending' },
    { description: 'Confirm TRK-08 handover complete', owner: 'Maintenance', due: '07:00', status: 'Pending' },
  ],
  
  equipment: [
    { id: 'EX-03', assignment: 'Pit 3 Zone C - Primary', operator: 'J. Thompson', hours: '06:00-18:00', status: 'Ready' },
    { id: 'EX-01', assignment: 'Pit 1 - Support', operator: 'M. Rodriguez', hours: '06:00-14:00', status: 'Ready' },
    { id: 'TRK-08', assignment: 'Haul Pit3→Crusher', operator: 'K. Wilson', hours: '07:00-18:00', status: 'Activated' },
    { id: 'RCL-02', assignment: 'SP-2 Reclaim', operator: 'S. Chen', hours: '06:00-18:00', status: 'Ready' },
  ],
  
  comms: {
    preShiftBrief: '06:00 at main crib room — Mandatory attendance',
    keyMessage: 'Focus on grade compliance for Train-07. Zone C dig starting 10:00 after blast window clears. All grade readings to be logged in real-time.',
    escalation: 'Any grade readings <61.5% Fe to be reported immediately to Shift Supervisor (Sarah Mitchell, ext. 4521)',
  },
};

export default ShiftBriefPDF;
