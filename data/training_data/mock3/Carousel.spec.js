// Carousel.test.jsx
import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import Carousel from '../Carousel';

describe('Carousel Component', () => {
  const imagesMock = [
    { id: 1, url: 'https://example.com/image1.png' },
    { id: 2, url: 'https://example.com/image2.png' },
    { id: 3, url: 'https://example.com/image3.png' },
  ];

  const renderCarousel = (props = {}) =>
    render(
      <Carousel
        images={imagesMock}
        testID="carousel"
        {...props}
      />
    );

  it('renders the correct number of slides', () => {
    const { getByTestId } = renderCarousel();
    imagesMock.forEach((image) => {
      expect(getByTestId(`carousel-slide-${image.id}`)).toBeTruthy();
    });
  });

  it('allows horizontal scrolling', () => {
    const { getByTestId } = renderCarousel();
    const flatList = getByTestId('carousel');
    expect(flatList.props.horizontal).toBe(true);
    expect(flatList.props.pagingEnabled).toBe(true);
    expect(flatList.props.showsHorizontalScrollIndicator).toBe(false);
  });

  it('renders each image correctly', () => {
    const { getByTestId } = renderCarousel();
    imagesMock.forEach((image) => {
      const slide = getByTestId(`carousel-slide-${image.id}`);
      expect(slide.props.source.uri).toBe(image.url);
    });
  });

  it('handles empty images array gracefully', () => {
    const { queryByTestId } = render(
      <Carousel images={[]} testID="empty-carousel" />
    );
    expect(queryByTestId('empty-carousel-slide-1')).toBeNull();
  });

  it('updates slides when images prop changes', () => {
    const { getByTestId, rerender, queryByTestId } = renderCarousel();

    // Initial slides
    imagesMock.forEach((image) => {
      expect(getByTestId(`carousel-slide-${image.id}`)).toBeTruthy();
    });

    // Update images
    const newImages = [
      { id: 4, url: 'https://example.com/image4.png' },
      { id: 5, url: 'https://example.com/image5.png' },
    ];

    rerender(<Carousel images={newImages} testID="carousel" />);

    newImages.forEach((image) => {
      expect(getByTestId(`carousel-slide-${image.id}`)).toBeTruthy();
    });

    // Old slides should no longer exist
    imagesMock.forEach((image) => {
      expect(queryByTestId(`carousel-slide-${image.id}`)).toBeNull();
    });
  });
});