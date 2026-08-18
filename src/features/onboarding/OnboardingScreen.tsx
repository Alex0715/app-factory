import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@core/theme';
import { PrimaryButton, SecondaryButton } from '@core/ui';
import { usePreferencesStore } from '@core/storage/preferencesStore';
import { analytics } from '@core/analytics';
import { onboardingSlides } from './onboardingContent';

export interface OnboardingScreenProps {
  onComplete: () => void;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const theme = useTheme();
  const [index, setIndex] = useState(0);
  const setOnboardingCompleted = usePreferencesStore((s) => s.setOnboardingCompleted);

  const slide = onboardingSlides[index];
  const isLast = index === onboardingSlides.length - 1;

  const finish = () => {
    setOnboardingCompleted(true);
    analytics.trackOnboardingCompleted();
    onComplete();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background, padding: theme.spacing.lg }]}>
      <View style={styles.content}>
        <Text style={[theme.typography.displayLarge, { color: theme.colors.textPrimary, textAlign: 'center' }]}>
          {slide.title}
        </Text>
        <Text
          style={[
            theme.typography.body,
            { color: theme.colors.textSecondary, textAlign: 'center', marginTop: theme.spacing.md },
          ]}
        >
          {slide.description}
        </Text>
      </View>

      <View style={[styles.dots, { marginBottom: theme.spacing.lg }]}>
        {onboardingSlides.map((s, i) => (
          <View
            key={s.key}
            style={[
              styles.dot,
              {
                backgroundColor: i === index ? theme.colors.primary : theme.colors.border,
                borderRadius: theme.radii.pill,
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.actions}>
        {index > 0 ? (
          <SecondaryButton
            label="Back"
            onPress={() => setIndex((i) => Math.max(0, i - 1))}
            style={{ flex: 1, marginRight: theme.spacing.sm }}
          />
        ) : null}
        <PrimaryButton
          label={isLast ? 'Get started' : 'Next'}
          onPress={() => (isLast ? finish() : setIndex((i) => i + 1))}
          style={{ flex: 1 }}
          testID="onboarding-primary-action"
        />
      </View>

      {!isLast ? (
        <SecondaryButton label="Skip" onPress={finish} style={{ marginTop: theme.spacing.sm }} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    marginHorizontal: 4,
  },
  actions: {
    flexDirection: 'row',
  },
});
