// ExpandableListItem.test.jsx
import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import ExpandableListItem from '../ExpandableListItem';
import { Colors } from '@themes';

describe('ExpandableListItem', () => {
  const title = 'Expandable Item';
  const details = 'Detailed information about the item.';
  const renderItem = (props = {}) =>
    render(
      <ExpandableListItem
        title={title}
        details={details}
        testID="expandable-item"
        {...props}
      />
    );

  it('renders title correctly', () => {
    const { getByText } = renderItem();
    expect(getByText(title)).toBeTruthy();
  });

  it('does not show details initially', () => {
    const { queryByTestId } = renderItem();
    expect(queryByTestId('expandable-item-details')).toBeNull();
  });

  it('expands to show details when header is pressed', () => {
    const { getByTestId, getByText } = renderItem();
    const header = getByTestId('expandable-item');
    fireEvent.press(header);
    expect(getByTestId('expandable-item-details')).toBeTruthy();
    expect(getByText(details)).toBeTruthy();
  });

  it('collapses to hide details when header is pressed again', () => {
    const { getByTestId, queryByTestId } = renderItem();
    const header = getByTestId('expandable-item');
    fireEvent.press(header); // Expand
    expect(getByTestId('expandable-item-details')).toBeTruthy();
    fireEvent.press(header); // Collapse
    expect(queryByTestId('expandable-item-details')).toBeNull();
  });

  it('shows correct icon based on expanded state', () => {
    const { getByTestId, rerender } = renderItem();
    const header = getByTestId('expandable-item');
    const icon = header.findByType('Icon');
    expect(icon.props.name).toBe('chevron-down');

    fireEvent.press(header);
    rerender(
      <ExpandableListItem
        title={title}
        details={details}
        testID="expandable-item"
      />
    );
    expect(icon.props.name).toBe('chevron-up');
  });
});