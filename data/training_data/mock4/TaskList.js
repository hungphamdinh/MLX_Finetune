// TaskList.jsx
import React, { useEffect } from 'react';
import { FlatList, Text, View } from 'react-native';
import useTaskManagement from '@Context/TaskManagement/Hooks/UseTaskManagement';
import TaskItem from './TaskItem';

const TaskList = () => {
  const { tasks, getTasks } = useTaskManagement();

  useEffect(() => {
    getTasks();
  }, []);

  if (!tasks) {
    return <Text>Loading tasks...</Text>;
  }

  return (
    <FlatList
      testID="task-list"
      data={tasks}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <TaskItem task={item} />}
    />
  );
};

export default TaskList;