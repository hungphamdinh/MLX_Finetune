import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import usePlanMaintenance from '@Context/PlanMaintenance/Hooks/UsePlanMaintenance';
import useAsset from '@Context/Asset/Hooks/UseAsset';
import NavigationService from '@NavigationService';
import MaintenancePlan from '../../AddOrEditAsset/MaintenancePlan';
import { renderScreen } from '@Mock/mockApp';

jest.mock('@Context/PlanMaintenance/Hooks/UsePlanMaintenance');
jest.mock('@Context/Asset/Hooks/UseAsset');
jest.mock('@NavigationService', () => ({
  navigate: jest.fn(),
}));

jest.mock('../../../PlanMaintenance/ListPM', () => {
  const { View, Text } = require('react-native');
  return () => (
    <View testID="ListPM">
      <Text>ListPM Component</Text>
    </View>
  );
});

jest.mock('@Components/WhiteSegmentControl', () => {
  const { TouchableOpacity, Text, View } = require('react-native');
  return ({ values, onChange }) => (
    <View testID="WhiteSegmentControl">
      {values.map((value, index) => (
        <TouchableOpacity key={value} onPress={() => onChange(index)} testID={`segment-button-${index}`}>
          <Text>{value}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
});

const mockGetAssetsPlan = jest.fn();
const mockNavigate = NavigationService.navigate;

const assetPlansMock = {
  data: [
    {
      id: 'plan-1',
      assetId: 'asset-1',
      name: 'Plan 1',
      status: 'NEXT',
    },
    {
      id: 'plan-2',
      assetId: 'asset-1',
      name: 'Plan 2',
      status: 'HISTORY',
    },
  ],
  isRefresh: false,
  isLoadMore: false,
  currentPage: 1,
  totalPage: 1,
};

beforeEach(() => {
  usePlanMaintenance.mockReturnValue({
    planMaintenance: {
      assetPlans: assetPlansMock,
    },
    getAssetsPlan: mockGetAssetsPlan,
  });

  useAsset.mockReturnValue({
    asset: {
      assetDetail: { id: 'asset-1', name: 'Asset One' },
    },
  });

  mockGetAssetsPlan.mockClear();
  mockNavigate.mockClear();
});

const renderComponent = () =>
  renderScreen(<MaintenancePlan navigation={{ navigate: mockNavigate }} isHistory={false} />)();

describe('MaintenancePlan Component', () => {
  it('renders correctly', () => {
    renderComponent();
  });

  it('calls getAssetsPlan on mount with correct parameters', async () => {
    renderComponent();

    // Wait for useEffect to run and getAssetsPlan to be called
    await waitFor(() => {
      expect(mockGetAssetsPlan).toHaveBeenCalledTimes(1);
    });

    const expectedParams = {
      assetIds: 'asset-1',
      page: 1,
      pageSize: 20,
      groupStatus: 'NEXT',
    };

    expect(mockGetAssetsPlan).toHaveBeenCalledWith(expectedParams);
  });

  it('changes selected index and fetches data when a segment is pressed', async () => {
    const { getByTestId } = renderComponent();

    const secondSegment = getByTestId('segment-button-1');
    fireEvent.press(secondSegment);

    // Wait for getAssetsPlan to be called again
    await waitFor(() => {
      expect(mockGetAssetsPlan).toHaveBeenCalledTimes(2);
    });

    const expectedFilteredParams = {
      assetIds: 'asset-1',
      page: 1,
      pageSize: 20,
      groupStatus: 'HISTORY',
    };

    expect(mockGetAssetsPlan).toHaveBeenCalledWith(expectedFilteredParams);
  });

  it('render ListPM', () => {
    const { getByTestId } = renderComponent();

    const listPM = getByTestId('ListPM');
    expect(listPM).toBeTruthy();
  });

  it('does not render WhiteSegmentControl when isHistory is true', () => {
    // Re-render component with isHistory=true
    const { queryByTestId } = renderScreen(<MaintenancePlan navigation={{ navigate: mockNavigate }} isHistory />)();

    expect(queryByTestId('WhiteSegmentControl')).toBeNull();

    expect(queryByTestId('ListPM')).toBeTruthy();
  });

  it('calls getAssetsPlan without groupStatus when isHistory is true', async () => {
    // Re-render component with isHistory=true
    renderScreen(<MaintenancePlan navigation={{ navigate: mockNavigate }} isHistory />)();

    // Wait for useEffect to run and getAssetsPlan to be called
    await waitFor(() => {
      expect(mockGetAssetsPlan).toHaveBeenCalledTimes(1);
    });

    // without group status
    const expectedParams = {
      assetIds: 'asset-1',
      page: 1,
      pageSize: 20,
    };

    expect(mockGetAssetsPlan).toHaveBeenCalledWith(expectedParams);
  });
});
