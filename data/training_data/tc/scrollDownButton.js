import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styled from 'styled-components/native';
import { TouchableOpacity } from 'react-native';
import { Colors } from '@themes';

const CircleButton = styled(TouchableOpacity)`
  align-self: center;
  background-color: white;
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 30px;
  padding-vertical: 5px;
  padding-horizontal: 8px;
  position: absolute;
  bottom: 30px;
`;

const Icon = styled(Ionicons)`
  margin-top: 3px;
`;

const ScrollDownButton = ({ onPress }) => (
  <CircleButton onPress={onPress}>
    <Icon
      testID="chevron-down-outline"
      color={Colors.azure}
      name="chevron-down-outline"
      size={30}
    />
  </CircleButton>
);

export default ScrollDownButton;
