import { useSyncExternalStore } from 'react';

function subscribe() {
  // Mount status never changes after hydration, so there's nothing to
  // subscribe to — return a no-op unsubscribe.
  return () => {};
}

/**
 * True once the component has hydrated on the client, false during SSR
 * and on the very first client render. Use this to gate rendering that can
 * only be correct client-side (e.g. reading a theme/locale preference from
 * localStorage), without a flash of mismatched content.
 *
 * Implemented with useSyncExternalStore rather than the classic
 * `useEffect(() => setMounted(true), [])` pattern: that pattern trips
 * eslint-plugin-react-hooks's `set-state-in-effect` rule, and this version
 * needs no state update at all.
 */
export function useHasMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
