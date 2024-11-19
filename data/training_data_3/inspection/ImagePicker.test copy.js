import React from 'react';
import { IconButton } from '@Elements';
import I18n from '@I18n';
import { generateGUID } from '@Utils/number';
import { openMultipleImagePicker } from '@Elements/ImagePicker';
import { Colors } from '@Themes';
import useForm from '@Context/Form/Hooks/UseForm';

const ImagePicker = ({ item, updateImageOptions }) => {
  const { uploadFileFormQuestionAnswers } = useForm();

  const openPicker = async (optionId) => {
    const resizedImages = await openMultipleImagePicker({
      singleSelectedMode: true,
      usedCameraButton: true,
    });

    if (resizedImages && resizedImages.length > 0) {
      const selectedImage = {
        ...resizedImages[0],
        guid: generateGUID(),
      };
      const result = await uploadFileFormQuestionAnswers({
        referenceId: item.guid,
        file: [selectedImage],
      });
      if (result) {
        updateImageOptions(optionId, result[0]);
      }
    }
  };

  const handleAddImage = (optionId) => {
    openPicker(optionId);
  };

  return (
    <IconButton
      color={Colors.azure}
      name="image"
      size={20}
      onPress={() => handleAddImage(item.id)}
      testID="image-button"
      accessibilityLabel={I18n.t('FORM_ADD_IMAGE')}
    />
  );
};

export default ImagePicker;
