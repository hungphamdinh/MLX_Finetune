// ExpandableSection.jsx
import React, { useState } from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity } from 'react-native';
import { Text } from '@components/Commons';
import Icon from 'react-native-vector-icons/Ionicons';

const SectionContainer = styled.View`
  margin: 10px 20px;
  border-bottom-width: 1px;
  border-bottom-color: #ddd;
`;

const Header = styled(TouchableOpacity)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
`;

const Content = styled.View`
  padding: 10px 0;
`;

const ExpandableSection = ({ title, children, testID }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <SectionContainer testID={testID}>
      <Header onPress={toggleExpand} testID={`${testID}-header`}>
        <Text text={title} preset="bold" />
        <Icon name={expanded ? 'chevron-up' : 'chevron-down'} size={24} color="#333" />
      </Header>
      {expanded && <Content testID={`${testID}-content`}>{children}</Content>}
    </SectionContainer>
  );
};

export default ExpandableSection;