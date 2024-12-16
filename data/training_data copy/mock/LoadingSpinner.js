// LoadingSpinner.jsx
import React from 'react';
import styled from 'styled-components/native';
import { ActivityIndicator } from 'react-native';
import { Colors } from '@themes';

const SpinnerContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({ transparent }) => (transparent ? 'rgba(0,0,0,0.3)' : 'transparent')};
`;

const LoadingSpinner = ({ size = 'large', color = Colors.primary, transparent = false, testID }) => (
  <SpinnerContainer transparent={transparent} testID={testID}>
    <ActivityIndicator size={size} color={color} />
  </SpinnerContainer>
);

export default LoadingSpinner;