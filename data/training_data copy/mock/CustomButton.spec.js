// CustomButton.test.jsx
import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import CustomButton from '../CustomButton';
import { Colors } from '@themes';

describe('CustomButton', () => {
  const mockOnPress = jest.fn();
  const mockIcon = { uri: 'https://example.com/icon.png' };

  const renderButton = (props = {}) =>
    render(
      <CustomButton
        title="Click Me"
        onPress={mockOnPress}
        primary={false}
        icon={mockIcon}
        disabled={false}
        {...props}
      />
    );

  it('renders correctly with title and icon', () => {
    const { getByText, getByTestId } = renderButton();
    expect(getByText('Click Me')).toBeTruthy();
    expect(getByTestId('custom-button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const { getByTestId } = renderButton();
    fireEvent.press(getByTestId('custom-button'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('renders with primary color when primary prop is true', () => {
    const { getByTestId } = renderButton({ primary: true });
    const button = getByTestId('custom-button');
    expect(button.props.style.backgroundColor).toBe(Colors.primary);
  });

  it('renders with secondary color when primary prop is false', () => {
    const { getByTestId } = renderButton({ primary: false });
    const button = getByTestId('custom-button');
    expect(button.props.style.backgroundColor).toBe(Colors.secondary);
  });

  it('disables the button when disabled prop is true', () => {
    const { getByTestId, getByText } = renderButton({ disabled: true });
    const button = getByTestId('custom-button');
    expect(button.props.accessibilityState.disabled).toBe(true);
    const text = getByText('Click Me');
    expect(text.props.style.color).toBe(Colors.textDisabled);
  });

  it('does not call onPress when button is disabled', () => {
    const { getByTestId } = renderButton({ disabled: true });
    fireEvent.press(getByTestId('custom-button'));
    expect(mockOnPress).not.toHaveBeenCalled();
  });
});