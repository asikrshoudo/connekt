import { EmptyState } from '../../components/feedback/EmptyState';
import { TabScreen } from '../../components/layout/TabScreen';

export function CallsScreen() {
  return (
    <TabScreen title="Calls">
      <EmptyState title="No calls yet" message="Calling is not available in this version." />
    </TabScreen>
  );
}
