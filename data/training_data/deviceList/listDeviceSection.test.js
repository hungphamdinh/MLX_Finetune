import React from 'react';
import { renderScreen } from '@Mock/mockApp';
import ListDeviceSection from '../../deviceList/listDeviceSection';

describe('ListDeviceSection', () => {
  const deviceProps = {
    devices: [
      {
        id: 1,
        name: 'Device 1',
      },
      {
        id: 2,
        name: 'Device 2',
      },
    ],
  };

  const renderItem = (currentDeviceAmount, maxDeviceAmount) =>
    renderScreen(
      <ListDeviceSection
        title="Device List"
        currentDeviceAmount={currentDeviceAmount}
        maxDeviceAmount={maxDeviceAmount}
        refreshing={false}
        {...deviceProps}
      />
    )();

  it('renders the component with the correct title and device count', () => {
    const { getByText } = renderItem(2, 5);
    expect(getByText('Device List (2/5):')).toBeTruthy();
  });
});
