import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import useJobRequest from '@Context/JobRequest/Hooks/UseJobRequest';
import useAsset from '@Context/Asset/Hooks/UseAsset';
import NavigationService from '@NavigationService';
import JobRequestHistory from '../../AddOrEditAsset/JobRequestHistory';

import { renderScreen } from '../../../../../__mock__/mockApp';

jest.mock('@Context/JobRequest/Hooks/UseJobRequest');
jest.mock('@Context/Asset/Hooks/UseAsset');
jest.mock('@NavigationService', () => ({
  navigate: jest.fn(),
}));

jest.mock('@Components/Filter', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return ({ onCompleted }) => (
    <TouchableOpacity onPress={() => onCompleted({ statusIds: ['status-1'] })} testID="apply-filter-button">
      <Text>Apply Filter</Text>
    </TouchableOpacity>
  );
});

const mockGetAssetJrHistory = jest.fn();
const mockGetGroupCategories = jest.fn();
const mockNavigate = NavigationService.navigate;

const jrHistoryMock = {
  data: [
    {
      id: 'jr-1',
      parentId: 'job-1',
      subject: 'Job Request Subject 1',
      form: { formName: 'Form A' },
      property: { name: 'Property X' },
      creatorUser: { displayName: 'Creator User 1' },
      listAssigned: [
        { id: 'assignee-1', displayName: 'Assignee One' },
        { id: 'assignee-2', displayName: 'Assignee Two' },
      ],
      inspection: { team: null },
      assets: ['asset-1', 'asset-2'],
      isActive: true,
    },
    {
      id: 'jr-2',
      parentId: 'job-2',
      subject: 'Job Request Subject 2',
      form: { formName: 'Form B' },
      property: { name: 'Property Y' },
      creatorUser: { displayName: 'Creator User 2' },
      listAssigned: [{ id: 'assignee-3', displayName: 'Assignee Three' }],
      inspection: { team: { name: 'Team Alpha' } },
      assets: [],
      isActive: false,
    },
  ],
  isRefresh: false,
  isLoadMore: false,
  currentPage: 1,
  totalPage: 1,
};

beforeEach(() => {
  useJobRequest.mockReturnValue({
    jobRequest: {
      jrHistorylist: jrHistoryMock,
      statusList: [
        { id: 'status-1', name: 'Completed' },
        { id: 'status-2', name: 'In Progress' },
      ],
    },
    getAssetJrHistory: mockGetAssetJrHistory,
    getGroupCategories: mockGetGroupCategories,
  });

  // Mock useAsset Hook
  useAsset.mockReturnValue({
    asset: {
      assetDetail: { id: 'asset-1', name: 'Asset One' },
    },
  });

  // Clear Mock Functions
  mockGetAssetJrHistory.mockClear();
  mockGetGroupCategories.mockClear();
  mockNavigate.mockClear();
});

// Define Render Function
const renderComponent = () => renderScreen(<JobRequestHistory />)();

describe('JobRequestHistory Component', () => {
  it('renders correctly', () => {
    renderComponent();
  });

  it('calls getAssetJrHistory on mount with correct parameters', async () => {
    renderComponent();

    // Wait for useEffect to run and getAssetJrHistory to be called
    await waitFor(() => {
      expect(mockGetAssetJrHistory).toHaveBeenCalledTimes(1);
    });

    const expectedParams = {
      page: 1,
      pageSize: 10,
      keyword: '',
      assetIds: 'asset-1',
    };

    expect(mockGetAssetJrHistory).toHaveBeenCalledWith(expectedParams);
  });

  it('navigates to detail screen with correct id when an active item is pressed', async () => {
    const { getByTestId } = renderComponent();

    const firstItem = getByTestId('item-jr-1');
    fireEvent.press(firstItem);

    expect(mockNavigate).toHaveBeenCalledWith('editJobRequest', {
      id: 'jr-1',
    });
  });

  it('does not navigate when a non-active item is pressed', () => {
    const { getByTestId } = renderComponent();

    const secondItem = getByTestId('item-jr-2');
    fireEvent.press(secondItem);

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('applies filters correctly and fetches filtered data', async () => {
    const { getByTestId } = renderComponent();

    const applyFilterButton = getByTestId('apply-filter-button');
    fireEvent.press(applyFilterButton);

    await waitFor(() => {
      expect(mockGetAssetJrHistory).toHaveBeenCalledTimes(2);
    });

    const expectedFilteredParams = {
      page: 1,
      pageSize: 10,
      keyword: '',
      statusIds: ['status-1'],
      assetIds: 'asset-1',
    };

    expect(mockGetAssetJrHistory).toHaveBeenCalledWith(expectedFilteredParams);
  });
});
