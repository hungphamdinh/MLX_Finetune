// LoginForm.test.jsx
import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import LoginForm from '../LoginForm';
import useAuth from '@Context/Auth/Hooks/UseAuth';

// Mock External Dependencies
jest.mock('@Context/Auth/Hooks/UseAuth');

describe('LoginForm Component', () => {
  const mockLogin = jest.fn();
  const mockAuthError = 'Invalid credentials';

  beforeEach(() => {
    useAuth.mockReturnValue({
      login: mockLogin,
      authError: null,
    });
    mockLogin.mockClear();
  });

  it('renders email and password inputs and login button', () => {
    const { getByPlaceholderText, getByTestId } = render(<LoginForm testID="login-form" />);

    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByTestId('login-button')).toBeTruthy();
  });

  it('validates input fields and shows error messages', async () => {
    const { getByTestId, findByTestId } = render(<LoginForm testID="login-form" />);

    const loginButton = getByTestId('login-button');
    fireEvent.press(loginButton);

    expect(await findByTestId('error-email')).toBeTruthy();
    expect(await findByTestId('error-password')).toBeTruthy();
    expect(await findByTestId('error-email')).toHaveTextContent('EMAIL_REQUIRED');
    expect(await findByTestId('error-password')).toHaveTextContent('PASSWORD_REQUIRED');
  });

  it('shows error for invalid email format', async () => {
    const { getByPlaceholderText, getByTestId, findByTestId } = render(<LoginForm testID="login-form" />);

    const emailInput = getByTestId('login-email');
    const loginButton = getByTestId('login-button');

    fireEvent.changeText(emailInput, 'invalidemail');
    fireEvent.press(loginButton);

    expect(await findByTestId('error-email')).toBeTruthy();
    expect(await findByTestId('error-email')).toHaveTextContent('INVALID_EMAIL');
  });

  it('calls login with correct data when form is valid', async () => {
    const { getByTestId } = render(<LoginForm testID="login-form" />);

    const emailInput = getByTestId('login-email');
    const passwordInput = getByTestId('login-password');
    const loginButton = getByTestId('login-button');

    fireEvent.changeText(emailInput, 'john.doe@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('john.doe@example.com', 'password123');
    });
  });

  it('displays authentication error when authError is present', () => {
    useAuth.mockReturnValue({
      login: mockLogin,
      authError: mockAuthError,
    });

    const { getByTestId } = render(<LoginForm testID="login-form" />);

    expect(getByTestId('error-auth')).toBeTruthy();
    expect(getByTestId('error-auth')).toHaveTextContent(mockAuthError);
  });

  it('does not call login if form validation fails', async () => {
    const { getByTestId, findByTestId } = render(<LoginForm testID="login-form" />);

    const loginButton = getByTestId('login-button');
    fireEvent.press(loginButton);

    await findByTestId('error-email');
    await findByTestId('error-password');

    expect(mockLogin).not.toHaveBeenCalled();
  });
});