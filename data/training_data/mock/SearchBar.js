// SearchBar.jsx
import React from 'react';
import styled from 'styled-components/native';
import { TextInput, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '@themes';

const SearchContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${Colors.bgSecondary};
  padding: 8px 12px;
  border-radius: 8px;
  margin: 10px;
`;

const StyledTextInput = styled(TextInput)`
  flex: 1;
  font-size: 16px;
  color: ${Colors.textPrimary};
`;

const SearchBar = ({ placeholder, value, onChangeText, onClear, testID }) => (
  <SearchContainer testID={testID}>
    <Icon name="search-outline" size={20} color={Colors.textSecondary} />
    <StyledTextInput
      placeholder={placeholder}
      placeholderTextColor={Colors.textSecondary}
      value={value}
      onChangeText={onChangeText}
      testID={`${testID}-input`}
    />
    {value.length > 0 && (
      <Icon name="close-circle" size={20} color={Colors.textSecondary} onPress={onClear} testID={`${testID}-clear`} />
    )}
  </SearchContainer>
);

export default SearchBar;