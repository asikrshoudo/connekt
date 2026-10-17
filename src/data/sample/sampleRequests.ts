// SAMPLE DATA ONLY. These are not real people or real messages.
import type { MessageRequest } from '../../types/request';

const ago = (minutes: number) => Date.now() - minutes * 60_000;

export const sampleRequests: MessageRequest[] = [
  {
    id: 'request-1',
    name: 'Priya Nair',
    firstMessage: 'Hi! We met at the meetup last week. Can we stay in touch?',
    receivedAt: ago(90),
  },
  {
    id: 'request-2',
    name: 'Unknown sender',
    firstMessage: 'Congratulations, you won a prize. Click here to claim it.',
    receivedAt: ago(60 * 26),
  },
];
