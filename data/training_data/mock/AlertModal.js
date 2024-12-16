// AlertModal.jsx
import React from 'react';
import styled from 'styled-components/native';
import { Modal, View } from 'react-native';
import { Text, Button } from '@components/Commons';
import { Colors } from '@themes';

const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const AlertBox = styled.View`
  width: 80%;
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  align-items: center;
`;

const ButtonRow = styled.View`
  flex-direction: row;
  margin-top: 20px;
`;

const AlertModal = ({ visible, title, message, onConfirm, onCancel, testID }) => (
  <Modal transparent={true} visible={visible} animationType="fade" testID={testID}>
    <ModalContainer>
      <AlertBox>
        <Text text={title} preset="bold" style={{ fontSize: 18 }} />
        <Text text={message} style={{ textAlign: 'center', marginTop: 10 }} />
        <ButtonRow>
          <Button title="Cancel" onPress={onCancel} style={{ marginRight: 10 }} testID={`${testID}-cancel`} />
          <Button title="Confirm" onPress={onConfirm} primary testID={`${testID}-confirm`} />
        </ButtonRow>
      </AlertBox>
    </ModalContainer>
  </Modal>
);

export default AlertModal;