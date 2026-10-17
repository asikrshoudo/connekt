// SAMPLE DATA ONLY. These are not real people or real messages.
import type { Message } from '../../types/chat';

const DAY = 60 * 24;
const ago = (minutes: number) => Date.now() - minutes * 60_000;

type Seed = [
  direction: Message['direction'],
  text: string,
  minutesAgo: number,
  sender?: string,
];

// Each list must go from oldest to newest.
const seeds: Record<string, Seed[]> = {
  'sample-1': [
    ['incoming', 'Are we still on for tonight?', DAY + 40],
    ['outgoing', 'Yes, what time works for you?', DAY + 35],
    ['incoming', 'How about 6?', 30],
    ['outgoing', 'Works for me', 20],
    ['incoming', 'Sounds good, see you at 6.', 4],
  ],
  'sample-2': [
    ['outgoing', 'Did you get a chance to look at the draft?', 120],
    ['incoming', 'Sent the files over, let me know if anything is missing from the folder.', 38],
  ],
  'sample-3': [
    ['incoming', 'Did you see the match?', 110],
    ['outgoing', 'Of course!', 100],
    ['incoming', 'Haha that was unreal', 95],
  ],
  'sample-4': [
    ['incoming', 'Hey, are you around?', 60 * 7 + 3],
    ['incoming', 'Can you call me when you are free?', 60 * 7],
  ],
  'sample-5': [
    ['outgoing', 'Here is the document you asked for.', 60 * 27 + 2],
    ['incoming', 'Thanks!', 60 * 27],
  ],
  'sample-6': [
    ['outgoing', 'Any update on the schedule?', DAY * 3 + 30],
    ['incoming', 'I will check and get back to you tomorrow morning.', DAY * 3],
  ],
  'sample-7': [
    ['outgoing', 'Are you coming to the event?', DAY * 12 + 5],
    ['incoming', 'Okay', DAY * 12],
  ],
  'sample-8': [['incoming', 'Happy birthday!', DAY * 40]],
  'sample-group-1': [
    ['incoming', 'Anyone up for a hike on Saturday?', 60 * 5 + 10, 'Maya Chen'],
    ['incoming', 'I am in! What time?', 60 * 5, 'Tanvir Hasan'],
    ['incoming', 'Early, before it gets hot.', 60 * 4 + 50, 'Maya Chen'],
    ['outgoing', 'Count me in too', 60 * 4 + 30],
    ['incoming', 'Great, I will bring snacks', 60 * 3, 'Ayaan Rahman'],
    ['incoming', 'Meet at 7 at the main gate?', 60 * 2 + 55, 'Ayaan Rahman'],
  ],
};

export const sampleMessages: Record<string, Message[]> = Object.fromEntries(
  Object.entries(seeds).map(([conversationId, items]) => [
    conversationId,
    items.map(([direction, text, minutesAgo, sender], index) => ({
      id: `${conversationId}-m${index}`,
      conversationId,
      text,
      sentAt: ago(minutesAgo),
      direction,
      ...(sender ? { senderName: sender } : {}),
    })),
  ]),
);
