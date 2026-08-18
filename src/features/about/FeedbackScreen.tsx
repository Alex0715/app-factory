import React, { useState } from 'react';
import { Alert, Linking, ScrollView, Text, TextInput } from 'react-native';
import { useTheme } from '@core/theme';
import { productConfig } from '@core/config';
import { PrimaryButton } from '@core/ui';
import { analytics } from '@core/analytics';
import { useFeatureFlag } from '@core/featureFlags';

export function FeedbackScreen() {
  const theme = useTheme();
  const [message, setMessage] = useState('');
  const feedbackEnabled = useFeatureFlag('feedbackEnabled');

  const submit = () => {
    if (!message.trim()) return;
    analytics.trackEvent('feedback_submitted', { length: message.length });
    // A real product wires this to its backend / support inbox instead of mailto.
    Linking.openURL(
      `mailto:${productConfig.supportEmail}?subject=${encodeURIComponent(
        `${productConfig.appName} feedback`
      )}&body=${encodeURIComponent(message)}`
    );
    setMessage('');
    Alert.alert('Thanks!', 'Your feedback has been prepared in your email app.');
  };

  if (!feedbackEnabled) {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }} contentContainerStyle={{ padding: theme.spacing.md }}>
        <Text style={[theme.typography.body, { color: theme.colors.textSecondary }]}>
          Feedback is currently unavailable.
        </Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }} contentContainerStyle={{ padding: theme.spacing.md }}>
      <Text style={[theme.typography.title, { color: theme.colors.textPrimary }]}>Feedback & support</Text>
      <Text style={[theme.typography.body, { color: theme.colors.textSecondary, marginTop: theme.spacing.sm }]}>
        We read every message. Tell us what&apos;s working or what isn&apos;t.
      </Text>
      <TextInput
        value={message}
        onChangeText={setMessage}
        placeholder="What's on your mind?"
        placeholderTextColor={theme.colors.textDisabled}
        multiline
        numberOfLines={6}
        accessibilityLabel="Feedback message"
        style={{
          marginTop: theme.spacing.lg,
          minHeight: 120,
          borderWidth: 1,
          borderColor: theme.colors.border,
          borderRadius: theme.radii.md,
          padding: theme.spacing.sm,
          color: theme.colors.textPrimary,
          textAlignVertical: 'top',
        }}
      />
      <PrimaryButton
        label="Send feedback"
        onPress={submit}
        disabled={!message.trim()}
        style={{ marginTop: theme.spacing.md }}
      />
    </ScrollView>
  );
}
