// TaskSearch.jsx
import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import useTaskManagement from '@Context/TaskManagement/Hooks/UseTaskManagement';

const TaskSearch = () => {
  const { searchTasks } = useTaskManagement();
  const [keyword, setKeyword] = useState('');

  const handleSearch = () => {
    searchTasks(keyword);
  };

  return (
    <View>
      <TextInput
        value={keyword}
        onChangeText={setKeyword}
        placeholder="Search tasks"
        testID="search-input"
      />
      <Button title="Search" onPress={handleSearch} testID="search-button" />
    </View>
  );
};

export default TaskSearch;