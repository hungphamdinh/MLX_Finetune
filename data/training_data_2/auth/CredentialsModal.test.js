import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import CredentialsModal from '../CredentialsModal';

describe('BiometricScreen', () => {
  test('render', () => {
    const { getByText } = render(<CredentialsModal />);

    expect(getByText('LOGIN_PASSWORD')).toBeTruthy();
    expect(getByText('LOGIN_USERNAME')).toBeTruthy();
    expect(getByText('ENABLE_BIOMETRIC')).toBeTruthy();
  });
  test('submit button triggers onSubmit function with correct values', () => {
    const onClosePress = jest.fn();
    const { getByText } = render(<CredentialsModal onClosePress={onClosePress} />);

    const passwordInput = getByText('LOGIN_PASSWORD');
    const submitButton = getByText('ENABLE_BIOMETRIC');
    act(() => {
      fireEvent.changeText(passwordInput, 'password123');
    });

    fireEvent.press(submitButton);
    expect(onClosePress).toBeTruthy();
  });
});
