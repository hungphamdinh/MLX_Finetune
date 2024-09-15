import React from 'react';
import { Platform, DeviceEventEmitter } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import BaseLayout from '@components/Layout/BaseLayout';
import navigationServices from '../../../../navigator/navigationServices';

const MoMoWebView = () => {
  const {
    params: { url },
  } = useRoute();

  const onNavigationStateChange = (newNavState) => {
    const { url: newUrl } = newNavState;
    if (newUrl.includes('propertycube.asia')) {
      navigationServices.popTo('FeePaymentConfirm');
      DeviceEventEmitter.emit('paymentCallBack');
    }
  };

  const baseLayoutProps = {
    title: 'MOMO_PAYMENT',
    showBell: false,
  };

  return (
    <BaseLayout {...baseLayoutProps}>
      <WebView
        testID="webview"
        originWhitelist={['*']}
        source={{ uri: url }}
        scalesPageToFit={Platform.OS === 'android'}
        automaticallyAdjustContentInsets={false}
        showsVerticalScrollIndicator={false}
        onNavigationStateChange={onNavigationStateChange}
      />
    </BaseLayout>
  );
};

export default MoMoWebView;
