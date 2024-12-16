// ToggleSwitch.test.jsx
import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import ToggleSwitch from '../ToggleSwitch';
import { Colors } from '@themes';

describe('ToggleSwitch', () => {
  const mockOnValueChange = jest.fn();

  const renderToggle = (props = {}) =>
    render(
      <ToggleSwitch
        label="Enable Notifications"
        value={false}
        onValueChange={mockOnValueChange}
        testID="toggle-switch"
        {...props}
      />
    );

  it('renders label correctly', () => {
    const { getByText } = renderToggle();
    expect(getByText('Enable Notifications')).toBeTruthy();
  });

  it('renders switch in correct position based on value', () => {
    const { getByTestId, rerender } = renderToggle({ value: false });
    const switchComponent = getByTestId('toggle-switch-switch');
    expect(switchComponent.props.value).toBe(false);

    rerender(
      <ToggleSwitch
        label="Enable Notifications"
        value={true}
        onValueChange={mockOnValueChange}
        testID="toggle-switch"
      />
    );
    expect(getByTestId('toggle-switch-switch').props.value).toBe(true);
  });

  it('calls onValueChange when switch is toggled', () => {
    const { getByTestId } = renderToggle();
    const switchComponent = getByTestId('toggle-switch-switch');
    fireEvent(switchComponent, 'valueChange', true);
    expect(mockOnValueChange).toHaveBeenCalledWith(true);
  });

  it('applies correct colors based on state', () => {
    const { getByTestId, rerender } = renderToggle({ value: false });
    let switchComponent = getByTestId('toggle-switch-switch');
    expect(switchComponent.props.trackColor).toEqual({ false: Colors.trackInactive, true: Colors.trackActive });
    expect(switchComponent.props.thumbColor).toBe(Colors.thumbInactive);

    rerender(
      <ToggleSwitch
        label="Enable Notifications"
        value={true}
        onValueChange={mockOnValueChange}
        testID="toggle-switch"
      />
    );
    switchComponent = getByTestId('toggle-switch-switch');
    expect(switchComponent.props.thumbColor).toBe(Colors.thumbActive);
  });
});