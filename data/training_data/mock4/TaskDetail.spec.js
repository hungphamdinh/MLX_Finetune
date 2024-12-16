// TaskDetail.test.jsx
import React from 'react';
import TaskDetail from '../TaskDetail';
import { render, waitFor } from '@testing-library/react-native';
import useTaskManagement from '@Context/TaskManagement/Hooks/UseTaskManagement';
import TaskComments from '../TaskComments';

// Mock External Dependencies
jest.mock('@Context/TaskManagement/Hooks/UseTaskManagement');
jest.mock('../TaskComments', () => {
  const { View } = require('react-native');
  return () => <View testID="task-comments" />;
});

// Mock Functions
const mockGetTaskDetail = jest.fn();

// Mock Data
const taskDetailMock = {
  id: 1,
  name: 'Task One',
  description: 'Description of Task One',
};

// Setup Mocks Before Each Test
beforeEach(() => {
  // Mock useTaskManagement Hook
  useTaskManagement.mockReturnValue({
    taskDetail: taskDetailMock,
    getTaskDetail: mockGetTaskDetail,
  });

  // Clear Mock Functions
  mockGetTaskDetail.mockClear();
});

// Define Render Function
const renderComponent = (props) => render(<TaskDetail {...props} />);

// Write Test Cases
describe('TaskDetail Component', () => {
  it('fetches task detail on mount', async () => {
    renderComponent({ taskId: 1 });

    await waitFor(() => expect(mockGetTaskDetail).toHaveBeenCalledWith(1));
  });

  it('renders task details correctly', async () => {
    const { getByTestId } = renderComponent({ taskId: 1 });

    await waitFor(() => expect(getByTestId('task-name')).toBeTruthy());

    expect(getByTestId('task-name').props.children).toBe('Task One');
    expect(getByTestId('task-description').props.children).toBe('Description of Task One');
  });

  it('includes TaskComments component', async () => {
    const { getByTestId } = renderComponent({ taskId: 1 });

    await waitFor(() => expect(getByTestId('task-comments')).toBeTruthy());
  });
});