import React, { useState } from 'react';
import Connect from '@stores';
import { useRoute } from '@react-navigation/native';
import styled from 'styled-components/native';
import BaseLayout from '@components/Layout/BaseLayout';
import i18n from '@i18n';
import Row from '@components/Layout/Row';
import { formatMoney } from '@utils/currencyFormatter';
import { Text } from '@components/Commons';
import Momo from '@utils/momo';
import PaymentMethodItem from './ItemPaymentMethod';

const Wrapper = styled.View`
  padding: 16px;
`;

const Title = styled(Text)`
  padding-horizontal: 16px;
  padding-vertical: 10px;
  font-size: 16px;
`;

const Footer = styled(Row)`
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 16px;
  justify-content: space-between;
`;

const MoMoPaymentMethod = ({
  app: {
    settingApp: { allowOnlinePaymentMomo },
  },
}) => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const route = useRoute();
  const routePrams = route.params;
  const params = routePrams.params;
  const callback = routePrams.callback;

  const onPayment = () => {
    callback(selectedMethod);
  };

  const paymentMethods = Momo.getPaymentMethods(allowOnlinePaymentMomo);

  const bottomButtons = [
    {
      title: i18n.t('COMMON_CONFIRM'),
      type: 'primary',
      onPress: onPayment,
      disabled: !selectedMethod,
    },
  ];
  return (
    <BaseLayout
      bottomButtons={bottomButtons}
      containerStyle={{ backgroundColor: 'white' }}
      title="MOMO_PAYMENT_METHODS_TITLE"
    >
      <Title preset="bold" text="PAYMENT_ADD_PAYMENT_METHOD" />
      <Wrapper>
        {paymentMethods.map((method) => (
          <PaymentMethodItem
            key={method.key}
            method={method}
            onSelect={setSelectedMethod}
            isSelected={selectedMethod === method.key}
          />
        ))}
      </Wrapper>

      <Footer>
        <Text preset="bold" text="FEE_PAYMENT_DETAIL_TOTAL_AMOUNT" />
        <Text text={formatMoney(params.totalAmount)} />
      </Footer>
    </BaseLayout>
  );
};

export default Connect(MoMoPaymentMethod);
