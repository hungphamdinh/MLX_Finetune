import React from 'react';
import ForgotPinCode from '../ForgotPinCode';
import { renderScreen } from '../../../../__mock__/mockApp';

describe('ForgotPinCode', () => {
  it('renders the ConfirmView component', () => {
    const { getByText } = renderScreen(<ForgotPinCode />)();
    expect(getByText('COMMON_CONTINUE')).toBeDefined();
  });
});
