import { EmptyState } from '../../components/feedback/EmptyState';
import { TabScreen } from '../../components/layout/TabScreen';

export function SearchScreen() {
  return (
    <TabScreen title="Search">
      <EmptyState title="Search" message="Find people and conversations here." />
    </TabScreen>
  );
}
