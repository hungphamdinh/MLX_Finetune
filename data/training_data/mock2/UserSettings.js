// UserSettings.jsx
import React, { useEffect } from 'react';
import styled from 'styled-components/native';
import { View } from 'react-native';
import { FormProvider } from 'react-hook-form';
import NavigationService from '@NavigationService';
import * as Yup from 'yup';
import {
  FormInput,
  FormSwitch,
  FormDate,
} from '@Components/Forms';
import { Box, Button, Text } from '@Elements';
import useSettings from '@Context/Settings/Hooks/UseSettings';
import useUser from '@Context/User/Hooks/UseUser';
import { useCompatibleForm, useYupValidationResolver } from '@Utils/hook';

const SettingsContainer = styled.View`
  flex: 1;
  padding: 20px;
  background-color: white;
`;

const UserSettings = ({ testID }) => {
  const requiredMessage = 'This field is required';
  
  const validationSchema = Yup.object().shape({
    username: Yup.string().required(requiredMessage),
    email: Yup.string().email('Invalid email').required(requiredMessage),
    notifications: Yup.boolean(),
    birthday: Yup.date().nullable(),
  });

  const formMethods = useCompatibleForm({
    resolver: useYupValidationResolver(validationSchema),
    defaultValues: {
      username: '',
      email: '',
      notifications: false,
      birthday: null,
    },
  });

  const { handleSubmit, setValue, watch } = formMethods;

  const { settings, fetchSettings, updateSettings } = useSettings();
  const { user, fetchUser } = useUser();

  useEffect(() => {
    fetchSettings();
    fetchUser();
  }, [fetchSettings, fetchUser]);

  useEffect(() => {
    if (user) {
      formMethods.reset({
        username: user.username,
        email: user.email,
        notifications: settings.notifications,
        birthday: user.birthday,
      });
    }
  }, [user, settings, formMethods]);

  const onSubmit = async (data) => {
    const response = await updateSettings(data);
    if (response.success) {
      NavigationService.goBack();
    } else {
      // Handle error
    }
  };

  return (
    <FormProvider {...formMethods}>
      <SettingsContainer testID={testID}>
        <FormInput
          required
          label="Username"
          name="username"
          testID={`${testID}-username`}
        />
        <FormInput
          required
          label="Email"
          name="email"
          keyboardType="email-address"
          testID={`${testID}-email`}
        />
        <FormSwitch
          label="Enable Notifications"
          name="notifications"
          testID={`${testID}-notifications`}
        />
        <FormDate
          label="Birthday"
          name="birthday"
          mode="date"
          testID={`${testID}-birthday`}
        />
        <Button
          title="Save Settings"
          onPress={handleSubmit(onSubmit)}
          testID={`${testID}-save-button`}
        />
      </SettingsContainer>
    </FormProvider>
  );
};

export default UserSettings;