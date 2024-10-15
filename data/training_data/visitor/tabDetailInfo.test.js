import React from 'react';
import { View } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import TabDetailInfo from '../addOrEditVisitor/tabDetailInfo/index';
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

const store = mockStore({
  visitor: { detailVisitor, listType: [] },
  file: { files: [] },
});


describe('TabDetailInfo', () => {
  beforeEach(() => {
    global.useMockRoute = {
      params: {
        id: '123',
      },
      name: 'EditVisitor',
    };
  });

  const renderTabDetailInfo = () =>
    render(
      <Provider store={store}>
        <View>
          <TabDetailInfo {...commonProps} />
        </View>
      </Provider>
    );

  it('should render TabDetailInfo component', () => {
    const { getByTestId } = renderTabDetailInfo();
    const addOrEditVisitor = getByTestId('add-or-edit-visitor');
    expect(addOrEditVisitor).toBeDefined();
  });

  it('should render visistors information', () => {
    const { getByTestId } = renderTabDetailInfo();
    const visitorInformation = getByTestId('visitor-informations');
    expect(visitorInformation).toBeDefined();
  });

  it('should do not show submit button', () => {
    const { queryByTestId } = renderTabDetailInfo();
    const submitButton = queryByTestId('submit-button');
    expect(submitButton).toBeNull();
  });

  afterEach(() => {
    global.useMockRoute = {};
  });
});

const commonProps = {
  navigation: { state: { routeName: 'AddVisitor' } },
  actions: {},
  visitor: { detailVisitor, listType: [] },
  file: { files: [] },
  units: { unitActive: {} },
  userProfile: { tenant: {} },
  app: { settingApp: { dateTimeFormat: '' } },
};

describe('TabDetailInfo', () => {
  beforeEach(() => {
    global.useMockRoute = {
      params: {
        id: '123',
      },
      name: 'AddVisitor',
    };
  });
  const renderAddVisitor = () =>
    render(
      <Provider store={store}>
        <View>
          <TabDetailInfo {...commonProps} />
        </View>
      </Provider>
    );

  test('should add a new visitor when the add visitor button is clicked', () => {
    const { getByTestId } = renderAddVisitor();
    const addVisitorButton = getByTestId('add-visitor-button');
    fireEvent.press(addVisitorButton);
    const visitorInformations = getByTestId('visitor-informations');
    expect(visitorInformations.children.length).toBe(2);
  });

  test('should remove a visitor when the remove visitor button is clicked', async () => {
    const { getByTestId } = renderAddVisitor();
    const addVisitorButton = getByTestId('add-visitor-button');
    fireEvent.press(addVisitorButton);
    const removeVisitorButton = getByTestId('remove-visitor-button');
    fireEvent.press(removeVisitorButton);
    const visitorInformations = getByTestId('visitor-informations');
    expect(visitorInformations.children.length).toBe(1);
  });

  test('should update the visitor name when the name input is changed', () => {
    const { getByTestId } = renderAddVisitor();
    const visitorInformations = getByTestId('visitor-informations');
    const firstVisitor = visitorInformations.children[0];
    const nameInput = getByTestId('visitor-name', { container: firstVisitor });
    const phoneInput = getByTestId('visitor-phone', { container: firstVisitor });
    const idInput = getByTestId('visitor-id', { container: firstVisitor });
    fireEvent.changeText(nameInput, 'John Doe');
    fireEvent.changeText(phoneInput, '123-456-7890');
    fireEvent.changeText(idInput, '1234567890');
    expect(nameInput.props.value).toBe('John Doe');
    expect(phoneInput.props.value).toBe('123-456-7890');
    expect(idInput.props.value).toBe('1234567890');
  });

  it('should show submit button', () => {
    const { getByTestId } = renderAddVisitor();
    const submitButton = getByTestId('submit-button');
    expect(submitButton).toBeDefined();
  });

  afterEach(() => {
    global.useMockRoute = {};
  });
});
