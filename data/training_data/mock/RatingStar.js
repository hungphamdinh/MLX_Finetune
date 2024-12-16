// RatingStar.jsx
import React from 'react';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '@themes';

const StarContainer = styled.View`
  flex-direction: row;
`;

const RatingStar = ({ rating, onRate, testID }) => {
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);

  return (
    <StarContainer testID={testID}>
      {stars.map((star) => (
        <Icon
          key={star}
          name={star <= rating ? 'star' : 'star-outline'}
          size={24}
          color={Colors.star}
          onPress={() => onRate(star)}
          testID={`star-${star}`}
        />
      ))}
    </StarContainer>
  );
};

export default RatingStar;