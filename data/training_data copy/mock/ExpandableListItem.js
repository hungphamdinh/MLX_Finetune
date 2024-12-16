// ExpandableListItem.jsx
import React, { useState } from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Text } from '@components/Commons';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '@themes';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ItemContainer = styled.View`
  background-color: ${Colors.bgSecondary};
  padding: 16px;
  margin: 8px 16px;
  border-radius: 8px;
`;

const Header = styled(TouchableOpacity)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Details = styled.View`
  margin-top: 10px;
`;

const ExpandableListItem = ({ title, details, testID }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <ItemContainer testID={testID}>
      <Header onPress={toggleExpand}>
        <Text text={title} preset="bold" />
        <Icon name={expanded ? 'chevron-up' : 'chevron-down'} size={20} color={Colors.textPrimary} />
      </Header>
      {expanded && (
        <Details testID={`${testID}-details`}>
          <Text text={details} />
        </Details>
      )}
    </ItemContainer>
  );
};

export default ExpandableListItem;