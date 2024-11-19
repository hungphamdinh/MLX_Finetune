import React, { useCallback, useState } from 'react';
import { TouchableOpacity, Alert, View } from 'react-native';
import styled from 'styled-components/native';
import { IconButton, ImageView } from '@Elements';
import I18n from '@I18n';
import ImageZoomModal from '../../../../../../ImageZoomModal';

const Image = styled(ImageView)`
  width: 50px;
  height: 50px;
  margin-bottom: 10px;
`;

const DeleteImageButton = styled.TouchableOpacity`
  position: absolute;
  top: -17;
  right: -17px;
  z-index: 2;
`;

const ImageFormQuestion = ({ item, name, allowDelete, updateImageOptions, iconStyle }) => {
  const [zoomModalImage, setZoomModalImage] = useState(null);
  const handleZoomImage = (image) => {
    setZoomModalImage(image);
  };

  const handleCloseZoomModal = () => {
    setZoomModalImage(null);
  };

  const handleDeleteImage = useCallback(() => {
    Alert.alert(
      I18n.t('COMMON_DELETE'),
      I18n.t('DOCUMENT_DELETE_ASK'),
      [
        {
          text: I18n.t('CANCEL'),
          style: 'cancel',
        },
        {
          text: I18n.t('COMMON_DELETE'),
          style: 'destructive',
          onPress: async () => {
            updateImageOptions(item.id, null);
          },
        },
      ],
      { cancelable: true }
    );
  }, [name, item.id]);

  return (
    <View>
      <TouchableOpacity
        testID="image-question"
        style={{ width: iconStyle?.width || 50 }}
        onPress={() => handleZoomImage(item.image)}
      >
        <Image testID="image-view" style={iconStyle} source={item.image} />
        {allowDelete && (
          <DeleteImageButton
            testID="close-circle"
            onPress={handleDeleteImage}
            accessibilityLabel={I18n.t('FORM_DELETE_IMAGE')}
          >
            <IconButton color="red" onPress={handleDeleteImage} name="close-circle" size={20} />
          </DeleteImageButton>
        )}
      </TouchableOpacity>
      <ImageZoomModal
        testID="zoom-modal"
        images={[zoomModalImage]}
        visible={!!zoomModalImage}
        index={1}
        onClose={handleCloseZoomModal}
      />
    </View>
  );
};

export default ImageFormQuestion;
