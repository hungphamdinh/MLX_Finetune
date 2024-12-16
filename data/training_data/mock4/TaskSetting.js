// TaskSettings.jsx
import React, { useState } from 'react';
import { View, Switch, Text } from 'react-native';
import useTaskManagement from '@Context/TaskManagement/Hooks/UseTaskManagement';

const TaskSettings = () => {
  const { settings, updateSettings } = useTaskManagement();
  const [notificationsEnabled, setNotificationsEnabled] = useState(settings.notificationsEnabled);

  const toggleNotifications = () => {
    setNotificationsEnabled((prev) => !prev);
    updateSettings({ notificationsEnabled: !notificationsEnabled });
  };

  return (
    <View>
      <View>
        <Text>Enable Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={toggleNotifications}
          testID="notifications-switch"
        />
      </View>
    </View>
  );
};

export default TaskSettings;