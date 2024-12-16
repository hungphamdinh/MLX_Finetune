/**
 * Created by thienmd on 10/26/20
 */
import React from 'react';
import { StyleSheet, TouchableOpacity, View, Alert, PermissionsAndroid, Platform, ScrollView } from 'react-native';
import _ from 'lodash';
import NavigationServices from '@NavigationService';
import BaseLayout from '@Components/Layout/BaseLayout';
import { Text } from '@Elements';
import I18n from '@I18n';
import { Colors } from '@Themes';
import { DraggableGrid } from 'react-native-draggable-grid';
import useFile from '../../../../Context/File/Hooks/UseFile';
import { generateInspectionUUID, TableNames } from '../../../../Services/OfflineDB/IDGenerator';
import SelectBottomTab from './SelectBottomTab';
import { toast } from '../../../../Utils';
import apiConfig from '../../../../Config/apiConfig';
import ImageZoomModal from '../../../../Components/ImageZoomModal';
import { usePhotoEditor } from '../../../../Components/InnovatorInspection/PhotoEditor';
import { useRoute } from '@react-navigation/native';
import EmptyList from './EmptyList';
import ImageItem from './ImageItem';
import useInspection from '../../../../Context/Inspection/Hooks/UseInspection';
import useApp from '../../../../Context/App/Hooks/UseApp';

const RightButton = ({ onPress, text, disabled }) => (
  <TouchableOpacity onPress={disabled ? undefined : onPress}>
    <Text
      style={{ textDecorationLine: 'underline', color: disabled ? 'gray' : Colors.text }}
      preset="bold"
      text={text}
    />
  </TouchableOpacity>
);

const AttachImages = () => {
  const route = useRoute();
  const { params } = route;
  const [selectMode, setSelectMode] = React.useState(false);
  const [selectedItems, setSelectedItems] = React.useState([]);
  const [images, setImages] = React.useState(params?.images || []);
  const [zoomModalVisible, setZoomModalVisible] = React.useState(false);
  const [imageIndex, setImageIndex] = React.useState(0);
  const [scrollEnabled, setScrollEnabled] = React.useState(true);

  const callBack = params?.callBack;
  const submitOnline = params?.submitOnline;
  const isView = params?.isView;
  const workflowGuid = params?.workflowGuid;
  const isRequiredLocation = params?.isRequiredLocation;
  const uaqId = params?.uaqId;

  const isHaveFileUrl = (item) => item.files?.fileUrl;

  const { uploadFiles, isLoading, downloadImage } = useFile();
  const { showPhotoEditor } = usePhotoEditor();
  const { showLoading } = useApp();
  const { getUserAnswerQuestionImage } = useInspection();

  const modifyKeyDraggableItem = (data) =>
    data.map((item) => {
      item.key = item.id;
      return item;
    });

  React.useEffect(() => {
    if (_.size(images)) {
      initImages();
    }
  }, []);

  const initImages = () => {
    const positionImages = images.map((item, index) => {
      if (item.files) {
        if (!item.files.position) {
          item.position = index;
          item.files.position = index;
        } else {
          item.position = item.files.position;
        }
      }
      return item;
    });
    setImages(_.orderBy(positionImages, 'position', 'asc'));
    modifyKeyDraggableItem(positionImages);
  };

  const handleDownload = async (url) => {
    if (Platform.OS === 'android') {
      const granted = await getPermissionAndroid();
      if (!granted) {
        // return;
      }
    }
    const res = await downloadImage(url);
    return res;
  };

  const getPermissionAndroid = async () => {
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
        title: 'Image Download Permission',
        message: 'Your permission is required to save images to your device',
      });
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      }
    } catch (err) {}
  };

  const uploadImagesOnline = async (data) => {
    const result = await uploadFiles('', data);
    const transResult = result.map((item) => ({
      files: item,
      guid: item.guid,
    }));
    return transResult;
  };

  const handleAddImage = async (items) => {
    if (submitOnline) {
      const notUploadedImages = items.map((image, index) => ({
        file: image.uri,
        position: (_.last(images)?.files?.position || 0) + index + 1,
      }));
      const result = await uploadImagesOnline(notUploadedImages);
      onAddNewImage(result);
      return;
    }
    onAddNewImage(items);
  };

  const handleEditImage = async (editedItem) => {
    if (submitOnline) {
      editedItem.file = editedItem.uri;
      editedItem.position = editedItem.files.position;

      const result = await uploadImagesOnline(editedItem);
      images.forEach((item) => {
        if (item.id === editedItem.id) {
          item.id = result.guid;
        }
        return item;
      });
      onImageChanged(result[0]);
      return;
    }
    onImageChanged(editedItem);
    showLoading(false);
  };

  const onImageChanged = (newImage) => {
    // replace the old image with the new
    const selectedImage = images.find((image) => image.id === newImage.id);

    const newEditedImage = {
      id: selectedImage.id,
      uaqId: selectedImage.uaqId,
      path: newImage.uri,
      description: newImage.description,
      files: newImage.files,
      workflowGuid,
    };
    if (submitOnline) {
      newEditedImage.imageGuid = newImage.files.guid;
    }
    const currentImages = images.map((image) => (image.id === newImage.id ? newEditedImage : image));
    onAddNewImage(currentImages, true);
  };

  const getFileUrl = (fileUrl) => `${fileUrl}&encToken=${encodeURIComponent(apiConfig.encToken)}`;

  const onOpenModalImageFull = (index) => {
    const newData = images.map((value) => ({
      ...value,
      fileUrl: getFileUrl(_.get(value, 'files.fileUrl')),
    }));
    setImages(newData);
    setImageIndex(index);
    setZoomModalVisible(true);
  };

  const onEditImage = async (item) => {
    let files = item.files;
    const getImageUrl = async () => {
      if (isHaveFileUrl(item)) {
        return files.fileUrl;
      }
      if (!submitOnline) {
        const formUserQuestionImage = await getUserAnswerQuestionImage(item.id);
        if (isHaveFileUrl(formUserQuestionImage)) {
          files = formUserQuestionImage.files;
          return files.fileUrl;
        }
      }

      return undefined;
    };

    const fileUrl = await getImageUrl();

    if (fileUrl) {
      const downloadPath = await handleDownload(fileUrl);
      _.set(item, 'path', downloadPath);
    }

    const image = {
      id: item.id,
      uri: item.path,
      files,
    };
    showPhotoEditor(image, handleEditImage, onCancelEditImage);
  };

  const onCancelEditImage = () => {
    showLoading(false);
  };

  const onSelectAll = () => {
    setSelectedItems(images);
  };

  const confirmDeleteImage = (callBack, text = 'INSPECTION_REMOVE_PHOTO_CONFIRM') => {
    Alert.alert(I18n.t('COMMON_DELETE'), I18n.t(text), [
      {
        text: I18n.t('AD_COMMON_CANCEL'),
        style: 'cancel',
      },
      {
        text: I18n.t('AD_COMMON_YES'),
        onPress: callBack,
      },
    ]);
  };

  const updateImages = (data) => {
    setImages(data);
    setSelectMode(false);
    setSelectedItems([]);
    callBack(data);
  };

  const onDeleteSelectedItem = () => {
    const selectedIds = selectedItems.map((item) => item.id);
    const filterImages = images.filter((image) => !selectedIds.includes(image.id));
    updateImages(filterImages);
  };

  const onDeletePress = (item) => {
    const filterImages = images.filter((image) => image.id !== item.id);
    const deletedImages = filterImages.map((item, index) => {
      item.files.position = index;
      return item;
    });
    updateImages(deletedImages);
  };

  const onBtAddPress = () => {
    NavigationServices.navigate('inspectionCamera', { onCompleted: handleAddImage, isRequiredLocation });
  };

  const onPressRightButton = () => {
    setSelectMode(!selectMode);
  };

  const onAddNewImage = (imgs, isReplace) => {
    const imageTransform = imgs.map((img) => {
      const offlineFiles = {
        position: _.size(images) + img.position,
      };
      const id = generateInspectionUUID(TableNames.formUserAnswerQuestionImage);
      return {
        id,
        path: img.uri,
        description: img.description,
        workflowGuid,
        location: img.location,
        files: submitOnline ? img.files : offlineFiles,
        imageGuid: img.guid,
        uaqId,
      };
    });
    const newImages = isReplace ? imgs : [...images, ...imageTransform];
    updateImages(modifyKeyDraggableItem(newImages));
    toast.showSuccess(I18n.t('INSPECTION_PHOTO_SAVE_SUCCESS'));
  };

  const onSelectPhoto = (item) => {
    const isExist = selectedItems.find((image) => image.id === item.id);
    if (isExist) {
      const newSelectedItems = selectedItems.filter((image) => image.id !== item.id);
      setSelectedItems(newSelectedItems);
      return;
    }
    setSelectedItems([...selectedItems, item]);
  };

  const onZoomModalClose = () => {
    setZoomModalVisible(false);
  };

  const onDragRelease = (data) => {
    const reorderingImages = data.map((item, index) => {
      const pos = index + 1;
      item.position = pos;
      const filePos = {
        ...item.files,
        position: pos,
      };
      item.files = filePos;
      return item;
    });
    updateImages(reorderingImages);
    setScrollEnabled(true);
  };

  const listProps = {
    data: images,
    numColumns: 2,
    columnWrapperStyle: styles.row,
    style: styles.list,
    showsVerticalScrollIndicator: false,
    contentContainerStyle: styles.contentContainer,
    ItemSeparatorComponent: () => <View style={{ height: 20 }} />,
    renderItem: (item) => renderItem(item),
    ListEmptyComponent: <EmptyList />,
    onItemPress: (data) => {
      onOpenModalImageFull((data.position || data.files.position) - 1);
    },
    onDragRelease: (data) => onDragRelease(data),
    onDragStart: () => setScrollEnabled(false),
  };

  const mainLayoutProps = {
    onBtAddPress,
    showAddButton: !selectMode && !isView,
    addTitle: 'INSPECTION_ADD_IMAGE',
    loading: isLoading,
    title: I18n.t('AD_COMMON_PHOTOS'),
    rightBtn: !isView,
    customRightBtn: !isView && (
      <RightButton
        onPress={onPressRightButton}
        disabled={images.length === 0}
        text={!selectMode ? 'SELECT' : 'AD_COMMON_CANCEL'}
      />
    ),
  };

  const renderItem = (item) => {
    const checked = selectedItems.findIndex((image) => image.id === item.id) > -1;
    return (
      // Need define this one for Draggable Item can work
      <View testID={`image-${item.key}`} key={item.key}>
        <ImageItem
          isView={isView}
          checked={checked}
          selectMode={selectMode}
          source={isHaveFileUrl(item) ? item.files : item.path}
          onDeletePress={() => confirmDeleteImage(() => onDeletePress(item))}
          onEditImage={() => onEditImage(item)}
          onSelect={() => onSelectPhoto(item)}
        />
      </View>
    );
  };

  return (
    <BaseLayout {...mainLayoutProps}>
      <ScrollView scrollEnabled={scrollEnabled}>
        <DraggableGrid {...listProps} />
      </ScrollView>

      {selectMode && (
        <SelectBottomTab
          onSelectAll={onSelectAll}
          count={selectedItems.length}
          onPressDelete={() =>
            confirmDeleteImage(
              onDeleteSelectedItem,
              I18n.t('INSPECTION_REMOVE_SELECTED_PHOTO_CONFIRM', null, selectedItems.length)
            )
          }
        />
      )}
      <ImageZoomModal images={images} visible={zoomModalVisible} index={imageIndex} onClose={onZoomModalClose} />
    </BaseLayout>
  );
};

export default AttachImages;

const styles = StyleSheet.create({
  contentContainer: {
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 80,
  },
  list: {
    flex: 1,
  },
  row: {
    justifyContent: 'space-between',
  },
});
