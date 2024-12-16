// AddTask.jsx
import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import useTaskManagement from '@Context/TaskManagement/Hooks/UseTaskManagement';

const AddTask = () => {
  const { addTask } = useTaskManagement();
  const [taskName, setTaskName] = useState('');

  const handleAddTask = () => {
    if (taskName) {
      addTask({ name: taskName });
      setTaskName('');
    }
  };

  return (
    <View>
      <TextInput
        value={taskName}
        onChangeText={setTaskName}
        placeholder="Enter task name"
        testID="task-name-input"
      />
      <Button title="Add Task" onPress={handleAddTask} testID="add-task-button" />
    </View>
  );
};

export default AddTask;