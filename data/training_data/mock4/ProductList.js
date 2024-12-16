// ProductList.jsx
import React, { useEffect } from 'react';
import { View, FlatList, Text } from 'react-native';
import useProduct from '@Context/Product/Hooks/UseProduct';

const ProductList = () => {
  const { products, getProducts } = useProduct();

  useEffect(() => {
    getProducts();
  }, []);

  if (!products) {
    return <Text>Loading...</Text>;
  }

  return (
    <FlatList
      testID="product-list"
      data={products}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View testID={`product-item-${item.id}`}>
          <Text>{item.name}</Text>
          <Text>{`$${item.price}`}</Text>
        </View>
      )}
    />
  );
};

export default ProductList;