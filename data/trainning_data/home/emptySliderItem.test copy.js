import React from 'react';
import styled from 'styled-components/native';
import { ImageView, Text } from '@components/Commons';
import { Colors, Metric } from '@themes';
import { icons } from '@resources/icons';

const Wrapper = styled.View`
  align-items: center;
  margin-bottom: 20px;
  width: ${Metric.ScreenWidth};
`;

const Title = styled(Text)`
  font-size: 18px;
  color: ${Colors.azure};
  margin-top: 10px;
`;

const Content = styled(Text)`
  color: ${Colors.azure};
  margin-top: 10px;
`;

const Icon = styled(ImageView)`
  width: 25px;
  height: 25px;
`;

const EmptySliderItem = ({ title, content, icon }) => (
  <Wrapper>
    <Icon testID="icon-bell" resizeMode="contain" source={icon || icons.bell} />
    {title && <Title preset="bold" text={title} />}
    {content && <Content text={content} />}
  </Wrapper>
);

export default EmptySliderItem;
