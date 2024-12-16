// NotificationSettings.jsx
import React, { useEffect } from 'react';
import styled from 'styled-components/native';
import { FlatList, View } from 'react-native';
import { Text, Switch } from '@components/Commons';
import useSettings from '@Context/Settings/Hooks/UseSettings';

const SettingsContainer = styled.View`
  flex: 1;
  padding: 20px;
  background-color: white;
`;

const SettingItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom-width: 1px;
  border-bottom-color: #eee;
`;

const NotificationSettings = ({ testID }) => {
  const { settings, fetchSettings, updateSetting } = useSettings();

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleToggle = (key, value) => {
    updateSetting(key, value);
  };

  const renderItem = ({ item }) => (
    <SettingItem testID={`setting-item-${item.key}`}>
      <Text text={item.label} />
      <Switch
        value={item.enabled}
        onValueChange={(value) => handleToggle(item.key, value)}
        testID={`switch-${item.key}`}
      />
    </SettingItem>
  );

  if (!settings) {
    return (
      <SettingsContainer testID={testID}>
        <Text text="Loading..." />
      </SettingsContainer>
    );
  }

  return (
    <SettingsContainer testID={testID}>
      <FlatList
        data={settings}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
      />
    </SettingsContainer>
  );
};

export default NotificationSettings;