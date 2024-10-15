import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import PaymentMethodItem from '../../momo/momoPaymentMethod/ItemPaymentMethod';

describe('PaymentMethodItem', () => {
  const mockMethod = {
    key: 'mockKey',
    icon: 'mockIcon',
    text: 'Mock Payment Method',
  };

  const mockOnSelect = jest.fn();

  it('renders the payment method text', () => {
    const { getByText } = render(<PaymentMethodItem method={mockMethod} onSelect={mockOnSelect} />);

    expect(getByText(mockMethod.text)).toBeTruthy();
  });

  it('calls onSelect when pressed', () => {
    const { getByText } = render(<PaymentMethodItem method={mockMethod} onSelect={mockOnSelect} />);

    fireEvent.press(getByText(mockMethod.text));

    expect(mockOnSelect).toHaveBeenCalledWith(mockMethod.key);
  });

  it('renders the radio button unchecked by default', () => {
    const { queryByTestId } = render(<PaymentMethodItem method={mockMethod} onSelect={mockOnSelect} />);

    expect(queryByTestId('radio-inner')).toBeFalsy();
  });

  it('renders the radio button checked when selected', () => {
    const { getByTestId } = render(<PaymentMethodItem method={mockMethod} onSelect={mockOnSelect} isSelected />);

    expect(getByTestId('radio-inner')).toBeTruthy();
  });
});
