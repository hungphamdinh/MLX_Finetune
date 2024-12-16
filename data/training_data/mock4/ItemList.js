// ItemList.jsx
import React from 'react';
import styled from 'styled-components/native';
import { FlatList, TouchableOpacity } from 'react-native';
import { Text } from '@components/Commons';

const ListContainer = styled.View`
  flex: 1;
  padding: 20px;
  background-color: white;
`;

const ListItem = styled(TouchableOpacity)`
  padding: 15px;
  border-bottom-width: 1px;
  border-bottom-color: #eee;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ItemName = styled(Text)`
  font-size: 18px;
  color: #333;
`;

const ItemPrice = styled(Text)`
  font-size: 16px;
  color: #666;
`;

const ItemList = ({ items, onItemPress, testID }) => {
  const renderItem = ({ item }) => (
    <ListItem onPress={() => onItemPress(item.id)} testID={`item-list-${item.id}`}>
      <ItemName text={item.name} />
      <ItemPrice text={`$${item.price}`} />
    </ListItem>
  );

  return (
    <ListContainer testID={testID}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </ListContainer>
  );
};

export default ItemList;