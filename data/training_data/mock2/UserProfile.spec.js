// UserProfile.test.jsx
import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import UserProfile from '../UserProfile';
import useUser from '@Context/User/Hooks/UseUser';
import useSettings from '@Context/Settings/Hooks/UseSettings';
import NavigationService from '@NavigationService';
import { renderScreen } from '@Mock/mockApp';

// Mock External Dependencies
jest.mock('@Context/User/Hooks/UseUser');
jest.mock('@Context/Settings/Hooks/UseSettings');
jest.mock('@NavigationService', () => ({
  navigate: jest.fn(),
  goBack: jest.fn(),
}));
jest.mock('@Components/Forms', () => {
  const {
    FormInputMock,
    FormDateMock,
    FormSwitchMock,
    FormDisabledProviderMock,
  } = require('@Mock/components/Forms'); // Adjust the path based on your project structure

  return {
    FormInput: ({ name, label, testID }) => <FormInputMock name={name} label={label} testID={testID} />,
    FormDate: ({ name, label, testID }) => <FormDateMock name={name} label={label} testID={testID} />,
    FormSwitch: ({ name, label, testID }) => <FormSwitchMock name={name} label={label} testID={testID} />,
  };
});

const mockFetchUser = jest.fn();
const mockUpdateUser = jest.fn();
const mockFetchSettings = jest.fn();
const mockUpdateSettings = jest.fn();

const mockNavigateFn = NavigationService.goBack;

const userMock = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  birthday: '1990-05-15',
};

const settingsMock = {
  notifications: true,
};

// 5. Set Up Mocks Before Each Test
beforeEach(() => {
  // Mock useUser Hook
  useUser.mockReturnValue({
    user: userMock,
    fetchUser: mockFetchUser,
    updateUser: mockUpdateUser,
  });

  // Mock useSettings Hook
  useSettings.mockReturnValue({
    settings: settingsMock,
    fetchSettings: mockFetchSettings,
    updateSettings: mockUpdateSettings,
  });

  // Clear Mock Functions
  mockFetchUser.mockClear();
  mockUpdateUser.mockClear();
  mockFetchSettings.mockClear();
  mockUpdateSettings.mockClear();
  mockNavigateFn.mockClear();
});

// 6. Define Render Function
const renderComponent = (props = {}) => renderScreen(<UserProfile {...props} />)();

// 7. Write Test Cases
describe('UserProfile Component', () => {
  it('renders correctly with user data', async () => {
    const { getByTestId } = renderComponent();

    expect(getByTestId('user-profile-firstName').props.value).toBe(userMock.firstName);
    expect(getByTestId('user-profile-lastName').props.value).toBe(userMock.lastName);
    expect(getByTestId('user-profile-email').props.value).toBe(userMock.email);
    expect(getByTestId('user-profile-birthday').props.value).toBe(userMock.birthday);
    expect(getByTestId('user-profile-notifications').props.value).toBe(settingsMock.notifications);
  });

  it('calls fetchUser and fetchSettings on mount', () => {
    renderComponent();
    expect(mockFetchUser).toHaveBeenCalledTimes(1);
    expect(mockFetchSettings).toHaveBeenCalledTimes(1);
  });

  it('shows validation errors when required fields are empty', async () => {
    const { getByTestId, findByTestId } = renderComponent();

    fireEvent.changeText(getByTestId('user-profile-firstName'), '');
    fireEvent.changeText(getByTestId('user-profile-lastName'), '');
    fireEvent.changeText(getByTestId('user-profile-email'), '');
    fireEvent.press(getByTestId('user-profile-save-button'));

    expect(await findByTestId('user-profile-firstName-error')).toBeTruthy();
    expect(await findByTestId('user-profile-lastName-error')).toBeTruthy();
    expect(await findByTestId('user-profile-email-error')).toBeTruthy();

    expect(getByTestId('user-profile-firstName-error').props.children).toBe('This field is required');
    expect(getByTestId('user-profile-lastName-error').props.children).toBe('This field is required');
    expect(getByTestId('user-profile-email-error').props.children).toBe('This field is required');
  });

  it('shows email format error for invalid email', async () => {
    const { getByTestId, findByTestId } = renderComponent();

    fireEvent.changeText(getByTestId('user-profile-email'), 'invalidemail');
    fireEvent.press(getByTestId('user-profile-save-button'));

    expect(await findByTestId('user-profile-email-error')).toBeTruthy();
    expect(getByTestId('user-profile-email-error').props.children).toBe('Invalid email');
  });

  it('calls updateUser with correct data on valid form submission', async () => {
    useUser.mockReturnValue({
      user: userMock,
      fetchUser: mockFetchUser,
      updateUser: mockUpdateUser.mockResolvedValue({ success: true }),
    });

    const { getByTestId } = renderComponent();

    fireEvent.changeText(getByTestId('user-profile-firstName'), 'Jane');
    fireEvent.changeText(getByTestId('user-profile-lastName'), 'Smith');
    fireEvent.changeText(getByTestId('user-profile-email'), 'jane.smith@example.com');
    fireEvent.press(getByTestId('user-profile-save-button'));

    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalledWith({
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        birthday: '1990-05-15',
        notifications: true,
      });
      expect(mockNavigateFn).toHaveBeenCalledTimes(1);
    });
  });

  it('handles updateUser failure gracefully', async () => {
    useUser.mockReturnValue({
      user: userMock,
      fetchUser: mockFetchUser,
      updateUser: mockUpdateUser.mockResolvedValue({ success: false }),
    });

    const { getByTestId } = renderComponent();

    fireEvent.changeText(getByTestId('user-profile-firstName'), 'Jane');
    fireEvent.changeText(getByTestId('user-profile-lastName'), 'Smith');
    fireEvent.changeText(getByTestId('user-profile-email'), 'jane.smith@example.com');
    fireEvent.press(getByTestId('user-profile-save-button'));

    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalledWith({
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        birthday: '1990-05-15',
        notifications: true,
      });
      expect(mockNavigateFn).not.toHaveBeenCalled();
      // Additional error handling assertions can be added here
    });
  });

  it('does not call updateUser if form validation fails', async () => {
    const { getByTestId, findByTestId } = renderComponent();

    fireEvent.press(getByTestId('user-profile-save-button'));

    await findByTestId('user-profile-firstName-error');
    await findByTestId('user-profile-lastName-error');
    await findByTestId('user-profile-email-error');

    expect(mockUpdateUser).not.toHaveBeenCalled();
  });
});