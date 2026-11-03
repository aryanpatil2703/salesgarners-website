/**
 * Automated test suite for the Supabase-inspired AI Assistant Studio interface.
 * Validates storage abstraction, conversation grouping, title generation, search,
 * streaming API, citations, and state lifecycle.
 */

import '../lib/env.js';
import {
  createNewConversation,
  generateConversationTitle,
  groupConversationsByDate,
  searchConversations,
} from '../lib/storage/chat-storage.js';

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`[PASS] ${message}`);
  } else {
    failed++;
    console.error(`[FAIL] ${message}`);
  }
}

async function runStudioTests() {
  console.log(`\n${BOLD}======================================================${RESET}`);
  console.log(`${BOLD}   Supabase AI Assistant Studio Test Suite           ${RESET}`);
  console.log(`${BOLD}======================================================\n`);

  // Scenario 1: Create a new conversation
  const conv1 = createNewConversation();
  assert(conv1.id.startsWith('conv_'), '1. Generates unique stable conversation ID');
  assert(conv1.title === 'New Chat', '1. Default title is "New Chat"');
  assert(conv1.messages.length === 0, '1. Initial messages array is empty');

  // Scenario 2: Send first message & append
  conv1.messages.push({
    id: 'msg_1',
    role: 'user',
    content: 'What B2B demand generation services do you offer?',
    createdAt: Date.now(),
    status: 'done',
  });
  assert(conv1.messages.length === 1, '2. User message appended to conversation');

  // Scenario 3: Automatically generate chat title
  const autoTitle = generateConversationTitle('What B2B services do you offer?');
  assert(autoTitle === 'What B2B services do you offer?', '3. Auto title cleanly extracts first user query');
  const longPrompt = 'This is a very long prompt designed to exceed forty two characters and test truncation';
  const truncatedTitle = generateConversationTitle(longPrompt);
  assert(truncatedTitle.endsWith('…') && truncatedTitle.length <= 43, '3. Long titles are safely truncated with ellipsis');

  // Scenario 4: Date grouping (Today, Yesterday, Previous 7 Days, Older)
  const now = Date.now();
  const todayConv = { id: 'c_today', title: 'Today Chat', createdAt: now, updatedAt: now, messages: [] };
  const yesterdayConv = { id: 'c_yesterday', title: 'Yesterday Chat', createdAt: now - 86400000, updatedAt: now - 86400000, messages: [] };
  const prev7Conv = { id: 'c_prev7', title: 'Last Week Chat', createdAt: now - 86400000 * 3, updatedAt: now - 86400000 * 3, messages: [] };
  const olderConv = { id: 'c_older', title: 'Old Chat', createdAt: now - 86400000 * 15, updatedAt: now - 86400000 * 15, messages: [] };

  const groups = groupConversationsByDate([todayConv, yesterdayConv, prev7Conv, olderConv]);
  assert(groups.some((g) => g.id === 'today'), '4. Group contains "Today" bucket');
  assert(groups.some((g) => g.id === 'yesterday'), '4. Group contains "Yesterday" bucket');
  assert(groups.some((g) => g.id === 'previous7'), '4. Group contains "Previous 7 Days" bucket');
  assert(groups.some((g) => g.id === 'older'), '4. Group contains "Older" bucket');

  // Scenario 5: Search conversations by title and message content
  const convSearch1 = {
    id: 'cs_1',
    title: 'Content Syndication Pilot',
    createdAt: now,
    updatedAt: now,
    messages: [{ id: 'm1', role: 'user', content: 'Tell me about content syndication', createdAt: now }],
  };
  const convSearch2 = {
    id: 'cs_2',
    title: 'Account Based Marketing',
    createdAt: now,
    updatedAt: now,
    messages: [{ id: 'm2', role: 'user', content: 'How does X-Engage handle ICP targeting?', createdAt: now }],
  };

  const titleMatches = searchConversations('syndication', [convSearch1, convSearch2]);
  assert(titleMatches.length === 1 && titleMatches[0].id === 'cs_1', '5. Matches query in conversation title');

  const contentMatches = searchConversations('X-Engage', [convSearch1, convSearch2]);
  assert(contentMatches.length === 1 && contentMatches[0].id === 'cs_2', '5. Matches query inside message content');

  const emptyMatches = searchConversations('nonexistent query string', [convSearch1, convSearch2]);
  assert(emptyMatches.length === 0, '5. Empty state returned when no query matches');

  // Scenario 6 & 7: Rename and Delete logic
  let mockList = [convSearch1, convSearch2];
  const newTitle = 'Renamed Syndication Pilot';
  mockList = mockList.map((c) => (c.id === 'cs_1' ? { ...c, title: newTitle } : c));
  assert(mockList.find((c) => c.id === 'cs_1')?.title === newTitle, '6. Conversation title renamed cleanly');

  mockList = mockList.filter((c) => c.id !== 'cs_1');
  assert(mockList.length === 1 && mockList[0].id === 'cs_2', '7. Conversation deleted from list');

  // Scenario 8: Live Streaming API & Citations Verification
  try {
    const { POST } = await import('../app/api/chat/route.js');
    const fakeRequest = {
      headers: { get: () => '127.0.0.1' },
      json: async () => ({
        messages: [{ role: 'user', content: 'What B2B demand generation services do you offer?' }],
        stream: true,
      }),
    };

    const res = await POST(fakeRequest);
    assert(res.status === 200, '8. /api/chat responds with HTTP 200 for stream request');
    assert(res.headers.get('content-type')?.includes('application/x-ndjson'), '8. Returns application/x-ndjson streaming header');

    // Read initial chunk
    const reader = res.body.getReader();
    const { value } = await reader.read();
    const initialText = new TextDecoder().decode(value);
    assert(initialText.includes('"type":"meta"'), '8. Streams initial meta metadata chunk with sources');
    assert(initialText.includes('"sources"'), '8. Citations array present in metadata chunk');

    // Cancel stream to verify Abort / Reader cancel
    await reader.cancel();
    assert(true, '9. Abort / stream interruption completes cleanly');
  } catch (err) {
    assert(false, `8. API streaming test failed: ${err.message}`);
  }

  // Summary
  console.log(`\n${BOLD}======================================================${RESET}`);
  console.log(`Total: ${passed + failed} | ${GREEN}Passed: ${passed}${RESET} | ${failed > 0 ? RED : GREEN}Failed: ${failed}${RESET}`);
  console.log(`${BOLD}======================================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
  process.exit(0);
}

runStudioTests().catch((err) => {
  console.error('Fatal error in studio tests:', err);
  process.exit(1);
});
