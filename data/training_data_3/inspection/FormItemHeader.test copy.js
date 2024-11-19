import React from 'react';
import { Alert } from 'react-native';
import _ from 'lodash';
import styled from 'styled-components/native';
import Row from '../../../../../Grid/Row';
import Tag from '../../../../../Tag';
import { IconButton } from '../../../../../../Elements';

const RightWrapper = styled(Row)`
  justify-content: flex-end;
  background-color: white;
`;

const LeftWrapper = styled(Row)`
  flex: 1;
`;

const ButtonViewDetail = styled(IconButton).attrs(() => ({
  containerStyle: {
    marginTop: -5,
  },
}))``;

const ItemTag = styled(Tag).attrs(() => ({
  containerStyle: {
    maxWidth: 100,
  },
}))``;

const ProjectTypeWrapper = styled.View`
  margin-right: -10px;
`;

const Header = ({ projectType, budgetCodes }) => {
  const haveBudgetCodes = _.size(budgetCodes) > 0;
  const onPressViewDetail = () => {
    Alert.alert(budgetCodes.join(', '));
  };

  return (
    <Row>
      <LeftWrapper>{haveBudgetCodes && budgetCodes.map((item) => <ItemTag key={item} title={item} />)}</LeftWrapper>
      <RightWrapper>
        {haveBudgetCodes && (
          <ButtonViewDetail testID="viewDetailButton" name="eye" size={20} onPress={onPressViewDetail} />
        )}
        {projectType && (
          <ProjectTypeWrapper>
            <ItemTag title={projectType} />
          </ProjectTypeWrapper>
        )}
      </RightWrapper>
    </Row>
  );
};

export default Header;
