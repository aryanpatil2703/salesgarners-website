/**
 * @fileoverview Chat interface data structures and citation types.
 * Decoupled from storage implementations for resilient compilation across build environments.
 */

export interface MessageCitation {
  title: string;
  url: string;
  category?: string;
}

export type MessageRole = "user" | "assistant" | "system";

export type MessageStatus = "sending" | "streaming" | "done" | "error";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: number;
  sources?: MessageCitation[];
  status?: MessageStatus;
}

