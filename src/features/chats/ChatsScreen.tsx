import { EmptyState } from '../../components/feedback/EmptyState';
import { TabScreen } from '../../components/layout/TabScreen';

export function ChatsScreen() {
  return (
    <TabScreen title="Chats">
      <EmptyState title="No conversations yet" message="Your conversations will appear here." />
    </TabScreen>
  );
}
