import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { ThemeProvider } from '@core/theme';
import { ToggleSettingRow } from '../ToggleSettingRow';

describe('ToggleSettingRow', () => {
  it('reflects the current value via accessibility state', () => {
    render(
      <ThemeProvider>
        <ToggleSettingRow label="Push notifications" value onValueChange={() => {}} />
      </ThemeProvider>
    );
    const toggle = screen.getByRole('switch', { name: 'Push notifications' });
    expect(toggle.props.accessibilityState.checked).toBe(true);
  });

  it('calls onValueChange with the flipped value', async () => {
    const onValueChange = jest.fn();
    render(
      <ThemeProvider>
        <ToggleSettingRow label="Push notifications" value={false} onValueChange={onValueChange} />
      </ThemeProvider>
    );

    fireEvent(screen.getByRole('switch', { name: 'Push notifications' }), 'valueChange', true);

    expect(onValueChange).toHaveBeenCalledWith(true);
  });
});
