// SettingsPanel.test.jsx
import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import SettingsPanel from '../SettingsPanel';
import useSettings from '@Context/Settings/Hooks/UseSettings';
import { renderScreen } from '@Mock/mockApp';

// Mock External Dependencies
jest.mock('@Context/Settings/Hooks/UseSettings');
jest.mock('@Components/Forms', () => {
  const { FormSwitchMock, FormRadioGroupMock } = require('@Mock/components/Forms');
  return {
    FormSwitch: ({ name, label, testID }) => <FormSwitchMock name={name} label={label} testID={testID} />,
    FormRadioGroup: ({ name, options, testID }) => <FormRadioGroupMock name={name} options={options} testID={testID} />,
  };
});

describe('SettingsPanel Component', () => {
  const mockFetchSettings = jest.fn();
  const mockUpdateSettings = jest.fn();

  const mockSettings = {
    darkMode: true,
    language: 'es',
  };

  beforeEach(() => {
    useSettings.mockReturnValue({
      settings: mockSettings,
      fetchSettings: mockFetchSettings,
      updateSettings: mockUpdateSettings,
    });
    mockFetchSettings.mockClear();
    mockUpdateSettings.mockClear();
  });

  const renderComponent = (props = {}) => renderScreen(<SettingsPanel {...props} />)();

  it('renders switches and radio groups with correct initial values', () => {
    const { getByTestId } = renderComponent();
    expect(getByTestId('settings-panel-darkMode').props.value).toBe(true);
    expect(getByTestId('settings-panel-language').props.selected).toBe('es');
  });

  it('calls fetchSettings on mount', () => {
    renderComponent();
    expect(mockFetchSettings).toHaveBeenCalledTimes(1);
  });

  it('updates dark mode and language correctly', async () => {
    mockUpdateSettings.mockResolvedValue({ success: true });
    const { getByTestId } = renderComponent();

    fireEvent(getByTestId('settings-panel-darkMode'), 'valueChange', false);
    fireEvent(getByTestId('settings-panel-language'), 'valueChange', 'fr');
    fireEvent.press(getByTestId('settings-panel-save-button'));

    await waitFor(() => {
      expect(mockUpdateSettings).toHaveBeenCalledWith({
        darkMode: false,
        language: 'fr',
      });
    });
  });

  it('handles updateSettings failure gracefully', async () => {
    mockUpdateSettings.mockResolvedValue({ success: false });
    const { getByTestId } = renderComponent();

    fireEvent(getByTestId('settings-panel-darkMode'), 'valueChange', false);
    fireEvent.press(getByTestId('settings-panel-save-button'));

    await waitFor(() => {
      expect(mockUpdateSettings).toHaveBeenCalledWith({
        darkMode: false,
        language: 'es',
      });
      // Additional error handling assertions can be added here
    });
  });

  it('does not call updateSettings if form validation fails', async () => {
    useSettings.mockReturnValue({
      settings: mockSettings,
      fetchSettings: mockFetchSettings,
      updateSettings: mockUpdateSettings,
    });
    const { getByTestId } = renderComponent();

    // Assuming language is required and selecting none would fail
    fireEvent(getByTestId('settings-panel-language'), 'valueChange', '');
    fireEvent.press(getByTestId('settings-panel-save-button'));

    await waitFor(() => {
      expect(mockUpdateSettings).not.toHaveBeenCalled();
    });
  });
});