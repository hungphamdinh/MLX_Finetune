import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ItemSurvey from '../itemSurvey/index';
const mockStore = {
  getState: jest.fn(() => ({
    // Define the state object you want to use for testing
    someValue: 'test value',
    anotherValue: 123,
  })),
  dispatch: jest.fn(),
};

describe('ItemSurvey', () => {
  const item = {
    surveyId: 1,
    name: 'Survey 1',
    isSubmitted: false,
    startDate: '2022-01-01T00:00:00.000Z',
    endDate: '2022-01-31T00:00:00.000Z',
    creationTime: '2022-01-15T00:00:00.000Z',
    creatorUserName: 'John Doe',
  };

  it('renders survey information correctly', () => {
    const { getByText } = render(<ItemSurvey item={item} />);
    expect(getByText(`#${item.surveyId}`)).toBeDefined();
    expect(getByText('COMMON_START_DATE')).toBeDefined();
    expect(getByText('COMMON_END_DATE')).toBeDefined();
    expect(getByText('SURVEY_SUBMITTED_DATE')).toBeDefined();
    expect(getByText(item.creatorUserName)).toBeDefined();
    expect(getByText(item.name)).toBeDefined();
  });

  it('calls action when pressed', () => {
    const mockAction = jest.fn();
    const { getByTestId } = render(<ItemSurvey item={item} action={mockAction} />);
    fireEvent.press(getByTestId('item-survey'));
    expect(mockAction).toHaveBeenCalled();
  });
});
