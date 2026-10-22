import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { Conversation } from '../../types/chat';
import {
  chatsReducer,
  createInitialState,
  MAX_PINNED,
  selectArchived,
  selectBlocked,
  selectRestricted,
  selectChatList,
} from './chatsState';

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

test('archiving hides a chat from the list and unpins it', () => {
  let state = createInitialState(four, ['a'], {});
  state = chatsReducer(state, { type: 'archive', id: 'a' });
  assert.equal(selectChatList(state).some((item) => item.conversation.id === 'a'), false);
  assert.equal(state.pinnedIds.length, 0);
  assert.equal(selectArchived(state).length, 1);
});

test('muting lasts until the chosen time', () => {
  let state = createInitialState(four, [], {});
  state = chatsReducer(state, { type: 'mute', id: 'a', until: 1000 });
  const mutedAt = (now: number) =>
    selectChatList(state, now).find((item) => item.conversation.id === 'a')?.muted;
  assert.equal(mutedAt(500), true);
  assert.equal(mutedAt(1500), false);
});

test('deleting a chat removes its messages and flags', () => {
  let state = createInitialState(four, ['a'], { a: [] });
  state = chatsReducer(state, { type: 'send', conversationId: 'a', messageId: 'm1', text: 'hi', sentAt: 1 });
  state = chatsReducer(state, { type: 'restrict', id: 'a' });
  state = chatsReducer(state, { type: 'deleteChat', id: 'a' });
  assert.equal(state.conversations.some((c) => c.id === 'a'), false);
  assert.equal(state.messages['a'], undefined);
  assert.equal(state.pinnedIds.length, 0);
  assert.equal(state.restrictedIds.length, 0);
});

test('blocking a request keeps the name for the blocked list', () => {
  let state = createInitialState([], [], {}, [
    { id: 'r1', name: 'Priya', firstMessage: 'hi', receivedAt: 1 },
  ]);
  state = chatsReducer(state, { type: 'blockRequest', id: 'r1' });
  assert.deepEqual(selectBlocked(state), [{ id: 'r1', name: 'Priya' }]);
  state = chatsReducer(state, { type: 'unblock', id: 'r1' });
  assert.equal(selectBlocked(state).length, 0);
});

const memberList = (ids: string[]) => ids.map((id) => ({ id, name: id.toUpperCase() }));

test('a group can be renamed and its members changed', () => {
  let state = createInitialState([], [], {});
  state = chatsReducer(state, {
    type: 'createGroup',
    id: 'g',
    name: 'Old',
    members: memberList(['a', 'b']),
    now: 1,
  });
  state = chatsReducer(state, {
    type: 'updateGroup',
    id: 'g',
    name: '  New  ',
    members: memberList(['a', 'b', 'c', 'c']),
  });
  assert.equal(state.conversations[0]?.name, 'New');
  assert.equal(state.conversations[0]?.members?.length, 3);
});

test('a group cannot lose its name or drop below the minimum', () => {
  let state = createInitialState([], [], {});
  state = chatsReducer(state, {
    type: 'createGroup',
    id: 'g',
    name: 'Keep',
    members: memberList(['a', 'b']),
    now: 1,
  });
  const tooFew = chatsReducer(state, {
    type: 'updateGroup',
    id: 'g',
    name: 'Keep',
    members: memberList(['a']),
  });
  assert.equal(tooFew.conversations[0]?.members?.length, 2);
  const noName = chatsReducer(state, {
    type: 'updateGroup',
    id: 'g',
    name: '   ',
    members: memberList(['a', 'b']),
  });
  assert.equal(noName.conversations[0]?.name, 'Keep');
});

test('updating a one-to-one chat does nothing', () => {
  const state = createInitialState([conversation('solo')], [], {});
  const next = chatsReducer(state, {
    type: 'updateGroup',
    id: 'solo',
    name: 'Group now',
    members: memberList(['a', 'b']),
  });
  assert.equal(next.conversations[0]?.name, 'solo');
});

test('a restricted chat is hidden from the list and found in the restricted list', () => {
  let state = createInitialState(four, ['a'], {});
  state = chatsReducer(state, { type: 'restrict', id: 'a' });
  assert.equal(selectChatList(state).some((item) => item.conversation.id === 'a'), false);
  assert.equal(selectRestricted(state).length, 1);
  assert.equal(state.pinnedIds.length, 0);
  state = chatsReducer(state, { type: 'unrestrict', id: 'a' });
  assert.equal(selectChatList(state).some((item) => item.conversation.id === 'a'), true);
  assert.equal(selectRestricted(state).length, 0);
});

test('a restricted chat is not listed as archived', () => {
  let state = createInitialState(four, [], {});
  state = chatsReducer(state, { type: 'archive', id: 'b' });
  state = chatsReducer(state, { type: 'restrict', id: 'b' });
  assert.equal(selectArchived(state).length, 0);
  assert.equal(selectRestricted(state).length, 1);
});
