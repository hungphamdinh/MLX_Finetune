// SettingsToggle.jsx
import React from 'react';
import styled from 'styled-components/native';
import { Switch } from 'react-native';
import { Text } from '@components/Commons';
import useSettings from '@Context/Settings/Hooks/UseSettings';

const ToggleContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom-width: 1px;
  border-bottom-color: #eee;
`;

const SettingsToggle = ({ label, settingKey, testID }) => {
  const { settings, toggleSetting } = useSettings();

  const isEnabled = settings[settingKey] || false;

  const handleToggle = () => {
    toggleSetting(settingKey, !isEnabled);
  };

  return (
    <ToggleContainer testID={testID}>
      <Text text={label} />
      <Switch
        value={isEnabled}
        onValueChange={handleToggle}
        testID={`${testID}-switch`}
      />
    </ToggleContainer>
  );
};

export default SettingsToggle;