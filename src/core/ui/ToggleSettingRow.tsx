import React from 'react';
import { Switch } from 'react-native';
import { useTheme } from '@core/theme';
import { SettingRow } from './SettingRow';

export interface ToggleSettingRowProps {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

/** SettingRow with a trailing Switch, for boolean preferences (notifications, dark mode, ...). */
export function ToggleSettingRow({ label, description, value, onValueChange, disabled }: ToggleSettingRowProps) {
  const theme = useTheme();
  return (
    <SettingRow
      label={label}
      description={description}
      trailing={
        <Switch
          value={value}
          onValueChange={onValueChange}
          disabled={disabled}
          trackColor={{ true: theme.colors.primary, false: theme.colors.border }}
          accessibilityRole="switch"
          accessibilityLabel={label}
          accessibilityState={{ checked: value, disabled }}
        />
      }
    />
  );
}
