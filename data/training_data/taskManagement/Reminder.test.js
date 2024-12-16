import React from 'react';
import Reminders from '../Reminder';
import { renderScreen } from '@Mock/mockApp';
import useApp from '@Context/App/Hooks/UseApp';

jest.mock('../Reminder/ItemUserEmail', () => {
    const React = require('react');
    const { View, Text, TouchableOpacity } = require('react-native');
  
    return ({ item, onPressRemove, testID }) => (
      <View testID={testID}>
        <Text testID={`${testID}-text`}>{item}</Text>
        <TouchableOpacity onClick={onPressRemove}>
            <Text>Remove</Text>
        </TouchableOpacity>
      </View>
    );
});
jest.mock('@Context/App/Hooks/UseApp');
jest.mock('@Components/Forms', () => {
  const {
    ForNumberInputMock,
    FormSwitchMock,
    FormInputMock,
    FormLazyDropdownMock,
  } = require('@Mock/components/Forms');

  return {
    FormNumberInput: ({ name, label, testID, ...rest }) => (
      <ForNumberInputMock name={name} label={label} testID={testID} {...rest} />
    ),
    FormSwitch: ({ name, label, testID, value, onValueChange, ...rest }) => (
      <FormSwitchMock name={name} label={label} testID={testID} value={value} onValueChange={onValueChange} {...rest} />
    ),
    FormInput: ({ name, label, testID, rightIcon, ...rest }) => (
      <FormInputMock name={name} label={label} testID={testID} rightIcon={rightIcon} {...rest} />
    ),
    FormLazyDropdown: ({ name, label, testID, multiple, options, getList, titleKey, fieldName, ...rest }) => (
      <FormLazyDropdownMock
        getList={getList}
        options={options}
        name={name}
        label={label}
        testID={testID}
        multiple={multiple}
        titleKey={titleKey}
        fieldName={fieldName}
        {...rest}
      />
    ),
  };
});

jest.mock('@Utils/common', () => ({
  validateEmail: jest.fn(),
}));

jest.mock('@Config/LocaleConfig', () => ({
  decimalSeparator: '.',
  groupSeparator: ',',
}));

jest.mock('@Themes', () => ({
  Colors: {
    azure: '#007aff',
    text: '#000000',
    disabled: '#d3d3d3',
  },
}));

jest.mock('@Utils', () => ({
  modal: {
    showError: jest.fn(),
  },
}));

jest.mock('@Elements', () => ({
  IconButton: ({ onPress, name, color, testID }) => (
    <button onClick={onPress} testID={testID}>
      {name}
    </button>
  ),
  Tag: ({ text, onPressRemove, testID }) => (
    <div testID={testID}>
      {text}
      <button onClick={onPressRemove}>Remove</button>
    </div>
  ),
}));

const mockGetEmployees = jest.fn();
const mockValidateEmail = require('@Utils/common').validateEmail;
const mockShowError = require('@Utils').modal.showError;

const employeesMock = {
  data: [
    { id: 1, displayName: 'User One' },
    { id: 2, displayName: 'User Two' },
  ],
};

const initialValuesMock = {
  isActive: true,
  reminderInMinutes: [1440],
  reminderInMinutesAfter: [1440],
  emails: ['test@example.com'],
  users: [{ id: 1, displayName: 'User One' }],
  userEmail: '',
};

beforeEach(() => {
  useApp.mockReturnValue({
    app: {
      employees: employeesMock,
    },
    getEmployees: mockGetEmployees,
  });

  mockGetEmployees.mockClear();
  mockValidateEmail.mockClear();
  mockShowError.mockClear();
});

const renderComponent = (props = {}) => renderScreen(<Reminders {...props} />)();

describe('Reminders Component', () => {
  it('renders the component correctly with initial values', () => {
    const { getByTestId } = renderComponent({
      initialValues: initialValuesMock,
    });

    const switchComponent = getByTestId('switch-isActive');
    expect(switchComponent.props.value).toBe(true);

    const reminderBeforeTag = getByTestId('reminder-in-minutes-0');
    expect(reminderBeforeTag.props.children[0]).toBe(1);

    const reminderAfterTag = getByTestId('reminder-in-minutes-after-0');
    expect(reminderAfterTag.props.children[0]).toBe(1);

    const emailTag = getByTestId('item-user-email-0-text');
    expect(emailTag.props.children).toBe('test@example.com');
  });
});