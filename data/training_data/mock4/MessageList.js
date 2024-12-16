// MessageList.jsx
import React, { useEffect } from 'react';
import { View, FlatList, Text } from 'react-native';
import useChat from '@Context/Chat/Hooks/UseChat';

const MessageList = ({ conversationId }) => {
  const { messages, getMessages } = useChat();

  useEffect(() => {
    getMessages(conversationId);
  }, [conversationId]);

  if (!messages) {
    return <Text>Loading messages...</Text>;
  }

  return (
    <FlatList
      testID="message-list"
      data={messages}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View testID={`message-item-${item.id}`}>
          <Text>{item.senderName}</Text>
          <Text>{item.content}</Text>
        </View>
      )}
    />
  );
};

export default MessageList;