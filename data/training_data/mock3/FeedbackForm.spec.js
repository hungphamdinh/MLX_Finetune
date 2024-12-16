// FeedbackForm.test.jsx
import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import FeedbackForm from '../FeedbackForm';
import useFeedback from '@Context/Feedback/Hooks/UseFeedback';

// Mock External Dependencies
jest.mock('@Context/Feedback/Hooks/UseFeedback');

describe('FeedbackForm Component', () => {
  const mockSubmitFeedback = jest.fn();
  const mockFeedbackError = null;
  const mockIsSubmitting = false;

  const renderForm = (props = {}) =>
    render(
      <FeedbackForm
        testID="feedback-form"
        {...props}
      />
    );

  beforeEach(() => {
    useFeedback.mockReturnValue({
      submitFeedback: mockSubmitFeedback,
      feedbackError: mockFeedbackError,
      isSubmitting: mockIsSubmitting,
    });
    mockSubmitFeedback.mockClear();
  });

  it('renders input fields and submit button', () => {
    const { getByPlaceholderText, getByTestId } = renderForm();

    expect(getByPlaceholderText('Your Name')).toBeTruthy();
    expect(getByPlaceholderText('Your Email')).toBeTruthy();
    expect(getByPlaceholderText('Your Feedback')).toBeTruthy();
    expect(getByTestId('feedback-submit-button')).toBeTruthy();
  });

  it('validates input fields and shows error messages', async () => {
    const { getByTestId, findByTestId } = renderForm();

    const submitButton = getByTestId('feedback-submit-button');
    fireEvent.press(submitButton);

    expect(await findByTestId('error-name')).toBeTruthy();
    expect(await findByTestId('error-email')).toBeTruthy();
    expect(await findByTestId('error-message')).toBeTruthy();

    expect(await findByTestId('error-name')).toHaveTextContent('NAME_REQUIRED');
    expect(await findByTestId('error-email')).toHaveTextContent('EMAIL_REQUIRED');
    expect(await findByTestId('error-message')).toHaveTextContent('MESSAGE_REQUIRED');
  });

  it('shows error for invalid email format', async () => {
    const { getByPlaceholderText, getByTestId, findByTestId } = renderForm();

    const emailInput = getByTestId('feedback-email');
    const submitButton = getByTestId('feedback-submit-button');

    fireEvent.changeText(emailInput, 'invalidemail');
    fireEvent.press(submitButton);

    expect(await findByTestId('error-email')).toBeTruthy();
    expect(await findByTestId('error-email')).toHaveTextContent('INVALID_EMAIL');
  });

  it('calls submitFeedback with correct data when form is valid', async () => {
    const { getByPlaceholderText, getByTestId } = renderForm();

    const nameInput = getByTestId('feedback-name');
    const emailInput = getByTestId('feedback-email');
    const messageInput = getByTestId('feedback-message');
    const submitButton = getByTestId('feedback-submit-button');

    fireEvent.changeText(nameInput, 'Jane Doe');
    fireEvent.changeText(emailInput, 'jane.doe@example.com');
    fireEvent.changeText(messageInput, 'Great app! Keep up the good work.');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(mockSubmitFeedback).toHaveBeenCalledWith({
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        message: 'Great app! Keep up the good work.',
      });
    });
  });

  it('disables submit button while submitting', () => {
    useFeedback.mockReturnValue({
      submitFeedback: mockSubmitFeedback,
      feedbackError: mockFeedbackError,
      isSubmitting: true,
    });

    const { getByTestId } = renderForm();

    const submitButton = getByTestId('feedback-submit-button');
    expect(submitButton.props.disabled).toBe(true);
    expect(submitButton.props.title).toBe('Submitting...');
  });

  it('displays authentication error when feedbackError is present', () => {
    const errorMock = 'Failed to submit feedback. Please try again.';
    useFeedback.mockReturnValue({
      submitFeedback: mockSubmitFeedback,
      feedbackError: errorMock,
      isSubmitting: false,
    });

    const { getByTestId } = renderForm();

    expect(getByTestId('error-feedback')).toBeTruthy();
    expect(getByTestId('error-feedback')).toHaveTextContent(errorMock);
  });

  it('does not call submitFeedback if form validation fails', async () => {
    const { getByTestId, findByTestId } = renderForm();

    const submitButton = getByTestId('feedback-submit-button');
    fireEvent.press(submitButton);

    await findByTestId('error-name');
    await findByTestId('error-email');
    await findByTestId('error-message');

    expect(mockSubmitFeedback).not.toHaveBeenCalled();
  });
});