// Carousel.jsx
import React from 'react';
import styled from 'styled-components/native';
import { FlatList, Dimensions } from 'react-native';
import { ImageView } from '@components/Commons';

const { width } = Dimensions.get('window');

const CarouselContainer = styled.View`
  height: 200px;
`;

const Slide = styled(ImageView)`
  width: ${width}px;
  height: 200px;
`;

const Carousel = ({ images, testID }) => {
  const renderItem = ({ item }) => (
    <Slide source={{ uri: item.url }} testID={`${testID}-slide-${item.id}`} />
  );

  return (
    <CarouselContainer testID={testID}>
      <FlatList
        data={images}
        horizontal
        pagingEnabled
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
      />
    </CarouselContainer>
  );
};

export default Carousel;