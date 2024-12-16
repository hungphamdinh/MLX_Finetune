// UserProfile.test.jsx
import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import UserProfile from '../UserProfile';
import useUser from '@Context/User/Hooks/UseUser';
import NavigationService from '@NavigationService';

// Mock External Dependencies
jest.mock('@Context/User/Hooks/UseUser');
jest.mock('@NavigationService', () => ({
  navigate: jest.fn(),
}));

describe('UserProfile Component', () => {
  const mockFetchUser = jest.fn();
  const mockNavigate = NavigationService.navigate;

  const userMock = {
    avatar: 'https://example.com/avatar.png',
    name: 'John Doe',
    email: 'john.doe@example.com',
  };

  beforeEach(() => {
    useUser.mockReturnValue({
      user: null,
      fetchUser: mockFetchUser,
    });
    mockFetchUser.mockClear();
    mockNavigate.mockClear();
  });

  it('calls fetchUser on mount', () => {
    render(<UserProfile testID="user-profile" />);
    expect(mockFetchUser).toHaveBeenCalledTimes(1);
  });

  it('renders loading state when user data is not available', () => {
    const { getByText, getByTestId } = render(<UserProfile testID="user-profile" />);
    expect(getByText('Loading...')).toBeTruthy();
    expect(getByTestId('user-profile')).toBeTruthy();
  });

  it('renders user information correctly', async () => {
    useUser.mockReturnValue({
      user: userMock,
      fetchUser: mockFetchUser,
    });

    const { getByTestId, getByText } = render(<UserProfile testID="user-profile" />);

    expect(getByTestId('user-profile-avatar').props.source.uri).toBe(userMock.avatar);
    expect(getByTestId('user-profile-username').props.text).toBe(userMock.name);
    expect(getByTestId('user-profile-email').props.text).toBe(userMock.email);
    expect(getByText('Edit Profile')).toBeTruthy();
  });

  it('navigates to EditProfile screen when Edit button is pressed', () => {
    useUser.mockReturnValue({
      user: userMock,
      fetchUser: mockFetchUser,
    });

    const { getByTestId } = render(<UserProfile testID="user-profile" />);
    const editButton = getByTestId('user-profile-edit-button');
    fireEvent.press(editButton);
    expect(mockNavigate).toHaveBeenCalledWith('EditProfile');
  });
});