// TaskSettings.test.jsx
import React from 'react';
import TaskSettings from '../TaskSettings';
import { render, fireEvent } from '@testing-library/react-native';
import useTaskManagement from '@Context/TaskManagement/Hooks/UseTaskManagement';

// Mock External Dependencies
jest.mock('@Context/TaskManagement/Hooks/UseTaskManagement');

// Mock Functions
const mockUpdateSettings = jest.fn();

// Mock Data
const settingsMock = {
  notificationsEnabled: true,
};

// Setup Mocks Before Each Test
beforeEach(() => {
  // Mock useTaskManagement Hook
  useTaskManagement.mockReturnValue({
    settings: settingsMock,
    updateSettings: mockUpdateSettings,
  });

  // Clear Mock Functions
  mockUpdateSettings.mockClear();
});

// Define Render Function
const renderComponent = () => render(<TaskSettings />);

// Write Test Cases
describe('TaskSettings Component', () => {
  it('renders the notifications switch with correct initial value', () => {
    const { getByTestId } = renderComponent();

    const switchComponent = getByTestId('notifications-switch');
    expect(switchComponent.props.value).toBe(true);
  });

  it('toggles notifications and updates settings', () => {
    const { getByTestId } = renderComponent();

    const switchComponent = getByTestId('notifications-switch');
    fireEvent.valueChange(switchComponent, false);

    expect(mockUpdateSettings).toHaveBeenCalledWith({ notificationsEnabled: false });
  });
});