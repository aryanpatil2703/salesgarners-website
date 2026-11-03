export interface MessageCitation {
  title: string;
  url: string;
  category?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: number;
  sources?: MessageCitation[];
  status?: 'sending' | 'streaming' | 'done' | 'error';
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: Message[];
}

export type GroupTimeframe = 'today' | 'yesterday' | 'previous7' | 'older';

export interface ConversationGroup {
  id: GroupTimeframe;
  label: string;
  conversations: Conversation[];
}

export function generateConversationTitle(promptText: string): string;
export function getStoredConversations(): Conversation[];
export function saveStoredConversations(conversations: Conversation[]): void;
export function getActiveConversationId(): string | null;
export function setActiveConversationId(id: string | null): void;
export function createNewConversation(title?: string): Conversation;
export function upsertConversation(conversation: Conversation): Conversation[];
export function renameConversation(id: string, newTitle: string): Conversation[];
export function deleteConversation(id: string): { conversations: Conversation[]; nextActiveId: string | null };
export function groupConversationsByDate(conversations: Conversation[]): ConversationGroup[];
export function searchConversations(query: string, conversations: Conversation[]): Conversation[];

