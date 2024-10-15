import React from 'react';
import I18n from '@I18n';
import styled from 'styled-components/native';
import Row from '../../Grid/Row';
import { Button, Text } from '../../../Elements';
import { withModal } from '../../../HOC';
import { BIOMETRIC_STATUS } from '../../../Config/Constants';
import useUser from '../../../Context/User/Hooks/UseUser';

const ButtonWrapper = styled(Row)`
  margin-top: 20px;
  justify-content: space-around;
`;

const Wrapper = styled.View`
  padding-horizontal: 10px;
`;
const SwitchOffModal = ({ onClosePress, onSuccess }) => {
  const { updateUserBiometric } = useUser();

  const switchOff = () => {
    updateUserBiometric(BIOMETRIC_STATUS.OFF);
    onSuccess();
  };

  return (
    <Wrapper>
      <Text text="SWITCH_OFF_BIOMETRIC_CONTENT" />
      <ButtonWrapper center>
        <Button block info rounded title={I18n.t('COMMON_CANCEL')} onPress={onClosePress} />
        <Button block primary rounded title={I18n.t('SWITCH_OFF')} onPress={switchOff} />
      </ButtonWrapper>
    </Wrapper>
  );
};

export default withModal(SwitchOffModal, 'COMMON_IMPORTANT_INFORMATION');
