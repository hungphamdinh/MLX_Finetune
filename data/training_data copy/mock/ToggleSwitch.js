// ToggleSwitch.jsx
import React from 'react';
import styled from 'styled-components/native';
import { Switch } from 'react-native';
import { Text } from '@components/Commons';
import { Colors } from '@themes';

const ToggleContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: ${Colors.bgSecondary};
  border-radius: 8px;
  margin: 8px 16px;
`;

const Label = styled(Text)`
  font-size: 16px;
  color: ${Colors.textPrimary};
`;

const ToggleSwitch = ({ label, value, onValueChange, testID }) => (
  <ToggleContainer testID={testID}>
    <Label text={label} />
    <Switch
      testID={`${testID}-switch`}
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: Colors.trackInactive, true: Colors.trackActive }}
      thumbColor={value ? Colors.thumbActive : Colors.thumbInactive}
    />
  </ToggleContainer>
);

export default ToggleSwitch;