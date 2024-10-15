import React from 'react';
import { renderScreen } from '__@mocks__/mockApp'; // Import your custom renderScreen function
import PostRejected from '../detailPost/PostRejected'; // Adjust the import path as necessary

describe('PostRejected', () => {
  it('renders correctly', () => {
    const { getByText, getByTestId } = renderScreen(<PostRejected />)();
    expect(getByText('POST_REJECTED_TITLE')).toBeTruthy();
    expect(getByText('POST_REJECTED_CONTENT')).toBeTruthy();

    const icon = getByTestId('postRejectedIcon');
    expect(icon).toBeTruthy();
  });
});