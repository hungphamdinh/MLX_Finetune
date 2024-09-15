import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { renderScreen } from '../../../../__mocks__/mockApp';
import TermAndConditions from '..';

const mockMultipleTerm = [
  {
    label: 'Term 1',
    content: '<p>Content 1</p>',
    checkboxLabel: 'Agree to Term 1',
  },
  {
    label: 'Term 2',
    content: '<p>Content 2</p>',
    checkboxLabel: 'Agree to Term 2',
  },
];

const mockOneTerm = [
  {
    label: 'Term 1',
    content: '<p>Content 1</p>',
    checkboxLabel: 'Agree to Term 1',
  },
];

const onAgree = jest.fn();

function setParams(params) {
  beforeEach(() => {
    global.useMockRoute = {
      params,
      name: 'TermAndConditions',
    };
  });
}

function clearParams() {
  afterEach(() => {
    global.useMockRoute = {};
  });
}

const renderTerm = () => renderScreen(<TermAndConditions />)({});

describe('TermAndConditions', () => {
  setParams({
    termAndConditions: mockMultipleTerm,
  });

  it('renders the component correctly', () => {
    const { getByTestId, getByText } = renderTerm();
    expect(getByTestId('termConditionView')).toBeTruthy();
    expect(getByText('TERM_CONDITIONS_SCROLL_TO_AGREE')).toBeTruthy();
    expect(getByText('TERM_CONDITIONS_BTN_NEXT')).toBeTruthy();
  });

  clearParams();
});

describe('TermAndConditions', () => {
  setParams({
    termAndConditions: mockOneTerm,
  });
  it('renders last T&C', () => {
    const { getByTestId, getByText } = renderTerm();
    expect(getByTestId('termConditionView')).toBeTruthy();
    expect(getByText('TERM_CONDITIONS_SCROLL_TO_AGREE')).toBeTruthy();
    expect(getByTestId('checkbox')).toBeTruthy();
    expect(getByText('TERM_CONDITION_BUTTON_AGREE')).toBeTruthy();
  });

  setParams({
    termAndConditions: mockOneTerm,
    onAgree,
  });
  it('renders last T&C & turn on CheckBox Agree', () => {
    const { getByTestId, getByText } = renderTerm();
    expect(getByTestId('termConditionView')).toBeTruthy();
    expect(getByText('TERM_CONDITIONS_SCROLL_TO_AGREE')).toBeTruthy();
    const buttonAgree = getByText('TERM_CONDITION_BUTTON_AGREE');

    const checkBox = getByTestId('checkbox');

    expect(checkBox).toBeTruthy();
    fireEvent.press(checkBox);
    fireEvent.press(buttonAgree);
  });

  clearParams();
});
