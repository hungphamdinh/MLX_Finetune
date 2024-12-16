import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SwitchOffModal from '../SwitchOffModal';

describe('SwitchOffModal', () => {
  it('render without crash', () => {
    render(<SwitchOffModal />);
  });
  it('should render the modal content correctly', () => {
    const { getByText } = render(<SwitchOffModal />);
    expect(getByText('SWITCH_OFF_BIOMETRIC_CONTENT')).toBeTruthy();
    expect(getByText('COMMON_CANCEL')).toBeTruthy();
    expect(getByText('SWITCH_OFF')).toBeTruthy();
  });

  it('should call onClosePress when cancel button is pressed', () => {
    const onClosePressMock = jest.fn();
    const { getByText } = render(
      <SwitchOffModal onClosePress={onClosePressMock} setModalSwitchOffVisible={jest.fn()} />
    );
    const cancelButton = getByText('COMMON_CANCEL');
    fireEvent.press(cancelButton);
    expect(onClosePressMock).toHaveBeenCalled();
  });

  it('should call switchOff and turn off Modal when switch off button is pressed', () => {
    const onSuccessMock = jest.fn();
    const { getByText } = render(<SwitchOffModal onSuccess={onSuccessMock} />);
    const switchOffButton = getByText('SWITCH_OFF');
    fireEvent.press(switchOffButton);
    expect(onSuccessMock).toHaveBeenCalled();
  });
});
