import React from 'react';
import styled from 'styled-components/native';
import { Text } from '@components/Commons';
import withAppModal from '../../../../components/appModalHOC';
import DeviceItem from '../deviceItem';

const Wrapper = styled.View`
  align-items: center;
`;

const Title = styled(Text)`
  margin-bottom: 10px;
`;

const DeviceReplaceModal = ({ list, onPressItem, onClosePress }) => {
  const onPress = (item) => {
    onClosePress();
    onPressItem(item);
  };

  return (
    <Wrapper>
      <Title text="REGISTER_DEVICE_REPLACE_WARNING" />
      {list.map((item, index) => (
        <DeviceItem key={item.deviceCode} onPressItem={() => onPress(item)} item={item} index={index} />
      ))}
    </Wrapper>
  );
};

export default withAppModal(DeviceReplaceModal);
