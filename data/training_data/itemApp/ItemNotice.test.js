import React from 'react';
import { renderScreen } from '@Mock/mockApp';
import { fireEvent } from '@testing-library/react-native';
import { images } from '@resources/image';
import ItemNotice from '../ItemNotice';

const EmptyImage = images.emptyImage;

describe('ItemNotice', () => {
  const sampleItem = {
    id: '1',
    fileUrl: null,
    content: 'Sample content',
    subject: 'Sample Subject',
  };
  const onPressMock = jest.fn();
  const render = (item = sampleItem) => renderScreen(<ItemNotice item={item} onPress={onPressMock} index={0} />)({});

  it('renders correctly', () => {
    const { getByText } = render();

    expect(getByText('Sample Subject')).toBeTruthy();
    expect(getByText('Sample content')).toBeTruthy();
  });

  it('handles onPress', () => {
    const { getByTestId } = render();

    fireEvent.press(getByTestId('item-notice'));
    expect(onPressMock).toHaveBeenCalledWith(sampleItem.id);
  });

  it('handles short content correctly', () => {
    const shortContentItem = { ...sampleItem, content: 'Short content' };
    const { getByText } = render(shortContentItem);
    expect(getByText('Short content')).toBeTruthy();
  });

  it('handles long content correctly', () => {
    const longContent = 'L'.repeat(50);
    const longContentItem = { ...sampleItem, content: longContent };
    const { getByText } = render(longContentItem);
    expect(getByText(longContent.substring(0, 50))).toBeTruthy();
  });

  it('displays the correct image', () => {
    const { getByTestId } = render();
    const imageComponent = getByTestId('image-view');
    expect(imageComponent.props.source).toBe(sampleItem.fileUrl || EmptyImage);
  });

  it('shows default message when subject is missing', () => {
    const noSubjectItem = { ...sampleItem, subject: '' };
    const { getByText } = render(noSubjectItem);
    expect(getByText('IB_NO_SUBJECT')).toBeTruthy();
  });

  it('handles HTML content correctly', () => {
    const htmlContentItem = { ...sampleItem, content: '<b>Bold Content</b><script>evilScript()</script>' };
    const { getByText } = render(htmlContentItem);
    expect(getByText('Bold ContentevilScript()')).toBeTruthy();
  });
});
