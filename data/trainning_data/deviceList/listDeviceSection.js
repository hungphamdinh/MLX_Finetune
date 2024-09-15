import React, { Fragment } from 'react';
import AppSwipeList from '@components/Lists/AppSwipeList';
import styled from 'styled-components/native';
import { View } from 'react-native';
import i18n from '@i18n';
import { Text } from '@components/Commons';

const Title = styled(Text)`
  text-transform: capitalize;
  margin-horizontal: 16px;
  font-weight: bold;
  margin-vertical: 8px;
`;

const ListDeviceSection = ({ title, currentDeviceAmount, maxDeviceAmount, ...deviceProps }) => (
  <Fragment>
    <Title>
      {i18n.t(title)} ({currentDeviceAmount}/{maxDeviceAmount}):
    </Title>
    <View>
      <AppSwipeList {...deviceProps} />
    </View>
  </Fragment>
);

export default ListDeviceSection;
