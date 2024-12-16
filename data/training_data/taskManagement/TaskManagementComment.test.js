import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { renderScreen } from '@Mock/mockApp';
import TaskManagementComment from '../TaskManagementComment';

const defaultState = {
  comments: [
    {
      id: 1,
      content: 'Test comment 1',
      userName: 'User 1',
    },
    {
      id: 2,
      content: 'Test comment 2',
      userName: 'User 2',
    },
  ],
  mentionUsers: [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
  ],
};

const testTask = {
  id: 1,
  name: 'Task Management',
  teamIds: [1, 2],
  tenantId: 4,
};

const renderTMComment = (state = defaultState) =>
  renderScreen(<TaskManagementComment task={testTask} teamList={[{name: 'Hung', id: 1}, {name: 'Hung2', id: 2}]} onCompleted={() => {}} />)({
    store: {
      app: {},
      taskManagement: {
        ...state,
        taskDetail: {
          isActive: true,
          name: 'Task Management',
        },
      },
      user: {
        user: {
          id: 1,
          displayName: 'Test User',
          profilePictureId: 'test-profile-pic',
        },
        tenant: {
          id: 4,
        },
      },
      file: {
        fileUrls: [],
      },
    },
  });

describe('TaskManagementComment', () => {
  it('renders TaskManagementComment without crashing', () => {
    renderTMComment();
  });

  it('renders floating button when task exists', () => {
    const { debug, getByTestId } = renderTMComment();
    debug();
    expect(getByTestId('message-floating-button')).toBeTruthy();
  });

  it('opens modal when floating button is pressed', () => {
    const { getByText, getByTestId } = renderTMComment();
    const floatingButton = getByTestId('message-floating-button');

    fireEvent.press(floatingButton);

    expect(getByText('# Task Management')).toBeTruthy();
  });
});
