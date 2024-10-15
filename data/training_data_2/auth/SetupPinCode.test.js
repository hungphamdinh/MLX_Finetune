import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SetupPinCode from '../SetupPinCode/index';
import { renderScreen } from '../../../../__mock__/mockApp';
import useUser from '../../../Context/User/Hooks/UseUser';

jest.mock('../../../Context/User/Hooks/UseUser');

describe('SetupPinCode', () => {
  it('renders correctly', () => {
    const { getByText, debug } = renderScreen(<SetupPinCode />)();
    debug();
    expect(getByText('SETUP_PIN')).toBeTruthy();
    expect(getByText('ENTER_PIN')).toBeTruthy();
    expect(getByText('CONFIRM_PIN')).toBeTruthy();
    expect(getByText('AD_COMMON_SAVE')).toBeTruthy();
  });

  it('submits form with valid inputs', async () => {
    const { getByText } = render(<SetupPinCode />);
    const pinInput = getByText('ENTER_PIN');
    const confirmPinInput = getByText('CONFIRM_PIN');
    const saveButton = getByText('AD_COMMON_SAVE');

    fireEvent.changeText(pinInput, '123456');
    fireEvent.changeText(confirmPinInput, '123456');
    fireEvent.press(saveButton);
  });
});

// Change Pin code
const renderChangePinCode = () => renderScreen(<SetupPinCode />)({ routeName: 'changePinCode' });
describe('ChangePinCode', () => {
  it('renders change pin correctly', () => {
    const { getByText, debug } = renderChangePinCode();
    debug();
    expect(getByText('CHANGE_PIN')).toBeTruthy();
    expect(getByText('CURRENT_PIN')).toBeTruthy();
    expect(getByText('NEW_PIN')).toBeTruthy();
    expect(getByText('CONFIRM_PIN')).toBeTruthy();
    expect(getByText('AD_COMMON_SAVE')).toBeTruthy();
  });

  it('submits form with valid inputs', async () => {
    const changePinCode = jest.fn();
    const setupPinCode = jest.fn();
    useUser.mockReturnValue({ changePinCode, setupPinCode });
    const { getByText, getByTestId } = renderChangePinCode();

    const oldPinInput = getByText('CURRENT_PIN');
    const pinInput = getByText('NEW_PIN');
    const confirmPinInput = getByText('CONFIRM_PIN');
    const saveButton = getByTestId('save-button');

    fireEvent.changeText(oldPinInput, '123456');
    fireEvent.changeText(pinInput, '123456');
    fireEvent.changeText(confirmPinInput, '123456');
    fireEvent.press(saveButton);
  });

  it('submits form with invalid inputs', async () => {
    const { getByText } = renderChangePinCode();
    const oldPinInput = getByText('CURRENT_PIN');
    const pinInput = getByText('NEW_PIN');
    const confirmPinInput = getByText('CONFIRM_PIN');
    const saveButton = getByText('AD_COMMON_SAVE');

    fireEvent.changeText(oldPinInput, '123456');
    fireEvent.changeText(pinInput, '123456');
    fireEvent.changeText(confirmPinInput, '1234567');
    fireEvent.press(saveButton);
  });
});
