import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import MoMoPaymentMethod from '../../momo/momoPaymentMethod';
import { renderScreen } from '@Mock/mockApp';

const store = {
  app: {
    settingApp: {
      allowOnlinePaymentMomo: {
        viaWallet: true,
        viaAtm: true,
        viaCredit: true,
      },
    },
  },
};

const mockActions = {
  account: {
    visibleAuthModal: jest.fn(),
    verifyAuthModal: jest.fn(),
    logout: jest.fn(),
  },
};

const mockCallback = jest.fn();
const mockRoute = {
  name: 'MoMoPaymentMethod',
  params: {
    params: {
      totalAmount: 1000,
    },
    callback: mockCallback,
  },
};

describe('MoMoPaymentMethod', () => {
  beforeEach(() => {
    global.useMockRoute = mockRoute;
  });

  const render = () =>
    renderScreen(<MoMoPaymentMethod actions={mockActions} />)({
      store,
    });

  it('renders payment method options', () => {
    const { getByText } = render();

    expect(getByText('PAYMENT_METHOD_MOMO')).toBeTruthy();
    expect(getByText('PAYMENT_METHOD_ATM')).toBeTruthy();
    expect(getByText('PAYMENT_METHOD_VISA')).toBeTruthy();
  });

  it('calls callback with selected method on confirm', () => {
    const { getByText } = render();

    fireEvent.press(getByText('PAYMENT_METHOD_VISA'));
    fireEvent.press(getByText('COMMON_CONFIRM'));

    expect(mockRoute.params.callback).toHaveBeenCalledWith('payWithCC');
  });
});
