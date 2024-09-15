import React, { useState } from 'react';
import styled from 'styled-components/native';
import IC_AVATAR_DF from '@resources/icons/avatar-default.png';
import LOGO from '@resources/icons/savillsLogo.png';
import { decode } from 'html-entities';
import i18n from '@i18n';
import { ImageView, Text } from '../../Commons';
import { Wrapper } from '../ItemCommon';

const RowWrapper = styled.View`
  flex-direction: row;
`;

const ButtonWrapper = styled(Wrapper)`
  padding: 0px;
  padding-top: 16px;
  padding-bottom: ${({ lines }) => (lines > 1 ? lines * 5 : 0)}px;
  margin-top: ${({ index }) => (index === 0 ? 5 : 0)}px;
`;

const ItemWrapper = styled.View`
  width: 90%;
`;
const ID = styled(Text)`
  font-size: 15px;
  margin-bottom: 5px;
  margin-top: -3px;
`;

const Logo = styled(ImageView)`
  width: 25px;
  height: 25px;
  margin-horizontal: 10px;
  border-radius: 5px;
`;

const Content = styled(Text)`
  line-height: 18;
  margin-right: 10px;
`;
const ItemNotice = ({ item, onPress, index }) => {
  const [textLines, setTextLines] = useState(3);
  const _onPress = () => {
    onPress(item.id);
  };
  const image = item.fileUrl ? (item.fileUrl?.mimeType !== 'application/pdf' ? item.fileUrl : IC_AVATAR_DF) : LOGO;
  const plainString = decode(item.content.replace(/(<[^>]+>)|(\s\s+)/g, ''));

  const onTextLayout = ({ nativeEvent: { lines } }) => {
    if (lines.length < 3) {
      setTextLines(lines.length);
    }
  };
  return (
    <ButtonWrapper
      testID="item-notice"
      index={index}
      activeOpacity={1}
      lines={textLines}
      onPress={_onPress}
      gestureHandler
    >
      <RowWrapper>
        <Logo testID="image-view" resizeMode="cover" source={image} />
        <ItemWrapper>
          <ID text={item.subject ? item.subject : i18n.t('IB_NO_SUBJECT')} preset="bold" />
          <Content onTextLayout={onTextLayout} numberOfLines={3} text={plainString.length > 0 ? plainString : ''} />
        </ItemWrapper>
      </RowWrapper>
    </ButtonWrapper>
  );
};

export default ItemNotice;
