// TaskAnalytics.test.jsx
import React from 'react';
import TaskAnalytics from '../TaskAnalytics';
import { render, waitFor } from '@testing-library/react-native';
import useTaskManagement from '@Context/TaskManagement/Hooks/UseTaskManagement';

// Mock External Dependencies
jest.mock('@Context/TaskManagement/Hooks/UseTaskManagement');

// Mock Functions
const mockGetAnalyticsData = jest.fn();

// Mock Data
const analyticsDataMock = {
  totalTasks: 100,
  completedTasks: 70,
  pendingTasks: 30,
};

// Setup Mocks Before Each Test
beforeEach(() => {
  // Mock useTaskManagement Hook
  useTaskManagement.mockReturnValue({
    analyticsData: analyticsDataMock,
    getAnalyticsData: mockGetAnalyticsData,
  });

  // Clear Mock Functions
  mockGetAnalyticsData.mockClear();
});

// Define Render Function
const renderComponent = () => render(<TaskAnalytics />);

// Write Test Cases
describe('TaskAnalytics Component', () => {
  it('fetches analytics data on mount', async () => {
    renderComponent();

    await waitFor(() => expect(mockGetAnalyticsData).toHaveBeenCalled());
  });

  it('renders analytics data correctly', async () => {
    const { getByTestId } = renderComponent();

    await waitFor(() => expect(getByTestId('total-tasks')).toBeTruthy());

    expect(getByTestId('total-tasks').props.children).toContain(100);
    expect(getByTestId('completed-tasks').props.children).toContain(70);
    expect(getByTestId('pending-tasks').props.children).toContain(30);
  });

  it('displays loading indicator when analytics data is not available', () => {
    // Update the mock to return no analytics data
    useTaskManagement.mockReturnValue({
      analyticsData: null,
      getAnalyticsData: mockGetAnalyticsData,
    });

    const { getByText } = renderComponent();

    expect(getByText('Loading analytics...')).toBeTruthy();
  });
});