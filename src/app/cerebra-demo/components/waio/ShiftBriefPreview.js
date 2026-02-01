"use client";

import React, { useState, useEffect } from 'react';
import { pdf } from '@react-pdf/renderer';
import ShiftBriefPDF, { defaultShiftBriefData } from './ShiftBriefPDF';

/**
 * Shift Brief Preview Component
 * 
 * Document-like preview of the generated shift brief with Accenture-branded PDF download.
 */

// Toast notification component
function Toast({ message, type = 'success', isVisible, onClose }) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const bgColor = type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#F59E0B';

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      padding: '14px 20px',
      background: bgColor,
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      zIndex: 10000,
      animation: 'slideIn 0.3s ease-out',
    }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        {type === 'success' ? (
          <polyline points="20 6 9 17 4 12"/>
        ) : (
          <circle cx="12" cy="12" r="10"/>
        )}
      </svg>
      <span style={{ color: 'white', fontSize: '13px', fontWeight: '600' }}>{message}</span>
      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// Section component
function Section({ title, children, icon }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '10px',
        paddingBottom: '6px',
        borderBottom: '2px solid #A100FF',
      }}>
        {icon}
        <span style={{ 
          fontSize: '12px', 
          fontWeight: '700', 
          color: '#1A1A2E',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}>
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

// Bullet list component
function BulletList({ items }) {
  return (
    <ul style={{ 
      margin: 0, 
      paddingLeft: '20px',
      fontSize: '12px',
      color: '#4B5563',
      lineHeight: '1.6',
    }}>
      {items?.map((item, idx) => (
        <li key={idx} style={{ marginBottom: '6px' }}>{item}</li>
      ))}
    </ul>
  );
}

// KPI row component
function KPIRow({ label, value, status }) {
  const statusColors = {
    good: '#10B981',
    warning: '#F59E0B',
    critical: '#EF4444',
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      padding: '6px 0',
      borderBottom: '1px solid #F3F4F6',
    }}>
      <span style={{ fontSize: '11px', color: '#6B7280' }}>{label}</span>
      <span style={{ 
        fontSize: '12px', 
        fontWeight: '600', 
        color: statusColors[status] || '#1A1A2E',
      }}>
        {value}
      </span>
    </div>
  );
}

// Action item component
function ActionItem({ action, owner, due, status }) {
  const statusColors = {
    pending: { bg: '#FEF3C7', text: '#92400E' },
    complete: { bg: '#D1FAE5', text: '#065F46' },
    overdue: { bg: '#FEE2E2', text: '#991B1B' },
  };
  const colors = statusColors[status] || statusColors.pending;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '8px 10px',
      background: '#F9FAFB',
      borderRadius: '4px',
      marginBottom: '6px',
    }}>
      <div style={{
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        background: colors.text,
        flexShrink: 0,
      }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '11px', color: '#1A1A2E' }}>{action}</div>
        <div style={{ fontSize: '10px', color: '#6B7280' }}>
          {owner} • Due: {due}
        </div>
      </div>
      <div style={{
        padding: '3px 8px',
        borderRadius: '4px',
        background: colors.bg,
        color: colors.text,
        fontSize: '9px',
        fontWeight: '600',
        textTransform: 'uppercase',
      }}>
        {status}
      </div>
    </div>
  );
}

// Icons
const Icons = {
  objective: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A100FF" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="6"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  summary: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A100FF" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
  risk: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A100FF" strokeWidth="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  actions: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A100FF" strokeWidth="2">
      <polyline points="9 11 12 14 22 4"/>
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </svg>
  ),
  comms: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A100FF" strokeWidth="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
};

export default function ShiftBriefPreview({ 
  shiftId = 'SHIFT-2025-01-15-DAY',
  planName = 'Option B: Balanced',
  generatedAt = '2025-01-15T11:00:00+08:00',
  onDownload,
  onSend,
}) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, visible: false }));
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    
    try {
      // Prepare PDF data with current shift info
      const pdfData = {
        ...defaultShiftBriefData,
        shiftId: shiftId,
        planName: planName,
        generatedAt: new Date(generatedAt).toLocaleString(),
      };
      
      // Generate PDF blob
      const pdfBlob = await pdf(<ShiftBriefPDF data={pdfData} />).toBlob();
      
      // Create and download the PDF file
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${shiftId}_ShiftBrief.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setIsDownloading(false);
      showToast('Shift brief PDF downloaded successfully!', 'success');
      onDownload?.();
    } catch (error) {
      console.error('PDF generation error:', error);
      setIsDownloading(false);
      showToast('Failed to generate PDF. Please try again.', 'error');
    }
  };

  const handleSend = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      showToast('Shift brief sent to Teams channel', 'success');
      onSend?.();
    }, 1500);
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '8px',
      border: '1px solid #E2E8F0',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      overflow: 'hidden',
      maxWidth: '600px',
    }}>
      {/* Document header */}
      <div style={{
        padding: '20px 24px',
        background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2D44 100%)',
        borderBottom: '3px solid #A100FF',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ 
              fontSize: '10px', 
              color: '#9CA3AF',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '4px',
            }}>
              WAIO Shift Brief
            </div>
            <div style={{ 
              fontSize: '18px', 
              fontWeight: '700', 
              color: 'white',
            }}>
              {shiftId}
            </div>
            <div style={{ 
              fontSize: '11px', 
              color: '#9CA3AF',
              marginTop: '4px',
            }}>
              Generated: {new Date(generatedAt).toLocaleString()} • Plan: {planName}
            </div>
          </div>
          <div style={{
            width: '48px',
            height: '48px',
            background: '#A100FF',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Document content */}
      <div style={{ padding: '20px 24px' }}>
        {/* Objectives */}
        <Section title="Shift Objectives" icon={Icons.objective}>
          <BulletList items={[
            'Achieve ≥62.0% Fe on Train-07 and Train-08 loads',
            'Maintain throughput within 5% of 155kt target',
            'Clear Pit 3 Zone B assay lag issue',
            'Reconcile SP-3 volume discrepancy',
          ]} />
        </Section>

        {/* Plan summary */}
        <Section title="Plan Summary" icon={Icons.summary}>
          <div style={{ 
            background: '#F9FAFB', 
            padding: '12px', 
            borderRadius: '6px',
            marginBottom: '12px',
          }}>
            <KPIRow label="Predicted Train-07 Fe" value="62.05%" status="good" />
            <KPIRow label="Predicted Train-08 Fe" value="62.20%" status="good" />
            <KPIRow label="Total Tonnes (Shift)" value="151,000 t" status="warning" />
            <KPIRow label="Compliance Probability" value="82%" status="good" />
            <KPIRow label="Value at Risk" value="$580k" status="warning" />
          </div>
          <div style={{ fontSize: '11px', color: '#4B5563', lineHeight: '1.5' }}>
            Blend recipe optimised with 55% SP-2, 35% SP-3, and 10% Pit 3 Zone C feed. 
            Dig operations shifted from Zone B to Zone C to recover Fe grade.
          </div>
        </Section>

        {/* Risks */}
        <Section title="Key Risks & Mitigations" icon={Icons.risk}>
          <div style={{
            display: 'grid',
            gap: '8px',
          }}>
            <div style={{
              display: 'flex',
              gap: '10px',
              padding: '8px 10px',
              background: '#FEF2F2',
              borderRadius: '4px',
              borderLeft: '3px solid #EF4444',
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '11px', fontWeight: '600', color: '#991B1B' }}>
                  TRK-12 Breakdown
                </div>
                <div style={{ fontSize: '10px', color: '#B91C1C', marginTop: '2px' }}>
                  Haul capacity reduced 8%. Mitigation: TRK-08 activated from standby.
                </div>
              </div>
            </div>
            <div style={{
              display: 'flex',
              gap: '10px',
              padding: '8px 10px',
              background: '#FFFBEB',
              borderRadius: '4px',
              borderLeft: '3px solid #F59E0B',
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '11px', fontWeight: '600', color: '#92400E' }}>
                  SP-3 Data Confidence
                </div>
                <div style={{ fontSize: '10px', color: '#B45309', marginTop: '2px' }}>
                  Confidence at 72% due to assay lag. Mitigation: Increased SP-2 ratio.
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Actions */}
        <Section title="Action Checklist" icon={Icons.actions}>
          <ActionItem 
            action="Verify sample from PIT3-ZC before dig start"
            owner="Pit Supervisor"
            due="09:30"
            status="pending"
          />
          <ActionItem 
            action="Confirm SP-3 rehandle logged in system"
            owner="Stockyard"
            due="08:00"
            status="pending"
          />
          <ActionItem 
            action="Fast-track Pit 3 samples"
            owner="Lab"
            due="10:00"
            status="pending"
          />
          <ActionItem 
            action="Update truck routes for PIT3-ZC access"
            owner="Dispatch"
            due="09:45"
            status="pending"
          />
        </Section>

        {/* Comms */}
        <Section title="Communications" icon={Icons.comms}>
          <div style={{ fontSize: '11px', color: '#4B5563', lineHeight: '1.5' }}>
            <p style={{ margin: '0 0 8px 0' }}>
              <strong>Pre-shift brief:</strong> 06:00 at main crib room
            </p>
            <p style={{ margin: '0 0 8px 0' }}>
              <strong>Key message:</strong> Focus on grade compliance for Train-07. 
              Zone C dig starting 10:00 after blast window clears.
            </p>
            <p style={{ margin: 0 }}>
              <strong>Escalation:</strong> Any grade readings &lt;61.5% Fe to be 
              reported immediately to Shift Supervisor.
            </p>
          </div>
        </Section>
      </div>

      {/* Actions footer */}
      <div style={{
        padding: '16px 24px',
        background: '#F9FAFB',
        borderTop: '1px solid #E2E8F0',
        display: 'flex',
        gap: '12px',
        justifyContent: 'flex-end',
      }}>
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          style={{
            padding: '10px 20px',
            background: 'white',
            border: '1px solid #E2E8F0',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600',
            color: '#4B5563',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            opacity: isDownloading ? 0.7 : 1,
          }}
        >
          {isDownloading ? (
            <span>Downloading...</span>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download PDF
            </>
          )}
        </button>
        <button
          onClick={handleSend}
          disabled={isSending}
          style={{
            padding: '10px 20px',
            background: '#A100FF',
            border: 'none',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            opacity: isSending ? 0.7 : 1,
          }}
        >
          {isSending ? (
            <span>Sending...</span>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
              Send to Teams
            </>
          )}
        </button>
      </div>

      {/* Toast notification */}
      <Toast 
        message={toast.message} 
        type={toast.type} 
        isVisible={toast.visible} 
        onClose={hideToast} 
      />
    </div>
  );
}

export { Section, BulletList, KPIRow, ActionItem };
