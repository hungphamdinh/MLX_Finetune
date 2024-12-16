// NotificationBadge.test.jsx
import React from 'react';
import { render } from '@testing-library/react-native';
import NotificationBadge from '../NotificationBadge';
import { Colors } from '@themes';

describe('NotificationBadge', () => {
  it('renders nothing when count is 0', () => {
    const { queryByTestId } = render(<NotificationBadge count={0} testID="notification-badge" />);
    expect(queryByTestId('notification-badge')).toBeNull();
  });

  it('renders correctly when count is greater than 0', () => {
    const { getByText, getByTestId } = render(<NotificationBadge count={5} testID="notification-badge" />);
    expect(getByTestId('notification-badge')).toBeTruthy();
    expect(getByText('5')).toBeTruthy();
  });

  it('renders correctly with multiple digits', () => {
    const { getByText } = render(<NotificationBadge count={99} testID="notification-badge" />);
    expect(getByText('99')).toBeTruthy();
  });

  it('applies correct styles based on Colors', () => {
    const { getByTestId } = render(<NotificationBadge count={3} testID="notification-badge" />);
    const badge = getByTestId('notification-badge');
    expect(badge.props.style.backgroundColor).toBe(Colors.bgError);
  });
});