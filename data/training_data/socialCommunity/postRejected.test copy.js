import React from 'react';
import styled from 'styled-components/native';
import { Text, ImageView } from '@components/Commons';
import { images } from '@resources/image';

const PostRejected = ({ detailPost }) => (
  <Wrapper>
    <Icon testID="postRejectedIcon" source={images.postRejected} />
    <Title preset="bold" text="POST_REJECTED_TITLE" />
    <Content text={detailPost?.reason || 'POST_REJECTED_CONTENT'} />
  </Wrapper>
);

const Wrapper = styled.View`
  flex: 1;
  align-items: center;
  padding-top: 50px;
  background-color: #fff;
`;

const Icon = styled(ImageView)`
  width: 48px;
  height: 48px;
  margin-bottom: 15px;
`;

const Title = styled(Text)`
  margin-bottom: 15px;
  font-size: 18px;
`;

const Content = styled(Text)`
  padding-horizontal: 15px;
`;

export default PostRejected;
