export interface FeatureFlagRepository {
  isEnabled(key: string): boolean;
  setOverride(key: string, enabled: boolean): void;
  clearOverride(key: string): void;
}
