// UserProfile.jsx
import React, { useEffect } from 'react';
import styled from 'styled-components/native';
import { View } from 'react-native';
import { Text, ImageView, Button } from '@components/Commons';
import useUser from '@Context/User/Hooks/UseUser';
import NavigationService from '@NavigationService';

const ProfileContainer = styled.View`
  flex: 1;
  padding: 20px;
  align-items: center;
  background-color: white;
`;

const Avatar = styled(ImageView)`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  margin-bottom: 20px;
`;

const Username = styled(Text)`
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
`;

const Email = styled(Text)`
  font-size: 16px;
  color: #666;
  margin-bottom: 30px;
`;

const EditButton = styled(Button)`
  width: 200px;
`;

const UserProfile = ({ testID }) => {
  const { user, fetchUser } = useUser();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleEdit = () => {
    NavigationService.navigate('EditProfile');
  };

  if (!user) {
    return (
      <ProfileContainer testID={testID}>
        <Text text="Loading..." />
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer testID={testID}>
      <Avatar source={{ uri: user.avatar }} testID={`${testID}-avatar`} />
      <Username text={user.name} testID={`${testID}-username`} />
      <Email text={user.email} testID={`${testID}-email`} />
      <EditButton title="Edit Profile" onPress={handleEdit} testID={`${testID}-edit-button`} />
    </ProfileContainer>
  );
};

export default UserProfile;