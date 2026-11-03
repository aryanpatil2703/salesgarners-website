"use client";

import * as React from "react";
import {
  RotateCcw,
  Maximize2,
  Minimize2,
  X,
  ArrowDown,
  Sparkles,
} from "lucide-react";
import { Message } from "@/lib/chat-types";
import { ChatMessage } from "./ChatMessage";
import { ChatComposer } from "./ChatComposer";
import { cn } from "@/lib/utils";

export interface ChatStudioProps {
  onClose?: () => void;
  onToggleExpand?: () => void;
  isExpanded?: boolean;
  className?: string;
}

const STARTER_PROMPTS = [
  "What B2B demand generation services do you offer?",
  "How does the Free Pilot Campaign work for content syndication?",
  "Tell me about the proprietary X-Engage intent platform",
  "What lead qualification tiers do you deliver (MQL, SQL, HQL)?",
];

/**
 * Modern In-Memory AI Chat Assistant Interface.
 * Operates entirely in-memory with zero localStorage persistence for anonymous visitors.
 * Features real-time NDJSON streaming, unboxed conversational presentation, collapsible citations,
 * and AbortController request cancellation.
 * @param {ChatStudioProps} props
 * @returns {JSX.Element}
 */
export function ChatStudio({ onClose, onToggleExpand, isExpanded = false, className }: ChatStudioProps) {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [currentInput, setCurrentInput] = React.useState("");
  const [isStreaming, setIsStreaming] = React.useState(false);
  const [feedbackState, setFeedbackState] = React.useState<Record<string, "up" | "down">>({});

  const abortControllerRef = React.useRef<AbortController | null>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [showScrollBottom, setShowScrollBottom] = React.useState(false);

  // Track scroll position to conditionally render the scroll-to-bottom button
  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollBottom(distanceToBottom > 120);
  };

  // Auto-scroll on incoming stream updates
  React.useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isStreaming]);

  /**
   * Clears the current conversation and resets in-memory state.
   */
  const handleResetChat = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
    }
    setMessages([]);
    setCurrentInput("");
  };

  /**
   * Stops active streaming response via AbortController.
   */
  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
    }
  };

  /**
   * Dispatches user message to /api/chat and handles real-time token streaming.
   * @param {string} text - Message text to send
   */
  const handleSendMessage = async (text: string) => {
    if (!text || isStreaming) return;

    const userMsgId = `user_${Date.now()}`;
    const assistantMsgId = `assistant_${Date.now() + 1}`;

    const userMessage: Message = {
      id: userMsgId,
      role: "user",
      content: text,
      createdAt: Date.now(),
      status: "done",
    };

    const initialAssistantMessage: Message = {
      id: assistantMsgId,
      role: "assistant",
      content: "",
      createdAt: Date.now(),
      sources: [],
      status: "streaming",
    };

    const updatedMessages = [...messages, userMessage, initialAssistantMessage];
    setMessages(updatedMessages);
    setCurrentInput("");
    setIsStreaming(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          messages: updatedMessages
            .filter((m) => m.id !== assistantMsgId)
            .map((m) => ({ role: m.role, content: m.content })),
          stream: true,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const contentType = res.headers.get("content-type") || "";

      if (contentType.includes("application/x-ndjson") && res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;

            try {
              const item = JSON.parse(trimmed);
              if (item.type === "meta") {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMsgId ? { ...m, sources: item.sources || [] } : m
                  )
                );
              } else if (item.type === "token") {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMsgId ? { ...m, content: m.content + item.content } : m
                  )
                );
              } else if (item.type === "error") {
                throw new Error(item.error || "Streaming error encountered");
              }
            } catch {
              // Ignore partial JSON parse errors during chunk boundaries
            }
          }
        }
      } else {
        const data = await res.json();
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? {
                  ...m,
                  content: data.message || "No response received.",
                  sources: data.sources || [],
                  status: "done",
                }
              : m
          )
        );
      }

      // Mark final assistant message as done
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsgId ? { ...m, status: "done" as const } : m
        )
      );
    } catch (err: any) {
      if (err.name === "AbortError") {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? {
                  ...m,
                  content: m.content ? m.content + " [Stopped]" : "Generation stopped.",
                  status: "done" as const,
                }
              : m
          )
        );
      } else {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? {
                  ...m,
                  content: `⚠️ ${err.message || "Unable to reach SalesGarners AI."} Please contact info@salesgarners.com or book a call at https://calendly.com/salesgarners.`,
                  status: "error" as const,
                }
              : m
          )
        );
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  /**
   * Regenerates the last assistant response.
   */
  const handleRegenerateLast = () => {
    if (isStreaming || messages.length === 0) return;
    const lastUserIndex = [...messages].reverse().findIndex((m) => m.role === "user");
    if (lastUserIndex < 0) return;

    const actualUserIndex = messages.length - 1 - lastUserIndex;
    const lastUserPrompt = messages[actualUserIndex].content;

    // Prune back to user prompt
    const pruned = messages.slice(0, actualUserIndex);
    setMessages(pruned);

    // Resend
    handleSendMessage(lastUserPrompt);
  };

  const handleFeedback = (messageId: string, type: "up" | "down") => {
    setFeedbackState((prev) => ({
      ...prev,
      [messageId]: prev[messageId] === type ? undefined! : type,
    }));
  };

  // Header display title: reflects current inquiry or default
  const displayTitle =
    messages.length > 0 && messages[0].role === "user"
      ? messages[0].content
      : "SalesGarners AI Concierge";

  return (
    <div
      className={cn(
        "flex flex-col w-full h-full rounded-[20px] bg-[#141416] text-zinc-100",
        "border border-zinc-800 shadow-[0_24px_70px_rgba(0,0,0,0.85),0_0_1px_1px_rgba(255,255,255,0.08)]",
        "overflow-hidden select-text relative",
        className
      )}
    >
      {/* Minimal Header Bar */}
      <header className="flex items-center justify-between gap-3 border-b border-zinc-800/80 px-4 py-3 bg-[#141416] shrink-0">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <h3 className="text-[14px] font-semibold text-zinc-100 truncate">
            {displayTitle}
          </h3>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-1 shrink-0 text-zinc-400">
          <button
            type="button"
            onClick={handleResetChat}
            aria-label="New chat"
            title="New chat"
            className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          {onToggleExpand && (
            <button
              type="button"
              onClick={onToggleExpand}
              aria-label={isExpanded ? "Collapse view" : "Expand view"}
              title={isExpanded ? "Collapse view" : "Expand view"}
              className="hidden sm:flex h-7 w-7 items-center justify-center rounded-md hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
            >
              {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
          )}

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close assistant"
              title="Close assistant"
              className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-zinc-800 hover:text-zinc-100 transition-colors ml-0.5"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </header>

      {/* Main Conversation Stream */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-5 scroll-smooth text-zinc-200"
      >
        {messages.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center py-10 px-3 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-800/90 text-zinc-300 border border-zinc-700/60 shadow-inner">
              <Sparkles className="h-5 w-5 text-zinc-200" />
            </div>
            <h2 className="mt-3.5 text-[17px] font-bold tracking-tight text-white">
              SalesGarners AI Concierge
            </h2>
            <p className="mt-1.5 max-w-[320px] text-[13px] leading-relaxed text-zinc-400">
              Ask anything about our B2B demand generation, proprietary X-Engage intent platform, or claiming your free pilot.
            </p>

            {/* Starter Prompt Cards */}
            <div className="mt-6 flex flex-col gap-2 max-w-sm w-full text-left">
              {STARTER_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(prompt)}
                  className="px-3.5 py-2.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800/90 border border-zinc-800 hover:border-zinc-700/80 text-[12.5px] text-zinc-300 hover:text-white transition-all text-left leading-snug"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m) => (
            <ChatMessage
              key={m.id}
              message={m}
              isStreaming={isStreaming && m.status === "streaming"}
              onRegenerate={m.role === "assistant" ? handleRegenerateLast : undefined}
              onFeedback={handleFeedback}
              currentFeedback={feedbackState[m.id]}
            />
          ))
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Composer Section with Floating Scroll-to-Bottom Indicator strictly above border */}
      <div className="relative shrink-0">
        {showScrollBottom && (
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
            <button
              type="button"
              onClick={() => {
                messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
                setShowScrollBottom(false);
              }}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1F1F22] border border-zinc-700/90 text-zinc-300 hover:text-white shadow-xl hover:scale-105 transition-transform"
              title="Scroll to latest message"
              aria-label="Scroll to latest message"
            >
              <ArrowDown className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        <ChatComposer
          value={currentInput}
          onChange={setCurrentInput}
          onSend={handleSendMessage}
          onStop={handleStopGeneration}
          isStreaming={isStreaming}
        />
      </div>
    </div>
  );
}

export default ChatStudio;
