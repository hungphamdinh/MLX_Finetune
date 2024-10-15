import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ItemVisitor from '../ItemVisitor';

describe('ItemVisitor', () => {
  const item = {
    code: '1234',
    createdAt: '2022-02-01T10:00:00.000Z',
    numberOfVisitors: 2,
    reasonForVisit: { name: 'Delivery' },
    fullUnitId: 'Unit 123',
    registerTime: '2022-02-01T10:30:00.000Z',
    registerCheckOutTime: '2022-02-01T11:00:00.000Z',
  };

  it('renders the item code', () => {
    const { getByText } = render(<ItemVisitor item={item} />);
    expect(getByText('#1234')).toBeDefined();
  });

  it('renders the date and time', () => {
    const { getByText } = render(<ItemVisitor item={item} />);
    expect(getByText('01/02/2022')).toBeDefined();
    expect(getByText('5:00 PM')).toBeDefined();
  });

  it('renders the number of visitors and reason for visit', () => {
    const { getByText } = render(<ItemVisitor item={item} />);
    expect(getByText('2 VS_VISITORS')).toBeDefined();
    expect(getByText('Delivery')).toBeDefined();
  });

  it('renders the check-in and check-out times', () => {
    const { getByText } = render(<ItemVisitor item={item} />);
    expect(getByText('VS_IN: 17:30 01/02/2022')).toBeDefined();
    expect(getByText('VS_OUT: 18:00 01/02/2022')).toBeDefined();
  });

  it('renders the unit ID', () => {
    const { getByText } = render(<ItemVisitor item={item} />);
    expect(getByText('Unit 123')).toBeDefined();
  });

  it('calls the onPress function when pressed', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(<ItemVisitor item={item} onPress={onPress} />);
    fireEvent.press(getByTestId('item-visitor'));
    expect(onPress).toHaveBeenCalled();
  });
});
