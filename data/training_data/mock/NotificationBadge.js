// NotificationBadge.jsx
import React from 'react';
import styled from 'styled-components/native';
import { View } from 'react-native';
import { Text } from '@components/Commons';
import { Colors } from '@themes';

const BadgeContainer = styled.View`
  position: absolute;
  top: -5px;
  right: -10px;
  background-color: ${Colors.bgError};
  border-radius: 10px;
  padding: 2px 6px;
  min-width: 20px;
  align-items: center;
  justify-content: center;
`;

const NotificationBadge = ({ count, testID }) => {
  if (count <= 0) return null;

  return (
    <BadgeContainer testID={testID}>
      <Text text={count.toString()} color={Colors.textLight} preset="bold" />
    </BadgeContainer>
  );
};

export default NotificationBadge;