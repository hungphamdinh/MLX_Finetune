import React from 'react';
import { Text } from '@components/Commons';
import styled from 'styled-components/native';

const MethodRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
`;

const Icon = styled.Image`
  width: 30px;
  height: 30px;
  margin-right: 8px;
`;

const MethodText = styled(Text)`
  font-size: 16px;
`;

const RadioOuterCircle = styled.View`
  width: 18px;
  height: 18px;
  border-radius: 9px;
  border-width: 1px;
  border-color: #000;
  margin-right: 10px;
`;

const RadioInnerCircle = styled.View`
  margin: 3px;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #000;
`;

const RadioCircle = ({ isSelected }) => <RadioOuterCircle >{isSelected && <RadioInnerCircle testID="radio-inner" />}</RadioOuterCircle>;

const PaymentMethodItem = ({ method, onSelect, isSelected }) => (
  <MethodRow onPress={() => onSelect(method.key)}>
    <RadioCircle isSelected={isSelected} />
    <Icon source={method.icon} />
    <MethodText text={method.text} />
  </MethodRow>
);

export default PaymentMethodItem;
