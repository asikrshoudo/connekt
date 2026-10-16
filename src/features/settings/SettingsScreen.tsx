import { EmptyState } from '../../components/feedback/EmptyState';
import { TabScreen } from '../../components/layout/TabScreen';

export function SettingsScreen() {
  return (
    <TabScreen title="Settings">
      <EmptyState title="Settings" message="Settings will be added soon." />
    </TabScreen>
  );
}
