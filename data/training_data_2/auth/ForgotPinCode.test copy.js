import React, { Fragment, useEffect, useState } from 'react';
import I18n from '@I18n';
import { FormProvider } from 'react-hook-form';
import { Button, Card, Text } from '@Elements';
import { Keyboard, DeviceEventEmitter } from 'react-native';
import * as Yup from 'yup';
import styled from 'styled-components/native';
import FormPasswordInput from '../../../Components/Auths/FormPasswordInput';
import BaseLayout from '../../../Components/Layout/BaseLayout';
import AwareScrollView from '../../../Components/Layout/AwareScrollView';
import useUser from '../../../Context/User/Hooks/UseUser';
import { useCompatibleForm, useYupValidationResolver } from '../../../Utils/hook';
import { images } from '../../../Resources/image';

const ConfirmWrapper = styled.View`
  align-items: center;
  padding-horizontal: 40px;
`;

const PinCodeImage = styled.Image`
  width: 100px;
  height: 100px;
  margin-vertical: 40px;
`;

const ConfirmText = styled(Text)`
  margin-bottom: 40px;
  font-size: 16px;
`;

const Caption = styled(Text)`
  color: gray;
  font-size: 12px;
  margin-horizontal: 15px;
`;

const ConfirmView = ({ onContinuePress, user }) => {
  const message = I18n.t('AUTH_FORGOT_PIN_EMAIL_CONTENT', null, user?.emailAddress);
  return (
    <ConfirmWrapper>
      <PinCodeImage source={images.pinCode} />
      <ConfirmText text={message} />
      <Button onPress={onContinuePress} primary rounded title="COMMON_CONTINUE" testID="continue-button" />
    </ConfirmWrapper>
  );
};

const ForgotPinCode = () => {
  const [isReset, setIsReset] = useState(false);

  const {
    user: { user },
    resetPinCode,
    sendPinResetCode,
  } = useUser();

  useEffect(() => {
    const subscriber = DeviceEventEmitter.addListener('sendPinResetCodeSuccess', sendVerifySuccess);
    return () => {
      subscriber.remove();
    };
  }, []);

  const onContinuePress = () => {
    sendPinResetCode({ email: user.emailAddress });
  };

  const sendVerifySuccess = () => {
    setIsReset(true);
  };

  const onSubmit = async (values) => {
    Keyboard.dismiss();
    const params = {
      pinCode: values.pin,
      verificationCode: values.verificationCode,
    };
    resetPinCode(params);
  };

  const requiredQuestion = I18n.t('AUTH_REQUIRED_FIELD');

  const validationSchema = Yup.object({
    verificationCode: Yup.string().required(requiredQuestion),
    pin: Yup.string()
      .required(requiredQuestion)
      .matches(/^\d{6}$/, I18n.t('AUTH_PIN_CODE_INVALID')),
    confirmPin: Yup.string().oneOf([Yup.ref('pin')], I18n.t('CHANGE_PIN_NOT_EQUAL_RE')),
  });

  const formMethods = useCompatibleForm({
    resolver: useYupValidationResolver(validationSchema),
    defaultValues: {
      verificationCode: '',
      pin: '',
      confirmPin: '',
    },
  });

  const pinInputProps = {
    keyboardType: 'number-pad',
    mode: 'small',
    maxLength: 6,
  };

  return (
    <BaseLayout title="AUTH_BTN_FORGOT_PIN" showBell={false} containerStyle={{ backgroundColor: 'white' }}>
      <AwareScrollView>
        {!isReset ? (
          <ConfirmView user={user} onContinuePress={onContinuePress} />
        ) : (
          <Fragment>
            <Card>
              <FormProvider {...formMethods}>
                <FormPasswordInput {...pinInputProps} name="verificationCode" label="VERIFICATION_CODE" />
                <FormPasswordInput {...pinInputProps} name="pin" label="ENTER_PIN" />
                <FormPasswordInput {...pinInputProps} name="confirmPin" label="CONFIRM_PIN" />
                <Button
                  onPress={formMethods.handleSubmit(onSubmit)}
                  primary
                  rounded
                  title="AD_COMMON_SAVE"
                  testID="save-button"
                />
              </FormProvider>
            </Card>
            <Caption text="AUTH_PIN_CODE_HINT" />
          </Fragment>
        )}
      </AwareScrollView>
    </BaseLayout>
  );
};

export default ForgotPinCode;
