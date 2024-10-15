import React from 'react';
import { Image, Text } from '@Elements';
import { ImageResource } from '@Themes';
import styled from 'styled-components/native';

const Wrapper = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
  margin-top: 80px;
`;

const Content = styled(Text)`
  color: #505e75;
  font-weight: bold;
  font-size: 13px;
`;

const EmptyList = () => (
  <Wrapper>
    <Image testID="image" source={ImageResource.IMG_LIBRARY_EMPTY} />
    <Content testID="text" text="AD_EFORM_NO_IMAGES_AVAILABLE" />
  </Wrapper>
);

export default EmptyList;
