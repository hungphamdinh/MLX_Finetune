import React, { useRef, useState } from 'react';
import styled from 'styled-components/native';
import { KeyboardAvoidingView, Platform } from 'react-native';
import Connect from '@stores';
import _ from 'lodash';
import Icon from 'react-native-vector-icons/Ionicons';
import BaseLayout from '@components/Layout/BaseLayout';
import { Colors } from '@themes';
import ImageAttachment from '@components/socialCommunity/ImageAttachment';
import i18n from '@i18n';
import SelectImageOptionsModal from '@components/SelectImageOptionsModal';
import Avatar from '@components/socialCommunity/avatar';
import { Text } from '@components/Commons';
import toast from '@utils/toast';

const Container = styled.View`
  flex: 1;
  background-color: white;
`;

const PostContainer = styled.ScrollView`
  flex: 1;
  background-color: white;
  padding: 10px;
`;

const UserInfo = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
`;

const Username = styled(Text)`
  font-size: 16px;
  font-weight: bold;
`;

const PostInput = styled.TextInput`
  font-size: 16px;
  margin-bottom: 16px;
  min-height: 100px;
`;

const BottomBar = styled.View`
  flex-direction: row;
  justify-content: space-around;
  background-color: #fff;
  padding: 8px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  box-shadow: 0px 3px 6px #00000029;
  elevation: 3;
`;

const BottomBarButton = styled.TouchableOpacity`
  padding: 8px;
`;

const BottomSafeArea = styled.SafeAreaView`
  background-color: white;
`;

const AddPost = ({ actions, userProfile: { user }, units: { unitActive } }) => {
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const pickerRef = useRef();

  const btImagePress = () => {
    pickerRef.current?.showLibraryPicker();
  };

  const onSelectedImage = (newImages) => {
    setImages([...images, ...newImages]);
  };

  const btCameraPress = () => {
    pickerRef.current?.openCamera();
  };

  const onDeleteImage = (index) => {
    const newImages = _.cloneDeep(images);
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const onSubmit = () => {
    if (images.length > 10) {
      toast.showError('POST_CREATE_IMAGE_LIMIT');
      return;
    }
    actions.socialCommunity.createPost({
      content,
      images,
      unitId: unitActive.unitId,
      memberRole: unitActive.memberRole,
    });
  };

  const baseLayoutProps = {
    title: 'POST_CREATE_TITLE',
    showBell: false,
    rightBtn: {
      text: 'SOCIAL_COMMUNITY_POST_CREATE_BUTTON',
      disabled: _.isEmpty(content) && _.isEmpty(images),
      onPress: onSubmit,
      testID: 'btCreate',
    },
  };

  return (
    <BaseLayout {...baseLayoutProps}>
      <Container>
        <PostContainer>
          <UserInfo>
            <Avatar size={40} />
            <Username text={user?.displayName} />
          </UserInfo>
          <PostInput
            multiline
            maxLength={4000}
            scrollEnabled={false}
            placeholder={i18n.t('POST_CREATE_PLACEHOLDER')}
            value={content}
            onChangeText={setContent}
            placeholderTextColor="gray"
          />
          <ImageAttachment images={images} onDeleteImage={onDeleteImage} />
        </PostContainer>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          keyboardVerticalOffset={Platform.select({ ios: 130, android: 0 })}
        >
          <BottomBar>
            <BottomBarButton onPress={btImagePress}>
              <Icon name="image-outline" size={24} color={Colors.azure} />
            </BottomBarButton>
            <BottomBarButton onPress={btCameraPress}>
              <Icon name="camera" size={24} color={Colors.azure} />
            </BottomBarButton>
          </BottomBar>
        </KeyboardAvoidingView>
      </Container>
      <BottomSafeArea />
      <SelectImageOptionsModal ref={pickerRef} allowSelectFile onSelectedImage={onSelectedImage} />
    </BaseLayout>
  );
};

export default Connect(AddPost);
