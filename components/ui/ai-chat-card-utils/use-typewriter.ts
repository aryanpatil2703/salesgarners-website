'use client';

import * as React from 'react';

export type TypewriterPhase = 'typing' | 'holding' | 'deleting' | 'gap';

export interface UseTypewriterOptions {
  typeMs?: number;
  deleteMs?: number;
  holdMs?: number;
  gapMs?: number;
  enabled?: boolean;
}

/**
 * Animated typewriter hook cycling through a list of prompts.
 * Designed to provide micro-interaction feedback during composer empty states.
 * @param prompts - Array of strings to cycle through
 * @param options - Timing configuration and enabled switch
 * @returns Object with current partial text and animation phase
 */
export function useTypewriter(
  prompts: string[],
  options: UseTypewriterOptions = {}
) {
  const {
    typeMs = 48,
    deleteMs = 14,
    holdMs = 3400,
    gapMs = 900,
    enabled = true,
  } = options;

  const [promptIndex, setPromptIndex] = React.useState(0);
  const [charIndex, setCharIndex] = React.useState(0);
  const [phase, setPhase] = React.useState<TypewriterPhase>('typing');

  const currentPrompt = prompts[promptIndex % prompts.length] || '';

  React.useEffect(() => {
    if (!enabled || !currentPrompt) {
      return;
    }

    let timer: NodeJS.Timeout;

    if (phase === 'typing') {
      if (charIndex < currentPrompt.length) {
        timer = setTimeout(() => {
          setCharIndex((prev) => prev + 1);
        }, typeMs);
      } else {
        setPhase('holding');
      }
    } else if (phase === 'holding') {
      timer = setTimeout(() => {
        setPhase('deleting');
      }, holdMs);
    } else if (phase === 'deleting') {
      if (charIndex > 0) {
        timer = setTimeout(() => {
          setCharIndex((prev) => prev - 1);
        }, deleteMs);
      } else {
        setPhase('gap');
      }
    } else if (phase === 'gap') {
      timer = setTimeout(() => {
        setPromptIndex((prev) => (prev + 1) % prompts.length);
        setPhase('typing');
      }, gapMs);
    }

    return () => clearTimeout(timer);
  }, [charIndex, currentPrompt, deleteMs, enabled, gapMs, holdMs, phase, promptIndex, prompts.length, typeMs]);

  const text = currentPrompt.slice(0, charIndex);

  return {
    text,
    phase,
  };
}

