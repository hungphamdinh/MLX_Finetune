// Badge.test.jsx
import React from 'react';
import { render } from '@testing-library/react-native';
import Badge from '../Badge';

describe('Badge Component', () => {
  const renderBadge = (props = {}) =>
    render(
      <Badge
        label="New"
        type="success"
        testID="badge"
        {...props}
      />
    );

  it('renders the label correctly', () => {
    const { getByText } = renderBadge();
    expect(getByText('New')).toBeTruthy();
  });

  it('applies correct background color based on type', () => {
    const { getByTestId, rerender } = renderBadge({ type: 'success' });
    let badge = getByTestId('badge');
    expect(badge.props.style.backgroundColor).toBe('#4CAF50');

    rerender(<Badge label="Error" type="error" testID="badge" />);
    badge = getByTestId('badge');
    expect(badge.props.style.backgroundColor).toBe('#F44336');

    rerender(<Badge label="Warning" type="warning" testID="badge" />);
    badge = getByTestId('badge');
    expect(badge.props.style.backgroundColor).toBe('#FFC107');

    rerender(<Badge label="Info" testID="badge" />);
    badge = getByTestId('badge');
    expect(badge.props.style.backgroundColor).toBe('#2196F3');
  });

  it('renders default type correctly', () => {
    const { getByTestId } = renderBadge({ type: 'default' });
    const badge = getByTestId('badge');
    expect(badge.props.style.backgroundColor).toBe('#2196F3');
  });

  it('handles custom type gracefully', () => {
    const { getByTestId } = renderBadge({ type: 'custom' });
    const badge = getByTestId('badge');
    expect(badge.props.style.backgroundColor).toBe('#2196F3');
  });

  it('renders different labels correctly', () => {
    const { getByText, rerender } = renderBadge({ label: 'Sale' });
    expect(getByText('Sale')).toBeTruthy();

    rerender(<Badge label="Hot" type="warning" testID="badge" />);
    expect(getByText('Hot')).toBeTruthy();
  });
});