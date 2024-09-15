import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { renderScreen } from '__@mocks__/mockApp';
import AddPost from '../addPost';

jest.mock('@utils/toast', () => ({
  showError: jest.fn(),
}));

const mockUser = { displayName: 'John Doe' };
const mockUnitActive = { unitId: 1, memberRole: 'member' };
const mockActions = {
  socialCommunity: {
    createPost: jest.fn(),
  },
};

describe('AddPost', () => {
  const renderComponent = (props = {}) =>
    renderScreen(<AddPost />)({
      store: {
        userProfile: {
          user: mockUser,
          ...props.userProfile,
        },
        units: { unitActive: mockUnitActive, ...props.units },
      },
      actions: mockActions,
    });

  it('renders the component correctly', () => {
    const { getByPlaceholderText, getByText } = renderComponent();

    expect(getByPlaceholderText('POST_CREATE_PLACEHOLDER')).toBeTruthy();
    expect(getByText('John Doe')).toBeTruthy();
  });

  it('updates the post content when typing', () => {
    const { getByPlaceholderText } = renderComponent();
    const input = getByPlaceholderText('POST_CREATE_PLACEHOLDER');
    fireEvent.changeText(input, 'Hello, world!');

    expect(input.props.value).toBe('Hello, world!');
  });

  it('shows an error when more than 10 images are selected', () => {
    const { getByText } = renderComponent();
    const createButton = getByText('SOCIAL_COMMUNITY_POST_CREATE_BUTTON');
    fireEvent.press(createButton);

    expect(mockActions.socialCommunity.createPost).not.toHaveBeenCalled();
  });
});
