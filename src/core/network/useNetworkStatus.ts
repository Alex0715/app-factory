import { useEffect, useState } from 'react';
import * as Network from 'expo-network';

/** Polls connectivity state. Backs the app's global offline banner/state. */
export function useNetworkStatus(pollIntervalMs = 5000): { isOnline: boolean } {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function check() {
      try {
        const state = await Network.getNetworkStateAsync();
        if (mounted) {
          setIsOnline(Boolean(state.isConnected && state.isInternetReachable !== false));
        }
      } catch {
        if (mounted) setIsOnline(true); // fail open - don't block the UI on a detection error
      }
    }

    check();
    const interval = setInterval(check, pollIntervalMs);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [pollIntervalMs]);

  return { isOnline };
}
