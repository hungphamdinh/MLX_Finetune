import React from 'react';
import styled from 'styled-components/native';
import { Colors } from '@themes';
import { deviceTypes } from '@configs/constants';
import SwipeableButton from '@components/Commons/SwipeableButton';

const RowWrapper = styled.View`
  flex-direction: row;
  justify-content: center;
  align-self: flex-end;
  margin-top: 15px;
  margin-right: 15px;
`;
const Space = styled.View`
  margin-horizontal: 5px;
`;

const HiddenItem = ({ isCurrentDevice, item, changeDeviceType, removeDevice }) => {
  const deviceType =
    item.registerType === deviceTypes.primary ? 'BTN_CHANGE_TO_SECONDARY_DEVCE' : 'BTN_CHANGE_TO_PRIMARY_DEVCE';

  return (
    <RowWrapper>
      <SwipeableButton color={Colors.azure} title={deviceType} icon="sync-outline" onPress={() => changeDeviceType(item)} />
      <Space />
      <SwipeableButton disabled={isCurrentDevice} color={Colors.bgRed} title="BTN_REMOVE_DEVICE" icon="trash-outline" onPress={() => removeDevice(item)} />

    </RowWrapper>
  );
};

export default HiddenItem;
