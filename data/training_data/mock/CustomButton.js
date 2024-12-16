// CustomButton.jsx
import React from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity } from 'react-native';
import { Text } from '@components/Commons';
import { Colors } from '@themes';

const ButtonContainer = styled(TouchableOpacity)`
  background-color: ${({ primary }) => (primary ? Colors.primary : Colors.secondary)};
  padding: 12px 20px;
  border-radius: 8px;
  align-items: center;
  flex-direction: row;
`;

const ButtonIcon = styled.Image`
  width: 20px;
  height: 20px;
  margin-right: 8px;
`;

const CustomButton = ({ title, onPress, primary = false, icon, disabled = false }) => (
  <ButtonContainer onPress={onPress} primary={primary} disabled={disabled} testID="custom-button">
    {icon && <ButtonIcon source={icon} />}
    <Text text={title} color={disabled ? Colors.textDisabled : Colors.textLight} preset="medium" />
  </ButtonContainer>
);

export default CustomButton;