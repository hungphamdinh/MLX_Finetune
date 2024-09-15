import React, { Fragment, useRef } from 'react';
import _ from 'lodash';
import styled from 'styled-components/native';
import { Platform, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRoute } from '@react-navigation/native';
import SegmentControl from '@components/segmentControl';
import { CheckBox } from '@components/Forms/FormCheckBox';
import BaseLayout from '@components/Layout/BaseLayout';
import { Colors } from '@themes';
import { Text } from '@components/Commons';
import NextTermButton from './nextButton';
import ScrollDownButton from './scrollDownButton';

const ButtonWrapper = styled.View`
  background-color: white;
  padding-bottom: 30px;
  margin-top: 15px;
`;
const CheckBoxTerm = styled(CheckBox).attrs(() => ({
  containerStyle: {
    marginLeft: 10,
    marginRight: 15,
  },
}))``;

const Hint = styled(Text)`
  font-size: 12px;
  padding-vertical: 5px;
  padding-horizontal: 10px;
  background-color: ${Colors.default};
`;

const TermAndConditions = ({ navigation }) => {
  const { params } = useRoute();
  const termAndConditions = params?.termAndConditions || [];
  const hideLeftButton = params?.hideLeftButton;
  const onAgree = params?.onAgree;

  const [filter, setFilter] = React.useState({
    groupIndex: 0,
  });
  const webViewRef = useRef();
  const [selectedItems, setSelectedItems] = React.useState([]);
  const [disabledAgree, setDisabledAgree] = React.useState(termAndConditions.map(() => true));

  const isLastTab = filter.groupIndex === _.size(termAndConditions) - 1;
  const disabledButton = disabledAgree.find((_item, index) => index === filter.groupIndex);
  const allowAgree = _.size(selectedItems) === _.size(termAndConditions);

  const onWebViewLoad = () => {
    webViewRef.current.injectJavaScript(`
      const contentHeight = document.body.scrollHeight;
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const isScrollable = contentHeight > viewportHeight;
      window.ReactNativeWebView.postMessage(isScrollable ? "scrollable" : "scrollToEnd");
    `);
  };

  const onTabChange = (groupIndex) => {
    setFilter({
      groupIndex,
    });
  };

  const onPressNextTerm = () => {
    setFilter({
      groupIndex: filter.groupIndex + 1,
    });
  };

  const onPressScrollToBottom = () => {
    webViewRef.current.injectJavaScript(`window.scrollTo(0, document.body.scrollHeight);`);
  };

  const onMessageReceived = ({ nativeEvent: { data } }) => {
    if (data === 'scrollToEnd' && disabledAgree) {
      const disabled = disabledAgree.map((child, idx) => (idx === filter.groupIndex ? false : child));
      setDisabledAgree(disabled);
    }
  };

  const checkItem = (item) => {
    const isExist = selectedItems.find((parcel) => parcel.id === item.id);
    if (isExist) {
      const newSelectedItems = selectedItems.filter((parcel) => parcel.id !== item.id);
      setSelectedItems(newSelectedItems);
      return;
    }
    setSelectedItems([...selectedItems, item]);
  };

  const baseLayoutProps = {
    containerStyle: { backgroundColor: 'white' },
    showLeftButton: !hideLeftButton,
    title: 'COMMON_TERM_CONDITIONS',
    navigation,
    showBell: false,
  };

  const injectedJavaScript = `window.onscroll = function(ev) {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
       window.ReactNativeWebView.postMessage("scrollToEnd")
    }};`;

  return (
    <BaseLayout {...baseLayoutProps}>
      {_.size(termAndConditions) > 1 && (
        <SegmentControl
          selectedIndex={filter.groupIndex}
          values={termAndConditions.map((item) => item.label)}
          onChange={onTabChange}
        />
      )}
      {termAndConditions.map((item, index) => (
        <Fragment key={item.label}>
          {index === filter.groupIndex && (
            <WebView
              ref={webViewRef}
              testID="termConditionView"
              style={styles.webview}
              originWhitelist={['*']}
              source={{ html: item.content }}
              injectedJavaScript={injectedJavaScript}
              onLoad={onWebViewLoad}
              onMessage={onMessageReceived}
              scalesPageToFit={Platform.OS === 'android'}
              automaticallyAdjustContentInsets={false}
              showsVerticalScrollIndicator
            />
          )}
        </Fragment>
      ))}

      <Hint text="TERM_CONDITIONS_SCROLL_TO_AGREE" />
      <ButtonWrapper>
        {!isLastTab ? (
          <NextTermButton
            disabled={disabledButton}
            title="TERM_CONDITIONS_BTN_NEXT"
            onPressNextTerm={onPressNextTerm}
          />
        ) : (
          <Fragment>
            {termAndConditions.map((item, index) => {
              const checked = selectedItems.findIndex((child) => child.id === item.id) > -1;
              const disabledCheckBox = disabledAgree.find((_item, checkBoxIdx) => index === checkBoxIdx);

              return (
                <CheckBoxTerm
                  {...item}
                  key={item.id}
                  testID={`checkbox-${item.id}`}
                  disabled={disabledCheckBox}
                  labelFirst={false}
                  label={item.checkboxLabel}
                  value={checked}
                  showRequiredMark
                  onCheckBoxPress={() => checkItem(item)}
                />
              );
            })}
            <NextTermButton
              showIcon={false}
              title="TERM_CONDITION_BUTTON_AGREE"
              disabled={!allowAgree}
              onPressNextTerm={onAgree}
            />
          </Fragment>
        )}
        <ScrollDownButton onPress={onPressScrollToBottom} />
      </ButtonWrapper>
    </BaseLayout>
  );
};

export default TermAndConditions;

const styles = StyleSheet.create({
  webview: {
    flex: 1,
    marginHorizontal: 10,
    marginTop: 10,
  },
});
