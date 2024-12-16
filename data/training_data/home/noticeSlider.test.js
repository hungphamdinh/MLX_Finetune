import React from 'react';
import { renderScreen } from '@Mock/mockApp';
import { fireEvent } from '@testing-library/react-native';
import NoticeSlider from '../noticeSlider';

const mockList = {
  data: [
    {subject: 'subject 1', content: 'content 1'},
    {subject: 'subject 2', content: 'content 2'},
  ],
  isRefresh: false,
  isLoadMore: false,
  currentPage: 1,
  totalPage: 2,
};

const mockOnViewAllNotices = jest.fn();

describe('NoticeSlider', () => {
  const renderNoticeSlider = () => renderScreen(<NoticeSlider list={mockList} onViewAllNotices={mockOnViewAllNotices} />)({});

  it('should render correctly when having data', () => {
    const { getByText, getByTestId} = renderNoticeSlider();
    const wraper = getByTestId('notice-list');
    const title = getByText('NOTICES');
    expect(wraper).toBeTruthy();
    expect(title).toBeTruthy();
  });

  it('should render the list of items when data is available', () => {
    const { getByTestId } = renderNoticeSlider();
    const appList = getByTestId('notice-list');
    expect(appList).toBeTruthy();
  });

});