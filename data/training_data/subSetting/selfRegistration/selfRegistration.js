import React, { Fragment } from 'react';
import Connect from '@stores';
import { DeviceEventEmitter } from 'react-native';
import BaseLayout from '@components/Layout/BaseLayout';
import { icons } from '@resources/icons';
import ItemSetting from '@components/settings/settingItem';
import AwareScrollView from '@components/Layout/AwareScrollView';
import navigationServices from '../../../../navigator/navigationServices';
import { REGISTRATION_TYPE } from '../../../../configs/constants';

const data = [
  {
    icon: icons.addResidents,
    title: 'PROFILE_BTN_ADD_MORE_MEMBERS',
    type: REGISTRATION_TYPE.MORE_MEMBER,
  },
  {
    icon: icons.home,
    title: 'PROFILE_BTN_ADD_MORE_UNITS',
    type: REGISTRATION_TYPE.MORE_UNIT,
  },
  {
    icon: icons.uac,
    title: 'UNIT_AUTH_CODE',
    screen: 'UnitAuthCode',
  },
];

const SelfRegistrationSettings = ({
  actions,
  selfRegistration: { curUnitAuthenticationCode },
  userProfile: { user },
}) => {
  const onItemPress = (item) => {
    actions.selfRegistration.setRegistrationType(item?.type);
    if (item.title === 'PROFILE_BTN_ADD_MORE_MEMBERS') {
      DeviceEventEmitter.addListener('CheckUnitAuthCodeSuccess', () => {
        navigationServices.navigate('ListRegisterMember');
      });
      actions.selfRegistration.verifyEmailCodeForMembers({
        code: curUnitAuthenticationCode,
        email: user.emailAddress,
      });
      return;
    }

    if (item.title === 'PROFILE_BTN_ADD_MORE_UNITS') {
      navigationServices.navigate('VerifyCodeAndEmailForUnits', {
        emailAddress: user.emailAddress,
      });
      return;
    }

    navigationServices.navigate(item.screen);
  };

  const renderSettingItem = (item) => {
    if (item.screen === 'SetupPinCode' && hasPinCode) {
      item.screen = 'ChangePinCode';
      item.title = 'BTN_CHANGE_PIN';
    }

    if (item.screen === 'ForgotPinCode' && !hasPinCode) {
      return null;
    }

    return <ItemSetting key={item.title} title={item.title} icon={item.icon} onPress={() => onItemPress(item)} />;
  };

  return (
    <BaseLayout showBell={false} title="PROFILE_BTN_SELF_REGISTRATION">
      <AwareScrollView>
        {data.map((item) => (
          <Fragment key={item.title}>{renderSettingItem(item)}</Fragment>
        ))}
      </AwareScrollView>
    </BaseLayout>
  );
};

export default Connect(SelfRegistrationSettings);
