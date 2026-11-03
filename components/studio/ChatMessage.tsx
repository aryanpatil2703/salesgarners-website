"use client";

import * as React from "react";
import {
  User,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Copy,
  Check,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  AlertCircle
} from "lucide-react";
import { Message, MessageCitation } from "@/lib/storage/chat-storage";
import { cn } from "@/lib/utils";

export interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean;
  onCopy?: (text: string) => void;
  onRegenerate?: () => void;
  onFeedback?: (messageId: string, type: "up" | "down") => void;
  currentFeedback?: "up" | "down";
}

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
 * Formats inline Markdown tokens: **bold**, `code`, and [link text](url)
 * @param {string} text - Raw single-line text
 * @returns {React.ReactNode[]} Array of formatted JSX elements
 */
function formatInlineTokens(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
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

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
}

/**
 * High-performance Markdown parser supporting code blocks, ordered lists, bullets, and paragraphs.
 * @param {string} raw - Markdown string
 * @returns {React.ReactNode[]} Array of rendered virtual DOM nodes
 */
function renderMarkdown(raw: string): React.ReactNode[] {
  if (!raw) return [];

  const lines = raw.split("\n");
  const nodes: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let codeLang = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code block boundary
    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        // Closing code block
        const codeContent = codeBuffer.join("\n");
        nodes.push(
          <div key={`codeblock-${i}`} className="my-3 rounded-lg overflow-hidden border border-zinc-800 bg-[#0E0E10]">
            {codeLang && (
              <div className="flex items-center justify-between px-3.5 py-1.5 bg-zinc-900/90 border-b border-zinc-800 text-[11px] font-mono text-zinc-400">
                <span>{codeLang}</span>
              </div>
            )}
            <pre className="p-3.5 text-[12.5px] font-mono text-zinc-200 overflow-x-auto leading-relaxed">
              <code>{codeContent}</code>
            </pre>
          </div>
        );
        inCodeBlock = false;
        codeBuffer = [];
        codeLang = "";
      } else {
        inCodeBlock = true;
        codeLang = line.trim().replace(/^```/, "").trim();
        codeBuffer = [];
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    const trimmed = line.trim();
    if (!trimmed) {
      nodes.push(<div key={`sp-${i}`} className="h-2" />);
      continue;
    }

    // Numbered list item: "1. ", "2. ", etc.
    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (numMatch) {
      nodes.push(
        <div key={`num-${i}`} className="flex items-start gap-2.5 my-1 pl-0.5">
          <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-zinc-800 text-[11px] font-bold text-zinc-300 border border-zinc-700/60 mt-0.5 select-none">
            {numMatch[1]}
          </span>
          <div className="text-[14.5px] leading-relaxed text-zinc-200 flex-1">
            {formatInlineTokens(numMatch[2])}
          </div>
        </div>
      );
      continue;
    }

    // Bullet items: "• ", "- ", "* "
    if (trimmed.startsWith("•") || trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const cleanLine = trimmed.replace(/^([•\-*]\s*)/, "");
      nodes.push(
        <div key={`bullet-${i}`} className="flex items-start gap-2.5 my-1 pl-1">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-zinc-400 mt-2 shrink-0" />
          <div className="text-[14.5px] leading-relaxed text-zinc-200 flex-1">
            {formatInlineTokens(cleanLine)}
          </div>
        </div>
      );
      continue;
    }

    // Standard paragraph
    nodes.push(
      <p key={`p-${i}`} className="my-1.5 text-[14.5px] leading-relaxed text-zinc-200">
        {formatInlineTokens(trimmed)}
      </p>
    );
  }

  return nodes;
}

/**
 * Message component representing either a user prompt or an assistant answer.
 * @param {ChatMessageProps} props
 * @returns {JSX.Element}
 */
export function ChatMessage({
  message,
  isStreaming = false,
  onCopy,
  onRegenerate,
  onFeedback,
  currentFeedback,
}: ChatMessageProps) {
  const [sourcesOpen, setSourcesOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator?.clipboard) {
      navigator.clipboard.writeText(message.content);
      setCopied(true);
      onCopy?.(message.content);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (message.role === "user") {
    return (
      <div className="py-2 animate-in fade-in-50 duration-150">
        <div className="flex items-start gap-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700/60 mt-0.5 shadow-xs">
            <User className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-[15.5px] font-semibold text-white leading-snug pt-0.5 break-words">
              {message.content}
            </h4>
          </div>
        </div>
      </div>
    );
  }

  const isError = message.status === "error";

  return (
    <div className="py-2 space-y-2.5 animate-in fade-in-50 duration-200">
      {/* Collapsible Retrieval Reasoning Accordion */}
      {message.sources && message.sources.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() => setSourcesOpen(!sourcesOpen)}
            className="group inline-flex items-center gap-1.5 text-[12.5px] text-zinc-400 hover:text-zinc-200 transition-colors select-none py-0.5"
          >
            {sourcesOpen ? (
              <ChevronDown className="h-3.5 w-3.5 text-zinc-500 group-hover:text-zinc-300" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 text-zinc-500 group-hover:text-zinc-300" />
            )}
            <span>Read up and searched SalesGarners knowledge base</span>
          </button>

          {sourcesOpen && (
            <div className="mt-2 pl-5 flex flex-wrap gap-2 animate-in fade-in-50 duration-150">
              {message.sources.map((s, idx) => (
                <a
                  key={idx}
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
      )}

      {/* Main Formatted Response */}
      <div className="text-[14.5px] leading-relaxed text-zinc-200 font-normal">
        {isError ? (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 text-rose-300 text-[13px]">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-400" />
            <div>
              <p className="font-medium">{message.content || "An error occurred while generating a response."}</p>
              {onRegenerate && (
                <button
                  type="button"
                  onClick={onRegenerate}
                  className="mt-2 inline-flex items-center gap-1 text-[12px] font-medium text-rose-200 underline hover:text-white"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Retry query</span>
                </button>
              )}
            </div>
          </div>
        ) : message.content ? (
          renderMarkdown(message.content)
        ) : (
          <div className="flex items-center gap-2 py-2 text-zinc-400 text-xs">
            <span className="h-2 w-2 rounded-full bg-zinc-400 animate-bounce [animation-delay:-0.3s]" />
            <span className="h-2 w-2 rounded-full bg-zinc-400 animate-bounce [animation-delay:-0.15s]" />
            <span className="h-2 w-2 rounded-full bg-zinc-400 animate-bounce" />
            <span className="ml-1 text-[12.5px] text-zinc-400">Synthesizing verified demand generation data…</span>
          </div>
        )}
      </div>

      {/* Action Toolbar */}
      {!isStreaming && message.content && !isError && (
        <div className="flex items-center gap-1 pt-1 text-zinc-500">
          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 rounded hover:bg-zinc-800 hover:text-zinc-300 transition-colors"
            title="Copy answer"
            aria-label="Copy answer"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          </button>

          {onRegenerate && (
            <button
              type="button"
              onClick={onRegenerate}
              className="p-1.5 rounded hover:bg-zinc-800 hover:text-zinc-300 transition-colors"
              title="Regenerate response"
              aria-label="Regenerate response"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          )}

          {onFeedback && (
            <>
              <button
                type="button"
                onClick={() => onFeedback(message.id, "up")}
                className={cn(
                  "p-1.5 rounded hover:bg-zinc-800 hover:text-zinc-300 transition-colors",
                  currentFeedback === "up" && "text-zinc-100 bg-zinc-800"
                )}
                title="Helpful"
                aria-label="Helpful"
              >
                <ThumbsUp className="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                onClick={() => onFeedback(message.id, "down")}
                className={cn(
                  "p-1.5 rounded hover:bg-zinc-800 hover:text-zinc-300 transition-colors",
                  currentFeedback === "down" && "text-zinc-100 bg-zinc-800"
                )}
                title="Not helpful"
                aria-label="Not helpful"
              >
                <ThumbsDown className="h-3.5 w-3.5" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default ChatMessage;

