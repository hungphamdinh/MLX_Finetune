// TaskFilter.jsx
import React from 'react';
import { View, Picker } from 'react-native';
import useTaskManagement from '@Context/TaskManagement/Hooks/UseTaskManagement';

const TaskFilter = () => {
  const { statusList, filterStatus, setFilterStatus } = useTaskManagement();

  return (
    <View>
      <Picker
        selectedValue={filterStatus}
        onValueChange={(value) => setFilterStatus(value)}
        testID="status-filter"
      >
        <Picker.Item label="All" value="" />
        {statusList.map((status) => (
          <Picker.Item key={status.id} label={status.name} value={status.code} />
        ))}
      </Picker>
    </View>
  );
};

export default TaskFilter;