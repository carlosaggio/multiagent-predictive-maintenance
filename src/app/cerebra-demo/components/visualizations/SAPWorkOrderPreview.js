"use client";

import React, { useState, useEffect } from 'react';
import { workOrderData as defaultWorkOrderData } from '../../data/workOrderData';

export default function SAPWorkOrderPreview({ onDownload, data = defaultWorkOrderData }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGenerateButton, setShowGenerateButton] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [PDFComponents, setPDFComponents] = useState(null);
  const [pdfError, setPdfError] = useState(null);
  const [orderStatus, setOrderStatus] = useState('CRTD'); // SAP status: CRTD → REL
  const [statusTransition, setStatusTransition] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const totalPages = 3;

  // Use the full work order data from the import
  const workOrderData = data || defaultWorkOrderData;

  // Load PDF components on client side only
  useEffect(() => {
    const loadPDF = async () => {
      try {
        const [pdfRenderer, workOrderModule] = await Promise.all([
          import('@react-pdf/renderer'),
          import('../WorkOrderPDF')
        ]);
        setPDFComponents({
          PDFDownloadLink: pdfRenderer.PDFDownloadLink,
          WorkOrderPDF: workOrderModule.default
        });
      } catch (error) {
        console.error('Failed to load PDF components:', error);
        setPdfError('PDF components could not be loaded');
      }
    };
    loadPDF();
  }, []);

  // Handler for "Generate Work Order in SAP"
  const handleGenerateInSAP = () => {
    setIsGenerating(true);
    
    // Step 1: Show processing for 2 seconds
    setTimeout(() => {
      setIsGenerating(false);
      setStatusTransition(true);
      
      // Step 2: Transition from CRTD to REL after brief delay
      setTimeout(() => {
        setOrderStatus('REL');
        setStatusTransition(false);
        setOrderConfirmed(true);
        setShowGenerateButton(false);
      }, 800);
    }, 2000);
  };

  // Simple display data derived from full work order
  const displayData = {
    orderNumber: workOrderData.header?.workOrderNumber || 'WO-2025-0147',
    notificationNumber: workOrderData.header?.notificationNumber || '10075234',
    equipment: `${workOrderData.equipment?.equipmentDesc || 'Primary Crusher'} (${workOrderData.equipment?.equipment || 'CRUSHER-001'})`,
    functionalLocation: workOrderData.equipment?.functionalLocation || 'MINE-01-CRUSH-001',
    priority: workOrderData.header?.priority || '1 - Very High',
    orderType: `${workOrderData.header?.orderType || 'PM02'} - ${workOrderData.header?.orderCategory || 'Corrective Maintenance'}`,
    plannerGroup: 'PG-CRUSH',
    workCenter: workOrderData.header?.workCenter || 'CRUSH-WC',
    systemStatus: orderStatus === 'REL' ? 'REL (Released)' : 'CRTD (Created)',
    description: workOrderData.description?.shortText || 'Liner Replacement - Primary Crusher',
    longText: workOrderData.description?.longText || '',
    parts: workOrderData.materials?.map(m => ({
      partNo: m.materialNumber,
      description: m.description,
      qty: m.quantity,
      unit: m.unit,
      location: m.storageLocation,
      status: m.status
    })) || [],
    operations: workOrderData.operations?.map(op => ({
      opNo: op.operationNumber,
      description: op.description,
      duration: `${op.duration} ${op.durationUnit}`,
      workCenter: op.workCenter
    })) || [],
    labor: {
      lead: workOrderData.laborAssignment?.leadTechnician || 'James Morrison',
      leadRole: workOrderData.laborAssignment?.trade || 'Mechanical Fitter',
      crew: workOrderData.laborAssignment?.crewMembers?.map(m => `${m.role}: ${m.name}`) || [],
      totalHours: workOrderData.laborAssignment?.estimatedHours || 8,
    },
    schedule: {
      plannedStart: workOrderData.schedule?.scheduledStart || '2025-01-20 06:00',
      plannedFinish: workOrderData.schedule?.scheduledFinish || '2025-01-20 14:00',
      productionImpact: workOrderData.schedule?.productionImpact || 'Full crusher shutdown required',
    }
  };

  return (
    <div style={{ 
      background: 'white', 
      borderRadius: '8px', 
      border: '1px solid #e2e8f0',
      overflow: 'hidden'
    }}>
      {/* SAP Header */}
      <div style={{ 
        background: '#1a1a2e',
        padding: '12px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
          <span style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>
            SAP PM Work Order
          </span>
        </div>
        <div style={{ 
          background: '#10B981',
          color: 'white',
          padding: '4px 10px',
          borderRadius: '4px',
          fontSize: '11px',
          fontWeight: '600'
        }}>
          {orderStatus}
        </div>
      </div>

      {/* Document Content */}
      <div style={{ padding: '20px', maxHeight: '500px', overflowY: 'auto' }}>
        {/* Generate in SAP Button - shows first */}
        {showGenerateButton && (
          <div style={{ 
            marginBottom: '20px',
            padding: '16px',
            background: '#F0FDF4',
            borderRadius: '8px',
            borderLeft: '4px solid #10B981',
          }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#1a1a2e', marginBottom: '8px' }}>
              Work Order Ready for Release
            </div>
            <div style={{ fontSize: '11px', color: '#4b5563', marginBottom: '12px' }}>
              AI analysis complete. Release this work order to submit for planning & scheduling approval.
            </div>
            <button
              onClick={handleGenerateInSAP}
              disabled={isGenerating}
              style={{
                padding: '10px 20px',
                background: isGenerating ? '#9ca3af' : '#10B981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: isGenerating ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {isGenerating ? (
                <>
                  <span style={{ 
                    width: '14px', 
                    height: '14px', 
                    border: '2px solid white',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  Creating in SAP...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 11 12 14 22 4"/>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                  </svg>
                  Release &amp; Submit for Scheduling
                </>
              )}
            </button>
          </div>
        )}

        {/* Header Section */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '16px',
          marginBottom: '20px',
          paddingBottom: '16px',
          borderBottom: '1px solid #e2e8f0'
        }}>
          <Field label="Order Number" value={displayData.orderNumber} highlight />
          <Field label="Notification" value={displayData.notificationNumber} />
          <Field label="Priority" value={displayData.priority} highlight danger />
          <Field label="Equipment" value={displayData.equipment} />
          <Field label="Functional Location" value={displayData.functionalLocation} />
          <Field label="Order Type" value={displayData.orderType} />
          <Field label="Planner Group" value={displayData.plannerGroup} />
          <Field label="Work Center" value={displayData.workCenter} />
          <Field label="System Status" value={displayData.systemStatus} />
        </div>

        {/* Description */}
        <Section title="Description">
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#1a1a2e', marginBottom: '8px' }}>
            {displayData.description}
          </div>
          <div style={{ fontSize: '11px', color: '#4b5563', whiteSpace: 'pre-line', lineHeight: '1.5' }}>
            {displayData.longText}
          </div>
        </Section>

        {/* Parts List */}
        <Section title="Materials / Components">
          <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                <th style={thStyle}>Material No.</th>
                <th style={thStyle}>Description</th>
                <th style={thStyle}>Qty</th>
                <th style={thStyle}>Storage Loc.</th>
                <th style={thStyle}>Status</th>
              </tr>
            </thead>
            <tbody>
              {displayData.parts.slice(0, 6).map((part, i) => (
                <tr key={i}>
                  <td style={tdStyle}>{part.partNo}</td>
                  <td style={tdStyle}>{part.description}</td>
                  <td style={tdStyle}>{part.qty} {part.unit}</td>
                  <td style={tdStyle}>{part.location}</td>
                  <td style={tdStyle}>
                    <span style={{ 
                      background: '#D1FAE5', 
                      color: '#065F46',
                      padding: '2px 6px',
                      borderRadius: '3px',
                      fontSize: '10px'
                    }}>
                      {part.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        {/* Operations / Task List */}
        <Section title="Operations / Task List">
          <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                <th style={thStyle}>Op. No.</th>
                <th style={thStyle}>Description</th>
                <th style={thStyle}>Duration</th>
                <th style={thStyle}>Work Center</th>
              </tr>
            </thead>
            <tbody>
              {displayData.operations.map((op, i) => (
                <tr key={i}>
                  <td style={tdStyle}>{op.opNo}</td>
                  <td style={tdStyle}>{op.description}</td>
                  <td style={tdStyle}>{op.duration}</td>
                  <td style={tdStyle}>{op.workCenter}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        {/* Labor & Schedule */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <Section title="Labor Assignment">
            <div style={{ fontSize: '12px' }}>
              <div style={{ marginBottom: '8px' }}>
                <span style={{ color: '#718096' }}>Lead Technician: </span>
                <span style={{ fontWeight: '600', color: '#1a1a2e' }}>{displayData.labor.lead}</span>
                <span style={{ color: '#718096' }}> ({displayData.labor.leadRole})</span>
              </div>
              <div style={{ color: '#718096', marginBottom: '8px' }}>
                Crew Members:
                <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                  {displayData.labor.crew.slice(0, 4).map((c, i) => (
                    <li key={i} style={{ color: '#4b5563' }}>{c}</li>
                  ))}
                </ul>
              </div>
              <div>
                <span style={{ color: '#718096' }}>Total Estimated: </span>
                <span style={{ fontWeight: '600', color: '#1a1a2e' }}>{displayData.labor.totalHours} hours</span>
              </div>
            </div>
          </Section>

          <Section title="Schedule">
            <div style={{ fontSize: '12px' }}>
              <div style={{ marginBottom: '6px' }}>
                <span style={{ color: '#718096' }}>Planned Start: </span>
                <span style={{ fontWeight: '600', color: '#1a1a2e' }}>{displayData.schedule.plannedStart}</span>
              </div>
              <div style={{ marginBottom: '6px' }}>
                <span style={{ color: '#718096' }}>Planned Finish: </span>
                <span style={{ fontWeight: '600', color: '#1a1a2e' }}>{displayData.schedule.plannedFinish}</span>
              </div>
              <div style={{ 
                marginTop: '8px', 
                padding: '6px 8px', 
                background: '#FEF3C7', 
                borderRadius: '4px',
                fontSize: '11px',
                color: '#92400E'
              }}>
                Note: {displayData.schedule.productionImpact}
              </div>
            </div>
          </Section>
        </div>
      </div>

      {/* Page Navigation */}
      <div style={{
        padding: '12px 20px',
        background: '#f3f4f6',
        borderTop: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '16px',
      }}>
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          style={{
            padding: '6px 12px',
            background: currentPage === 1 ? '#e2e8f0' : 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '4px',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            fontSize: '12px',
          }}
        >
          Previous
        </button>
        <span style={{ fontSize: '12px', color: '#4b5563' }}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          style={{
            padding: '6px 12px',
            background: currentPage === totalPages ? '#e2e8f0' : 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '4px',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            fontSize: '12px',
          }}
        >
          Next
        </button>
      </div>

      {/* Order Confirmation Banner - shows after generation */}
      {orderConfirmed && (
        <div style={{
          padding: '16px 20px',
          background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
          borderTop: '1px solid #10B981',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#10B981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#065F46' }}>
                Work Order Released Successfully
              </div>
              <div style={{ fontSize: '12px', color: '#047857', marginTop: '2px' }}>
                WO# <strong>{displayData.orderNumber}</strong> | Status: <strong>REL</strong> | Submitted for scheduling approval
              </div>
            </div>
          </div>
          <div style={{
            padding: '6px 12px',
            background: '#10B981',
            color: 'white',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: '600',
            letterSpacing: '0.5px'
          }}>
            SAP CONFIRMED
          </div>
        </div>
      )}

      {/* Status Transition Animation */}
      {statusTransition && (
        <div style={{
          padding: '16px 20px',
          background: '#FEF3C7',
          borderTop: '1px solid #F59E0B',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '24px',
            height: '24px',
            border: '3px solid #F59E0B',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <span style={{ fontSize: '13px', color: '#92400E', fontWeight: '500' }}>
            Transitioning status: CRTD → REL...
          </span>
        </div>
      )}

      {/* Actions */}
      <div style={{ 
        padding: '16px 20px', 
        background: '#f9fafb',
        borderTop: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '12px'
      }}>
        {/* Generate in SAP Button */}
        {showGenerateButton ? (
          <button
            onClick={handleGenerateInSAP}
            disabled={isGenerating}
            style={{
              padding: '10px 20px',
              background: isGenerating ? '#9ca3af' : '#E67E22',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: isGenerating ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {isGenerating ? (
              <>
                <span style={{ 
                  width: '14px', 
                  height: '14px', 
                  border: '2px solid white',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                Creating in SAP...
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 11 12 14 22 4"/>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
                Release Work Order
              </>
            )}
          </button>
        ) : (
          <button
            onClick={() => {
              // Trigger download of consolidated report
              if (onDownload) onDownload('report');
            }}
            style={{
              padding: '10px 16px',
              background: 'white',
              color: '#4b5563',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
            Download Full Report
          </button>
        )}

        <div style={{ display: 'flex', gap: '12px' }}>
          {PDFComponents && workOrderData ? (
            <PDFComponents.PDFDownloadLink
              document={<PDFComponents.WorkOrderPDF data={workOrderData} />}
              fileName={`WorkOrder_${workOrderData.header?.workOrderNumber || 'WO-2025-0147'}.pdf`}
              style={{ textDecoration: 'none' }}
            >
              {({ loading, error }) => (
                <button
                  disabled={loading || error}
                  style={{
                    padding: '10px 20px',
                    background: loading ? '#9ca3af' : error ? '#EF4444' : '#A100FF',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: loading || error ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {loading ? (
                    <>
                      <span style={{ 
                        width: '14px', 
                        height: '14px', 
                        border: '2px solid white',
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }} />
                      Generating PDF...
                    </>
                  ) : error ? (
                    'PDF Error'
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                      Download Work Order PDF
                    </>
                  )}
                </button>
              )}
            </PDFComponents.PDFDownloadLink>
          ) : (
            <button
              disabled={true}
              style={{
                padding: '10px 20px',
                background: '#9ca3af',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {pdfError ? 'PDF unavailable' : 'Loading PDF...'}
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// Helper Components
function Section({ title, children }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ 
        fontSize: '12px', 
        fontWeight: '600', 
        color: '#A100FF',
        marginBottom: '10px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function Field({ label, value, highlight, danger }) {
  return (
    <div>
      <div style={{ fontSize: '10px', color: '#718096', marginBottom: '2px' }}>{label}</div>
      <div style={{ 
        fontSize: '12px', 
        fontWeight: highlight ? '600' : '400',
        color: danger ? '#EF4444' : '#1a1a2e'
      }}>
        {value}
      </div>
    </div>
  );
}

const thStyle = {
  textAlign: 'left',
  padding: '8px',
  borderBottom: '1px solid #e2e8f0',
  fontWeight: '600',
  color: '#4b5563'
};

const tdStyle = {
  padding: '8px',
  borderBottom: '1px solid #f0f0f0',
  color: '#1a1a2e'
};

