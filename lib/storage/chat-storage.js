/**
 * Storage and state abstraction for Supabase Studio-inspired AI Chat conversations.
 * Persists conversations and messages in browser localStorage with robust schema validation.
 */

const STORAGE_KEY_CONVERSATIONS = 'sg_studio_conversations';
const STORAGE_KEY_ACTIVE_ID = 'sg_studio_active_conversation_id';

/**
 * Checks whether browser localStorage is accessible in the current runtime environment.
 * @returns {boolean} True if localStorage can be safely read and written
 */
function isLocalStorageAvailable() {
  if (typeof window === 'undefined') return false;
  try {
    const testKey = '__sg_storage_probe__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Generates a clean human-readable conversation title from the initial user prompt.
 * @param {string} promptText - Raw user query
 * @returns {string} Truncated clean title
 */
export function generateConversationTitle(promptText) {
  if (!promptText) return 'New Conversation';
  const clean = promptText.trim().replace(/\s+/g, ' ');
  if (clean.length <= 42) return clean;
  return clean.substring(0, 42).trim() + '…';
}

/**
 * Safely parses and validates conversation records from localStorage.
 * Handles corrupt data gracefully by falling back to an empty array without crashing.
 * @returns {Array<object>} List of validated conversations, sorted by last activity
 */
export function getStoredConversations() {
  if (!isLocalStorageAvailable()) return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_CONVERSATIONS);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Filter and validate shape
    const validated = parsed.filter((c) => {
      return (
        c &&
        typeof c.id === 'string' &&
        typeof c.title === 'string' &&
        typeof c.createdAt === 'number' &&
        typeof c.updatedAt === 'number' &&
        Array.isArray(c.messages)
      );
    });

    // Sort descending by last activity (updatedAt)
    return validated.sort((a, b) => b.updatedAt - a.updatedAt);
  } catch (err) {
    console.warn('[ChatStorage] Failed to parse stored conversations, resetting gracefully:', err);
    return [];
  }
}

/**
 * Persists an array of conversations into localStorage.
 * @param {Array<object>} conversations - List of conversations to save
 */
export function saveStoredConversations(conversations) {
  if (!isLocalStorageAvailable()) return;

  try {
    window.localStorage.setItem(STORAGE_KEY_CONVERSATIONS, JSON.stringify(conversations));
  } catch (err) {
    console.error('[ChatStorage] Failed to save conversations to localStorage:', err);
  }
}

/**
 * Retrieves the currently active conversation ID from storage.
 * @returns {string | null} Active conversation ID or null
 */
export function getActiveConversationId() {
  if (!isLocalStorageAvailable()) return null;
  return window.localStorage.getItem(STORAGE_KEY_ACTIVE_ID);
}

/**
 * Persists the active conversation ID.
 * @param {string | null} id - Active conversation ID or null
 */
export function setActiveConversationId(id) {
  if (!isLocalStorageAvailable()) return;
  if (!id) {
    window.localStorage.removeItem(STORAGE_KEY_ACTIVE_ID);
  } else {
    window.localStorage.setItem(STORAGE_KEY_ACTIVE_ID, id);
  }
}

/**
 * Creates a new in-memory conversation instance.
 * Note: Empty conversations are not automatically saved to localStorage until first message is sent.
 * @param {string} [title] - Optional initial title
 * @returns {object} Initialized conversation
 */
export function createNewConversation(title) {
  const now = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return {
    id: `conv_${now}_${randomSuffix}`,
    title: title || 'New Chat',
    createdAt: now,
    updatedAt: now,
    messages: [],
  };
}

/**
 * Upserts a conversation into storage and sets it as the active conversation.
 * @param {object} conversation - Conversation to upsert
 * @returns {Array<object>} Updated conversation list
 */
export function upsertConversation(conversation) {
  const current = getStoredConversations();
  const index = current.findIndex((c) => c.id === conversation.id);

  let updatedList;
  if (index >= 0) {
    updatedList = [...current];
    updatedList[index] = { ...conversation, updatedAt: Date.now() };
  } else {
    updatedList = [conversation, ...current];
  }

  // Sort by updatedAt descending
  updatedList.sort((a, b) => b.updatedAt - a.updatedAt);
  saveStoredConversations(updatedList);
  setActiveConversationId(conversation.id);
  return updatedList;
}

/**
 * Renames an existing conversation title.
 * @param {string} id - Conversation ID
 * @param {string} newTitle - New title string
 * @returns {Array<object>} Updated conversation list
 */
export function renameConversation(id, newTitle) {
  const current = getStoredConversations();
  const updated = current.map((c) => {
    if (c.id === id) {
      return { ...c, title: newTitle.trim() || 'Untitled Chat', updatedAt: Date.now() };
    }
    return c;
  });
  saveStoredConversations(updated);
  return updated;
}

/**
 * Deletes a conversation from storage and adjusts the active conversation if necessary.
 * @param {string} id - Conversation ID to remove
 * @returns {{ conversations: Array<object>, nextActiveId: string | null }}
 */
export function deleteConversation(id) {
  const current = getStoredConversations();
  const updated = current.filter((c) => c.id !== id);
  saveStoredConversations(updated);

  const activeId = getActiveConversationId();
  let nextActiveId = activeId;

  if (activeId === id) {
    nextActiveId = updated.length > 0 ? updated[0].id : null;
    setActiveConversationId(nextActiveId);
  }

  return { conversations: updated, nextActiveId };
}

/**
 * Groups conversations into calendar buckets (Today, Yesterday, Previous 7 Days, Older)
 * using the user's local timezone.
 * @param {Array<object>} conversations - List of conversations
 * @returns {Array<{ id: string, label: string, conversations: Array<object> }>} Array of non-empty conversation groups
 */
export function groupConversationsByDate(conversations) {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfYesterday = startOfToday - 24 * 60 * 60 * 1000;
  const startOf7Days = startOfToday - 7 * 24 * 60 * 60 * 1000;

  const todayList = [];
  const yesterdayList = [];
  const previous7List = [];
  const olderList = [];

  for (const conv of conversations) {
    const timestamp = conv.updatedAt || conv.createdAt;
    if (timestamp >= startOfToday) {
      todayList.push(conv);
    } else if (timestamp >= startOfYesterday) {
      yesterdayList.push(conv);
    } else if (timestamp >= startOf7Days) {
      previous7List.push(conv);
    } else {
      olderList.push(conv);
    }
  }

  const groups = [];
  if (todayList.length > 0) {
    groups.push({ id: 'today', label: 'Today', conversations: todayList });
  }
  if (yesterdayList.length > 0) {
    groups.push({ id: 'yesterday', label: 'Yesterday', conversations: yesterdayList });
  }
  if (previous7List.length > 0) {
    groups.push({ id: 'previous7', label: 'Previous 7 Days', conversations: previous7List });
  }
  if (olderList.length > 0) {
    groups.push({ id: 'older', label: 'Older', conversations: olderList });
  }

  return groups;
}

/**
 * Performs case-insensitive search across conversation titles and message content.
 * @param {string} query - Search term
 * @param {Array<object>} conversations - Conversation list
 * @returns {Array<object>} Filtered conversations matching the search query
 */
export function searchConversations(query, conversations) {
  const term = query.trim().toLowerCase();
  if (!term) return conversations;

  return conversations.filter((conv) => {
    if (conv.title.toLowerCase().includes(term)) return true;
    return conv.messages.some((m) => m.content && m.content.toLowerCase().includes(term));
  });
}

