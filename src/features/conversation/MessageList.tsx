import type { ReactElement } from 'react';
import { FlatList } from 'react-native';
import { spacing } from '../../core/theme/spacing';
import type { TimelineRow } from './buildTimeline';
import { DateSeparator } from './DateSeparator';
import { MessageBubble } from './MessageBubble';

type Props = {
  rows: TimelineRow[];
  footer?: ReactElement;
};

// Rows are newest first; `inverted` puts the newest message at the bottom.
export function MessageList({ rows, footer }: Props) {
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
            groupedWithPrevious={item.groupedWithPrevious}
            showTime={item.showTime}
          />
        )
      }
    />
  );
}
