import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { Conversation } from '../../types/chat';
import { chatsReducer, createInitialState, MAX_PINNED, selectChatList } from './chatsState';

const conversation = (id: string, lastMessageAt = 0): Conversation => ({
  id,
  name: id,
  lastMessage: '',
  lastMessageAt,
  unreadCount: 0,
});

const four = ['a', 'b', 'c', 'd'].map((id, index) => conversation(id, index));

test('cannot pin more than the limit', () => {
  let state = createInitialState(four, [], {});
  for (const id of ['a', 'b', 'c', 'd']) state = chatsReducer(state, { type: 'pin', id });
  assert.equal(state.pinnedIds.length, MAX_PINNED);
  assert.deepEqual(state.pinnedIds, ['a', 'b', 'c']);
});

test('pinned chats come first, the rest newest first', () => {
  const state = createInitialState(four, ['a'], {});
  const ids = selectChatList(state).map((item) => item.conversation.id);
  assert.deepEqual(ids, ['a', 'd', 'c', 'b']);
});

test('sending adds the message and updates the preview', () => {
  const start = createInitialState([conversation('a')], [], { a: [] });
  const next = chatsReducer(start, {
    type: 'send',
    conversationId: 'a',
    messageId: 'm1',
    text: 'hello',
    sentAt: 5,
  });
  assert.equal(next.conversations[0]?.lastMessage, 'hello');
  assert.equal(next.messages['a']?.length, 1);
});

test('deleting the last message restores the previous preview', () => {
  let state = createInitialState([conversation('a')], [], { a: [] });
  state = chatsReducer(state, { type: 'send', conversationId: 'a', messageId: 'm1', text: 'one', sentAt: 1 });
  state = chatsReducer(state, { type: 'send', conversationId: 'a', messageId: 'm2', text: 'two', sentAt: 2 });
  state = chatsReducer(state, { type: 'deleteMessage', conversationId: 'a', messageId: 'm2' });
  assert.equal(state.conversations[0]?.lastMessage, 'one');
});

test('reacting twice with the same emoji removes the reaction', () => {
  let state = createInitialState([conversation('a')], [], { a: [] });
  state = chatsReducer(state, { type: 'send', conversationId: 'a', messageId: 'm1', text: 'hi', sentAt: 1 });
  state = chatsReducer(state, { type: 'react', conversationId: 'a', messageId: 'm1', emoji: '👍' });
  assert.equal(state.messages['a']?.[0]?.reaction, '👍');
  state = chatsReducer(state, { type: 'react', conversationId: 'a', messageId: 'm1', emoji: '👍' });
  assert.equal(state.messages['a']?.[0]?.reaction, undefined);
});

test('leaving a group removes it and its pin', () => {
  let state = createInitialState([], [], {});
  state = chatsReducer(state, {
    type: 'createGroup',
    id: 'g1',
    name: 'Group',
    members: [{ id: 'x', name: 'X' }],
    now: 1,
  });
  state = chatsReducer(state, { type: 'pin', id: 'g1' });
  state = chatsReducer(state, { type: 'leaveGroup', id: 'g1' });
  assert.equal(state.conversations.length, 0);
  assert.equal(state.pinnedIds.length, 0);
});
