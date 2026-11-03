'use client';

import { useState, useRef, useEffect } from 'react';
import ChatStudio from '@/components/studio/ChatStudio';
import './Chatbot.css';

/**
 * Production AI Concierge Chatbot component for salesgarners.com.
 * Operates purely in-memory with zero local storage persistence for visitor privacy.
 * Preserves the floating launcher button on the website as an entry point,
 * which opens a perfectly proportioned, sleek AI Assistant modal inspired by Supabase Studio.
 * @returns {JSX.Element}
 */
export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const launcherRef = useRef(null);

  // Focus management
  useEffect(() => {
    if (!isOpen) {
      launcherRef.current?.focus();
    }
  }, [isOpen]);

  // Handle global escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setIsExpanded(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <div className="sg-chat-widget">
      {/* Floating launcher button when chat is closed */}
      {!isOpen && (
        <button
          ref={launcherRef}
          className="sg-chat-launcher"
          onClick={() => setIsOpen(true)}
          aria-label="Open SalesGarners AI Concierge"
          aria-haspopup="dialog"
        >
          <div className="sg-launcher-aura" aria-hidden="true" />
          <div className="sg-launcher-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z" />
              <circle cx="8" cy="10" r="1.5" />
              <circle cx="12" cy="10" r="1.5" />
              <circle cx="16" cy="10" r="1.5" />
            </svg>
          </div>
          <span>Chat with AI</span>
          <span className="sg-badge-dot" title="Online" />
        </button>
      )}

      {/* Supabase-Inspired Single-Session AI Assistant Modal */}
      {isOpen && (
        <div
          className={`fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-[9999] transition-all duration-200 ease-out ${
            isExpanded
              ? 'w-full h-full sm:w-[680px] md:w-[720px] sm:h-[760px] sm:max-w-[calc(100vw-32px)] sm:max-h-[calc(100vh-32px)]'
              : 'w-full h-full sm:w-[410px] md:w-[430px] sm:h-[630px] sm:max-w-[calc(100vw-32px)] sm:max-h-[calc(100vh-32px)]'
          }`}
          role="dialog"
          aria-label="SalesGarners AI Studio"
          aria-modal="true"
        >
          <ChatStudio
            onClose={() => {
              setIsOpen(false);
              setIsExpanded(false);
            }}
            onToggleExpand={() => setIsExpanded((prev) => !prev)}
            isExpanded={isExpanded}
            className="w-full h-full rounded-none sm:rounded-[20px]"
          />
        </div>
      )}
    </div>
  );
}
