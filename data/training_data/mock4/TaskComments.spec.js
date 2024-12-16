// TaskComments.test.jsx
import React from 'react';
import TaskComments from '../TaskComments';
import { render, waitFor } from '@testing-library/react-native';
import useTaskManagement from '@Context/TaskManagement/Hooks/UseTaskManagement';

// Mock External Dependencies
jest.mock('@Context/TaskManagement/Hooks/UseTaskManagement');

// Mock Functions
const mockGetTaskComments = jest.fn();

// Mock Data
const commentsMock = [
  { id: 1, text: 'First comment' },
  { id: 2, text: 'Second comment' },
];

// Setup Mocks Before Each Test
beforeEach(() => {
  // Mock useTaskManagement Hook
  useTaskManagement.mockReturnValue({
    comments: commentsMock,
    getTaskComments: mockGetTaskComments,
  });

  // Clear Mock Functions
  mockGetTaskComments.mockClear();
});

// Define Render Function
const renderComponent = (props) => render(<TaskComments {...props} />);

// Write Test Cases
describe('TaskComments Component', () => {
  it('fetches comments on mount', async () => {
    renderComponent({ taskId: 1 });

    await waitFor(() => expect(mockGetTaskComments).toHaveBeenCalledWith(1));
  });

  it('renders comments correctly', async () => {
    const { getByTestId, getAllByTestId } = renderComponent({ taskId: 1 });

    await waitFor(() => expect(getByTestId('comments-list')).toBeTruthy());

    // Verify that comments are displayed
    expect(getAllByTestId(/comment-/).length).toBe(2);
  });

  it('displays loading indicator when comments are not available', () => {
    useTaskManagement.mockReturnValue({
      comments: null,
      getTaskComments: mockGetTaskComments,
    });

    const { getByText } = renderComponent({ taskId: 1 });

    expect(getByText('Loading comments...')).toBeTruthy();
  });
});