import React from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@core/theme';
import { AppButton } from './AppButton';

export interface ConfirmationDialogProps {
  visible: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Generic modal confirmation dialog for destructive or important actions. */
export function ConfirmationDialog({
  visible,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  const theme = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={[styles.overlay, { backgroundColor: theme.colors.overlay }]}>
        <View
          style={[
            styles.dialog,
            { backgroundColor: theme.colors.surface, borderRadius: theme.radii.lg, padding: theme.spacing.lg },
          ]}
          accessibilityRole="alert"
        >
          <Text style={[theme.typography.subtitle, { color: theme.colors.textPrimary }]}>{title}</Text>
          {message ? (
            <Text
              style={[
                theme.typography.body,
                { color: theme.colors.textSecondary, marginTop: theme.spacing.sm },
              ]}
            >
              {message}
            </Text>
          ) : null}
          <View style={[styles.actions, { marginTop: theme.spacing.lg }]}>
            <AppButton
              label={cancelLabel}
              variant="secondary"
              onPress={onCancel}
              style={{ flex: 1, marginRight: theme.spacing.sm }}
            />
            <AppButton
              label={confirmLabel}
              variant={destructive ? 'destructive' : 'primary'}
              onPress={onConfirm}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  dialog: {
    width: '100%',
    maxWidth: 400,
  },
  actions: {
    flexDirection: 'row',
  },
});
