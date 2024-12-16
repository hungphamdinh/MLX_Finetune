// TaskFilter.test.jsx
import React from 'react';
import TaskFilter from '../TaskFilter';
import { render, fireEvent } from '@testing-library/react-native';
import useTaskManagement from '@Context/TaskManagement/Hooks/UseTaskManagement';

// Mock External Dependencies
jest.mock('@Context/TaskManagement/Hooks/UseTaskManagement');

// Mock Functions
const mockSetFilterStatus = jest.fn();

// Mock Data
const statusListMock = [
  { id: 1, name: 'Open', code: 'OPEN' },
  { id: 2, name: 'In Progress', code: 'IN_PROGRESS' },
  { id: 3, name: 'Completed', code: 'COMPLETED' },
];

// Setup Mocks Before Each Test
beforeEach(() => {
  // Mock useTaskManagement Hook
  useTaskManagement.mockReturnValue({
    statusList: statusListMock,
    filterStatus: '',
    setFilterStatus: mockSetFilterStatus,
  });

  // Clear Mock Functions
  mockSetFilterStatus.mockClear();
});

// Define Render Function
const renderComponent = () => render(<TaskFilter />);

// Write Test Cases
describe('TaskFilter Component', () => {
  it('renders status options correctly', () => {
    const { getByTestId } = renderComponent();

    const picker = getByTestId('status-filter');
    expect(picker.props.selectedValue).toBe('');
    expect(picker.props.children.length).toBe(4); // Including "All"
  });

  it('changes filter status when a new status is selected', () => {
    const { getByTestId } = renderComponent();

    const picker = getByTestId('status-filter');
    fireEvent.valueChange(picker, 'IN_PROGRESS');

    expect(mockSetFilterStatus).toHaveBeenCalledWith('IN_PROGRESS');
  });
});