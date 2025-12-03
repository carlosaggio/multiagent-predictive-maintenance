"use client";

import React from "react";
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
}) {
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
