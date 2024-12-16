import React from 'react';
import { renderScreen } from '@Mock/mockApp';
import { fireEvent } from '@testing-library/react-native';
import HiddenItem from '../../deviceList/hiddenItem';
import { deviceTypes } from '../../../../configs/constants';

describe('HiddenItem', () => {
  const changeDeviceType = jest.fn();
  const removeDevice = jest.fn();

  const renderItem = (item) =>
    renderScreen(<HiddenItem item={item} changeDeviceType={changeDeviceType} removeDevice={removeDevice} />)();

  it('renders correctly with primary device type', () => {
    const item = {
      registerType: deviceTypes.primary,
    };
    const { getByText } = renderItem(item);

    fireEvent.press(getByText('BTN_CHANGE_TO_SECONDARY_DEVCE'));
    expect(changeDeviceType).toHaveBeenCalledWith(item);

    fireEvent.press(getByText('BTN_REMOVE_DEVICE'));
    expect(removeDevice).toHaveBeenCalledWith(item);
  });

  it('renders correctly with secondary device type', () => {
    const secondaryItem = {
      registerType: deviceTypes.secondary,
    };

    const { getByText } = renderItem(secondaryItem);

    expect(getByText('BTN_CHANGE_TO_PRIMARY_DEVCE')).toBeTruthy();
    expect(getByText('BTN_REMOVE_DEVICE')).toBeTruthy();
  });
});
