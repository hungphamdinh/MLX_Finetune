import React from 'react';
import { Colors } from '@themes';
import { fireEvent } from '@testing-library/react-native';
import NextTermButton from '../nextButton';
import { renderScreen } from '../../../../__mocks__/mockApp';

const onPressNextTerm = jest.fn();

const renderButton = (disabled) =>
  renderScreen(<NextTermButton disabled={disabled} onPressNextTerm={onPressNextTerm} />)();

describe('NextTermButton', () => {
  it('renders the button correctly when enabled', () => {
    const { getByTestId } = renderButton();

    const buttonText = getByTestId('chevron-forward-outline');

    expect(buttonText).toBeTruthy();
    expect(buttonText).toHaveStyle({ color: Colors.azure });
  });

  it('renders the button correctly when disabled', () => {
    const { getByTestId } = renderButton(true);
    const buttonText = getByTestId('chevron-forward-outline');

    expect(buttonText).toBeTruthy();
    expect(buttonText).toHaveStyle({ color: Colors.textSemiGray });
  });

  it('calls onPressNextTerm when the button is pressed', () => {
    const { getByTestId } = renderButton();
    const buttonText = getByTestId('chevron-forward-outline');
    fireEvent.press(buttonText);

    expect(onPressNextTerm).toHaveBeenCalledTimes(1);
  });
});
