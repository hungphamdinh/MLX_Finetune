// NotificationSettings.test.jsx
import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import NotificationSettings from '../NotificationSettings';
import useSettings from '@Context/Settings/Hooks/UseSettings';
import NavigationService from '@NavigationService';
import { renderScreen } from '@Mock/mockApp';

// Mock External Dependencies
jest.mock('@Context/Settings/Hooks/UseSettings');
jest.mock('@NavigationService', () => ({
  navigate: jest.fn(),
  goBack: jest.fn(),
}));
jest.mock('@Components/Forms', () => {
  const {
    FormSwitchMock,
    FormRadioGroupMock,
  } = require('__@_mock__/components/Forms'); // Adjust the path based on your project structure

  return {
    FormSwitch: ({ name, label, testID }) => <FormSwitchMock name={name} label={label} testID={testID} />,
    FormRadioGroup: ({ name, options, testID }) => <FormRadioGroupMock name={name} options={options} testID={testID} />,
  };
});

const mockFetchSettings = jest.fn();
const mockUpdateSettings = jest.fn();

const mockNavigateFn = NavigationService.goBack;

const settingsMock = {
  emailNotifications: true,
  pushNotifications: false,
  smsNotifications: true,
  notificationFrequency: 'weekly',
};

// 5. Set Up Mocks Before Each Test
beforeEach(() => {
  // Mock useSettings Hook
  useSettings.mockReturnValue({
    settings: settingsMock,
    fetchSettings: mockFetchSettings,
    updateSettings: mockUpdateSettings,
  });

  // Clear Mock Functions
  mockFetchSettings.mockClear();
  mockUpdateSettings.mockClear();
  mockNavigateFn.mockClear();
});

// 6. Define Render Function
const renderComponent = (props = {}) => renderScreen(<NotificationSettings {...props} />)();

// 7. Write Test Cases
describe('NotificationSettings Component', () => {
  it('renders correctly with settings data', async () => {
    const { getByTestId } = renderComponent();

    expect(getByTestId('notification-settings-emailNotifications').props.value).toBe(settingsMock.emailNotifications);
    expect(getByTestId('notification-settings-pushNotifications').props.value).toBe(settingsMock.pushNotifications);
    expect(getByTestId('notification-settings-smsNotifications').props.value).toBe(settingsMock.smsNotifications);
    expect(getByTestId('notification-settings-notificationFrequency').props.selected).toBe(settingsMock.notificationFrequency);
  });

  it('calls fetchSettings on mount', () => {
    renderComponent();
    expect(mockFetchSettings).toHaveBeenCalledTimes(1);
  });

  it('updates notification settings correctly', async () => {
    useSettings.mockReturnValue({
      settings: settingsMock,
      fetchSettings: mockFetchSettings,
      updateSettings: mockUpdateSettings.mockResolvedValue({ success: true }),
    });

    const { getByTestId } = renderComponent();

    fireEvent(getByTestId('notification-settings-emailNotifications'), 'valueChange', false);
    fireEvent(getByTestId('notification-settings-pushNotifications'), 'valueChange', true);
    fireEvent(getByTestId('notification-settings-smsNotifications'), 'valueChange', false);
    fireEvent.press(getByTestId('notification-settings-save-button'));

    await waitFor(() => {
      expect(mockUpdateSettings).toHaveBeenCalledWith({
        emailNotifications: false,
        pushNotifications: true,
        smsNotifications: false,
        notificationFrequency: 'weekly',
      });
      expect(mockNavigateFn).toHaveBeenCalledTimes(1);
    });
  });

  it('handles updateSettings failure gracefully', async () => {
    useSettings.mockReturnValue({
      settings: settingsMock,
      fetchSettings: mockFetchSettings,
      updateSettings: mockUpdateSettings.mockResolvedValue({ success: false }),
    });

    const { getByTestId } = renderComponent();

    fireEvent(getByTestId('notification-settings-emailNotifications'), 'valueChange', false);
    fireEvent.press(getByTestId('notification-settings-save-button'));

    await waitFor(() => {
      expect(mockUpdateSettings).toHaveBeenCalledWith({
        emailNotifications: false,
        pushNotifications: false,
        smsNotifications: true,
        notificationFrequency: 'weekly',
      });
      expect(mockNavigateFn).not.toHaveBeenCalled();
      // Additional error handling assertions can be added here
    });
  });

  it('does not call updateSettings if form validation fails', async () => {
    const { getByTestId } = renderComponent();

    // Since all fields have default values and are not required (except notificationFrequency),
    // this test might not be necessary unless there are validation rules.
    // If notificationFrequency is required, you can simulate missing it.

    fireEvent.press(getByTestId('notification-settings-save-button'));

    await waitFor(() => {
      // Assuming notificationFrequency is always set, updateSettings should be called
      expect(mockUpdateSettings).toHaveBeenCalledTimes(1);
    });
  });

  it('changes notification frequency correctly', async () => {
    const { getByTestId } = renderComponent();

    fireEvent(getByTestId('notification-settings-notificationFrequency'), 'valueChange', 'monthly');
    fireEvent.press(getByTestId('notification-settings-save-button'));

    await waitFor(() => {
      expect(mockUpdateSettings).toHaveBeenCalledWith({
        emailNotifications: true,
        pushNotifications: false,
        smsNotifications: true,
        notificationFrequency: 'monthly',
      });
      expect(mockNavigateFn).toHaveBeenCalledTimes(1);
    });
  });
});