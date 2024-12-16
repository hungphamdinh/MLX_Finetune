// RatingStar.test.jsx
import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import RatingStar from '../RatingStar';
import { Colors } from '@themes';

describe('RatingStar', () => {
  const mockOnRate = jest.fn();

  const renderRatingStar = (rating = 0) =>
    render(
      <RatingStar
        rating={rating}
        onRate={mockOnRate}
        testID="rating-star"
      />
    );

  it('renders five stars', () => {
    const { getByTestId } = renderRatingStar();
    for (let i = 1; i <= 5; i++) {
      expect(getByTestId(`star-${i}`)).toBeTruthy();
    }
  });

  it('highlights correct number of stars based on rating', () => {
    const { getByTestId, rerender } = renderRatingStar(3);
    for (let i = 1; i <= 5; i++) {
      const star = getByTestId(`star-${i}`);
      if (i <= 3) {
        expect(star.props.name).toBe('star');
        expect(star.props.color).toBe(Colors.star);
      } else {
        expect(star.props.name).toBe('star-outline');
        expect(star.props.color).toBe(Colors.star);
      }
    }

    rerender(<RatingStar rating={5} onRate={mockOnRate} testID="rating-star" />);
    for (let i = 1; i <= 5; i++) {
      expect(getByTestId(`star-${i}`).props.name).toBe('star');
    }
  });

  it('calls onRate with correct star number when a star is pressed', () => {
    const { getByTestId } = renderRatingStar();
    fireEvent.press(getByTestId('star-4'));
    expect(mockOnRate).toHaveBeenCalledWith(4);
  });

  it('updates stars when rating changes', () => {
    const { getByTestId, rerender } = renderRatingStar(2);
    fireEvent.press(getByTestId('star-5'));
    rerender(<RatingStar rating={5} onRate={mockOnRate} testID="rating-star" />);
    for (let i = 1; i <= 5; i++) {
      expect(getByTestId(`star-${i}`).props.name).toBe('star');
    }
  });

  it('handles zero rating correctly', () => {
    const { getByTestId } = renderRatingStar(0);
    for (let i = 1; i <= 5; i++) {
      expect(getByTestId(`star-${i}`).props.name).toBe('star-outline');
    }
  });
});