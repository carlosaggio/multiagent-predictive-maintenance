"use client";

import React, { useEffect, useRef } from "react";

export default function NotificationPanel({
  isOpen,
  onClose,
  notifications = [],
  onNotificationClick,
}) {
  const panelRef = useRef(null);

  // Handle click outside to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose && onClose();
      }
    }

    if (isOpen) {
      // Add event listener with delay to prevent immediate close
      const timer = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);
      return () => {
        clearTimeout(timer);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, onClose]);

  // Handle escape key
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape') {
        onClose && onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  return (
    <>
      {/* Overlay */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.3)',
          zIndex: 999,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '340px',
          background: 'white',
          boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.15)',
          zIndex: 1000,
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid #e2e8f0',
          background: '#fafafa',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#A100FF">
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
            </svg>
            <span style={{ fontWeight: '600', fontSize: '15px', color: '#1a1a2e' }}>
              Notifications
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
              color: '#718096',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Notification List */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px',
        }}>
          {notifications.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '200px',
              color: '#9ca3af',
            }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.4 }}>
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
              </svg>
              <p style={{ marginTop: '12px', fontSize: '13px' }}>No notifications</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClick={() => onNotificationClick && onNotificationClick(notification)}
              />
            ))
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div style={{
            padding: '12px 16px',
            borderTop: '1px solid #e2e8f0',
            textAlign: 'center',
          }}>
            <button style={{
              background: 'none',
              border: 'none',
              color: '#A100FF',
              fontSize: '12px',
              fontWeight: '500',
              cursor: 'pointer',
            }}>
              View All Notifications
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// Notification Item Component
function NotificationItem({ notification, onClick }) {
  const severityColors = {
    critical: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
    success: '#10B981',
  };

  const severityBg = {
    critical: '#FEF2F2',
    warning: '#FFFBEB',
    info: '#EFF6FF',
    success: '#F0FDF4',
  };

  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        gap: '12px',
        padding: '14px',
        marginBottom: '8px',
        background: severityBg[notification.severity] || '#F9FAFB',
        borderRadius: '8px',
        cursor: 'pointer',
        borderLeft: `3px solid ${severityColors[notification.severity] || '#9CA3AF'}`,
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateX(2px)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateX(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Severity Icon */}
      <div style={{
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        background: severityColors[notification.severity] || '#9CA3AF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        {notification.severity === 'critical' && (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        )}
        {notification.severity === 'warning' && (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
          </svg>
        )}
        {notification.severity === 'info' && (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: '13px',
          fontWeight: '600',
          color: '#1a1a2e',
          marginBottom: '4px',
        }}>
          {notification.title}
        </div>
        <div style={{
          fontSize: '12px',
          color: '#718096',
          lineHeight: '1.4',
          marginBottom: '6px',
        }}>
          {notification.description}
        </div>
        <div style={{
          fontSize: '10px',
          color: '#9ca3af',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
          </svg>
          {notification.timestamp}
        </div>
      </div>

      {/* Arrow */}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="#9ca3af" style={{ flexShrink: 0, alignSelf: 'center' }}>
        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
      </svg>
    </div>
  );
}
