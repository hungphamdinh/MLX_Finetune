// AlertModal.test.jsx
import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import AlertModal from '../AlertModal';

describe('AlertModal', () => {
  const mockOnConfirm = jest.fn();
  const mockOnCancel = jest.fn();

  const renderModal = (props = {}) =>
    render(
      <AlertModal
        visible={true}
        title="Delete Item"
        message="Are you sure you want to delete this item?"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        testID="alert-modal"
        {...props}
      />
    );

  it('renders correctly with title and message', () => {
    const { getByText } = renderModal();
    expect(getByText('Delete Item')).toBeTruthy();
    expect(getByText('Are you sure you want to delete this item?')).toBeTruthy();
  });

  it('calls onConfirm when Confirm button is pressed', () => {
    const { getByTestId } = renderModal();
    const confirmButton = getByTestId('alert-modal-confirm');
    fireEvent.press(confirmButton);
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when Cancel button is pressed', () => {
    const { getByTestId } = renderModal();
    const cancelButton = getByTestId('alert-modal-cancel');
    fireEvent.press(cancelButton);
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('does not render the modal when visible is false', () => {
    const { queryByTestId } = render(
      <AlertModal
        visible={false}
        title="Test"
        message="Test Message"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        testID="alert-modal"
      />
    );
    expect(queryByTestId('alert-modal')).toBeNull();
  });
});