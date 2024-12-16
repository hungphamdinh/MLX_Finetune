// UserSettings.test.jsx
import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import UserSettings from '../UserSettings';
import useSettings from '@Context/Settings/Hooks/UseSettings';
import useUser from '@Context/User/Hooks/UseUser';
import NavigationService from '@NavigationService';
import { renderScreen } from '@Mock/mockApp';

// Mock External Dependencies
jest.mock('@Context/Settings/Hooks/UseSettings');
jest.mock('@Context/User/Hooks/UseUser');
jest.mock('@NavigationService', () => ({
  navigate: jest.fn(),
  goBack: jest.fn(),
}));

describe('UserSettings Component', () => {
  const mockFetchSettings = jest.fn();
  const mockUpdateSettings = jest.fn();
  const mockFetchUser = jest.fn();

  const mockSettings = {
    notifications: true,
  };

  const mockUser = {
    username: 'john_doe',
    email: 'john.doe@example.com',
    birthday: '1990-05-15',
  };

  beforeEach(() => {
    useSettings.mockReturnValue({
      settings: mockSettings,
      fetchSettings: mockFetchSettings,
      updateSettings: mockUpdateSettings,
    });

    useUser.mockReturnValue({
      user: mockUser,
      fetchUser: mockFetchUser,
    });

    mockFetchSettings.mockClear();
    mockUpdateSettings.mockClear();
    mockFetchUser.mockClear();
    NavigationService.goBack.mockClear();
  });

  const renderComponent = (props = {}) => renderScreen(<UserSettings {...props} />)();

  it('calls fetchSettings and fetchUser on mount', () => {
    renderComponent();
    expect(mockFetchSettings).toHaveBeenCalledTimes(1);
    expect(mockFetchUser).toHaveBeenCalledTimes(1);
  });

  it('initializes form with user and settings data', async () => {
    const { getByTestId } = renderComponent();

    await waitFor(() => {
      expect(getByTestId('user-settings-username').props.value).toBe(mockUser.username);
      expect(getByTestId('user-settings-email').props.value).toBe(mockUser.email);
      expect(getByTestId('user-settings-notifications').props.value).toBe(mockSettings.notifications);
      expect(getByTestId('user-settings-birthday').props.value).toBe(mockUser.birthday);
    });
  });

  it('shows validation errors when required fields are empty', async () => {
    const { getByTestId, findByTestId } = renderComponent();

    fireEvent.changeText(getByTestId('user-settings-username'), '');
    fireEvent.changeText(getByTestId('user-settings-email'), '');
    fireEvent.press(getByTestId('user-settings-save-button'));

    expect(await findByTestId('user-settings-username-error')).toBeTruthy();
    expect(await findByTestId('user-settings-email-error')).toBeTruthy();
    expect(getByTestId('user-settings-username-error').props.children).toBe('This field is required');
    expect(getByTestId('user-settings-email-error').props.children).toBe('This field is required');
  });

  it('shows email format error for invalid email', async () => {
    const { getByTestId, findByTestId } = renderComponent();

    fireEvent.changeText(getByTestId('user-settings-email'), 'invalidemail');
    fireEvent.press(getByTestId('user-settings-save-button'));

    expect(await findByTestId('user-settings-email-error')).toBeTruthy();
    expect(getByTestId('user-settings-email-error').props.children).toBe('Invalid email');
  });

  it('calls updateSettings with correct data on valid form submission', async () => {
    mockUpdateSettings.mockResolvedValue({ success: true });

    const { getByTestId } = renderComponent();

    fireEvent.changeText(getByTestId('user-settings-username'), 'jane_doe');
    fireEvent.changeText(getByTestId('user-settings-email'), 'jane.doe@example.com');
    fireEvent.press(getByTestId('user-settings-save-button'));

    await waitFor(() => {
      expect(mockUpdateSettings).toHaveBeenCalledWith({
        username: 'jane_doe',
        email: 'jane.doe@example.com',
        notifications: true,
        birthday: '1990-05-15',
      });
      expect(NavigationService.goBack).toHaveBeenCalledTimes(1);
    });
  });

  it('handles updateSettings failure gracefully', async () => {
    mockUpdateSettings.mockResolvedValue({ success: false });

    const { getByTestId } = renderComponent();

    fireEvent.changeText(getByTestId('user-settings-username'), 'jane_doe');
    fireEvent.changeText(getByTestId('user-settings-email'), 'jane.doe@example.com');
    fireEvent.press(getByTestId('user-settings-save-button'));

    await waitFor(() => {
      expect(mockUpdateSettings).toHaveBeenCalledWith({
        username: 'jane_doe',
        email: 'jane.doe@example.com',
        notifications: true,
        birthday: '1990-05-15',
      });
      expect(NavigationService.goBack).not.toHaveBeenCalled();
      // Additional error handling assertions can be added here
    });
  });
});