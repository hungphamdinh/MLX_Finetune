// UserProfile.jsx
import React, { useEffect } from 'react';
import styled from 'styled-components/native';
import { View } from 'react-native';
import { FormProvider } from 'react-hook-form';
import NavigationService from '@NavigationService';
import * as Yup from 'yup';
import {
  FormInput,
  FormDate,
  FormSwitch,
} from '@Components/Forms';
import { Box, Button, Text } from '@Elements';
import useUser from '@Context/User/Hooks/UseUser';
import useSettings from '@Context/Settings/Hooks/UseSettings';
import { useCompatibleForm, useYupValidationResolver } from '@Utils/hook';

const ProfileContainer = styled.View`
  flex: 1;
  padding: 20px;
  background-color: white;
`;

const UserProfile = ({ testID }) => {
  const requiredMessage = 'This field is required';

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required(requiredMessage),
    lastName: Yup.string().required(requiredMessage),
    email: Yup.string().email('Invalid email').required(requiredMessage),
    birthday: Yup.date().nullable(),
    notifications: Yup.boolean(),
  });

  const formMethods = useCompatibleForm({
    resolver: useYupValidationResolver(validationSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      birthday: null,
      notifications: false,
    },
  });

  const { handleSubmit, setValue, watch } = formMethods;

  const { user, fetchUser, updateUser } = useUser();
  const { settings, fetchSettings, updateSettings } = useSettings();

  useEffect(() => {
    fetchUser();
    fetchSettings();
  }, [fetchUser, fetchSettings]);

  useEffect(() => {
    if (user) {
      formMethods.reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        birthday: user.birthday,
        notifications: settings.notifications,
      });
    }
  }, [user, settings, formMethods]);

  const onSubmit = async (data) => {
    const response = await updateUser(data);
    if (response.success) {
      NavigationService.goBack();
    } else {
      // Handle error (e.g., show a modal or toast)
    }
  };

  return (
    <FormProvider {...formMethods}>
      <ProfileContainer testID={testID}>
        <FormInput
          required
          label="First Name"
          name="firstName"
          testID={`${testID}-firstName`}
        />
        <FormInput
          required
          label="Last Name"
          name="lastName"
          testID={`${testID}-lastName`}
        />
        <FormInput
          required
          label="Email"
          name="email"
          keyboardType="email-address"
          testID={`${testID}-email`}
        />
        <FormDate
          label="Birthday"
          name="birthday"
          mode="date"
          testID={`${testID}-birthday`}
        />
        <FormSwitch
          label="Enable Notifications"
          name="notifications"
          testID={`${testID}-notifications`}
        />
        <Button
          title="Save Profile"
          onPress={handleSubmit(onSubmit)}
          testID={`${testID}-save-button`}
        />
      </ProfileContainer>
    </FormProvider>
  );
};

export default UserProfile;