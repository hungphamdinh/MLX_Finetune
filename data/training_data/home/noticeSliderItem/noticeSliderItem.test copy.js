import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import IC_AVATAR_DF from '@resources/icons/avatar-default.png';
import LOGO from '@resources/icons/savillsLogo.png';
import { decode } from 'html-entities';
import { ImageView, Text } from '../../../Commons';

const NoticeSliderItem = ({ item, onPress }) => {
  const image = item.fileUrl ? (item.fileUrl?.mimeType !== 'application/pdf' ? item.fileUrl : IC_AVATAR_DF) : LOGO;
  const plainString = decode(item.content.replace(/(<[^>]+>)|(\s\s+)/g, ''));

  return (
    <TouchableOpacity testID="notice-overlay" onPress={onPress}>
      <View style={styles.container}>
        <View>
          <ImageView style={styles.image} source={image} resizeMode="cover" />
          <View>
            <View style={styles.subjectBackground}>
              <Text numberOfLines={1} style={styles.subject}>
                {item.subject}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.contentWrapper}>
            <Text numberOfLines={2} style={styles.content}>
              {plainString}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = {
  container: {
    backgroundColor: 'white',
    borderRadius: 14,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: 300,
  },
  image: {
    width: '100%',
    height: 80,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    overflow: 'hidden',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 8,
    minHeight: 35,
  },
  subject: {
    fontWeight: '600',
    fontSize: 13,
    color: 'white',
  },
  contentWrapper: {
    flexDirection: 'column',
    paddingLeft: 10,
    flex: 1,
  },
  content: {
    color: '#878787',
  },
  subjectBackground: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    zIndex: 1,
    paddingHorizontal: 18,
    paddingVertical: 13,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
  },
};

export default NoticeSliderItem;
