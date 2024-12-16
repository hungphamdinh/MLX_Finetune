// NotificationSettings.test.jsx
import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import NotificationSettings from '../NotificationSettings';
import useSettings from '@Context/Settings/Hooks/UseSettings';

// Mock External Dependencies
jest.mock('@Context/Settings/Hooks/UseSettings');

describe('NotificationSettings Component', () => {
  const mockFetchSettings = jest.fn();
  const mockUpdateSetting = jest.fn();

  const settingsMock = [
    { key: 'email_notifications', label: 'Email Notifications', enabled: true },
    { key: 'push_notifications', label: 'Push Notifications', enabled: false },
    { key: 'sms_notifications', label: 'SMS Notifications', enabled: true },
  ];

  beforeEach(() => {
    useSettings.mockReturnValue({
      settings: null,
      fetchSettings: mockFetchSettings,
      updateSetting: mockUpdateSetting,
    });
    mockFetchSettings.mockClear();
    mockUpdateSetting.mockClear();
  });

  it('calls fetchSettings on mount', () => {
    render(<NotificationSettings testID="notification-settings" />);
    expect(mockFetchSettings).toHaveBeenCalledTimes(1);
  });

  it('renders loading state when settings are not available', () => {
    const { getByText, getByTestId } = render(<NotificationSettings testID="notification-settings" />);
    expect(getByText('Loading...')).toBeTruthy();
    expect(getByTestId('notification-settings')).toBeTruthy();
  });

  it('renders list of settings correctly', () => {
    useSettings.mockReturnValue({
      settings: settingsMock,
      fetchSettings: mockFetchSettings,
      updateSetting: mockUpdateSetting,
    });

    const { getByTestId, getByText } = render(<NotificationSettings testID="notification-settings" />);

    settingsMock.forEach((setting) => {
      expect(getByText(setting.label)).toBeTruthy();
      expect(getByTestId(`switch-${setting.key}`).props.value).toBe(setting.enabled);
    });
  });

  it('toggles a setting correctly', () => {
    useSettings.mockReturnValue({
      settings: settingsMock,
      fetchSettings: mockFetchSettings,
      updateSetting: mockUpdateSetting,
    });

    const { getByTestId } = render(<NotificationSettings testID="notification-settings" />);

    const switchItem = getByTestId('switch-push_notifications');
    fireEvent(switchItem, 'valueChange', true);
    expect(mockUpdateSetting).toHaveBeenCalledWith('push_notifications', true);
  });

  it('handles multiple toggles correctly', () => {
    useSettings.mockReturnValue({
      settings: settingsMock,
      fetchSettings: mockFetchSettings,
      updateSetting: mockUpdateSetting,
    });

    const { getByTestId } = render(<NotificationSettings testID="notification-settings" />);

    const switchEmail = getByTestId('switch-email_notifications');
    const switchSMS = getByTestId('switch-sms_notifications');

    fireEvent(switchEmail, 'valueChange', false);
    fireEvent(switchSMS, 'valueChange', false);

    expect(mockUpdateSetting).toHaveBeenCalledWith('email_notifications', false);
    expect(mockUpdateSetting).toHaveBeenCalledWith('sms_notifications', false);
  });
});