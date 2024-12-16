import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { renderScreen } from '@Mock/mockApp';
import NoticeSliderItem from '../../noticeSlider/noticeSliderItem';

const mockItem = {
  fileUrl: 'exampleImageUrl',
  content: '<p>Sample content</p>',
  subject: 'Sample Subject',
};

const mockOnPress = jest.fn();

describe('NoticeSliderItem', () => {
  const renderItem = () => renderScreen(<NoticeSliderItem item={mockItem} onPress={mockOnPress} />)({ });

  it('should render correctly', () => {
    const { getByText } = renderItem();
    const itemSubject = getByText('Sample Subject');
    const itemContent = getByText('Sample content');
    expect(itemSubject).toBeTruthy();
    expect(itemContent).toBeTruthy();
  });

  it('should call onPress when notice is pressed', () => {
    const { getByTestId } = renderItem();
    const noticeOverlay = getByTestId('notice-overlay');
    fireEvent.press(noticeOverlay);
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });
});
