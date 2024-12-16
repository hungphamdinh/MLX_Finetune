import React, { useRef } from 'react';
import styled from 'styled-components/native';
import { Platform, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import BaseLayout from '../../../../Components/Layout/BaseLayout';
import Button from '../../../../Elements/Button';
import { Text } from '../../../../Elements';
import useApp from '../../../../Context/App/Hooks/UseApp';

const TermView = styled(WebView)`
  flex: 1;
  margin-bottom: 10;
`;

const ButtonWrapper = styled.View`
  background-color: white;
  padding-bottom: 30px;
  padding-top: 10px;
`;

const Hint = styled(Text)`
  font-size: 12px;
  padding-bottom: 10px;
  margin-left: 5px;
`;

const BiometricTermAndConditions = ({ navigation }) => {
  const {
    app: { biometricTermConditions },
  } = useApp();

  const [disabledAgree, setDisabledAgree] = React.useState(true);
  const onAgree = navigation.getParam('onAgree');
  const onGoBack = navigation.getParam('onGoBack');
  const webViewRef = useRef();

  const onWebViewLoad = () => {
    webViewRef.current.injectJavaScript(`
      const contentHeight = document.body.scrollHeight;
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const isScrollable = contentHeight > viewportHeight;
      window.ReactNativeWebView.postMessage(isScrollable ? "scrollable" : "scrollToEnd");
    `);
  };

  const goBack = (callBack) => {
    navigation.goBack();
    callBack();
  };

  const onClose = () => {
    goBack(onGoBack);
  };

  const onAgreeTerms = () => {
    goBack(onAgree);
  };

  const injectedJavaScript = `window.onscroll = function(ev) {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
         window.ReactNativeWebView.postMessage("scrollToEnd")
      }};`;

  const onMessageReceived = ({ nativeEvent: { data } }) => {
    if (data === 'scrollToEnd' && disabledAgree) {
      setDisabledAgree(false);
    }
  };

  return (
    <BaseLayout onLeftPress={onClose} title="COMMON_TERM_CONDITIONS" navigation={navigation} showBell={false}>
      <TermView
        testID="termConditionView"
        ref={webViewRef}
        style={styles.webview}
        originWhitelist={['*']}
        onLoad={onWebViewLoad}
        source={{ html: biometricTermConditions }}
        scalesPageToFit={Platform.OS === 'android'}
        automaticallyAdjustContentInsets={false}
        injectedJavaScript={injectedJavaScript}
        onMessage={onMessageReceived}
      />
      <Hint text="TERM_CONDITIONS_SCROLL_TO_AGREE" />
      <ButtonWrapper>
        <Button disabled={disabledAgree} title="SE_BTN_ACCEPT_CONFIRM" primary rounded onPress={onAgreeTerms} />
      </ButtonWrapper>
    </BaseLayout>
  );
};

export default BiometricTermAndConditions;

const styles = StyleSheet.create({
  webview: {
    flex: 1,
    marginBottom: 10,
  },
});
