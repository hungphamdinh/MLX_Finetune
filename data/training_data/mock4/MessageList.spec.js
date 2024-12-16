// MessageList.test.jsx
import React from 'react';
import MessageList from '../MessageList';
import { render, waitFor } from '@testing-library/react-native';
import useChat from '@Context/Chat/Hooks/UseChat';

// Mock External Dependencies
jest.mock('@Context/Chat/Hooks/UseChat');
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock Functions
const mockGetMessages = jest.fn();

// Mock Data
const messagesMock = [
  { id: 1, senderName: 'Alice', content: 'Hello!' },
  { id: 2, senderName: 'Bob', content: 'Hi there!' },
];

// Setup Mocks Before Each Test
beforeEach(() => {
  // Mock useChat Hook
  useChat.mockReturnValue({
    messages: messagesMock,
    getMessages: mockGetMessages,
  });

  // Clear Mock Functions
  mockGetMessages.mockClear();
});

// Define Render Function
const renderComponent = (props = {}) => render(<MessageList {...props} />);

// Write Test Cases
describe('MessageList Component', () => {
  it('fetches messages on mount', async () => {
    renderComponent({ conversationId: 123 });

    await waitFor(() => expect(mockGetMessages).toHaveBeenCalledWith(123));
  });

  it('renders messages correctly', async () => {
    const { getByTestId, getAllByText } = renderComponent({ conversationId: 123 });

    await waitFor(() => expect(getByTestId('message-list')).toBeTruthy());

    // Verify that messages are displayed
    expect(getAllByText(/Hello|Hi/).length).toBe(2);
  });

  it('displays loading indicator when messages are not available', () => {
    useChat.mockReturnValue({
      messages: null,
      getMessages: mockGetMessages,
    });

    const { getByText } = renderComponent({ conversationId: 123 });

    expect(getByText('Loading messages...')).toBeTruthy();
  });
});