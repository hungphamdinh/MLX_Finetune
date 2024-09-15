import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ScrollDownButton from '../scrollDownButton';

describe('ScrollDownButton', () => {
  it('should call onPress when the button is pressed', () => {
    const mockOnPress = jest.fn();

    const { getByTestId } = render(<ScrollDownButton onPress={mockOnPress} />);

    const button = getByTestId('chevron-down-outline');

    fireEvent.press(button);

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });
});