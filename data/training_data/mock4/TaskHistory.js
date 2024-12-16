// TaskHistory.jsx
import React, { useEffect } from 'react';
import { FlatList, Text } from 'react-native';
import useTaskManagement from '@Context/TaskManagement/Hooks/UseTaskManagement';

const TaskHistory = ({ taskId }) => {
  const { history, getTaskHistory } = useTaskManagement();

  useEffect(() => {
    getTaskHistory(taskId);
  }, [taskId]);

  if (!history) {
    return <Text>Loading task history...</Text>;
  }

  return (
    <FlatList
      testID="history-list"
      data={history}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <Text testID={`history-item-${item.id}`}>{item.description}</Text>
      )}
    />
  );
};

export default TaskHistory;