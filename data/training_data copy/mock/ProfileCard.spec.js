// ProfileCard.test.jsx
import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import ProfileCard from '../ProfileCard';
import { Colors } from '@themes';

describe('ProfileCard', () => {
  const mockUser = {
    avatar: 'https://example.com/avatar.png',
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
  };
  const mockOnPress = jest.fn();

  const renderComponent = (props = {}) =>
    render(
      <ProfileCard user={mockUser} onPress={mockOnPress} {...props} />
    );

  it('renders user avatar, name, and email correctly', () => {
    const { getByText, getByTestId } = renderComponent();

    const avatar = getByTestId('profile-card').findByType('ImageView');
    expect(avatar.props.source.uri).toBe(mockUser.avatar);

    expect(getByText('Jane Doe')).toBeTruthy();
    expect(getByText('jane.doe@example.com')).toBeTruthy();
  });

  it('calls onPress when the card is pressed', () => {
    const { getByTestId } = renderComponent();
    fireEvent.press(getByTestId('profile-card'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('applies correct styles based on Colors', () => {
    const { getByText } = renderComponent();

    const nameText = getByText('Jane Doe');
    expect(nameText.props.style.color).toBe(Colors.textPrimary);

    const emailText = getByText('jane.doe@example.com');
    expect(emailText.props.style.color).toBe(Colors.textSecondary);
  });
});