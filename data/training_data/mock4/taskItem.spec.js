// TaskItem.test.jsx
import React from 'react';
import TaskItem from '../TaskItem';
import { render } from '@testing-library/react-native';

// Define Render Function
const renderComponent = (props) => render(<TaskItem {...props} />);

// Write Test Cases
describe('TaskItem Component', () => {
  it('renders task details correctly', () => {
    const task = { id: 1, name: 'Task One', status: 'Open' };
    const { getByTestId } = renderComponent({ task });

    expect(getByTestId('task-name-1').props.children).toBe('Task One');
    expect(getByTestId('task-status-1').props.children).toBe('Open');
  });
});