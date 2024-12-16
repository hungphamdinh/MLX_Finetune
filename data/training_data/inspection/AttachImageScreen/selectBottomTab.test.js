import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SelectBottomTab from '../../../Inspection/AttachImageScreen/SelectBottomTab';

describe('SelectBottomTab Component', () => {
  const count = 2;
  const onPressDelete = jest.fn();
  const onSelectAll = jest.fn();

  const renderBottomTab = (count = 2) => {
    return render(<SelectBottomTab count={count} onPressDelete={onPressDelete} onSelectAll={onSelectAll} />);
  };

  it('renders correctly', () => {
    render(<SelectBottomTab />);
  });

  it('calls onSelectAll when pressed', () => {
    const { getByText } = renderBottomTab();
    const selectAllButton = getByText('COMMON_SELECT_ALL');
    fireEvent.press(selectAllButton);
    expect(onSelectAll).toHaveBeenCalledTimes(1);
  });

  it('calls onPressDelete when pressed', () => {
    const { getByTestId } = renderBottomTab();
    const deleteButton = getByTestId('delete-button');
    fireEvent.press(deleteButton);
    expect(onPressDelete).toHaveBeenCalledTimes(1);
  });

  it('renders correct text when count is 0', () => {
    const { getByText } = renderBottomTab(0);
    const text = getByText('COMMON_SELECT');
    expect(text).toBeTruthy();
  });

  it('renders correct text when count is greater than 0', () => {
    const { getByText } = renderBottomTab();
    const text = getByText('INSPECTION_PHOTO_SELECTED'.toUpperCase());
    expect(text).toBeTruthy();
  });
});
