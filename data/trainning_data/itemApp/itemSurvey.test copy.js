import React from 'react';
import styled from 'styled-components/native';
import moment from 'moment';
import { Text } from '../../Commons';
import { icons } from '../../../resources/icons';
import Configs from '../../../utils/configs';
import StatusView from '../../statusView';
import { HorizontalLine, ID, RowWrapper, VerticalLabelValue, Wrapper } from '../ItemCommon';
import { Colors } from '../../../themes';

const InfoWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 12px;
`;

const UserIcon = styled.Image`
  width: 15px;
  height: 22px;
  tint-color: ${Colors.azure};
  margin-right: 12px;
`;

const LeftValue = styled(Text)`
  font-size: 12px;

  flex: 1;
`;

const RightValue = styled(Text)`
  font-size: 12px;
  margin-left: 12px;
`;

const ItemSurvey = ({ item, action }) => {
  const { name, isSubmitted, startDate, endDate, creationTime, creatorUserName } = item;
  const status = {
    name: !isSubmitted ? 'SV_TAB_SURVEY' : 'SV_TAB_SURVEYED',
    colorCode: !isSubmitted ? '#58DECB' : '#FF9E9E',
  };
  const from = moment(startDate).format(Configs.DayTimeFormat);
  const to = moment(endDate).format(Configs.DayTimeFormat);
  const submittedDate = moment(creationTime).format(Configs.DayTimeFormat);
  return (
    <Wrapper onPress={action} testID="item-survey">
      <ID text={`#${item.surveyId}`} preset="bold" />
      <RowWrapper>
        <VerticalLabelValue label="COMMON_START_DATE" value={from} />
        <VerticalLabelValue label="COMMON_END_DATE" value={to} />
      </RowWrapper>

      <HorizontalLine />
      <InfoWrapper>
        <LeftValue text="SURVEY_SUBMITTED_DATE" preset="medium" />
        <RightValue text={submittedDate} preset="medium" />
      </InfoWrapper>
      <InfoWrapper>
        <UserIcon source={icons.user} resizeMode="contain" />
        <LeftValue text={creatorUserName} preset="medium" />
        <RightValue text={name} preset="medium" />
      </InfoWrapper>

      <StatusView status={status} />
    </Wrapper>
  );
};

export default ItemSurvey;
