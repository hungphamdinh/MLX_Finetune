// TaskHistory.test.jsx
import React from 'react';
import TaskHistory from '../TaskHistory';
import { render, waitFor } from '@testing-library/react-native';
import useTaskManagement from '@Context/TaskManagement/Hooks/UseTaskManagement';

// Mock External Dependencies
jest.mock('@Context/TaskManagement/Hooks/UseTaskManagement');

// Mock Functions
const mockGetTaskHistory = jest.fn();

// Mock Data
const historyMock = [
  { id: 1, description: 'Task created' },
  { id: 2, description: 'Status changed to In Progress' },
];

// Setup Mocks Before Each Test
beforeEach(() => {
  // Mock useTaskManagement Hook
  useTaskManagement.mockReturnValue({
    history: historyMock,
    getTaskHistory: mockGetTaskHistory,
  });

  // Clear Mock Functions
  mockGetTaskHistory.mockClear();
});

// Define Render Function
const renderComponent = (props) => render(<TaskHistory {...props} />);

// Write Test Cases
describe('TaskHistory Component', () => {
  it('fetches task history on mount', async () => {
    renderComponent({ taskId: 1 });

    await waitFor(() => expect(mockGetTaskHistory).toHaveBeenCalledWith(1));
  });

  it('renders task history correctly', async () => {
    const { getByTestId, getAllByTestId } = renderComponent({ taskId: 1 });

    await waitFor(() => expect(getByTestId('history-list')).toBeTruthy());

    // Verify that history items are displayed
    expect(getAllByTestId(/history-item-/).length).toBe(2);
  });

  it('displays loading indicator when history is not available', () => {
    useTaskManagement.mockReturnValue({
      history: null,
      getTaskHistory: mockGetTaskHistory,
    });

    const { getByText } = renderComponent({ taskId: 1 });

    expect(getByText('Loading task history...')).toBeTruthy();
  });
});