"use client";

import * as React from "react";
import { motion, useInView } from "motion/react";
import {
  ArrowUp,
  ArrowDown,
  RotateCcw,
  PlusCircle,
  Maximize2,
  Minimize2,
  X,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  User,
  Sparkles
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useTypewriter } from "@/components/ui/ai-chat-card-utils/use-typewriter";

export interface AIChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Array<{ title: string; url: string; category?: string }>;
}

export interface AIChatCardProps {
  title?: string;
  subtitle?: string;
  greeting?: string;
  prompt?: string;
  /** Prompts the composer types out on a loop. */
  prompts?: string[];
  /** Turn the prompt-typing animation off. */
  autoType?: boolean;
  placeholder?: string;
  icon?: React.ReactNode;
  onSend?: (message: string) => void;
  onReset?: () => void;
  onAttach?: () => void;
  onClose?: () => void;
  onToggleExpand?: () => void;
  isExpanded?: boolean;
  messages?: AIChatMessage[];
  isLoading?: boolean;
  className?: string;
}

const DEFAULT_PROMPTS = [
  "What B2B demand generation services do you offer?",
  "How does the Free Pilot Campaign work for content syndication?",
  "Tell me about the proprietary X-Engage intent platform",
  "What lead qualification tiers do you deliver (MQL, SQL, HQL)?",
];

/**
 * Sanitizes markdown links to prevent javascript: or malformed URI execution.
 * @param {string} rawUrl - Untrusted URL string
 * @returns {string} Safe URL or '#'
 */
function sanitizeHref(rawUrl: string): string {
  if (!rawUrl) return "#";
  const trimmed = rawUrl.trim();
  if (
    trimmed.startsWith("/") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("mailto:")
  ) {
    return trimmed;
  }
  return "#";
}

/**
 * Parses basic markdown syntax (bold, links, inline code, lists) into safe React virtual DOM elements.
 * @param {string} text - Raw markdown-formatted text string
 * @returns {React.ReactNode[]} Array of JSX elements
 */
function renderFormattedContent(text: string): React.ReactNode[] {
  if (!text) return [];

  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      elements.push(<div key={`space-${i}`} className="h-2" />);
      continue;
    }

    // Numbered list items (e.g. "1. ", "2. ")
    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (numMatch) {
      elements.push(
        <div key={`num-${i}`} className="flex items-start gap-2.5 my-1.5 pl-0.5">
          <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-zinc-800 text-[11px] font-bold text-zinc-300 border border-zinc-700/60 mt-0.5 select-none">
            {numMatch[1]}
          </span>
          <div className="text-[14.5px] leading-relaxed text-zinc-200 flex-1">
            {formatInline(numMatch[2])}
          </div>
        </div>
      );
      continue;
    }

    // Bullet items (e.g. "• ", "- ", "* ")
    if (trimmed.startsWith("•") || trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const cleanLine = trimmed.replace(/^([•\-*]\s*)/, "");
      elements.push(
        <div key={`bullet-${i}`} className="flex items-start gap-2.5 my-1.5 pl-1">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-zinc-400 mt-2 shrink-0" />
          <div className="text-[14.5px] leading-relaxed text-zinc-200 flex-1">
            {formatInline(cleanLine)}
          </div>
        </div>
      );
      continue;
    }

    // Standard paragraph
    elements.push(
      <p key={`p-${i}`} className="my-1.5 text-[14.5px] leading-relaxed text-zinc-200">
        {formatInline(trimmed)}
      </p>
    );
  }

  return elements;
}

/**
 * Parses inline formatting: **bold**, `code`, and [link text](url)
 * @param {string} line - Single line string
 * @returns {React.ReactNode[]} Array of tokens and JSX nodes
 */
function formatInline(line: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      parts.push(line.substring(lastIndex, match.index));
    }

    const token = match[0];
    if (token.startsWith("**") && token.endsWith("**")) {
      parts.push(
        <strong key={`b-${match.index}`} className="font-semibold text-white">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("`") && token.endsWith("`")) {
      parts.push(
        <code
          key={`c-${match.index}`}
          className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-[12px] border border-zinc-700/60"
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith("[") && token.includes("](")) {
      const label = token.substring(1, token.indexOf("]("));
      const rawUrl = token.substring(token.indexOf("](") + 2, token.length - 1);
      const safeUrl = sanitizeHref(rawUrl);
      const isExternal = safeUrl.startsWith("http");
      parts.push(
        <a
          key={`a-${match.index}`}
          href={safeUrl}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="text-zinc-100 underline decoration-zinc-500 underline-offset-2 hover:text-white hover:decoration-white font-medium transition-colors"
        >
          {label}
        </a>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < line.length) {
    parts.push(line.substring(lastIndex));
  }

  return parts;
}

/**
 * Standalone modern AI Canvas Chat Card component.
 * Modeled after Perplexity and Cursor conversational interfaces with clean dark layout,
 * inline user prompts, collapsible retrieval reasoning, and unboxed high-contrast AI answers.
 * @param {AIChatCardProps} props
 * @returns {JSX.Element}
 */
export function AIChatCard({
  title = "SalesGarners AI Concierge",
  subtitle = "Intent-Driven Demand Generation",
  greeting = "Welcome to SalesGarners!",
  prompt = "Ask anything about our B2B demand generation, publications, or claiming your free pilot.",
  prompts = DEFAULT_PROMPTS,
  autoType = true,
  placeholder = "Ask a follow up question…",
  onSend,
  onReset,
  onClose,
  onToggleExpand,
  isExpanded = false,
  messages = [],
  isLoading = false,
  className,
}: AIChatCardProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { margin: "-10% 0px" });

  const [userMessage, setUserMessage] = React.useState("");
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [feedback, setFeedback] = React.useState<Record<string, "up" | "down">>({});
  const [expandedSources, setExpandedSources] = React.useState<Record<string, boolean>>({});

  const { text: typedMessage } = useTypewriter(prompts, {
    typeMs: 48,
    deleteMs: 14,
    holdMs: 3400,
    gapMs: 900,
    enabled: autoType && inView && messages.length === 0 && !userMessage,
  });

  // Auto-scroll when new messages arrive
  React.useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const handleCopy = (id: string, text: string) => {
    if (typeof navigator !== "undefined" && navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const toggleFeedback = (id: string, type: "up" | "down") => {
    setFeedback((prev) => ({
      ...prev,
      [id]: prev[id] === type ? undefined! : type,
    }));
  };

  const toggleSources = (id: string) => {
    setExpandedSources((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSendMessage = (customPrompt?: string) => {
    const textToSend = (typeof customPrompt === "string" ? customPrompt : userMessage).trim();
    if (!textToSend || isLoading) return;

    onSend?.(textToSend);
    setUserMessage("");
    requestAnimationFrame(() => textareaRef.current?.focus());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Dynamic header title: uses the first user question if present, otherwise default title
  const displayTitle = messages.length > 0 && messages[0].role === "user"
    ? messages[0].content
    : title;

  return (
    <div
      ref={rootRef}
      className={cn(
        "flex w-full h-full flex-col rounded-[20px] bg-[#141416] text-zinc-100",
        "border border-zinc-800 shadow-[0_24px_70px_rgba(0,0,0,0.85),0_0_1px_1px_rgba(255,255,255,0.08)]",
        "overflow-hidden transition-all duration-200 select-text",
        className
      )}
    >
      {/* Minimal Header */}
      <div className="flex items-center justify-between gap-3 border-b border-zinc-800/80 px-5 py-3.5 bg-[#141416]">
        <div className="flex items-center gap-2.5 min-w-0 pr-2">
          <h3 className="text-[14.5px] font-semibold text-zinc-100 truncate">
            {displayTitle}
          </h3>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 shrink-0 text-zinc-400">
          <button
            type="button"
            onClick={() => {
              setUserMessage("");
              onReset?.();
            }}
            aria-label="New chat / reset"
            title="New chat / reset"
            className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              setUserMessage("");
              onReset?.();
            }}
            aria-label="New conversation"
            title="New conversation"
            className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
          >
            <PlusCircle className="h-4 w-4" />
          </button>

          {onToggleExpand && (
            <button
              type="button"
              onClick={onToggleExpand}
              aria-label={isExpanded ? "Collapse size" : "Expand size"}
              title={isExpanded ? "Collapse size" : "Expand size"}
              className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
            >
              {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
          )}

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close chat"
              title="Close chat"
              className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-zinc-800 hover:text-zinc-100 transition-colors ml-1"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Conversation Stream */}
      {messages.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center px-8 py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-800/90 text-zinc-300 border border-zinc-700/60 shadow-inner">
            <Sparkles className="h-6 w-6 text-zinc-200" />
          </div>
          <p className="mt-4 text-[18px] font-bold tracking-tight text-white">
            {greeting}
          </p>
          <p className="mt-2 max-w-[340px] text-[13.5px] leading-relaxed text-zinc-400">
            {prompt}
          </p>

          {/* Quick Suggestion Chips */}
          <div className="mt-6 flex flex-wrap gap-2 items-center justify-center max-w-[420px]">
            {[
              "Free Pilot Campaign",
              "Lead Gen Tiers (MQL/SQL)",
              "X-Engage Platform",
              "Book a Strategy Call",
            ].map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(chip)}
                className="text-[12.5px] font-medium px-3.5 py-1.5 rounded-full bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-300 hover:text-white border border-zinc-700/60 transition-colors hover:scale-[1.02] active:scale-[0.98]"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 scroll-smooth text-zinc-200">
          {messages.map((m, idx) =>
            m.role === "user" ? (
              <div key={m.id} className="pt-2">
                <div className="flex items-start gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700/60 mt-0.5">
                    <User className="h-4 w-4" />
                  </div>
                  <h4 className="text-[15.5px] font-semibold text-white leading-snug pt-0.5">
                    {m.content}
                  </h4>
                </div>
              </div>
            ) : (
              <div key={m.id} className="space-y-3">
                {/* Collapsible Retrieval Reasoning Accordion */}
                <div>
                  <button
                    type="button"
                    onClick={() => toggleSources(m.id)}
                    className="group inline-flex items-center gap-1.5 text-[12.5px] text-zinc-400 hover:text-zinc-200 transition-colors select-none py-0.5"
                  >
                    {expandedSources[m.id] ? (
                      <ChevronDown className="h-3.5 w-3.5 text-zinc-500 group-hover:text-zinc-300" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5 text-zinc-500 group-hover:text-zinc-300" />
                    )}
                    <span>Read up and searched SalesGarners knowledge base</span>
                  </button>

                  {/* Expanded Sources Chips */}
                  {expandedSources[m.id] && m.sources && m.sources.length > 0 && (
                    <div className="mt-2 pl-5 flex flex-wrap gap-2 animate-in fade-in-50 duration-150">
                      {m.sources.map((s, sIdx) => (
                        <a
                          key={sIdx}
                          href={sanitizeHref(s.url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11.5px] px-2.5 py-1 rounded bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/60 transition-colors"
                        >
                          <span>{s.title.split("-")[0].trim()}</span>
                          <ExternalLink className="h-2.5 w-2.5 text-zinc-500" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {/* AI Formatted Response Content */}
                <div className="text-[14.5px] leading-relaxed text-zinc-200 font-normal">
                  {m.content ? (
                    renderFormattedContent(m.content)
                  ) : (
                    <div className="flex items-center gap-2 py-2 text-zinc-400 text-xs">
                      <span className="h-2 w-2 rounded-full bg-zinc-400 animate-bounce [animation-delay:-0.3s]" />
                      <span className="h-2 w-2 rounded-full bg-zinc-400 animate-bounce [animation-delay:-0.15s]" />
                      <span className="h-2 w-2 rounded-full bg-zinc-400 animate-bounce" />
                      <span className="ml-1 text-[12.5px] text-zinc-400">Synthesizing verified demand generation data…</span>
                    </div>
                  )}
                </div>

                {/* Bottom Action Bar */}
                <div className="flex items-center gap-1 pt-1 text-zinc-500">
                  <button
                    type="button"
                    onClick={() => handleCopy(m.id, m.content)}
                    className="p-1.5 rounded hover:bg-zinc-800 hover:text-zinc-300 transition-colors"
                    title="Copy answer"
                    aria-label="Copy answer"
                  >
                    {copiedId === m.id ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleFeedback(m.id, "up")}
                    className={cn(
                      "p-1.5 rounded hover:bg-zinc-800 hover:text-zinc-300 transition-colors",
                      feedback[m.id] === "up" && "text-zinc-100 bg-zinc-800"
                    )}
                    title="Helpful"
                    aria-label="Helpful"
                  >
                    <ThumbsUp className="h-3.5 w-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleFeedback(m.id, "down")}
                    className={cn(
                      "p-1.5 rounded hover:bg-zinc-800 hover:text-zinc-300 transition-colors",
                      feedback[m.id] === "down" && "text-zinc-100 bg-zinc-800"
                    )}
                    title="Not helpful"
                    aria-label="Not helpful"
                  >
                    <ThumbsDown className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Faint divider between conversation turns */}
                {idx < messages.length - 1 && (
                  <div className="border-b border-zinc-800/60 pt-2" />
                )}
              </div>
            )
          )}

          {/* Loading state when awaiting first tokens */}
          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <div className="space-y-3 pt-2">
              <div className="inline-flex items-center gap-1.5 text-[12.5px] text-zinc-400 select-none py-0.5">
                <ChevronRight className="h-3.5 w-3.5 text-zinc-500 animate-pulse" />
                <span>Searching SalesGarners knowledge base & pgvector…</span>
              </div>
              <div className="flex items-center gap-2 py-2 text-zinc-400 text-xs">
                <span className="h-2 w-2 rounded-full bg-zinc-400 animate-bounce [animation-delay:-0.3s]" />
                <span className="h-2 w-2 rounded-full bg-zinc-400 animate-bounce [animation-delay:-0.15s]" />
                <span className="h-2 w-2 rounded-full bg-zinc-400 animate-bounce" />
                <span className="ml-1 text-[12.5px] text-zinc-400">Generating verified response…</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Floating Scroll to Latest Button */}
      {messages.length > 0 && (
        <div className="flex justify-center -mb-3.5 z-20 pointer-events-none">
          <button
            type="button"
            onClick={() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })}
            className="pointer-events-auto flex h-7 w-7 items-center justify-center rounded-full bg-[#1F1F22] border border-zinc-700/80 text-zinc-400 hover:text-white shadow-lg transition-transform hover:scale-105"
            title="Scroll to latest"
            aria-label="Scroll to latest"
          >
            <ArrowDown className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Input Composer */}
      <div className="p-4 pt-2 bg-[#141416] border-t border-zinc-800/70">
        <div className="rounded-2xl bg-[#1F1F22] border border-zinc-800/90 focus-within:border-zinc-700/90 p-3.5 transition-colors">
          <textarea
            ref={textareaRef}
            value={userMessage}
            onChange={(event) => setUserMessage(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={messages.length === 0 && autoType && typedMessage ? typedMessage : "Ask a follow up question…"}
            rows={2}
            className="w-full resize-none bg-transparent text-[14.5px] leading-relaxed text-zinc-100 placeholder:text-zinc-500 border-none outline-none ring-0 focus:outline-none focus:ring-0 min-h-[64px]"
            style={{ outline: "none", boxShadow: "none", border: "none" }}
          />
          <div className="mt-1 flex items-center justify-between">
            <span className="text-[11px] text-zinc-500 font-medium select-none">
              Press Enter ↵ to send
            </span>
            <button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={isLoading || !userMessage.trim()}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title="Send message"
              aria-label="Send message"
            >
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIChatCard;
