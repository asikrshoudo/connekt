import type { ReactElement } from 'react';
import { FlatList } from 'react-native';
import { spacing } from '../../core/theme/spacing';
import type { Message } from '../../types/chat';
import type { TimelineRow } from './buildTimeline';
import { DateSeparator } from './DateSeparator';
import { MessageBubble } from './MessageBubble';
import type { MessageMenuTarget } from './types';

type Props = {
  rows: TimelineRow[];
  contactName: string;
  showSenders: boolean;
  onMessageLongPress: (target: MessageMenuTarget) => void;
  onMessageOpen: (message: Message) => void;
  footer?: ReactElement;
};

// Rows are newest first; `inverted` puts the newest message at the bottom.
export function MessageList({
  rows,
  contactName,
  showSenders,
  onMessageLongPress,
  onMessageOpen,
  footer,
}: Props) {
  return (
    <FlatList
      data={rows}
      inverted
      keyExtractor={(row) => row.id}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingVertical: spacing.md }}
      ListFooterComponent={footer}
      renderItem={({ item }) =>
        item.type === 'separator' ? (
          <DateSeparator label={item.label} />
        ) : (
          <MessageBubble
            message={item.message}
            reply={item.reply}
            contactName={contactName}
            showSender={showSenders && !item.groupedWithPrevious}
            groupedWithPrevious={item.groupedWithPrevious}
            showTime={item.showTime}
            onLongPress={onMessageLongPress}
            onOpen={onMessageOpen}
          />
        )
      }
    />
  );
}
