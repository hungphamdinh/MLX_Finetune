import React from 'react';
import useWorkflow from '@Context/Workflow/Hooks/UseWorkflow';
import useProperty from '@Context/Property/Hooks/UseProperty';
import useUser from '@Context/User/Hooks/UseUser';
import useTeam from '@Context/Team/Hooks/UseTeam';
import useInspection from '@Context/Inspection/Hooks/UseInspection';
import useFile from '@Context/File/Hooks/UseFile';
import useFeatureFlag from '@Context/useFeatureFlag';
import { renderScreen } from '@Mock/mockApp';
import ListModel from '@Context/Model/ListModel';
import useAsset from '@Context/Asset/Hooks/UseAsset';
import CreateOrEditJob from '../../Inspection/EditJob';

// Mock all the hooks
jest.mock('@Context/Workflow/Hooks/UseWorkflow');
jest.mock('@Context/Property/Hooks/UseProperty');
jest.mock('@Context/User/Hooks/UseUser');
jest.mock('@Context/Team/Hooks/UseTeam');
jest.mock('@Context/Inspection/Hooks/UseInspection');
jest.mock('@Context/File/Hooks/UseFile');
jest.mock('@Context/useFeatureFlag');
jest.mock('@Context/Asset/Hooks/UseAsset');

describe('CreateOrEditJob', () => {
  const mockNavigation = {
    getParam: jest.fn(),
    state: { routeName: 'addJob' },
  };

  const mockInspectionDetail = {
    id: 123,
    inspectionPropertyId: 456,
    guid: 'mock-guid',
    workflow: {
      creatorUser: { id: 789 },
      status: {
        id: 1,
      },
    },
  };

  beforeEach(() => {
    // Setup mock return values for hooks
    useWorkflow.mockReturnValue({
      workflow: { statusList: [], priorities: [], trackers: [], fields: {} },
    });
    useProperty.mockReturnValue({
      property: { propertyDetail: {}, propertiesToSelect: new ListModel() },
      getDetailProperty: jest.fn(),
      getPropertiesToSelect: jest.fn(),
    });
    useUser.mockReturnValue({ user: { user: {} } });
    useTeam.mockReturnValue({
      getUserInTeam: jest.fn(),
      team: { inspectionTeams: [], assignedInspectionTeams: [], usersInTeam: [] },
    });
    useInspection.mockReturnValue({
      inspection: {
        inspectionDetailInfo: mockInspectionDetail,
        headers: [],
        signatories: [],
        footers: [],
        inspectionSetting: {},
      },
      createOnlineInspection: jest.fn(),
      updateOnlineInspections: jest.fn(),
      uploadInspectionDocument: jest.fn(),
      releaseInspection: jest.fn(),
      getInspectionDetailInfo: jest.fn().mockResolvedValue(mockInspectionDetail),
    });
    useFile.mockReturnValue({
      file: { attachmentFiles: [] },
      getByReferenceIdAndModuleNames: jest.fn(),
    });
    useFeatureFlag.mockReturnValue({ isEnableLiveThere: false });
    useAsset.mockReturnValue({
      asset: { assets: new ListModel() },
      searchAssets: jest.fn(),
    });
  });

  it('renders correctly for add job', () => {
    const { getByText } = renderScreen(<CreateOrEditJob />)({ routeName: 'addJob' });
    expect(getByText('INSPECTION_ADD_JOB')).toBeTruthy();
  });

  it('renders correctly for edit job', () => {
    mockNavigation.state.routeName = 'editJob';
    const { getByText } = renderScreen(<CreateOrEditJob />)({ routeName: 'editJob' });
    expect(getByText('INSPECTION_EDIT_JOB')).toBeTruthy();
  });
});
