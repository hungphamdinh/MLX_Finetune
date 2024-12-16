import React from 'react';
import i18n from '@i18n';
import CurrencyFormatter from '../../../utils/currencyFormatter';
import { Card, Text } from '../../Commons';
import _ from 'lodash';
import styled from 'styled-components';

const SectionScore = styled(Text)`
  margin-top: 5px;
`;

const FormTotalScore = ({ totalScores }) => {
  const totalScore =
    totalScores.length > 0 ? totalScores.reduce((accumulator, curr) => accumulator + curr.score, 0) : 0;
  if (totalScore === 0) {
    return;
  }

  const formatScore = (score) => {
    return CurrencyFormatter.getInstance().formatNumber(score);
  }

  return React.useMemo(() => {
    return (
      <Card testID="card">
        <Text>
          <Text text={`${i18n.t('FORM_TOTAL_SCORE')}: `} preset="bold" />
          <Text text={formatScore(totalScore)} />
        </Text>
        {totalScores.map(
          (item) => item.score > 0 && <SectionScore text={`${item.section}: ${formatScore(item.score)} ${i18n.t('SCORE')}`} />
        )}
      </Card>
    );
  }, [totalScore]);
};

export default FormTotalScore;
