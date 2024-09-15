import React from 'react';
import { Linking, DeviceEventEmitter } from 'react-native';
import Connect from '@stores';
import { MOMO_REQUEST_TYPE } from '@configs/constants';
import Momo from '@utils/momo';
import BasePaymentHOC from './basePaymentHOC';
import navigationServices from '../../../../navigator/navigationServices';

export default function withMomoPayment(WrappedComponent) {
  class HOCComponent extends BasePaymentHOC {
    constructor(props) {
      super(props);
      this.walletCallBackSubscriber = null;
      this.paymentCallBackSubscriber = null;
    }
    componentDidMount() {
      this.walletCallBackSubscriber = Linking.addEventListener('url', this.handleWalletCallback);
      this.paymentCallBackSubscriber = DeviceEventEmitter.addListener('paymentCallBack', this.handlePaymentCallback);
    }

    componentWillUnmount() {
      this.walletCallBackSubscriber.remove();
      this.paymentCallBackSubscriber.remove();
    }

    componentDidUpdate(prevProps) {
      const {
        fee: { orderDetail },
        route: { params },
      } = this.props;
      const { onSuccess } = params;

      if (!prevProps.fee.orderDetail && orderDetail) {
        if (orderDetail.status.code === 'SUCCESS') {
          navigationServices.popTo('DetailFee');
          onSuccess();
          return;
        }
        this.showPaymentError(orderDetail.status.description);
      }
    }

    handlePaymentCallback = () => {
      const { momoOrderRequest } = this.props.fee;
      const { requestId, orderId } = momoOrderRequest;
      if (requestId && orderId) {
        this.props.actions.fee.checkMomoResult({ requestId, orderId });
      }
    };

    handleWalletCallback = ({ url }) => {
      if (url && url.indexOf('payment/callback') > -1) {
        this.handlePaymentCallback();
      }
    };

    handlePaymentViaWallet = (listID) => {
      Momo.ensureExistedMomoApp(() => {
        this.props.actions.fee.createOrderMomo(listID, MOMO_REQUEST_TYPE.CAPTURE_WALLET);
      });
    };

    choosePaymentMethod(params, callback) {
      navigationServices.navigate('MoMoPaymentMethod', {
        params,
        callback,
      });
    }

    createOrder = (listID, totalAmount) => {
      const momoPaymentMethods = Momo.getPaymentMethods(this.props.app.settingApp?.allowOnlinePaymentMomo);
      if (momoPaymentMethods.length === 1) {
        this.handleSelectedPaymentMethod(momoPaymentMethods[0].key, listID);
        return;
      }
      this.choosePaymentMethod(
        {
          listID,
          totalAmount,
        },
        (method) => {
          this.handleSelectedPaymentMethod(method, listID);
        }
      );
    };

    handleSelectedPaymentMethod = (method, listID) => {
      if (method === MOMO_REQUEST_TYPE.CAPTURE_WALLET) {
        this.handlePaymentViaWallet(listID);
        return;
      }
      this.props.actions.fee.createOrderMomo(listID, method, this.handlePaymentCallback);
    };

    render() {
      return <WrappedComponent {...this.getWrappedParams()} />;
    }
  }
  return Connect(HOCComponent);
}
