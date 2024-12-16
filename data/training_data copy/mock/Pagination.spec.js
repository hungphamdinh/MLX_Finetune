// Pagination.test.jsx
import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import Pagination from '../Pagination';
import { Colors } from '@themes';

describe('Pagination', () => {
  const mockOnPageChange = jest.fn();

  const renderPagination = (currentPage, totalPages) =>
    render(
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={mockOnPageChange}
        testID="pagination"
      />
    );

  it('renders the correct number of page buttons', () => {
    const { getByTestId } = renderPagination(1, 5);
    for (let i = 1; i <= 5; i++) {
      expect(getByTestId(`page-button-${i}`)).toBeTruthy();
    }
  });

  it('highlights the current page', () => {
    const { getByTestId } = renderPagination(3, 5);
    const currentPageButton = getByTestId('page-button-3');
    expect(currentPageButton.props.style.backgroundColor).toBe(Colors.primary);
    const currentPageText = currentPageButton.findByType('Text');
    expect(currentPageText.props.style.color).toBe(Colors.textLight);
    expect(currentPageText.props.style.fontWeight).toBe('bold');
  });

  it('calls onPageChange with correct page number when a page button is pressed', () => {
    const { getByTestId } = renderPagination(2, 4);
    const pageButton = getByTestId('page-button-4');
    fireEvent.press(pageButton);
    expect(mockOnPageChange).toHaveBeenCalledWith(4);
  });

  it('does not highlight non-current pages', () => {
    const { getByTestId } = renderPagination(2, 3);
    const nonCurrentPageButton = getByTestId('page-button-1');
    expect(nonCurrentPageButton.props.style.backgroundColor).toBe(Colors.bgSecondary);
    const nonCurrentPageText = nonCurrentPageButton.findByType('Text');
    expect(nonCurrentPageText.props.style.color).toBe(Colors.textPrimary);
    expect(nonCurrentPageText.props.style.fontWeight).toBe('normal');
  });

  it('renders correctly when there is only one page', () => {
    const { getByTestId } = renderPagination(1, 1);
    expect(getByTestId('page-button-1')).toBeTruthy();
  });

  it('handles zero pages gracefully', () => {
    const { queryByTestId } = render(
      <Pagination currentPage={0} totalPages={0} onPageChange={mockOnPageChange} testID="pagination" />
    );
    expect(queryByTestId('pagination')).toBeTruthy();
    // No page buttons should be rendered
    expect(queryByTestId('page-button-1')).toBeNull();
  });
});