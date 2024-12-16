// TaskAssignment.test.jsx
import React from 'react';
import TaskAssignment from '../TaskAssignment';
import { render, fireEvent } from '@testing-library/react-native';
import useTaskManagement from '@Context/TaskManagement/Hooks/UseTaskManagement';

// Mock External Dependencies
jest.mock('@Context/TaskManagement/Hooks/UseTaskManagement');

// Mock Functions
const mockAssignTask = jest.fn();

// Mock Data
const usersMock = [
  { id: 1, name: 'User One' },
  { id: 2, name: 'User Two' },
];

// Setup Mocks Before Each Test
beforeEach(() => {
  // Mock useTaskManagement Hook
  useTaskManagement.mockReturnValue({
    users: usersMock,
    assignTask: mockAssignTask,
  });

  // Clear Mock Functions
  mockAssignTask.mockClear();
});

// Define Render Function
const renderComponent = (props) => render(<TaskAssignment {...props} />);

// Write Test Cases
describe('TaskAssignment Component', () => {
  it('renders user options correctly', () => {
    const { getByTestId } = renderComponent({ taskId: 1 });

    const picker = getByTestId('user-picker');
    expect(picker.props.children.length).toBe(3); // Including "Select User"
  });

  it('assigns task when a user is selected and Assign button is pressed', () => {
    const { getByTestId } = renderComponent({ taskId: 1 });

    const picker = getByTestId('user-picker');
    fireEvent.valueChange(picker, 2);

    fireEvent.press(getByTestId('assign-button'));

    expect(mockAssignTask).toHaveBeenCalledWith(1, 2);
  });

  it('does not assign task when no user is selected', () => {
    const { getByTestId } = renderComponent({ taskId: 1 });

    fireEvent.press(getByTestId('assign-button'));

    expect(mockAssignTask).not.toHaveBeenCalled();
  });
});