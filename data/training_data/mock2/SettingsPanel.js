// SettingsPanel.jsx
import React from 'react';
import styled from 'styled-components/native';
import { View } from 'react-native';
import { FormProvider } from 'react-hook-form';
import * as Yup from 'yup';
import { useCompatibleForm, useYupValidationResolver } from '@Utils/hook';
import {
  FormSwitch,
  FormRadioGroup,
} from '@Components/Forms';
import { Button, Text } from '@Elements';
import useSettings from '@Context/Settings/Hooks/UseSettings';

const PanelContainer = styled.View`
  flex: 1;
  padding: 20px;
  background-color: white;
`;

const SettingsPanel = ({ testID }) => {
  const validationSchema = Yup.object().shape({
    darkMode: Yup.boolean(),
    language: Yup.string().required('Language selection is required'),
  });

  const formMethods = useCompatibleForm({
    resolver: useYupValidationResolver(validationSchema),
    defaultValues: { darkMode: false, language: 'en' },
  });

  const { handleSubmit, watch } = formMethods;
  const { settings, fetchSettings, updateSettings } = useSettings();

  React.useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  React.useEffect(() => {
    if (settings) {
      formMethods.reset({
        darkMode: settings.darkMode,
        language: settings.language,
      });
    }
  }, [settings, formMethods]);

  const onSubmit = async (data) => {
    await updateSettings(data);
  };

  const languageOptions = [
    { label: 'English', value: 'en' },
    { label: 'Spanish', value: 'es' },
    { label: 'French', value: 'fr' },
  ];

  return (
    <FormProvider {...formMethods}>
      <PanelContainer testID={testID}>
        <FormSwitch
          label="Enable Dark Mode"
          name="darkMode"
          testID={`${testID}-darkMode`}
        />
        <FormRadioGroup
          options={languageOptions}
          name="language"
          testID={`${testID}-language`}
        />
        <Button
          title="Save Settings"
          onPress={handleSubmit(onSubmit)}
          testID={`${testID}-save-button`}
        />
      </PanelContainer>
    </FormProvider>
  );
};

export default SettingsPanel;