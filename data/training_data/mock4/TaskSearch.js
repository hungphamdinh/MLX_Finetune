// TaskAssignment.jsx
import React, { useState } from 'react';
import { View, Picker, Button } from 'react-native';
import useTaskManagement from '@Context/TaskManagement/Hooks/UseTaskManagement';

const TaskAssignment = ({ taskId }) => {
  const { users, assignTask } = useTaskManagement();
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleAssign = () => {
    if (selectedUserId) {
      assignTask(taskId, selectedUserId);
    }
  };

  return (
    <View>
      <Picker
        selectedValue={selectedUserId}
        onValueChange={(value) => setSelectedUserId(value)}
        testID="user-picker"
      >
        <Picker.Item label="Select User" value={null} />
        {users.map((user) => (
          <Picker.Item key={user.id} label={user.name} value={user.id} />
        ))}
      </Picker>
      <Button title="Assign Task" onPress={handleAssign} testID="assign-button" />
    </View>
  );
};

export default TaskAssignment;