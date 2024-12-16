// SearchBar.test.jsx
import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import SearchBar from '../SearchBar';
import { Colors } from '@themes';

describe('SearchBar', () => {
  const mockOnChangeText = jest.fn();
  const mockOnClear = jest.fn();

  const renderSearchBar = (props = {}) =>
    render(
      <SearchBar
        placeholder="Search..."
        value=""
        onChangeText={mockOnChangeText}
        onClear={mockOnClear}
        testID="search-bar"
        {...props}
      />
    );

  it('renders correctly with placeholder', () => {
    const { getByPlaceholderText } = renderSearchBar();
    expect(getByPlaceholderText('Search...')).toBeTruthy();
  });

  it('calls onChangeText when text is entered', () => {
    const { getByTestId } = renderSearchBar();
    const input = getByTestId('search-bar-input');
    fireEvent.changeText(input, 'Hello');
    expect(mockOnChangeText).toHaveBeenCalledWith('Hello');
  });

  it('renders clear icon when there is text', () => {
    const { getByTestId } = renderSearchBar({ value: 'Hello' });
    const clearIcon = getByTestId('search-bar-clear');
    expect(clearIcon).toBeTruthy();
  });

  it('calls onClear when clear icon is pressed', () => {
    const { getByTestId } = renderSearchBar({ value: 'Hello' });
    const clearIcon = getByTestId('search-bar-clear');
    fireEvent.press(clearIcon);
    expect(mockOnClear).toHaveBeenCalledTimes(1);
  });

  it('does not render clear icon when there is no text', () => {
    const { queryByTestId } = renderSearchBar({ value: '' });
    expect(queryByTestId('search-bar-clear')).toBeNull();
  });

  it('applies correct styles to icons', () => {
    const { getByTestId } = renderSearchBar({ value: 'Test' });
    const searchIcon = getByTestId('search-bar').findByType('Icon');
    expect(searchIcon.props.color).toBe(Colors.textSecondary);
  });
});