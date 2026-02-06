/**
 * Progressive Loader Utility
 * 
 * Provides hooks and components for staged content reveals that give
 * the impression of real-time AI processing and generation.
 * 
 * Used across Pit-to-Port workflow output stages to create a more
 * dynamic, generated feel rather than static pre-rendered content.
 */

import { useState, useEffect, useCallback, useRef } from 'react';

// ============================================================================
// CONFIGURATION
// ============================================================================

// Default timing configurations for different content types
export const TIMING_PRESETS = {
  fast: { baseDelay: 150, stagger: 100 },        // Quick reveals (simple items)
  normal: { baseDelay: 300, stagger: 200 },      // Standard content
  slow: { baseDelay: 500, stagger: 300 },        // Complex visualizations
  processing: { baseDelay: 800, stagger: 400 },  // Heavy processing simulation
};

// ============================================================================
// HOOKS
// ============================================================================

/**
 * useProgressiveReveal
 * 
 * Hook that manages staged reveals of multiple items with configurable timing.
 * 
 * @param {number} itemCount - Total number of items to reveal
 * @param {object} options - Configuration options
 * @param {number} options.baseDelay - Initial delay before first reveal (ms)
 * @param {number} options.stagger - Delay between each item reveal (ms)
 * @param {boolean} options.autoStart - Whether to start automatically (default: true)
 * @param {function} options.onAllRevealed - Callback when all items are revealed
 * @returns {object} { revealedCount, revealedItems, isComplete, startReveal, reset }
 */
export function useProgressiveReveal(itemCount, options = {}) {
  const {
    baseDelay = 300,
    stagger = 200,
    autoStart = true,
    onAllRevealed = null,
  } = options;

  const [revealedCount, setRevealedCount] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const timersRef = useRef([]);
  const onAllRevealedRef = useRef(onAllRevealed);
  
  // Keep callback ref updated
  useEffect(() => {
    onAllRevealedRef.current = onAllRevealed;
  }, [onAllRevealed]);

  // Cleanup function
  const clearTimers = useCallback(() => {
    timersRef.current.forEach(timer => clearTimeout(timer));
    timersRef.current = [];
  }, []);

  // Start the reveal sequence
  const startReveal = useCallback(() => {
    if (isStarted) return;
    setIsStarted(true);
    clearTimers();
    
    for (let i = 0; i < itemCount; i++) {
      const delay = baseDelay + (i * stagger);
      const timer = setTimeout(() => {
        setRevealedCount(prev => {
          const newCount = prev + 1;
          if (newCount === itemCount && onAllRevealedRef.current) {
            // Small delay before callback to ensure state is settled
            setTimeout(() => onAllRevealedRef.current(), 100);
          }
          return newCount;
        });
      }, delay);
      timersRef.current.push(timer);
    }
  }, [isStarted, itemCount, baseDelay, stagger, clearTimers]);

  // Reset to initial state
  const reset = useCallback(() => {
    clearTimers();
    setRevealedCount(0);
    setIsStarted(false);
  }, [clearTimers]);

  // Auto-start if enabled
  useEffect(() => {
    if (autoStart && itemCount > 0) {
      startReveal();
    }
    return clearTimers;
  }, [autoStart, itemCount, startReveal, clearTimers]);

  // Helper to check if a specific index is revealed
  const revealedItems = Array.from({ length: itemCount }, (_, i) => i < revealedCount);

  return {
    revealedCount,
    revealedItems,
    isComplete: revealedCount >= itemCount,
    isStarted,
    startReveal,
    reset,
  };
}

/**
 * useSectionLoader
 * 
 * Hook for managing sequential section loading with processing simulation.
 * Each section can have a different "weight" affecting its load time.
 * 
 * @param {Array} sections - Array of section configs { id, weight?, label? }
 * @param {object} options - Configuration options
 * @returns {object} { loadedSections, currentSection, isComplete, progress }
 */
export function useSectionLoader(sections, options = {}) {
  const {
    baseTime = 400,
    weightMultiplier = 200,
    autoStart = true,
    onComplete = null,
  } = options;

  const [loadedSections, setLoadedSections] = useState(new Set());
  const [currentSection, setCurrentSection] = useState(null);
  const [isStarted, setIsStarted] = useState(false);
  const timersRef = useRef([]);
  const onCompleteRef = useRef(onComplete);
  
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(timer => clearTimeout(timer));
    timersRef.current = [];
  }, []);

  const start = useCallback(() => {
    if (isStarted || sections.length === 0) return;
    setIsStarted(true);
    
    let cumulativeDelay = 0;
    
    sections.forEach((section, idx) => {
      const weight = section.weight || 1;
      const loadTime = baseTime + (weight * weightMultiplier);
      
      // Start loading this section
      const startTimer = setTimeout(() => {
        setCurrentSection(section.id);
      }, cumulativeDelay);
      timersRef.current.push(startTimer);
      
      // Complete loading this section
      const completeTimer = setTimeout(() => {
        setLoadedSections(prev => new Set([...prev, section.id]));
        
        // If last section, trigger complete callback
        if (idx === sections.length - 1) {
          setCurrentSection(null);
          setTimeout(() => onCompleteRef.current?.(), 100);
        }
      }, cumulativeDelay + loadTime);
      timersRef.current.push(completeTimer);
      
      cumulativeDelay += loadTime;
    });
  }, [isStarted, sections, baseTime, weightMultiplier]);

  useEffect(() => {
    if (autoStart) start();
    return clearTimers;
  }, [autoStart, start, clearTimers]);

  const progress = sections.length > 0 
    ? (loadedSections.size / sections.length) * 100 
    : 0;

  return {
    loadedSections,
    currentSection,
    isComplete: loadedSections.size >= sections.length,
    isStarted,
    progress,
    start,
    isSectionLoaded: (id) => loadedSections.has(id),
    isSectionLoading: (id) => currentSection === id,
  };
}

/**
 * useTypingEffect
 * 
 * Simulates typing effect for text content to appear more generated.
 * 
 * @param {string} text - Full text to reveal
 * @param {object} options - Configuration options
 * @returns {object} { displayText, isComplete }
 */
export function useTypingEffect(text, options = {}) {
  const {
    speed = 20,        // ms per character
    startDelay = 300,
    autoStart = true,
  } = options;

  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef(null);
  const indexRef = useRef(0);

  const start = useCallback(() => {
    if (!text) return;
    
    indexRef.current = 0;
    setDisplayText('');
    setIsComplete(false);
    
    const startTimer = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        if (indexRef.current < text.length) {
          setDisplayText(text.slice(0, indexRef.current + 1));
          indexRef.current++;
        } else {
          clearInterval(intervalRef.current);
          setIsComplete(true);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(startTimer);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, speed, startDelay]);

  useEffect(() => {
    if (autoStart) return start();
  }, [autoStart, start]);

  return { displayText, isComplete };
}

// ============================================================================
// COMPONENTS (React Component Wrappers)
// ============================================================================

/**
 * ProgressiveSection
 * 
 * Wrapper component that handles fade-in animation with optional loading state.
 * 
 * Props:
 * - isVisible: boolean - Whether section should be visible
 * - isLoading: boolean - Whether to show loading indicator
 * - delay: number - Animation delay (ms)
 * - children: React node
 */
export function ProgressiveSection({ 
  isVisible, 
  isLoading = false, 
  delay = 0, 
  loadingText = 'Processing...',
  children,
  style = {},
}) {
  if (!isVisible && !isLoading) return null;
  
  if (isLoading) {
    return (
      <div style={{
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        color: '#6B7280',
        fontSize: '12px',
        animation: 'fadeIn 0.3s ease-out',
        ...style,
      }}>
        <LoadingSpinner size={16} />
        {loadingText}
      </div>
    );
  }
  
  return (
    <div style={{
      animation: `fadeSlideUp 0.4s ease-out ${delay}ms both`,
      ...style,
    }}>
      {children}
    </div>
  );
}

/**
 * LoadingSpinner
 * 
 * Simple animated spinner component.
 */
export function LoadingSpinner({ size = 20, color = '#A100FF' }) {
  return (
    <div style={{
      width: size,
      height: size,
      border: `2px solid ${color}30`,
      borderTopColor: color,
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    }} />
  );
}

/**
 * ProcessingIndicator
 * 
 * Visual indicator for AI processing with optional steps.
 */
export function ProcessingIndicator({ 
  label = 'Processing', 
  steps = [],
  currentStep = 0,
  showSteps = true,
}) {
  return (
    <div style={{
      padding: '24px',
      background: 'linear-gradient(135deg, #F5F3FF 0%, #EEF2FF 100%)',
      borderRadius: '8px',
      border: '1px solid #A100FF20',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: showSteps && steps.length > 0 ? '16px' : 0,
      }}>
        <LoadingSpinner />
        <div>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#1A1A2E' }}>
            {label}
          </div>
          {steps.length > 0 && currentStep < steps.length && (
            <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>
              {steps[currentStep]}
            </div>
          )}
        </div>
      </div>
      
      {showSteps && steps.length > 0 && (
        <div style={{ display: 'flex', gap: '8px' }}>
          {steps.map((step, idx) => (
            <div
              key={idx}
              style={{
                flex: 1,
                height: '4px',
                borderRadius: '2px',
                background: idx < currentStep ? '#A100FF' : idx === currentStep ? '#A100FF60' : '#E2E8F0',
                transition: 'background 0.3s ease',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// CSS KEYFRAMES (to be injected once)
// ============================================================================

export const progressiveLoaderStyles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes fadeSlideUp {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes fadeSlideIn {
    from {
      opacity: 0;
      transform: translateX(-10px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Creates a delayed promise for artificial processing time.
 */
export function simulateProcessing(minMs = 500, maxMs = 1500) {
  const delay = Math.random() * (maxMs - minMs) + minMs;
  return new Promise(resolve => setTimeout(resolve, delay));
}

/**
 * Generates a random "processing" step message.
 */
export function getProcessingMessage(type = 'generic') {
  const messages = {
    generic: [
      'Analyzing data patterns...',
      'Running constraint analysis...',
      'Optimizing parameters...',
      'Generating insights...',
      'Validating results...',
    ],
    grade: [
      'Analyzing grade distribution...',
      'Checking compliance thresholds...',
      'Calculating deviation sources...',
      'Projecting grade outcomes...',
    ],
    plan: [
      'Evaluating plan options...',
      'Balancing constraints...',
      'Calculating trade-offs...',
      'Ranking alternatives...',
    ],
    reconciliation: [
      'Comparing plan vs actual...',
      'Identifying deviation patterns...',
      'Calculating compliance metrics...',
      'Generating insights...',
    ],
  };
  
  const pool = messages[type] || messages.generic;
  return pool[Math.floor(Math.random() * pool.length)];
}

export default {
  useProgressiveReveal,
  useSectionLoader,
  useTypingEffect,
  ProgressiveSection,
  LoadingSpinner,
  ProcessingIndicator,
  TIMING_PRESETS,
  progressiveLoaderStyles,
  simulateProcessing,
  getProcessingMessage,
};
