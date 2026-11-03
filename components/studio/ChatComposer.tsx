"use client";

import * as React from "react";
import { ArrowUp, Square } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ChatComposerProps {
  value: string;
  onChange: (val: string) => void;
  onSend: (text: string) => void;
  onStop?: () => void;
  isStreaming?: boolean;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
}

const MAX_CHAR_LIMIT = 1500;

/**
 * Auto-growing message input composer with dynamic height, keyboard dispatch, and streaming interruption.
 * @param {ChatComposerProps} props
 * @returns {JSX.Element}
 */
export function ChatComposer({
  value,
  onChange,
  onSend,
  onStop,
  isStreaming = false,
  disabled = false,
  placeholder = "Ask a follow up question…",
  maxLength = MAX_CHAR_LIMIT,
}: ChatComposerProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea height to fit multiline input up to 160px
  React.useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isStreaming && value.trim() && !disabled) {
        onSend(value.trim());
      }
    }
  };

  const handleSendClick = () => {
    if (isStreaming && onStop) {
      onStop();
      return;
    }
    if (value.trim() && !disabled) {
      onSend(value.trim());
    }
  };

  const isOverLimit = value.length > maxLength;
  const canSend = !disabled && (isStreaming || (value.trim().length > 0 && !isOverLimit));

  return (
    <div className="p-4 pt-2 bg-[#141416] border-t border-zinc-800/70">
      <div
        className={cn(
          "relative rounded-2xl bg-[#1F1F22] border p-3.5 transition-colors",
          isOverLimit
            ? "border-rose-500/80 focus-within:border-rose-500"
            : "border-zinc-800/90 focus-within:border-zinc-700/90"
        )}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          disabled={disabled && !isStreaming}
          className="w-full resize-none bg-transparent text-[14.5px] leading-relaxed text-zinc-100 placeholder:text-zinc-500 border-none outline-none ring-0 focus:outline-none focus:ring-0 min-h-[56px] max-h-[160px]"
          style={{ outline: "none", boxShadow: "none", border: "none" }}
        />

        <div className="mt-1 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] text-zinc-500 font-medium select-none">
            <span>Press Enter ↵ to send, Shift+Enter for new line</span>
            {value.length > 500 && (
              <span className={cn(isOverLimit ? "text-rose-400 font-bold" : "text-zinc-500")}>
                ({value.length}/{maxLength})
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleSendClick}
            disabled={!canSend}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full transition-colors",
              isStreaming
                ? "bg-rose-500 hover:bg-rose-600 text-white"
                : "bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            )}
            title={isStreaming ? "Stop generating" : "Send message"}
            aria-label={isStreaming ? "Stop generating" : "Send message"}
          >
            {isStreaming ? <Square className="h-3 w-3 fill-current" /> : <ArrowUp className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatComposer;

