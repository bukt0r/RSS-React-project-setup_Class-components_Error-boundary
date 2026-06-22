import { useSyncExternalStore, type ReactElement } from 'react';
import {
  getNavigationSnapshot,
  subscribeNavigation,
} from './nextNavigationMock';

interface NavigationSyncProps {
  children: () => ReactElement;
}

function NavigationSync({ children }: NavigationSyncProps) {
  useSyncExternalStore(
    subscribeNavigation,
    getNavigationSnapshot,
    getNavigationSnapshot,
  );

  return children();
}

export default NavigationSync;
