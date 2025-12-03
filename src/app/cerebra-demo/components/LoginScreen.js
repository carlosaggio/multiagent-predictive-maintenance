"use client";

import React from "react";
import Image from "next/image";

// Microsoft Logo SVG component
const MicrosoftLogo = () => (
  <svg width="20" height="20" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="9" height="9" fill="#f25022" />
    <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
    <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
    <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
  </svg>
);

// Accenture Logo Component - clean logo only (uses official SVG)
const AccentureLogoMain = () => (
  <Image 
    src="/img/accenture-logo.svg" 
    alt="Accenture" 
    width={28} 
    height={28}
    style={{ objectFit: 'contain' }}
  />
);

// Accenture Logo Component - small icon version (uses official SVG)
const AccentureLogo = ({ size = 14 }) => (
  <Image 
    src="/img/accenture-logo.svg" 
    alt="Accenture" 
    width={size} 
    height={size}
    style={{ objectFit: 'contain' }}
  />
);

export default function LoginScreen({ onLogin }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      // Industrial gradient background - dusk tones with orange and teal
      background: `
        linear-gradient(135deg, 
          rgba(26, 26, 46, 0.95) 0%, 
          rgba(30, 35, 50, 0.9) 30%,
          rgba(45, 40, 50, 0.85) 50%,
          rgba(60, 45, 45, 0.9) 70%,
          rgba(80, 50, 40, 0.95) 100%
        ),
        linear-gradient(45deg, 
          rgba(0, 164, 180, 0.15) 0%, 
          transparent 50%,
          rgba(230, 126, 34, 0.2) 100%
        ),
        radial-gradient(ellipse at 20% 80%, rgba(230, 126, 34, 0.1) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 20%, rgba(0, 164, 180, 0.08) 0%, transparent 50%)
      `,
      backgroundColor: '#1a1a2e',
    }}>
      {/* Subtle industrial pattern overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255,255,255,0.01) 2px,
            rgba(255,255,255,0.01) 4px
          )
        `,
        pointerEvents: 'none',
      }} />

      {/* Login Card - Minimalistic */}
      <div style={{
        width: '340px',
        padding: '44px 36px',
        background: 'rgba(26, 26, 46, 0.9)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        animation: 'fadeIn 0.6s ease-out',
      }}>
        {/* Accenture Logo - subtle */}
        <div style={{ marginBottom: '20px' }}>
          <AccentureLogoMain />
        </div>

        {/* App Title - prominent */}
        <div style={{ 
          marginBottom: '32px',
          textAlign: 'center'
        }}>
          <div style={{ 
            fontSize: '18px', 
            color: 'white',
            fontWeight: '600',
            letterSpacing: '0.5px'
          }}>
            Mining Operations
          </div>
          <div style={{ 
            fontSize: '14px', 
            color: 'rgba(255, 255, 255, 0.7)',
            marginTop: '6px',
            letterSpacing: '0.5px',
            fontWeight: '500'
          }}>
            AI Control Tower
          </div>
        </div>

        {/* Microsoft Login Button - Accenture Purple */}
        <button
          onClick={onLogin}
          style={{
            width: '100%',
            padding: '14px 24px',
            background: '#A100FF',
            border: 'none',
            borderRadius: '6px',
            color: 'white',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(161, 0, 255, 0.3)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#8500D4';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#A100FF';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <MicrosoftLogo />
          <span>Login with Microsoft</span>
        </button>

        {/* Alternative login link - underlined */}
        <div style={{
          marginTop: '20px',
          fontSize: '13px',
          color: 'rgba(255, 255, 255, 0.5)',
        }}>
          or sign in using{' '}
          <span
            style={{
              color: '#A100FF',
              cursor: 'pointer',
              textDecoration: 'underline',
              textUnderlineOffset: '2px',
            }}
          >
            Email
          </span>
        </div>
      </div>

      {/* Background credit - bottom left */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '20px',
        fontSize: '11px',
        color: 'rgba(255, 255, 255, 0.35)',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}>
        <AccentureLogo size={12} />
        <span>(c) 2025 Accenture. All Rights Reserved.</span>
      </div>

      {/* Powered by - bottom right */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        right: '20px',
        fontSize: '11px',
        color: 'rgba(255, 255, 255, 0.35)',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}>
        <span>Powered by</span>
        <span style={{ color: '#A100FF', fontWeight: '600' }}>AIIS</span>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
