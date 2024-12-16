// ItemList.test.jsx
import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import ItemList from '../ItemList';
import { Text } from '@components/Commons';

describe('ItemList Component', () => {
  const mockOnItemPress = jest.fn();

  const itemsMock = [
    { id: 1, name: 'Item One', price: 29.99 },
    { id: 2, name: 'Item Two', price: 49.99 },
    { id: 3, name: 'Item Three', price: 19.99 },
  ];

  const renderComponent = (props = {}) =>
    render(
      <ItemList
        items={itemsMock}
        onItemPress={mockOnItemPress}
        testID="item-list"
        {...props}
      />
    );

  it('renders list of items correctly', () => {
    const { getByText, getByTestId } = renderComponent();

    itemsMock.forEach((item) => {
      expect(getByText(item.name)).toBeTruthy();
      expect(getByText(`$${item.price}`)).toBeTruthy();
      expect(getByTestId(`item-list-${item.id}`)).toBeTruthy();
    });
  });

  it('calls onItemPress with correct id when an item is pressed', () => {
    const { getByTestId } = renderComponent();

    const itemToPress = getByTestId('item-list-2');
    fireEvent.press(itemToPress);

    expect(mockOnItemPress).toHaveBeenCalledWith(2);
  });

  it('renders nothing when items list is empty', () => {
    const { queryByTestId } = render(
      <ItemList items={[]} onItemPress={mockOnItemPress} testID="item-list" />
    );

    expect(queryByTestId('item-list')).toBeTruthy();
    expect(queryByTestId('item-list-1')).toBeNull();
    expect(queryByTestId('item-list-2')).toBeNull();
  });

  it('handles multiple item presses correctly', () => {
    const { getByTestId } = renderComponent();

    const item1 = getByTestId('item-list-1');
    const item3 = getByTestId('item-list-3');

    fireEvent.press(item1);
    fireEvent.press(item3);

    expect(mockOnItemPress).toHaveBeenCalledWith(1);
    expect(mockOnItemPress).toHaveBeenCalledWith(3);
    expect(mockOnItemPress).toHaveBeenCalledTimes(2);
  });
});