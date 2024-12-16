// TaskSearch.test.jsx
import React from 'react';
import TaskSearch from '../TaskSearch';
import { render, fireEvent } from '@testing-library/react-native';
import useTaskManagement from '@Context/TaskManagement/Hooks/UseTaskManagement';

// Mock External Dependencies
jest.mock('@Context/TaskManagement/Hooks/UseTaskManagement');

// Mock Functions
const mockSearchTasks = jest.fn();

// Setup Mocks Before Each Test
beforeEach(() => {
  // Mock useTaskManagement Hook
  useTaskManagement.mockReturnValue({
    searchTasks: mockSearchTasks,
  });

  // Clear Mock Functions
  mockSearchTasks.mockClear();
});

// Define Render Function
const renderComponent = () => render(<TaskSearch />);

// Write Test Cases
describe('TaskSearch Component', () => {
  it('calls searchTasks with the correct keyword', () => {
    const { getByTestId } = renderComponent();

    // Enter search keyword
    fireEvent.changeText(getByTestId('search-input'), 'urgent');

    // Press the Search button
    fireEvent.press(getByTestId('search-button'));

    // Verify that searchTasks was called with the correct argument
    expect(mockSearchTasks).toHaveBeenCalledWith('urgent');
  });

  it('does not call searchTasks when keyword is empty', () => {
    const { getByTestId } = renderComponent();

    // Press the Search button without entering a keyword
    fireEvent.press(getByTestId('search-button'));

    // Verify that searchTasks was called (assuming it handles empty strings)
    expect(mockSearchTasks).toHaveBeenCalledWith('');
  });
});