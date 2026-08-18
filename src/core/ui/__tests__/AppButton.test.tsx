import React from 'react';
import { render, screen, userEvent } from '@testing-library/react-native';
import { ThemeProvider } from '@core/theme';
import { AppButton } from '../AppButton';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('AppButton', () => {
  it('renders its label and is reachable by accessibility label', () => {
    renderWithTheme(<AppButton label="Continue" onPress={() => {}} />);
    expect(screen.getByRole('button', { name: 'Continue' })).toBeTruthy();
  });

  it('calls onPress when tapped', async () => {
    const onPress = jest.fn();
    renderWithTheme(<AppButton label="Continue" onPress={onPress} />);

    const user = userEvent.setup();
    await user.press(screen.getByRole('button', { name: 'Continue' }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', async () => {
    const onPress = jest.fn();
    renderWithTheme(<AppButton label="Continue" onPress={onPress} disabled />);

    const user = userEvent.setup();
    await user.press(screen.getByRole('button', { name: 'Continue' }));

    expect(onPress).not.toHaveBeenCalled();
  });

  it('shows a busy accessibility state while loading and hides the label', () => {
    renderWithTheme(<AppButton label="Continue" onPress={() => {}} loading />);
    const button = screen.getByRole('button', { name: 'Continue' });
    expect(button.props.accessibilityState.busy).toBe(true);
    expect(screen.queryByText('Continue')).toBeNull();
  });
});
