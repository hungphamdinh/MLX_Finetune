import React from 'react';
import { Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import SliderHeader from '../sliderHeader';

describe('SliderHeader', () => {
  const mockOnViewAll = jest.fn();
  const title = 'Test Title';

  it('should render the title correctly', () => {
    const { getByText } = render(
      <SliderHeader title={title} onViewAll={mockOnViewAll}>
        <></>
      </SliderHeader>
    );

    expect(getByText(title)).toBeTruthy();
  });

  it('should render the "VIEW_ALL" button and handle press', () => {
    const { getByTestId } = render(
      <SliderHeader title={title} onViewAll={mockOnViewAll}>
        <></>
      </SliderHeader>
    );

    const viewAllButton = getByTestId('view-all-btn');
    fireEvent.press(viewAllButton);

    expect(mockOnViewAll).toHaveBeenCalled();
  });

  it('should render children correctly', () => {
    const childText = 'Child Content';
    const { getByText } = render(
      <SliderHeader title={title} onViewAll={mockOnViewAll}>
        <Text>{childText}</Text>
      </SliderHeader>
    );

    expect(getByText(childText)).toBeTruthy();
  });
});
