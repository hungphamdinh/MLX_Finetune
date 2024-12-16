// TaskDetail.jsx
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import useTaskManagement from '@Context/TaskManagement/Hooks/UseTaskManagement';
import TaskComments from './TaskComments';

const TaskDetail = ({ taskId }) => {
  const { taskDetail, getTaskDetail } = useTaskManagement();

  useEffect(() => {
    getTaskDetail(taskId);
  }, [taskId]);

  if (!taskDetail) {
    return <Text>Loading task details...</Text>;
  }

  return (
    <View>
      <Text testID="task-name">{taskDetail.name}</Text>
      <Text testID="task-description">{taskDetail.description}</Text>
      <TaskComments taskId={taskId} />
    </View>
  );
};

export default TaskDetail;