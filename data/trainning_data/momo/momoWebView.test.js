import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { DeviceEventEmitter } from 'react-native';
import MoMoWebView from '../../momo/momoWebView';
import { renderScreen } from '../../../../../__mocks__/mockApp';
import navigationServices from '../../../../navigator/navigationServices';

describe('MoMoWebView', () => {
  const render = () =>
    renderScreen(<MoMoWebView />)({
      params,
    });

  const params = {
    callBack: jest.fn(),
    url: 'https://example.com',
  };
  beforeEach(() => {
    global.useMockRoute = {
      params,
      name: 'MoMoWebView',
    };
    emitSpy = jest.spyOn(DeviceEventEmitter, 'emit').mockImplementation(() => {});
  });

  it('renders the WebView', () => {
    const { getByTestId } = render();

    expect(getByTestId('webview')).toBeTruthy();
  });

  it('calls callback on state change', () => {
    const { getByTestId } = render();
    const webView = getByTestId('webview');

    fireEvent(webView, 'navigationStateChange', {
      url: 'https://propertycube.asia',
    });

    expect(emitSpy).toHaveBeenCalledWith('paymentCallBack');
  });

  it('pops screen on callback', () => {
    const { getByTestId } = render();
    const webView = getByTestId('webview');

    fireEvent(webView, 'navigationStateChange', {
      url: 'https://propertycube.asia',
    });

    expect(navigationServices.popTo).toHaveBeenCalledWith('FeePaymentConfirm');
  });
});
