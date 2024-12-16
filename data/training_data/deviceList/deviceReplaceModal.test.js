import React from 'react';
import { renderScreen } from '@Mock/mockApp';
import { fireEvent } from '@testing-library/react-native';
import DeviceReplaceModal from '../../deviceList/deviceReplaceModal';

describe('DeviceReplaceModal', () => {
  const mockList = [
    {
      deviceCode: 'device1',
      deviceName: 'Device 1',
    },
    {
      deviceCode: 'device2',
      deviceName: 'Device 2',
    },
  ];

  it('renders the component with the correct title and devices', () => {
    const onPressItem = jest.fn();
    const onClosePress = jest.fn();

    const { getByText } = renderScreen(
      <DeviceReplaceModal visible list={mockList} onPressItem={onPressItem} onClosePress={onClosePress} />
    )();

    expect(getByText('REGISTER_DEVICE_REPLACE_WARNING')).toBeTruthy();

    mockList.forEach((item) => {
      expect(getByText(item.deviceName)).toBeTruthy();
    });

    const firstDeviceItem = getByText('Device 1');
    fireEvent.press(firstDeviceItem);

    expect(onPressItem).toHaveBeenCalledWith(mockList[0]);
    expect(onClosePress).toHaveBeenCalled();
  });
});
