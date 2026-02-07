"use client";

import React, { useState } from "react";
import Image from "next/image";

// Accenture Logo Component - uses official SVG from /public/img/
const AccentureLogo = ({ size = 20 }) => (
  <Image 
    src="/img/accenture-logo.svg" 
    alt="Accenture" 
    width={size} 
    height={size}
    style={{ objectFit: 'contain' }}
  />
);

export default function CerebraHeader({
  title,
  showBackButton = false,
  onBack,
  onNotificationClick,
  notificationCount = 0,
  onGraphClick,
  showGraphButton = false,
  // Control Tower props
  onControlTowerClick,
  showControlTowerButton = false,
  controlTowerActive = false,
  // Domain mode props
  domainMode = null,
  domainModes = [],
  onDomainModeChange = null,
}) {
  const [showDomainMenu, setShowDomainMenu] = useState(false);
  const activeDomain = domainModes.find(m => m.id === domainMode);
  return (
    <header className="cerebra-header">
      <div className="cerebra-header-left">
        {/* Accenture Logo with text - logo first, then name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AccentureLogo size={20} />
          <span style={{ 
            color: 'white', 
            fontFamily: 'Arial, sans-serif', 
            fontSize: '16px',
            fontWeight: '700',
            letterSpacing: '0.5px'
          }}>
            accenture
          </span>
        </div>

        {/* Divider */}
        <div style={{ 
          width: '1px', 
          height: '24px', 
          background: 'rgba(255,255,255,0.3)',
          margin: '0 16px'
        }} />

        {/* Page Title */}
        <div className="cerebra-header-title" style={{ 
          fontSize: '15px', 
          fontWeight: '400',
          color: 'white'
        }}>
          {title}
        </div>
      </div>

      <div className="cerebra-header-right">
        {/* Back Button */}
        {showBackButton && (
          <button
            onClick={onBack}
            style={{
              padding: "8px 16px",
              background: "#374151",
              border: "none",
              borderRadius: "4px",
              color: "white",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: '500',
            }}
          >
            Back
          </button>
        )}

        {/* Ontology Button - P2C Knowledge Graph */}
        {showGraphButton && onGraphClick && (
          <button
            onClick={onGraphClick}
            title="View P2C Ontology"
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '6px',
              padding: '8px 12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'white',
              fontSize: '12px',
              fontWeight: '500',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(161,0,255,0.3)';
              e.currentTarget.style.borderColor = '#A100FF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="18" cy="5" r="3"/>
              <circle cx="6" cy="12" r="3"/>
              <circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
            Ontology
          </button>
        )}

        {/* AI Control Tower Button - icon only, subtle */}
        {showControlTowerButton && onControlTowerClick && (
          <button
            onClick={onControlTowerClick}
            title="AI Control Tower"
            style={{
              background: controlTowerActive ? 'rgba(161,0,255,0.25)' : 'rgba(255,255,255,0.1)',
              border: `1px solid ${controlTowerActive ? '#A100FF' : 'rgba(255,255,255,0.2)'}`,
              borderRadius: '6px',
              padding: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: controlTowerActive ? '#A100FF' : 'white',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (!controlTowerActive) {
                e.currentTarget.style.background = 'rgba(161,0,255,0.2)';
                e.currentTarget.style.borderColor = 'rgba(161,0,255,0.5)';
              }
            }}
            onMouseLeave={(e) => {
              if (!controlTowerActive) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
              }
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <path d="M3 9h18"/>
              <path d="M9 21V9"/>
            </svg>
          </button>
        )}

        {/* Domain Mode Dropdown */}
        {domainModes.length > 0 && onDomainModeChange && (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowDomainMenu(!showDomainMenu)}
              onBlur={() => setTimeout(() => setShowDomainMenu(false), 150)}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '6px',
                padding: '8px 12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'white',
                fontSize: '12px',
                fontWeight: '500',
                transition: 'all 0.2s ease',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1"/>
                <rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/>
                <rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
              {activeDomain?.label || 'Select Mode'}
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: '2px' }}>
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            {showDomainMenu && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '4px',
                background: '#1a1a2e',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '8px',
                padding: '4px',
                minWidth: '160px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                zIndex: 100,
              }}>
                {domainModes.map(mode => (
                  <button
                    key={mode.id}
                    onClick={() => {
                      onDomainModeChange(mode.id);
                      setShowDomainMenu(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: 'none',
                      borderRadius: '4px',
                      background: domainMode === mode.id ? 'rgba(161,0,255,0.2)' : 'transparent',
                      color: domainMode === mode.id ? '#A100FF' : 'rgba(255,255,255,0.8)',
                      fontSize: '12px',
                      fontWeight: domainMode === mode.id ? '600' : '400',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (domainMode !== mode.id) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (domainMode !== mode.id) {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    {domainMode === mode.id && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="#A100FF" stroke="none">
                        <circle cx="12" cy="12" r="5"/>
                      </svg>
                    )}
                    {domainMode !== mode.id && <div style={{ width: '12px' }} />}
                    {mode.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Notification Bell */}
        {onNotificationClick && (
          <div className="notification-bell" onClick={onNotificationClick}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M10 2a6 6 0 0 1 6 6c0 7 3 9 3 9H1s3-2 3-9a6 6 0 0 1 6-6z" />
              <path d="M8.5 18a2.5 2.5 0 0 0 3 0" />
            </svg>
            {notificationCount > 0 && (
              <div className="notification-badge">{notificationCount}</div>
            )}
          </div>
        )}

        {/* User Avatar */}
        <div className="user-avatar" style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: '#A100FF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '13px',
          fontWeight: '600',
          color: 'white'
        }}>
          CA
        </div>
        <span style={{ fontSize: "14px", color: "white" }}>Carlos Aggio</span>
      </div>
    </header>
  );
}
