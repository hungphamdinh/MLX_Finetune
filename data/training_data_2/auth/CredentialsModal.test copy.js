import React from 'react';
import { FormProvider } from 'react-hook-form';
import I18n from '@I18n';
import * as Yup from 'yup';
import styled from 'styled-components/native';
import { Button } from '../../../Elements';
import { FormInput } from '../../Forms';
import { withModal } from '../../../HOC';
import { useCompatibleForm, useYupValidationResolver } from '../../../Utils/hook';
import { icons } from '../../../Resources/icon';
import useUser from '../../../Context/User/Hooks/UseUser';
import { BIOMETRIC_STATUS } from '../../../Config/Constants';

const ButtonWrapper = styled.View`
  align-items: center;
  margin-top: 10px;
`;

const Wrapper = styled.View`
  padding-horizontal: 10px;
`;

const InputIcon = styled.Image`
  margin-right: 10px;
`;

const CredentialsModal = ({ onSuccess }) => {
  const {
    user: { user },
    checkAuthenticate,
    updateUserBiometric,
  } = useUser();

  const requiredQuestion = I18n.t('AUTH_REQUIRED_FIELD');
  const validationSchema = Yup.object().shape({
    password: Yup.string().required(requiredQuestion),
  });
  const formMethods = useCompatibleForm({
    resolver: useYupValidationResolver(validationSchema),
    defaultValues: {
      username: user.emailAddress,
      password: '',
    },
  });

  const onSubmit = async (values) => {
    const response = await checkAuthenticate(values);
    if (response) {
      updateUserBiometric(BIOMETRIC_STATUS.ON);
      onSuccess();
    }
  };

  return (
    <Wrapper>
      <FormProvider {...formMethods}>
        <FormInput
          name="username"
          mode="small"
          keyboardType="email-address"
          label="LOGIN_USERNAME"
          editable={false}
          placeholder="LOGIN_USERNAME"
        />
        <FormInput
          name="password"
          secureTextEntry
          mode="small"
          label="LOGIN_PASSWORD"
          placeholder="LOGIN_PASSWORD"
          leftIcon={<InputIcon source={icons.password} />}
        />
        <ButtonWrapper center>
          <Button
            block
            primary
            rounded
            title={I18n.t('ENABLE_BIOMETRIC')}
            onPress={formMethods.handleSubmit(onSubmit)}
          />
        </ButtonWrapper>
      </FormProvider>
    </Wrapper>
  );
};

export default withModal(CredentialsModal, 'CREDENTIALS_TITLE');
