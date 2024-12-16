// NotificationSettings.jsx
import React, { useEffect } from 'react';
import styled from 'styled-components/native';
import { View } from 'react-native';
import { FormProvider } from 'react-hook-form';
import NavigationService from '@NavigationService';
import * as Yup from 'yup';
import {
  FormSwitch,
  FormRadioGroup,
} from '@Components/Forms';
import { Box, Button, Text } from '@Elements';
import useSettings from '@Context/Settings/Hooks/UseSettings';
import { useCompatibleForm, useYupValidationResolver } from '@Utils/hook';

const SettingsContainer = styled.View`
  flex: 1;
  padding: 20px;
  background-color: white;
`;

const NotificationSettings = ({ testID }) => {
  const validationSchema = Yup.object().shape({
    emailNotifications: Yup.boolean(),
    pushNotifications: Yup.boolean(),
    smsNotifications: Yup.boolean(),
    notificationFrequency: Yup.string().required('Frequency is required'),
  });

  const formMethods = useCompatibleForm({
    resolver: useYupValidationResolver(validationSchema),
    defaultValues: {
      emailNotifications: false,
      pushNotifications: false,
      smsNotifications: false,
      notificationFrequency: 'daily',
    },
  });

  const { handleSubmit, setValue, watch } = formMethods;

  const { settings, fetchSettings, updateSettings } = useSettings();

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    if (settings) {
      formMethods.reset({
        emailNotifications: settings.emailNotifications,
        pushNotifications: settings.pushNotifications,
        smsNotifications: settings.smsNotifications,
        notificationFrequency: settings.notificationFrequency,
      });
    }
  }, [settings, formMethods]);

  const onSubmit = async (data) => {
    const response = await updateSettings(data);
    if (response.success) {
      NavigationService.goBack();
    } else {
      // Handle error (e.g., show a modal or toast)
    }
  };

  const notificationOptions = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
  ];

  return (
    <FormProvider {...formMethods}>
      <SettingsContainer testID={testID}>
        <FormSwitch
          label="Enable Email Notifications"
          name="emailNotifications"
          testID={`${testID}-emailNotifications`}
        />
        <FormSwitch
          label="Enable Push Notifications"
          name="pushNotifications"
          testID={`${testID}-pushNotifications`}
        />
        <FormSwitch
          label="Enable SMS Notifications"
          name="smsNotifications"
          testID={`${testID}-smsNotifications`}
        />
        <Box title="Notification Frequency">
          <FormRadioGroup
            options={notificationOptions}
            name="notificationFrequency"
            testID={`${testID}-notificationFrequency`}
            horizontal
          />
        </Box>
        <Button
          title="Save Settings"
          onPress={handleSubmit(onSubmit)}
          testID={`${testID}-save-button`}
        />
      </SettingsContainer>
    </FormProvider>
  );
};

export default NotificationSettings;