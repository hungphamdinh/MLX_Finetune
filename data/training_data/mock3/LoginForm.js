// LoginForm.jsx
import React from 'react';
import styled from 'styled-components/native';
import { View } from 'react-native';
import { FormProvider, useForm } from 'react-hook-form';
import { TextInput, Button, Text } from '@components/Commons';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import useAuth from '@Context/Auth/Hooks/UseAuth';

const FormContainer = styled.View`
  flex: 1;
  padding: 20px;
  justify-content: center;
  background-color: white;
`;

const InputField = styled(TextInput)`
  margin-bottom: 15px;
`;

const ErrorText = styled(Text)`
  color: red;
  margin-bottom: 10px;
`;

const LoginForm = ({ testID }) => {
  const { login, authError } = useAuth();

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('INVALID_EMAIL').required('EMAIL_REQUIRED'),
    password: Yup.string().min(6, 'PASSWORD_MIN').required('PASSWORD_REQUIRED'),
  });

  const formMethods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: { email: '', password: '' },
  });

  const { handleSubmit, formState: { errors } } = formMethods;

  const onSubmit = (data) => {
    login(data.email, data.password);
  };

  return (
    <FormProvider {...formMethods}>
      <FormContainer testID={testID}>
        <InputField
          name="email"
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          testID="login-email"
        />
        {errors.email && <ErrorText text={errors.email.message} testID="error-email" />}

        <InputField
          name="password"
          placeholder="Password"
          secureTextEntry
          testID="login-password"
        />
        {errors.password && <ErrorText text={errors.password.message} testID="error-password" />}

        {authError && <ErrorText text={authError} testID="error-auth" />}

        <Button title="Login" onPress={handleSubmit(onSubmit)} testID="login-button" />
      </FormContainer>
    </FormProvider>
  );
};

export default LoginForm;