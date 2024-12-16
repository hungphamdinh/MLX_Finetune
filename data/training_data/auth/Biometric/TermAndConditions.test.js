import React from 'react';
import { render } from '@testing-library/react-native';
import BiometricTermAndConditions from '../../Biometric/TermAndConditions';

const mockNavigation = {
  getParam: jest.fn(),
  goBack: jest.fn(),
};
const renderTerm = () => render(<BiometricTermAndConditions navigation={mockNavigation} />);

describe('BiometricTermAndConditions', () => {
  test('renders the component and button interaction', () => {
    const { getByText, getByTestId } = renderTerm();
    expect(getByTestId('termConditionView')).toBeTruthy();
    expect(getByText('TERM_CONDITIONS_SCROLL_TO_AGREE')).toBeTruthy();
    expect(getByText('SE_BTN_ACCEPT_CONFIRM')).toBeTruthy();
  });

  test('button should be disabled initially', () => {
    const { getByText } = renderTerm();

    const button = getByText('SE_BTN_ACCEPT_CONFIRM');
    expect(button).toBeDisabled();
  });
});
