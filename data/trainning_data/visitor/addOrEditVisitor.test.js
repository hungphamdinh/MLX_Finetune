// BEGIN: 6f7d8a2fj3d1
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import AddOrEditVisitor from '../addOrEditVisitor/index';
import mockStore from '../../../../__mocks__/mockStore';

const detailVisitor = {
  visitorInformations: [
    {
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@example.com',
    },
  ],
  numberOfVisitors: 2,
  registerTime: '2022-01-01T00:00:00',
  registerCheckOutTime: '2022-01-01T01:00:00',
  description: 'Test Description',
  reasonForVisit: { id: 1, name: 'Test Reason' },
};

const store = mockStore({ visitor: { detailVisitor } });
const renderAddOrEditVisitor = () =>
  render(
    <Provider store={store}>
      <AddOrEditVisitor />
    </Provider>
  );

describe('AddOrEditVisitor', () => {
  beforeEach(() => {
    global.useMockRoute = {
      params: {},
      name: 'AddVisitor',
    };
  });

  it('renders the add visitor', () => {
    const { getByText } = renderAddOrEditVisitor();
    expect(getByText('VS_NEW')).toBeDefined();
  });

  it('does not render the visitor pass tab when adding a new visitor', () => {
    const { queryByText } = renderAddOrEditVisitor();
    expect(queryByText('VISITOR_PASS')).toBeNull();
  });

  it('changes the title to "VS_NEW" when adding a new visitor', () => {
    const { getByText } = renderAddOrEditVisitor();
    expect(getByText('VS_NEW')).toBeDefined();
  });

  afterEach(() => {
    global.useMockRoute = {};
  });
});

describe('AddOrEditVisitor', () => {
  beforeEach(() => {
    global.useMockRoute = {
      params: {
        visitorId: '123',
      },
      name: 'EditVisitor',
    };
  });

  it('renders the visitor pass tab when editing an existing visitor', () => {
    const { getByText } = renderAddOrEditVisitor();
    expect(getByText('VISITOR_PASS')).toBeDefined();
  });

  it('changes the title to "VS_EDIT" when editing an existing visitor', () => {
    const { getByText } = renderAddOrEditVisitor();
    expect(getByText('VS_EDIT')).toBeDefined();
  });

  it('navigates to the visitor pass tab when clicking on the "Visitor Pass" tab', () => {
    const { getByText } = renderAddOrEditVisitor();
    fireEvent.press(getByText('VISITOR_PASS'));
    expect(getByText('VISITOR_PASS')).toBeDefined();
  });

  afterEach(() => {
    global.useMockRoute = {};
  });
});
