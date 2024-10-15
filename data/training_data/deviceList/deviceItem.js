import React from 'react';
import styled from 'styled-components/native';
import deviceIcon from '@resources/icons/phone.png';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ImageView, Text } from '../../../../components/Commons';

const RowWrapper = styled.View`
  flex-direction: row;
  margin-top: 10px;
`;

const Wrapper = styled(TouchableOpacity)`
  background-color: white;
  border-radius: 14px;
  margin-bottom: 20px;
  box-shadow: 0px 3px 6px #00000029;
  elevation: 6;
  padding-top: 16px;
  padding-bottom: ${({ lines }) => (lines > 1 ? lines * 5 : 0)}px;
  margin-top: ${({ index }) => (index === 0 ? 5 : 0)}px;
  margin-horizontal: 15px;
`;

const ItemWrapper = styled.View`
  width: 90%;
`;

const Device = styled(Text)`
  font-size: 15px;
  margin-top: 3px;
`;

const CurrentDevice = styled(Text)`
  text-align: right;
  margin-right: 15px;
  color: gray;
`;

const DeviceIcon = styled(ImageView)`
  width: 25px;
  height: 25px;
  margin-horizontal: 10px;
  border-radius: 5px;
`;

const DeviceItem = ({ item, index, isCurrentDevice, onPressItem }) => {
  const textLines = 3;

  return (
    <Wrapper onPress={onPressItem} index={index} activeOpacity={onPressItem ? 0 : 1} lines={textLines}>
      <RowWrapper>
        <DeviceIcon resizeMode="cover" source={deviceIcon} />
        <ItemWrapper>
          <Device text={item.deviceName} preset="bold" />
          <CurrentDevice text={isCurrentDevice ? 'CURRENT_DEVICE' : ''} />
        </ItemWrapper>
      </RowWrapper>
    </Wrapper>
  );
};

export default DeviceItem;
