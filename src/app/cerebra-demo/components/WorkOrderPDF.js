"use client";

import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Define styles for PDF
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
    borderBottomWidth: 2,
    borderBottomColor: '#A100FF',
  },
  logo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#A100FF',
  },
  logoSubtext: {
    fontSize: 8,
    color: '#6B7280',
    marginTop: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A2E',
    textAlign: 'right',
  },
  woNumber: {
    fontSize: 12,
    color: '#E67E22',
    fontWeight: 'bold',
    textAlign: 'right',
    marginTop: 4,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#A100FF',
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  label: {
    width: '35%',
    fontSize: 9,
    color: '#6B7280',
  },
  value: {
    width: '65%',
    fontSize: 9,
    color: '#1A1A2E',
  },
  table: {
    marginTop: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#A100FF',
    padding: 6,
  },
  tableHeaderCell: {
    color: '#ffffff',
    fontSize: 8,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 6,
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
  descriptionBox: {
    backgroundColor: '#F9FAFB',
    padding: 10,
    borderRadius: 4,
    marginTop: 8,
  },
  descriptionText: {
    fontSize: 9,
    color: '#4B5563',
    lineHeight: 1.4,
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
  priorityBadge: {
    backgroundColor: '#EF4444',
    color: '#ffffff',
    padding: '2 6',
    borderRadius: 3,
    fontSize: 8,
    fontWeight: 'bold',
  },
  statusBadge: {
    backgroundColor: '#10B981',
    color: '#ffffff',
    padding: '2 6',
    borderRadius: 3,
    fontSize: 8,
    fontWeight: 'bold',
  },
  costSummary: {
    backgroundColor: '#F0FDF4',
    padding: 10,
    borderRadius: 4,
    marginTop: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    marginTop: 8,
    borderTopWidth: 2,
    borderTopColor: '#10B981',
  },
  totalLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  totalValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#10B981',
  },
  aiAnalysis: {
    backgroundColor: '#FEF3C7',
    padding: 10,
    borderRadius: 4,
    marginTop: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#E67E22',
  },
  aiLabel: {
    fontSize: 9,
    color: '#92400E',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  aiText: {
    fontSize: 8,
    color: '#78350F',
    lineHeight: 1.4,
  },
});

// Work Order PDF Document Component
const WorkOrderPDF = ({ data }) => (
  <Document>
    {/* Page 1: Header & Equipment Details */}
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>ACCENTURE</Text>
          <Text style={styles.logoSubtext}>Industrial Intelligence Suite</Text>
        </View>
        <View>
          <Text style={styles.title}>MAINTENANCE WORK ORDER</Text>
          <Text style={styles.woNumber}>{data.header.workOrderNumber}</Text>
        </View>
      </View>

      {/* Order Header Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Work Order Header</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Order Type:</Text>
          <Text style={styles.value}>{data.header.orderType} - {data.header.orderCategory}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Priority:</Text>
          <Text style={[styles.value, { color: '#EF4444', fontWeight: 'bold' }]}>{data.header.priority}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Notification:</Text>
          <Text style={styles.value}>{data.header.notificationNumber}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Plant:</Text>
          <Text style={styles.value}>{data.header.plant} ({data.header.businessArea})</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Work Center:</Text>
          <Text style={styles.value}>{data.header.workCenter}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Created By:</Text>
          <Text style={styles.value}>{data.header.createdBy} on {data.header.createdDate}</Text>
        </View>
      </View>

      {/* Equipment Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Equipment Information</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Functional Location:</Text>
          <Text style={styles.value}>{data.equipment.functionalLocation}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Equipment ID:</Text>
          <Text style={styles.value}>{data.equipment.equipment}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Description:</Text>
          <Text style={styles.value}>{data.equipment.equipmentDesc}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Manufacturer/Model:</Text>
          <Text style={styles.value}>{data.equipment.manufacturer} {data.equipment.model}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Serial Number:</Text>
          <Text style={styles.value}>{data.equipment.serialNumber}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>ABC Indicator:</Text>
          <Text style={styles.value}>{data.equipment.abcIndicator} - Critical Equipment</Text>
        </View>
      </View>

      {/* Description Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Work Description</Text>
        <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#1A1A2E', marginBottom: 8 }}>
          {data.description.shortText}
        </Text>
        <View style={styles.descriptionBox}>
          <Text style={styles.descriptionText}>{data.description.longText}</Text>
        </View>
      </View>

      {/* AI Analysis Badge */}
      <View style={styles.aiAnalysis}>
        <Text style={styles.aiLabel}>AI-Generated Work Order (Cerebra Agent)</Text>
        <Text style={styles.aiText}>
          Analysis ID: {data.aiAnalysis.analysisId} | Confidence: {(data.aiAnalysis.confidenceScore * 100).toFixed(0)}%
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Generated by AIIS (Accenture Industrial Intelligence Suite)</Text>
        <Text style={styles.footerText}>Page 1 of 3</Text>
      </View>
    </Page>

    {/* Page 2: Operations */}
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.logo}>ACCENTURE</Text>
        <Text style={styles.woNumber}>{data.header.workOrderNumber}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Operations / Task List</Text>
        
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { width: '8%' }]}>Op.</Text>
            <Text style={[styles.tableHeaderCell, { width: '52%' }]}>Description</Text>
            <Text style={[styles.tableHeaderCell, { width: '15%' }]}>Work Center</Text>
            <Text style={[styles.tableHeaderCell, { width: '10%' }]}>Duration</Text>
            <Text style={[styles.tableHeaderCell, { width: '15%' }]}>Activity</Text>
          </View>

          {/* Table Rows */}
          {data.operations.map((op, index) => (
            <View key={op.operationNumber} style={[styles.tableRow, index % 2 === 1 ? styles.tableRowAlt : {}]}>
              <Text style={[styles.tableCell, { width: '8%' }]}>{op.operationNumber}</Text>
              <Text style={[styles.tableCell, { width: '52%' }]}>{op.description}</Text>
              <Text style={[styles.tableCell, { width: '15%' }]}>{op.workCenter}</Text>
              <Text style={[styles.tableCell, { width: '10%' }]}>{op.duration} {op.durationUnit}</Text>
              <Text style={[styles.tableCell, { width: '15%' }]}>{op.activityType}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Schedule Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Schedule</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Scheduled Start:</Text>
          <Text style={styles.value}>{data.schedule.scheduledStart}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Scheduled Finish:</Text>
          <Text style={styles.value}>{data.schedule.scheduledFinish}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Planned Downtime:</Text>
          <Text style={styles.value}>{data.schedule.plannedDowntime} hours</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Production Impact:</Text>
          <Text style={styles.value}>{data.schedule.productionImpact}</Text>
        </View>
      </View>

      {/* Labor Assignment */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Labor Assignment</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Lead Technician:</Text>
          <Text style={styles.value}>{data.laborAssignment.leadTechnician} ({data.laborAssignment.trade})</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Crew:</Text>
          <Text style={styles.value}>{data.laborAssignment.crewName} ({data.laborAssignment.crewSize} persons)</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Estimated Hours:</Text>
          <Text style={styles.value}>{data.laborAssignment.estimatedHours} hours (Skill Match: {data.laborAssignment.skillMatch})</Text>
        </View>
        
        {/* Crew Members */}
        <View style={[styles.table, { marginTop: 8 }]}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { width: '40%' }]}>Name</Text>
            <Text style={[styles.tableHeaderCell, { width: '30%' }]}>Role</Text>
            <Text style={[styles.tableHeaderCell, { width: '30%' }]}>Trade</Text>
          </View>
          {data.laborAssignment.crewMembers.map((member, index) => (
            <View key={index} style={[styles.tableRow, index % 2 === 1 ? styles.tableRowAlt : {}]}>
              <Text style={[styles.tableCell, { width: '40%' }]}>{member.name}</Text>
              <Text style={[styles.tableCell, { width: '30%' }]}>{member.role}</Text>
              <Text style={[styles.tableCell, { width: '30%' }]}>{member.trade}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Generated by AIIS (Accenture Industrial Intelligence Suite)</Text>
        <Text style={styles.footerText}>Page 2 of 3</Text>
      </View>
    </Page>

    {/* Page 3: Materials & Cost */}
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.logo}>ACCENTURE</Text>
        <Text style={styles.woNumber}>{data.header.workOrderNumber}</Text>
      </View>

      {/* Materials Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Materials / Components</Text>
        
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { width: '12%' }]}>Material</Text>
            <Text style={[styles.tableHeaderCell, { width: '38%' }]}>Description</Text>
            <Text style={[styles.tableHeaderCell, { width: '8%' }]}>Qty</Text>
            <Text style={[styles.tableHeaderCell, { width: '10%' }]}>Unit</Text>
            <Text style={[styles.tableHeaderCell, { width: '12%' }]}>Price</Text>
            <Text style={[styles.tableHeaderCell, { width: '10%' }]}>Stock</Text>
            <Text style={[styles.tableHeaderCell, { width: '10%' }]}>Status</Text>
          </View>
          {data.materials.map((mat, index) => (
            <View key={mat.itemNumber} style={[styles.tableRow, index % 2 === 1 ? styles.tableRowAlt : {}]}>
              <Text style={[styles.tableCell, { width: '12%' }]}>{mat.materialNumber}</Text>
              <Text style={[styles.tableCell, { width: '38%' }]}>{mat.description}</Text>
              <Text style={[styles.tableCell, { width: '8%' }]}>{mat.quantity}</Text>
              <Text style={[styles.tableCell, { width: '10%' }]}>{mat.unit}</Text>
              <Text style={[styles.tableCell, { width: '12%' }]}>${mat.unitPrice.toFixed(2)}</Text>
              <Text style={[styles.tableCell, { width: '10%' }]}>{mat.availableStock}</Text>
              <Text style={[styles.tableCell, { width: '10%', color: '#10B981' }]}>{mat.status}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Safety Requirements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Safety Requirements</Text>
        <View style={styles.row}>
          <Text style={styles.label}>JSA Number:</Text>
          <Text style={styles.value}>{data.safety.jsaNumber} ({data.safety.jsaStatus})</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Permits Required:</Text>
          <Text style={styles.value}>
            {data.safety.permits.filter(p => p.status === 'Required').map(p => p.type).join(', ')}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>PPE Required:</Text>
          <Text style={styles.value}>{data.safety.ppe.join(', ')}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Hazards:</Text>
          <Text style={styles.value}>{data.safety.hazards.join(', ')}</Text>
        </View>
      </View>

      {/* Cost Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cost Estimate</Text>
        <View style={styles.costSummary}>
          <View style={styles.row}>
            <Text style={styles.label}>Labor Cost:</Text>
            <Text style={styles.value}>${data.costEstimate.laborCost.toFixed(2)} ({data.costEstimate.laborHours} hrs @ ${data.costEstimate.laborRate}/hr)</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Material Cost:</Text>
            <Text style={styles.value}>${data.costEstimate.materialCost.toFixed(2)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Overhead:</Text>
            <Text style={styles.value}>${data.costEstimate.overheadCost.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TOTAL ESTIMATE:</Text>
            <Text style={styles.totalValue}>${data.costEstimate.totalEstimate.toFixed(2)} {data.costEstimate.currency}</Text>
          </View>
        </View>
        <View style={[styles.row, { marginTop: 8 }]}>
          <Text style={styles.label}>Cost Center:</Text>
          <Text style={styles.value}>{data.costEstimate.costCenter}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Budget Remaining:</Text>
          <Text style={[styles.value, { color: '#10B981' }]}>${data.costEstimate.budgetRemaining.toFixed(2)}</Text>
        </View>
      </View>

      {/* Approval Section */}
      <View style={[styles.section, { marginTop: 20 }]}>
        <Text style={styles.sectionTitle}>Approvals</Text>
        <View style={{ flexDirection: 'row', gap: 20 }}>
          <View style={{ flex: 1, borderBottomWidth: 1, borderBottomColor: '#1A1A2E', paddingBottom: 30 }}>
            <Text style={{ fontSize: 8, color: '#6B7280' }}>Planner Signature</Text>
          </View>
          <View style={{ flex: 1, borderBottomWidth: 1, borderBottomColor: '#1A1A2E', paddingBottom: 30 }}>
            <Text style={{ fontSize: 8, color: '#6B7280' }}>Supervisor Approval</Text>
          </View>
          <View style={{ flex: 1, borderBottomWidth: 1, borderBottomColor: '#1A1A2E', paddingBottom: 30 }}>
            <Text style={{ fontSize: 8, color: '#6B7280' }}>Date</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Generated by AIIS (Accenture Industrial Intelligence Suite)</Text>
        <Text style={styles.footerText}>Page 3 of 3</Text>
      </View>
    </Page>
  </Document>
);

export default WorkOrderPDF;


