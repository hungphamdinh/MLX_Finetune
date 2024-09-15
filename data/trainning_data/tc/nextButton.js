import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styled from 'styled-components/native';
import { TouchableOpacity } from 'react-native';
import { Text } from '@components/Commons';
import { Colors } from '@themes';

const NextButton = styled(TouchableOpacity)`
  margin-bottom: 15px;
  align-self: flex-end;
  flex-direction: row;
  margin-right: 10px;
`;

const NextText = styled(Text)`
  color: ${({ color }) => color};
  margin-top: 2px;
`;

const Icon = styled(Ionicons)`
  margin-top: 3px;
`

const NextTermButton = ({ disabled, onPressNextTerm, title, showIcon = true }) => (
  <NextButton disabled={disabled} onPress={onPressNextTerm}>
    <NextText showIcon preset="bold" color={disabled ? Colors.textSemiGray : Colors.azure} text={title} />
    {showIcon && (
      <Icon
        testID="chevron-forward-outline"
        color={disabled ? Colors.textSemiGray : Colors.azure}
        name="chevron-forward-outline"
        size={14}
      />
    )}
  </NextButton>
);

export default NextTermButton;
