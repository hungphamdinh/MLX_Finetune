// ProfileCard.jsx
import React from 'react';
import styled from 'styled-components/native';
import { ImageView, Text } from '@components/Commons';
import { Colors } from '@themes';

const Card = styled.View`
  background-color: white;
  border-radius: 10px;
  padding: 16px;
  align-items: center;
  shadow-color: #000;
  shadow-offset: {
    width: 0;
    height: 2;
  };
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  elevation: 5;
  margin: 10px;
`;

const Avatar = styled(ImageView)`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  margin-bottom: 12px;
`;

const Name = styled(Text)`
  font-size: 20px;
  font-weight: bold;
  color: ${Colors.textPrimary};
  margin-bottom: 4px;
`;

const Email = styled(Text)`
  font-size: 14px;
  color: ${Colors.textSecondary};
`;

const ProfileCard = ({ user, onPress }) => (
  <Card testID="profile-card" onPress={onPress}>
    <Avatar source={{ uri: user.avatar }} />
    <Name text={user.name} />
    <Email text={user.email} />
  </Card>
);

export default ProfileCard;