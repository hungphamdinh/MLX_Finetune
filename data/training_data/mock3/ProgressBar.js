// ProgressBar.jsx
import React from 'react';
import styled from 'styled-components/native';
import { View } from 'react-native';
import { Text } from '@components/Commons';

const ProgressContainer = styled.View`
  width: 100%;
  height: 20px;
  background-color: #eee;
  border-radius: 10px;
  overflow: hidden;
  margin-vertical: 10px;
`;

const ProgressFill = styled.View`
  height: 100%;
  width: ${({ progress }) => `${progress}%`};
  background-color: ${({ color }) => color || '#4CAF50'};
  border-radius: 10px 0 0 10px;
`;

const ProgressLabel = styled(Text)`
  text-align: center;
  margin-top: 5px;
  font-size: 14px;
  color: #333;
`;

const ProgressBar = ({ progress, label, color = '#4CAF50', testID }) => (
  <View testID={testID}>
    <ProgressContainer testID={`${testID}-container`}>
      <ProgressFill progress={progress} color={color} testID={`${testID}-fill`} />
    </ProgressContainer>
    {label && <ProgressLabel text={label} testID={`${testID}-label`} />}
  </View>
);

export default ProgressBar;