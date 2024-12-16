// TaskComments.jsx
import React, { useEffect } from 'react';
import { FlatList, Text } from 'react-native';
import useTaskManagement from '@Context/TaskManagement/Hooks/UseTaskManagement';

const TaskComments = ({ taskId }) => {
  const { comments, getTaskComments } = useTaskManagement();

  useEffect(() => {
    getTaskComments(taskId);
  }, [taskId]);

  if (!comments) {
    return <Text>Loading comments...</Text>;
  }

  return (
    <FlatList
      testID="comments-list"
      data={comments}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <Text testID={`comment-${item.id}`}>{item.text}</Text>
      )}
    />
  );
};

export default TaskComments;