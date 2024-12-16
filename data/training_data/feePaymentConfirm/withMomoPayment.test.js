import React from 'react';
import Momo from '@utils/momo';
import { Linking, DeviceEventEmitter } from 'react-native';
import withMomoPayment from '../../feePaymentConfirm/paymentHOC/withMoMoPayment'; // Adjust the import path
import { renderScreen } from '@Mock/mockApp';

jest.mock('@utils/momo', () => ({
  ensureExistedMomoApp: jest.fn(),
}));
jest.mock('../../../../navigator/navigationServices', () => ({
  navigate: jest.fn(),
}));

const WrappedComponent = () => <></>;
const MockComponent = withMomoPayment(WrappedComponent);

describe('withMomoPayment HOC', () => {
  const mockCreateOrderMomo = jest.fn();
  const mockCheckMomoResult = jest.fn();

  const render = () =>
    renderScreen(
      <MockComponent
        navigation={{ getParam: jest.fn(), goBack: jest.fn() }}
        actions={{
          fee: {
            createOrderMomo: mockCreateOrderMomo,
            checkMomoResult: mockCheckMomoResult,
          },
        }}
        fee={{ orderDetail: null }}
      />
    )({});

  beforeEach(() => {
    jest.spyOn(Linking, 'addEventListener').mockImplementation(() => ({
      remove: jest.fn(),
    }));
    jest.spyOn(DeviceEventEmitter, 'addListener').mockImplementation(() => ({
      remove: jest.fn(),
    }));
    Momo.ensureExistedMomoApp.mockImplementation((callback) => callback());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add and remove event listeners on mount and unmount', () => {
    const { unmount } = render();

    expect(Linking.addEventListener).toHaveBeenCalledWith('url', expect.any(Function));
    expect(DeviceEventEmitter.addListener).toHaveBeenCalledWith('paymentCallBack', expect.any(Function));

    unmount();
  });
});
