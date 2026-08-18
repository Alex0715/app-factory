export type FeatureFlagKey = string;

export interface FeatureFlagDefinition {
  key: FeatureFlagKey;
  defaultValue: boolean;
  description?: string;
}
