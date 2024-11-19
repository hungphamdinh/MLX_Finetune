import React from 'react';
import NavigationService from '@NavigationService';
import styled from 'styled-components/native';
import { Button, Text } from '@Elements';
import AuthLayout from '../../../Components/Auths/AuthLayout';

import { BIOMETRIC_STATUS } from '../../../Config/Constants';
import useUser from '../../../Context/User/Hooks/UseUser';

const Title = styled(Text)`
  color: black;
  font-weight: bold;
  font-size: 30px;
  margin-top: 50px;
  width: 80%;
`;

const Subtitle = styled(Text)`
  color: black;
  margin-top: 26px;
`;

const SettingButton = styled(Button).attrs(() => ({
  containerStyle: {
    height: 50,
    borderRadius: 25,
    marginTop: 32,
    alignSelf: 'center',
  },
}))``;

const SkipButton = styled(Button)`
  margin-top: 10px;
  text-decoration-line: underline;
  color: gray;
  font-weight: bold;
`;

const Wrapper = styled.View`
  padding-horizontal: 40px;
`;
const BiometricScreen = () => {
  const { saveBiometricSetting } = useUser();

  const onGoToSettings = () => {
    NavigationService.replace('Setting');
  };

  const onSkip = () => {
    NavigationService.goBack();
  };

  const submit = (callBack) => {
    saveBiometricSetting(BIOMETRIC_STATUS.SKIP);
    callBack();
  };

  return (
    <AuthLayout onRightButtonPress={() => submit(onSkip)} showRightButton showLeftButton={false}>
      <Wrapper>
        <Title text="BIOMETRIC_TITLE" />
        <Subtitle text="BIOMETRIC_SUB_TITLE" />
      </Wrapper>

      <SettingButton title="GO_TO_SETTINGS" primary rounded onPress={() => submit(onGoToSettings)} />
      <SkipButton title="SKIP_FOR_NOW" transparent onPress={() => submit(onSkip)} />
    </AuthLayout>
  );
};

export default BiometricScreen;
