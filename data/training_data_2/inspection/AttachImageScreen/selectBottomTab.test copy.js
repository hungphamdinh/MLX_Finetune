import React from 'react';
import styled from 'styled-components';
import { TouchableOpacity } from 'react-native';
import { RowWrapper } from '../../../../../Components/ItemApp/ItemCommon';
import { Text, IconButton } from '../../../../../Elements';
import I18n from '../../../../../I18n';
import { Metric, Colors } from '../../../../../Themes';

const Wrapper = styled(RowWrapper)`
  background-color: white;
  justify-content: space-between;
  position: absolute;
  bottom: 0px;
  padding-top: 20px;
  padding-horizontal: 20px;
  padding-bottom: 30px;
  width: ${Metric.ScreenWidth}px;
`;

const SelectBottomTab = ({ count, onPressDelete, onSelectAll }) => (
  <Wrapper>
    <TouchableOpacity onPress={onSelectAll}>
      <Text preset="bold" text="COMMON_SELECT_ALL" />
    </TouchableOpacity>
    <Text
      preset="bold"
      text={count === 0 ? I18n.t('COMMON_SELECT') : I18n.t('INSPECTION_PHOTO_SELECTED'.toUpperCase(), null, count)}
    />
    <IconButton testID="delete-button" size={25} color={Colors.azure} name="trash-sharp" onPress={onPressDelete} />
  </Wrapper>
);

export default SelectBottomTab;
