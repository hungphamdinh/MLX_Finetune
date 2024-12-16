// AddTask.test.jsx
import React from 'react';
import AddTask from '../AddTask';
import { render, fireEvent } from '@testing-library/react-native';
import useTaskManagement from '@Context/TaskManagement/Hooks/UseTaskManagement';

// Mock External Dependencies
jest.mock('@Context/TaskManagement/Hooks/UseTaskManagement');

// Mock Functions
const mockAddTask = jest.fn();

// Setup Mocks Before Each Test
beforeEach(() => {
  // Mock useTaskManagement Hook
  useTaskManagement.mockReturnValue({
    addTask: mockAddTask,
  });

  // Clear Mock Functions
  mockAddTask.mockClear();
});

// Define Render Function
const renderComponent = () => render(<AddTask />);

// Write Test Cases
describe('AddTask Component', () => {
  it('adds a task when the Add Task button is pressed', () => {
    const { getByTestId } = renderComponent();

    // Enter task name
    fireEvent.changeText(getByTestId('task-name-input'), 'New Task');

    // Press the Add Task button
    fireEvent.press(getByTestId('add-task-button'));

    // Verify that addTask was called with the correct argument
    expect(mockAddTask).toHaveBeenCalledWith({ name: 'New Task' });
  });

  it('does not add a task when the task name is empty', () => {
    const { getByTestId } = renderComponent();

    // Press the Add Task button without entering a task name
    fireEvent.press(getByTestId('add-task-button'));

    // Verify that addTask was not called
    expect(mockAddTask).not.toHaveBeenCalled();
  });
});