import React from 'react';
import NavigationService from '@NavigationService';
import { render, fireEvent } from '@testing-library/react-native';
import BiometricScreen from '../../Biometric';

// Mock the NavigationService.replace method
jest.mock('@NavigationService', () => ({
  replace: jest.fn(),
  goBack: jest.fn(),
}));

describe('BiometricScreen', () => {
  it('render BiometricScreen', () => {
    const { getByText } = render(<BiometricScreen />);

    expect(getByText('GO_TO_SETTINGS')).toBeTruthy();
    expect(getByText('SKIP_FOR_NOW')).toBeTruthy();
    expect(getByText('BIOMETRIC_TITLE')).toBeTruthy();
    expect(getByText('BIOMETRIC_SUB_TITLE')).toBeTruthy();
  });
  it('should navigate to Profile screen when "GO_TO_SETTINGS" button is pressed', () => {
    const { getByText } = render(<BiometricScreen />);
    const goToSettingsButton = getByText('GO_TO_SETTINGS');

    fireEvent.press(goToSettingsButton);

    expect(NavigationService.replace).toHaveBeenCalledWith('Setting');
  });

  it('should go back when "SKIP_FOR_NOW" button is pressed', () => {
    const { getByText } = render(<BiometricScreen />);
    const skipButton = getByText('SKIP_FOR_NOW');

    fireEvent.press(skipButton);

    expect(NavigationService.goBack).toHaveBeenCalled();
  });
});
