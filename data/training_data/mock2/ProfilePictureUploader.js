// ProfilePictureUploader.jsx
import React from 'react';
import styled from 'styled-components/native';
import { View, Image } from 'react-native';
import { Button, Text } from '@Elements';
import useUser from '@Context/User/Hooks/UseUser';

const UploaderContainer = styled.View`
  align-items: center;
  padding: 20px;
  background-color: white;
`;

const Avatar = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  margin-bottom: 20px;
`;

const ProfilePictureUploader = ({ testID }) => {
  const { user, uploadProfilePicture, isUploading } = useUser();

  const handleUpload = () => {
    // Logic to open image picker and upload
    uploadProfilePicture('new-avatar-url');
  };

  return (
    <UploaderContainer testID={testID}>
      <Avatar source={{ uri: user.avatar }} testID={`${testID}-avatar`} />
      <Button
        title={isUploading ? 'Uploading...' : 'Change Profile Picture'}
        onPress={handleUpload}
        disabled={isUploading}
        testID={`${testID}-upload-button`}
      />
    </UploaderContainer>
  );
};

export default ProfilePictureUploader;