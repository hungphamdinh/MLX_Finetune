// Header.test.js
import React from 'react';
import { Alert } from 'react-native';
import { fireEvent } from '@testing-library/react-native';
import FormItemHeader from '../../FormItems/FormItemHeader'; // Adjust the import path according to your file structure
import { renderScreen } from '../../../../../../../__mock__/mockApp';

const alertSpy = jest.spyOn(Alert, 'alert');

const render = (budgetCodes, projectType) =>
  renderScreen(<FormItemHeader budgetCodes={budgetCodes} projectType={projectType} />)();

const budgetCodes = ['ABC123', 'DEF456'];
const projectType = 'Project A';

describe('FormItemHeader', () => {
  beforeEach(() => {
    alertSpy.mockClear();
  });

  it('displays an alert with budget codes when the view detail button is pressed and budget codes exist', () => {
    const { getByTestId } = render(budgetCodes, projectType);
    const viewDetailButton = getByTestId('viewDetailButton');
    fireEvent.press(viewDetailButton);
    expect(alertSpy).toHaveBeenCalledWith(budgetCodes.join(', '));
  });

  it('does not display the view detail button when there are no budget codes', () => {
    const { queryByTestId } = render([], projectType);
    expect(queryByTestId('viewDetailButton')).toBeNull();
  });

  it('displays the project type as a tag', () => {
    const { getByText } = render(budgetCodes, projectType);
    expect(getByText(projectType)).toBeTruthy();
  });
});
