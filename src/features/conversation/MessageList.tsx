import type { ReactElement } from 'react';
import { FlatList } from 'react-native';
import { spacing } from '../../core/theme/spacing';
import type { TimelineRow } from './buildTimeline';
import { DateSeparator } from './DateSeparator';
import { MessageBubble } from './MessageBubble';
import type { MessageMenuTarget } from './types';

type Props = {
  rows: TimelineRow[];
  contactName: string;
  onMessageLongPress: (target: MessageMenuTarget) => void;
  footer?: ReactElement;
};

// Rows are newest first; `inverted` puts the newest message at the bottom.
export function MessageList({ rows, contactName, onMessageLongPress, footer }: Props) {
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
            groupedWithPrevious={item.groupedWithPrevious}
            showTime={item.showTime}
            onLongPress={onMessageLongPress}
          />
        )
      }
    />
  );
}
