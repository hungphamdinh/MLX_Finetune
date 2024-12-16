// InspectionListScreen.test.jsx
import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import InspectionListScreen from '../InspectionListScreen';
import useInspection from '@Context/Inspection/Hooks/UseInspection';
import { renderScreen } from '@Utils/renderScreen';

// Mock External Dependencies
jest.mock('@Context/Inspection/Hooks/UseInspection');
jest.mock('@Elements', () => ({
  Text: ({ text }) => <text>{text}</text>,
  Button: ({ title, onPress, testID }) => (
    <button onClick={onPress} data-testid={testID}>
      {title}
    </button>
  ),
  SearchBar: ({ testID }) => <input data-testid={testID} />,
}));

describe('InspectionListScreen Component', () => {
  const mockFetchInspections = jest.fn();
  const mockLoadMoreInspections = jest.fn();

  const inspectionsMock = [
    { id: 1, name: 'Inspection One' },
    { id: 2, name: 'Inspection Two' },
  ];

  beforeEach(() => {
    useInspection.mockReturnValue({
      inspections: inspectionsMock,
      fetchInspections: mockFetchInspections,
      isLoading: false,
      isRefreshing: false,
      loadMoreInspections: mockLoadMoreInspections,
      hasMore: true,
    });
    mockFetchInspections.mockClear();
    mockLoadMoreInspections.mockClear();
  });

  const navigationMock = {
    navigate: jest.fn(),
  };

  const renderComponent = (props = {}) =>
    renderScreen(<InspectionListScreen navigation={navigationMock} {...props} />)();

  it('renders the list of inspections', () => {
    const { getByTestId } = renderComponent({ testID: 'inspection-list' });
    inspectionsMock.forEach((item) => {
      expect(getByTestId(`inspection-list-item-${item.id}`)).toBeTruthy();
    });
  });

  it('calls fetchInspections on mount', () => {
    renderComponent();
    expect(mockFetchInspections).toHaveBeenCalledTimes(1);
  });

  it('navigates to CreateInspection screen when create button is pressed', () => {
    const { getByTestId } = renderComponent({ testID: 'inspection-list' });
    fireEvent.press(getByTestId('inspection-list-create-button'));
    expect(navigationMock.navigate).toHaveBeenCalledWith('CreateInspection');
  });

  it('navigates to InspectionDetail screen when an item is pressed', () => {
    const { getByTestId } = renderComponent({ testID: 'inspection-list' });
    fireEvent.press(getByTestId('inspection-list-item-1'));
    expect(navigationMock.navigate).toHaveBeenCalledWith('InspectionDetail', { id: 1 });
  });

  it('calls loadMoreInspections when end of list is reached', () => {
    const { getByTestId } = renderComponent({ testID: 'inspection-list' });
    const list = getByTestId('inspection-list-list');
    fireEvent.scroll(list, { nativeEvent: { contentOffset: { y: 100 } } });
    expect(mockLoadMoreInspections).toHaveBeenCalledTimes(1);
  });

  it('does not call loadMoreInspections when hasMore is false', () => {
    useInspection.mockReturnValue({
      inspections: inspectionsMock,
      fetchInspections: mockFetchInspections,
      isLoading: false,
      isRefreshing: false,
      loadMoreInspections: mockLoadMoreInspections,
      hasMore: false,
    });
    const { getByTestId } = renderComponent({ testID: 'inspection-list' });
    const list = getByTestId('inspection-list-list');
    fireEvent.scroll(list, { nativeEvent: { contentOffset: { y: 100 } } });
    expect(mockLoadMoreInspections).not.toHaveBeenCalled();
  });
});