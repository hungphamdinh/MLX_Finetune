import React from 'react';
import { renderScreen } from '@Mock/mockApp';
import mockNavigation from '@Mock/mockNavigation';
import DetailPost from '../index';

const mockActions = {
  socialCommunity: {
    detailPost: jest.fn(),
    getPostComments: jest.fn(),
    postComment: jest.fn(),
    deleteComment: jest.fn(),
  },
};

const mockApp = {
  store: {
    socialCommunity: {
      list: [],
    },
  },
  actions: mockActions,
};

const commonProps = {
  navigation: mockNavigation('DetailPost', {
    id: 1
  }),
};

const renderDetail = () => renderScreen(<DetailPost {...commonProps} />)(mockApp);

describe('DetailPost', () => {
  it('renders correctly', () => {
    renderDetail();
  });
});
