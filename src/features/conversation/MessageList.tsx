import type { ReactElement } from 'react';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { spacing } from '../../core/theme/spacing';
import type { TimelineRow } from './buildTimeline';
import { DateSeparator } from './DateSeparator';
import { MessageBubble } from './MessageBubble';

type Props = {
  rows: TimelineRow[];
  footer?: ReactElement;
};

// Rows are newest first; `inverted` puts the newest message at the bottom.
// itemLayoutAnimation slides the older messages up smoothly when a new one arrives.
export function MessageList({ rows, footer }: Props) {
  return (
    <Animated.FlatList
      data={rows}
      inverted
      keyExtractor={(row: TimelineRow) => row.id}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingVertical: spacing.md }}
      itemLayoutAnimation={LinearTransition.springify().damping(22).stiffness(240)}
      ListFooterComponent={footer}
      renderItem={({ item }: { item: TimelineRow }) =>
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
