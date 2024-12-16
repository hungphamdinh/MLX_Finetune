import React from 'react';
import { renderScreen } from '@Mock/mockApp';
import { fireEvent } from '@testing-library/react-native';
import LibrarySlider from '../librarySlider';

const mockList = {
  data: [
    { documentName: 'subject 1', content: 'libraryName 1' },
    { documentName: 'subject 2', content: 'libraryName 2' },
  ],
  isRefresh: false,
  isLoadMore: false,
  currentPage: 1,
  totalPage: 2,
};

const mockOnViewAllNotices = jest.fn();

describe('LibrarySlider', () => {
  const renderNoticeSlider = () =>
    renderScreen(<LibrarySlider list={mockList} onViewAllNotices={mockOnViewAllNotices} />)({
      store: {
        library: {
          documents: mockList,
        },
      },
    });

  it('should render correctly when having data', () => {
    const { getByText, getByTestId } = renderNoticeSlider();
    const wraper = getByTestId('library-list');
    const title = getByText('LB_TITLEHEADER');
    expect(wraper).toBeTruthy();
    expect(title).toBeTruthy();
  });

  it('should render the list of items when data is available', () => {
    const { getByTestId } = renderNoticeSlider();
    const appList = getByTestId('library-list');
    expect(appList).toBeTruthy();
  });
});
