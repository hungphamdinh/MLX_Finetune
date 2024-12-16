import React, { Fragment } from 'react';
import I18n from '@I18n';
import { FormProvider } from 'react-hook-form';
import { Button, Card, Text } from '@Elements';
import { Keyboard } from 'react-native';
import * as Yup from 'yup';
import _ from 'lodash';
import NavigationService from '@NavigationService';
import styled from 'styled-components/native';
import FormPasswordInput from '../../../Components/Auths/FormPasswordInput';
import BaseLayout from '../../../Components/Layout/BaseLayout';
import AwareScrollView from '../../../Components/Layout/AwareScrollView';
import useUser from '../../../Context/User/Hooks/UseUser';
import { useCompatibleForm, useYupValidationResolver } from '../../../Utils/hook';
import { withModal } from '../../../HOC';

const Caption = styled(Text)`
  color: gray;
  font-size: 12px;
  margin-horizontal: 15px;
`;

const SetupPinCodeView = ({ isChangePin, isScreen = false }) => {
  const { changePinCode, setupPinCode } = useUser();

  const goBack = () => {
    if (isScreen) {
      NavigationService.goBack();
    }
  };

  const onSubmit = async (values) => {
    Keyboard.dismiss();
    const params = {
      pinCode: values.pin,
      oldPinCode: isChangePin ? values.oldPin : undefined,
    };
    const actionFnc = isChangePin ? changePinCode : setupPinCode;
    const result = await actionFnc(params);

    if (result) {
      goBack();
    }
  };

  const requiredQuestion = I18n.t('AUTH_REQUIRED_FIELD');
  let addOnValidation = {};
  if (isChangePin) {
    addOnValidation = {
      oldPin: Yup.string().required(requiredQuestion),
    };
  }

  let pinValidation = Yup.string()
    .required(requiredQuestion)
    .matches(/^\d{6}$/, I18n.t('AUTH_PIN_CODE_INVALID'));
  if (isChangePin) {
    pinValidation = pinValidation.test('not-same-as-old', I18n.t('AUTH_OLD_PIN_DIFFERENT_NEW_PIN'), function (value) {
      return value !== this.parent.oldPin;
    });
  }

  const validationSchema = Yup.object({
    pin: pinValidation,
    confirmPin: Yup.string().oneOf([Yup.ref('pin')], I18n.t('CHANGE_PIN_NOT_EQUAL_RE')),
    ...addOnValidation,
  });

  const formMethods = useCompatibleForm({
    resolver: useYupValidationResolver(validationSchema),
    defaultValues: {
      oldPin: '',
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
    <Fragment>
      <Card>
        <FormProvider {...formMethods}>
          {isChangePin && <FormPasswordInput {...pinInputProps} name="oldPin" label="CURRENT_PIN" />}
          <FormPasswordInput {...pinInputProps} name="pin" label={isChangePin ? 'NEW_PIN' : 'ENTER_PIN'} />
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
  );
};

const SetupPinCode = ({ navigation }) => {
  const isChangePin = _.get(navigation, 'state.routeName') === 'changePinCode';

  return (
    <BaseLayout
      title={isChangePin ? 'CHANGE_PIN' : 'SETUP_PIN'}
      showBell={false}
      containerStyle={{ backgroundColor: 'white' }}
    >
      <AwareScrollView>
        <SetupPinCodeView isChangePin={isChangePin} isScreen />
      </AwareScrollView>
    </BaseLayout>
  );
};

export default SetupPinCode;

export const SetupPinCodeModal = withModal(() => <SetupPinCodeView />, 'SETUP_PIN');
