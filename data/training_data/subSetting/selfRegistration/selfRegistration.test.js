import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import SelfRegistrationSetting from '../../../subSetting/selfRegistration';
import { renderScreen } from '../../../../../../__mocks__/mockApp';
import navigationServices from '../../../../../navigator/navigationServices';

const mockStore = {
  selfRegistration: { curUnitAuthenticationCode: '123456' },
  userProfile: { user: { emailAddress: 'test@example.com' } },
};

const mockActions = {
  selfRegistration: {
    verifyEmailCodeForMembers: jest.fn(),
  },
};

const render = () =>
  renderScreen(<SelfRegistrationSetting />)({
    store: mockStore,
    actions: mockActions,
  });

describe('Setting', () => {
  it('renders Setting correctly', () => {
    const { getByText } = render();

    expect(getByText('PROFILE_BTN_SELF_REGISTRATION')).toBeTruthy();
    expect(getByText('PROFILE_BTN_ADD_MORE_MEMBERS')).toBeTruthy();
  });

  it('navigates to UnitAuthCode screen on pressing Unit Auth Code', () => {
    const { getByText } = render();
    fireEvent.press(getByText('UNIT_AUTH_CODE'));
    expect(navigationServices.navigate).toHaveBeenCalledWith('UnitAuthCode');
  });

  it('navigates to VerifyCodeAndEmailForUnits screen on pressing Add More Unit', () => {
    const { getByText } = render();
    fireEvent.press(getByText('PROFILE_BTN_ADD_MORE_UNITS'));
    expect(navigationServices.navigate).toHaveBeenCalledWith('VerifyCodeAndEmailForUnits', {
      emailAddress: 'test@example.com',
    });
  });

  it('enable to press Add More Member', () => {
    const { getByText } = render();
    fireEvent.press(getByText('PROFILE_BTN_ADD_MORE_MEMBERS'));
  });
});
