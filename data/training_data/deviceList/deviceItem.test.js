import React from 'react';
import { renderScreen } from '__@mocks__/mockApp';
import DeviceItem from '../../deviceList/deviceItem';

describe('DeviceItem', () => {
  const item = {
    deviceName: 'Test Device',
  };
  const renderItem = (isCurrentDevice) =>
    renderScreen(<DeviceItem item={item} index={0} isCurrentDevice={isCurrentDevice} />)();

  it('renders correctly', () => {
    const isCurrentDevice = false;
    const { getByText, queryByText } = renderItem(isCurrentDevice);

    expect(getByText('Test Device')).toBeTruthy();
    expect(queryByText('CURRENT_DEVICE')).toBeNull();
  });

  it('renders as current device', () => {
    const isCurrentDevice = true;
    const { getByText } = renderItem(isCurrentDevice);

    expect(getByText('Test Device')).toBeTruthy();
    expect(getByText('CURRENT_DEVICE')).toBeTruthy();
  });
});
