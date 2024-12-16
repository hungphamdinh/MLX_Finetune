// TaskItem.jsx
import React from 'react';
import { View, Text } from 'react-native';

const TaskItem = ({ task }) => {
  return (
    <View testID={`task-item-${task.id}`}>
      <Text testID={`task-name-${task.id}`}>{task.name}</Text>
      <Text testID={`task-status-${task.id}`}>{task.status}</Text>
    </View>
  );
};

export default TaskItem;