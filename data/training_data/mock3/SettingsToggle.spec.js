// SettingsToggle.test.jsx
import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import SettingsToggle from '../SettingsToggle';
import useSettings from '@Context/Settings/Hooks/UseSettings';

// Mock External Dependencies
jest.mock('@Context/Settings/Hooks/UseSettings');

describe('SettingsToggle Component', () => {
  const mockToggleSetting = jest.fn();

  const settingsMock = {
    darkMode: true,
    notifications: false,
  };

  const renderToggle = (props = {}) =>
    render(
      <SettingsToggle
        label="Dark Mode"
        settingKey="darkMode"
        testID="settings-toggle"
        {...props}
      />
    );

  beforeEach(() => {
    useSettings.mockReturnValue({
      settings: settingsMock,
      toggleSetting: mockToggleSetting,
    });
    mockToggleSetting.mockClear();
  });

  it('renders label and switch correctly', () => {
    const { getByText, getByTestId } = renderToggle();
    expect(getByText('Dark Mode')).toBeTruthy();
    expect(getByTestId('settings-toggle-switch').props.value).toBe(true);
  });

  it('calls toggleSetting with correct parameters when switch is toggled', () => {
    const { getByTestId } = renderToggle();
    const switchComponent = getByTestId('settings-toggle-switch');
    fireEvent(switchComponent, 'valueChange', false);
    expect(mockToggleSetting).toHaveBeenCalledWith('darkMode', false);
  });

  it('reflects updated switch state based on settings prop', () => {
    const { getByTestId, rerender } = render(
      <SettingsToggle label="Notifications" settingKey="notifications" testID="settings-toggle-notifications" />
    );

    expect(getByTestId('settings-toggle-notifications-switch').props.value).toBe(false);

    useSettings.mockReturnValue({
      settings: { ...settingsMock, notifications: true },
      toggleSetting: mockToggleSetting,
    });

    rerender(<SettingsToggle label="Notifications" settingKey="notifications" testID="settings-toggle-notifications" />);
    expect(getByTestId('settings-toggle-notifications-switch').props.value).toBe(true);
  });

  it('handles multiple toggles correctly', () => {
    const { getByTestId } = render(
      <View>
        <SettingsToggle label="Dark Mode" settingKey="darkMode" testID="toggle-dark-mode" />
        <SettingsToggle label="Notifications" settingKey="notifications" testID="toggle-notifications" />
      </View>
    );

    const darkModeSwitch = getByTestId('toggle-dark-mode-switch');
    const notificationsSwitch = getByTestId('toggle-notifications-switch');

    fireEvent(darkModeSwitch, 'valueChange', false);
    fireEvent(notificationsSwitch, 'valueChange', true);

    expect(mockToggleSetting).toHaveBeenCalledWith('darkMode', false);
    expect(mockToggleSetting).toHaveBeenCalledWith('notifications', true);
    expect(mockToggleSetting).toHaveBeenCalledTimes(2);
  });
});