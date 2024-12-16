import React from 'react';
import { renderScreen } from '@Mock/mockApp';
import EmptySliderItem from '../emptySliderItem';

describe('EmptySliderItem', () => {
  it('renders correctly', () => {
    const { getByText, getByTestId } = renderScreen(<EmptySliderItem title={"NOTICE_LIST_EMPTY_TITLE"} content={"NOTICE_LIST_EMPTY_CONTENT"} />)();

    expect(getByTestId('icon-bell')).toBeTruthy();
    expect(getByText('NOTICE_LIST_EMPTY_TITLE')).toBeTruthy();
    expect(getByText('NOTICE_LIST_EMPTY_CONTENT')).toBeTruthy();
  });
});