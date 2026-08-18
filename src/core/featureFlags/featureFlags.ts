import { create } from 'zustand';
import { productConfig } from '@core/config';
import { FeatureFlagRepository } from '@domain/repositories';

/**
 * Simple feature flag system: local default values (from product.config.ts)
 * overridable at runtime (e.g. from a debug menu). Intentionally not a
 * remote-config platform - wire a remote source into `loadRemoteOverrides`
 * later if a product needs one, without changing call sites.
 */
type FlagKey = keyof typeof productConfig.featureFlags | (string & {});

interface FeatureFlagState {
  overrides: Record<string, boolean>;
  setOverride: (key: string, enabled: boolean) => void;
  clearOverride: (key: string) => void;
}

const useFeatureFlagStore = create<FeatureFlagState>((set) => ({
  overrides: {},
  setOverride: (key, enabled) => set((s) => ({ overrides: { ...s.overrides, [key]: enabled } })),
  clearOverride: (key) =>
    set((s) => {
      const next = { ...s.overrides };
      delete next[key];
      return { overrides: next };
    }),
}));

export const featureFlags: FeatureFlagRepository = {
  isEnabled(key: string): boolean {
    const { overrides } = useFeatureFlagStore.getState();
    if (key in overrides) return overrides[key];
    const defaults = productConfig.featureFlags as Record<string, boolean>;
    return defaults[key] ?? false;
  },
  setOverride(key: string, enabled: boolean): void {
    useFeatureFlagStore.getState().setOverride(key, enabled);
  },
  clearOverride(key: string): void {
    useFeatureFlagStore.getState().clearOverride(key);
  },
};

/** React hook: re-renders when the given flag's value changes. */
export function useFeatureFlag(key: FlagKey): boolean {
  return useFeatureFlagStore((s) => {
    if (key in s.overrides) return s.overrides[key as string];
    const defaults = productConfig.featureFlags as Record<string, boolean>;
    return defaults[key as string] ?? false;
  });
}
