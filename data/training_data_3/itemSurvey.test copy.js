import React from 'react';
import styled from 'styled-components/native';
import moment from 'moment';
import i18n from '@i18n';
import { Text } from '../../Commons';
import Configs from '../../../utils/configs';
import StatusView from '../../statusView';
import { HorizontalLine, ID, RowWrapper, VerticalLabelValue, Wrapper } from '../ItemCommon';

const InfoWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex: 1;
`;

const Name = styled(Text)`
  margin-vertical: 10px;
`;

const Score = styled(Text)`
  margin-top: 5px;
`

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
        <Text text="SURVEY_SUBMITTED_DATE" preset="medium" />
        <Text text={submittedDate} preset="medium" />
      </InfoWrapper>
      <Name text={name} />
      <StatusView status={status} />
      {item.totalScore && <Score text={`${i18n.t('TOTAL_SCORE')}: ${item.totalScore}`} preset="medium" />}
    </Wrapper>
  );
};

export default ItemSurvey;
