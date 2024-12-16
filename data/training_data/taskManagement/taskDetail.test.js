// TaskDetail.test.jsx
import React from 'react';
import TaskDetail from '../TaskDetail';
import { renderScreen } from '@Mock/mockApp';
import useTaskManagement from '@Context/TaskManagement/Hooks/UseTaskManagement';
import useApp from '@Context/App/Hooks/UseApp';
import useTeam from '@Context/Team/Hooks/UseTeam';
import useFile from '@Context/File/Hooks/UseFile';
import { fireEvent } from '@testing-library/react-native';

jest.mock('@Context/TaskManagement/Hooks/UseTaskManagement');
jest.mock('@Context/App/Hooks/UseApp');
jest.mock('@Context/Team/Hooks/UseTeam');
jest.mock('@Context/File/Hooks/UseFile');
jest.mock('@Components/Forms', () => {
  // Require the mock components from the separate file
  const {
    FormInputMock,
    FormDateMock,
    FormLazyDropdownMock,
    FormRadioGroupMock,
    FormDocumentPickerMock,
    FormDropdownMock,
    ForNumberInputMock,
    FormSwitchMock,
    FormDisabledProviderMock,
  } = require('../../../../__mock__/components/Forms'); // Adjust the path based on your project structure

  return {
    FormInput: ({ name, label, testID }) => <FormInputMock name={name} label={label} testID={testID} />,
    FormDate: ({ name, label, testID }) => <FormDateMock name={name} label={label} testID={testID} />,
    FormLazyDropdown: ({ name, label, testID, multiple, options, getList, titleKey }) => <FormLazyDropdownMock getList={getList} options={options} name={name} label={label} testID={testID} multiple={multiple} titleKey={titleKey} />,
    FormRadioGroup: ({ name, label, testID }) => <FormRadioGroupMock name={name} label={label} testID={testID} />,
    FormDocumentPicker: ({ name, label, testID }) => (
      <FormDocumentPickerMock name={name} label={label} testID={testID} />
    ),
    FormDropdown: ({ name, label, testID, options, multiple }) => <FormDropdownMock options={options} name={name} label={label} testID={testID} multiple={multiple} />,
    FormNumberInput: ({ name, label, testID }) => <ForNumberInputMock name={name} label={label} testID={testID} />,
    FormSwitch: ({ name, label, testID }) => <FormSwitchMock name={name} label={label} testID={testID} />,
    FormDisabledProvider: ({ disabled, children }) => (
      <FormDisabledProviderMock disabled={disabled}>{children}</FormDisabledProviderMock>
    ),
  };
});

jest.mock('@Components/TaskManagement/TaskManagementComment', () => {
  const { View } = require('react-native');
  return () => <View />;
});


jest.mock('@NavigationService', () => ({
  navigate: jest.fn(),
  goBack: jest.fn(),
}));

// Mock Functions
const mockGetTaskDetail = jest.fn();
const mockAddTask = jest.fn();
const mockUpdateTask = jest.fn();
const mockGetUsersInTeams = jest.fn();
const mockGetTeamsByTenant = jest.fn();
const mockGetEmployeesByTenant = jest.fn();
const mockGetListEmployees = jest.fn();
const mockGetTeamsByUsers = jest.fn();
const mockGetTenantList = jest.fn();
const mockGetFileByReferenceId = jest.fn();

// Mock Data
const priorityListMock = [
  { id: 1, name: 'High', isDefault: true },
  { id: 2, name: 'Medium', isDefault: false },
  { id: 3, name: 'Low', isDefault: false },
];

const statusListMock = [
  { id: 1, name: 'Open', isDefault: true, code: 'OPEN' },
  { id: 2, name: 'In Progress', isDefault: false, code: 'IN_PROGRESS' },
  { id: 3, name: 'Completed', isDefault: false, code: 'COMPLETED' },
];

const teamListMock = [
  { id: 1, name: 'Team One' },
  { id: 2, name: 'Team Two' },
];

const assigneeListMock = [
  { id: 1, displayName: 'User One' },
  { id: 2, displayName: 'User Two' },
];

const taskDetailMock = {
  id: 1,
  name: 'Task One',
  description: 'Description of Task One',
  startDate: '2023-01-01',
  endDate: '2023-01-10',
  priorityId: 1,
  statusId: 1,
  teamIds: [1],
  assignees: [{ id: 1, displayName: 'User One' }],
  isNotification: false,
  frequency: '1',
  reminder: {
    isActive: true,
    reminderInMinutes: [],
    reminderInMinutesAfter: [],
    emails: [],
    userIds: [1],
    users: [{ id: 1, displayName: 'User One' }],
  },
  files: [],
  isTeamSelectionFirst: true,
  isPublic: [false],
  taskAssigns: [],
  teams: [{ id: 1, name: 'Team One' }, { id: 2, name: 'Team Two' }],
  tenant: { id: 1, name: 'Tenant One' },
  subTasks: [],
  parentId: null,
  creatorUser: {id: 111, name: 'Hung', displayName: 'Hung'}
};

const employeesByTenantMock = {
  data: [
    { id: 1, displayName: 'User One' },
    { id: 2, displayName: 'User Two' },
  ],
};

const referenceFilesMock = [];

const teamsByUsersMock = [
  { id: 1, name: 'Team One' },
  { id: 2, name: 'Team Two' },
];

const editRoute = {
  params: {
    id: 1
  },
  name: 'editTask',
}

const addRoute = {
  params: {},
  name: 'addTask'
}

// Setup Mocks Before Each Test
beforeEach(() => {
  global.useMockRoute = addRoute;
  // Mock useTaskManagement Hook
  useTaskManagement.mockReturnValue({
    taskManagement: {
      priorityList: priorityListMock,
      statusList: statusListMock,
      teamList: teamListMock,
      assigneeList: assigneeListMock,
      taskDetail: taskDetailMock,
    },
    getTaskDetail: mockGetTaskDetail,
    addTask: mockAddTask,
    updateTask: mockUpdateTask,
    getUsersInTeamByTenants: mockGetUsersInTeams,
    getTeamsByTenant: mockGetTeamsByTenant,
  });

  // Mock useApp Hook
  useApp.mockReturnValue({
    app: {
      employeesByTenant: employeesByTenantMock,
      employees: employeesByTenantMock,
    },
    getEmployeesByTenant: mockGetEmployeesByTenant,
    getEmployees: mockGetListEmployees,
  });

  // Mock useTeam Hook
  useTeam.mockReturnValue({
    team: {
      teamsByUsers: teamsByUsersMock,
    },
    getTeamsByUsers: mockGetTeamsByUsers,
  });

  // Mock useFile Hook
  useFile.mockReturnValue({
    getFileByReferenceId: mockGetFileByReferenceId,
    file: {
      referenceFiles: referenceFilesMock,
    },
  });


  // Clear Mock Functions
  mockGetTaskDetail.mockClear();
  mockAddTask.mockClear();
  mockUpdateTask.mockClear();
  mockGetUsersInTeams.mockClear();
  mockGetTeamsByTenant.mockClear();
  mockGetEmployeesByTenant.mockClear();
  mockGetTeamsByUsers.mockClear();
  mockGetTenantList.mockClear();
  mockGetFileByReferenceId.mockClear();
});

// Define Render Function
const renderComponent = (props = {}) => renderScreen(<TaskDetail {...props} />)();

// Write Test Cases
describe('TaskDetail Component', () => {
  it('renders add Task', () => {
    const { getByText } = renderComponent();
    expect(getByText('ADD_TASK')).toBeTruthy();
  });

  it('render EditTask with General Info', () => {
    global.useMockRoute = editRoute;
    const { getByText, getByTestId} = renderComponent();

    expect(mockGetTaskDetail).toHaveBeenCalledWith(1);
    expect(getByText('EDIT_TASK')).toBeTruthy();

    const taskDes = getByTestId('task-description-input');
    expect(taskDes.props.value).toBe('Description of Task One')

    const taskName = getByTestId('task-name-input');
    expect(taskName.props.value).toBe('Task One')

    const createdBy = getByTestId('creatorUser-input');
    expect(createdBy.props.value).toBe('Hung')

    const startDate = getByTestId('startDate-date');
    expect(startDate.props.value).toBe(new Date('2023-01-01').toString())

    const endDate = getByTestId('endDate-date');
    expect(endDate.props.value).toBe(new Date('2023-01-10').toString())

    const taskStatus = getByTestId('status-dropdown-value');
    expect(taskStatus.props.children).toBe('Open')

    const taskPriority = getByTestId('priority-dropdown-value');
    expect(taskPriority.props.children).toBe('High')

    const taskFrequency = getByTestId('frequency-dropdown-value');
    expect(taskFrequency.props.children).toBe('ONE_OFF')

    expect(getByText('REMINDER')).toBeTruthy();
    expect(getByText('COMMON_DOCUMENT')).toBeTruthy();

  });

  it('render EditTask with isTeamSelection = true', () => {
    global.useMockRoute = editRoute;
    const {getByTestId} = renderComponent();

    const teamDropdownValue = getByTestId('team-dropdown-value');
    expect(teamDropdownValue.props.children).toBe('Team One, Team Two');

    const assigneeDropdownValue = getByTestId('assignee-dropdown-value');
    expect(assigneeDropdownValue.props.children).toBe('Select options');
  });

  it('render EditTask with isTeamSelection = false', () => {
    global.useMockRoute = editRoute;
    const taskDetail = {
      ...taskDetailMock,
      isTeamSelectionFirst: false,
    };

    useTaskManagement.mockReturnValue({
      taskManagement: {
        ...useTaskManagement().taskManagement,
        taskDetail: taskDetail,
      },
      getTaskDetail: mockGetTaskDetail,
      getUsersInTeamByTenants: mockGetUsersInTeams,
      getTeamsByTenant: mockGetTeamsByTenant,
    });

    const { getByTestId } = renderComponent();
    const assigneeDropdownValue = getByTestId('assignee-lazy-dropdown-value');
    expect(assigneeDropdownValue.props.children).toBe('User One');

    const teamDropdownValue = getByTestId('team-dropdown-value');
    expect(teamDropdownValue.props.children).toBe('Team One, Team Two');

  });

  it('disables form fields when isReadOnly is true', async () => {
    const { isGranted } = require('@Config/PermissionConfig');
    isGranted.mockReturnValue(false);

    const { getByTestId } = renderComponent();
    expect(getByTestId('form-disabled-provider').props.disabled).toBe(true);
  });

  it('not allow to add when missing data', async () => {
    const { getByTestId } = renderComponent();

    const priorityDropdown = getByTestId('priority-dropdown');
    fireEvent.press(priorityDropdown);
    const priorityOption = getByTestId('priority-option-2');
    fireEvent.press(priorityOption);

    const statusDropdown = getByTestId('status-dropdown');
    fireEvent.press(statusDropdown);
    const statusOption = getByTestId('status-option-2');
    fireEvent.press(statusOption);


    const saveButton = getByTestId('button-save');
    fireEvent.press(saveButton);

    expect(mockAddTask).not.toHaveBeenCalledWith(expect.objectContaining({
      priorityId: 2,
      statusId: 2,
      name: 'Option 1',
    }));
  });

  it('handle submit when edit', async () => {
    global.useMockRoute = editRoute;
    const { getByTestId } = renderComponent();

    const priorityDropdown = getByTestId('priority-dropdown');
    fireEvent.press(priorityDropdown);
    const priorityOption = getByTestId('priority-option-2');
    fireEvent.press(priorityOption);

    const statusDropdown = getByTestId('status-dropdown');
    fireEvent.press(statusDropdown);
    const statusOption = getByTestId('status-option-2');
    fireEvent.press(statusOption);


    const saveButton = getByTestId('button-save');
    fireEvent.press(saveButton);

    expect(mockAddTask).not.toHaveBeenCalledWith(expect.objectContaining({
      ...taskDetailMock,
      priorityId: 2,
      statusId: 2,
      name: 'Option 1',
    }));
  });
});