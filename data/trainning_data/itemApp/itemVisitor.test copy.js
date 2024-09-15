import React from 'react';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import i18n from '@i18n';
import moment from 'moment';
import { Text } from '../../Commons';
import { Colors } from '../../../themes';
import { icons } from '../../../resources/icons';
import Configs from '../../../utils/configs';
import { HorizontalLine, VerticalLabelValue, Wrapper } from '../ItemCommon';

const ID = styled(Text)`
  font-size: 15px;
  ${'' /* flex: 1; */}
  margin-bottom: 12px;
`;

const RowWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 5px;
`;

const Symbol = styled.Image`
  width: 15px;
  height: 22px;
  tint-color: ${Colors.azure};
`;

const LeftValue = styled(Text)`
  font-size: 12px;
  margin-left: 12px;
  flex: 1;
`;

const RightValue = styled(Text)`
  font-size: 12px;
  margin-left: 12px;
`;

const NextWrapper = styled.View`
  width: 18px;
  height: 18px;
  background-color: #648fca;
  border-radius: 5px;
  align-items: center;
  justify-content: center;
  margin-left: 5px;
`;

const ItemVisitor = ({ item, onPress }) => {
  const date = moment(item.createdAt).format(Configs.DayFormat);
  const time = moment(item.createdAt).format('LT');
  const format = 'HH:mm DD/MM/YYYY';
  const checkInTime = item.registerTime ? moment(item.registerTime).format(format) : undefined;
  const checkOutTime = item.registerCheckOutTime ? moment(item.registerCheckOutTime).format(format) : undefined;

  return (
    <Wrapper onPress={onPress} testID="item-visitor">
      <ID text={`#${item.code}`} preset="bold" />
      <RowWrapper>
        <VerticalLabelValue label="COMMON_DATE" value={date} />
        <VerticalLabelValue label="COMMON_TIME" value={time} />
      </RowWrapper>

      <HorizontalLine />
      {item.numberOfVisitors > 0 && (
        <RowWrapper style={{ marginTop: 0 }}>
          <Symbol resizeMode="contain" source={icons.visitorAmounts} />
          <LeftValue text={`${item.numberOfVisitors} ${i18n.t('VS_VISITORS')}`} preset="medium" />
          <RightValue text={`${item.reasonForVisit.name}`} preset="medium" />
        </RowWrapper>
      )}
      {(checkInTime || checkOutTime) && (
        <RowWrapper>
          {checkInTime && (
            <>
              <Symbol source={icons.nounTime} resizeMode="contain" />
              <LeftValue text={`${i18n.t('VS_IN')}: ${checkInTime}`} preset="medium" />
            </>
          )}
          {checkOutTime && (
            <>
              <Symbol source={icons.nounTime} resizeMode="contain" />
              <RightValue text={`${i18n.t('VS_OUT')}: ${checkOutTime}`} preset="medium" />
            </>
          )}
        </RowWrapper>
      )}

      <RowWrapper>
        <Symbol source={icons.location} />
        <LeftValue text={`${item.fullUnitId}`} preset="medium" />
        <NextWrapper>
          <Icon size={12} color="white" name="chevron-forward" />
        </NextWrapper>
      </RowWrapper>
    </Wrapper>
  );
};

export default ItemVisitor;
