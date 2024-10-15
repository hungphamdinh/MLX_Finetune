// InspectionHistory.test.js

import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import useUser from '@Context/User/Hooks/UseUser';
import useWorkflow from '@Context/Workflow/Hooks/UseWorkflow';
import useAsset from '@Context/Asset/Hooks/UseAsset';
import NavigationService from '@NavigationService';
import InspectionHistory from '../../AddOrEditAsset/InspectionHistory';
import { renderScreen } from '../../../../../__mock__/mockApp';

jest.mock('@Context/User/Hooks/UseUser');
jest.mock('@Context/Workflow/Hooks/UseWorkflow');
jest.mock('@Context/Asset/Hooks/UseAsset');
jest.mock('@Components/ItemApp/ItemInspectionHistory', () => 'ItemInspectionHistory');

const mockGetInspectionsHistory = jest.fn();
const mockNavigate = NavigationService.navigate;

const inspectionsHistoryMock = {
  data: [
    {
      id: 'inspection-1',
      parentId: 'job-1',
      subject: 'Inspection Subject 1',
      form: { formName: 'Form A' },
      property: { name: 'Property X' },
      creatorUser: { displayName: 'Creator User 1' },
      listAssigned: [
        { id: 'assignee-1', displayName: 'Assignee One' },
        { id: 'assignee-2', displayName: 'Assignee Two' },
      ],
      inspection: { team: null },
      assets: ['asset-1', 'asset-2'],
      creationTime: '2024-01-01T10:00:00Z',
      startDate: '2024-01-02T10:00:00Z',
      status: 'Completed',
      taskStatus: 'Done',
      priority: 'High',
    },
    {
      id: 'inspection-2',
      parentId: 'job-2',
      subject: 'Inspection Subject 2',
      form: { formName: 'Form B' },
      property: { name: 'Property Y' },
      creatorUser: { displayName: 'Creator User 2' },
      listAssigned: [{ id: 'assignee-3', displayName: 'Assignee Three' }],
      inspection: { team: { name: 'Team Alpha' } },
      assets: [],
      creationTime: '2024-02-01T11:00:00Z',
      startDate: '2024-02-02T11:00:00Z',
      status: 'In Progress',
      taskStatus: 'Ongoing',
      priority: 'Medium',
    },
  ],
  isRefresh: false,
  isLoadMore: false,
  currentPage: 1,
  totalPage: 1,
};

beforeEach(() => {
  useUser.mockReturnValue({
    user: {
      user: { id: 'user-1', name: 'John Doe' },
    },
  });

  useWorkflow.mockReturnValue({
    workflow: {
      statusList: [
        { id: 'status-1', isIssueClosed: true, code: 'COMPLETED' },
        { id: 'status-2', isIssueClosed: false, code: 'IN_PROGRESS' },
      ],
    },
  });

  useAsset.mockReturnValue({
    asset: {
      assetDetail: { id: 'asset-1', name: 'Asset One' },
      inspectionsHistory: inspectionsHistoryMock,
    },
    getInspectionsHistory: mockGetInspectionsHistory,
  });

  // Clear Mock Functions
  mockGetInspectionsHistory.mockClear();
  mockNavigate.mockClear();
});

// Define Render Function
const render = () => renderScreen(<InspectionHistory />)();

describe('InspectionHistory Component', () => {
  it('renders correctly', () => {
    render();
  });

  it('calls getInspectionsHistory on mount with correct parameters', async () => {
    render();
    await waitFor(() => {
      expect(mockGetInspectionsHistory).toHaveBeenCalledTimes(1);
    });

    const expectedParams = {
      page: 1,
      orderByColumn: 0,
      isDescending: true,
      statusIds: 'status-1',
      assetId: 'asset-1',
    };
    expect(mockGetInspectionsHistory).toHaveBeenCalledWith(expectedParams, 'user-1');
  });

  it('navigates to detail screen with correct id when an item is pressed', async () => {
    const { getByTestId } = render();
    const firstItem = getByTestId('item-inspection-0');
    fireEvent.press(firstItem);
    expect(mockNavigate).toHaveBeenCalledWith('editJob', {
      id: 'inspection-1',
    });
  });
});
