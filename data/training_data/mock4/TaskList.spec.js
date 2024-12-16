// TaskList.test.jsx
import React from 'react';
import TaskList from '../TaskList';
import { render, waitFor } from '@testing-library/react-native';
import useTaskManagement from '@Context/TaskManagement/Hooks/UseTaskManagement';

// Mock External Dependencies
jest.mock('@Context/TaskManagement/Hooks/UseTaskManagement');

// Mock Functions
const mockGetTasks = jest.fn();

// Mock Data
const tasksMock = [
  { id: 1, name: 'Task One', status: 'Open' },
  { id: 2, name: 'Task Two', status: 'In Progress' },
];

// Setup Mocks Before Each Test
beforeEach(() => {
  // Mock useTaskManagement Hook
  useTaskManagement.mockReturnValue({
    tasks: tasksMock,
    getTasks: mockGetTasks,
  });

  // Clear Mock Functions
  mockGetTasks.mockClear();
});

// Define Render Function
const renderComponent = () => render(<TaskList />);

// Write Test Cases
describe('TaskList Component', () => {
  it('fetches tasks on mount', async () => {
    renderComponent();

    await waitFor(() => expect(mockGetTasks).toHaveBeenCalled());
  });

  it('renders task list correctly', async () => {
    const { getByTestId, getAllByTestId } = renderComponent();

    await waitFor(() => expect(getByTestId('task-list')).toBeTruthy());

    // Verify that tasks are displayed
    expect(getAllByTestId(/task-item-/).length).toBe(2);
  });

  it('displays loading indicator when tasks are not available', () => {
    // Update the mock to return no tasks
    useTaskManagement.mockReturnValue({
      tasks: null,
      getTasks: mockGetTasks,
    });

    const { getByText } = renderComponent();

    expect(getByText('Loading tasks...')).toBeTruthy();
  });
});