// Badge.jsx
import React from 'react';
import styled from 'styled-components/native';
import { View } from 'react-native';
import { Text } from '@components/Commons';

const BadgeContainer = styled.View`
  background-color: ${({ type }) => {
    switch (type) {
      case 'success':
        return '#4CAF50';
      case 'error':
        return '#F44336';
      case 'warning':
        return '#FFC107';
      default:
        return '#2196F3';
    }
  }};
  padding: 5px 10px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
`;

const Badge = ({ label, type = 'default', testID }) => (
  <BadgeContainer type={type} testID={testID}>
    <Text text={label} color="#fff" preset="bold" />
  </BadgeContainer>
);

export default Badge;