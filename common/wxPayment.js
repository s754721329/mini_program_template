import promisify from '../utils/promisify';
import api from '../utils/api';
import { getLocalStorageSync } from '../utils/localStorage';

const wxRequestPayment = promisify(wx.requestPayment);

function getChargeData(paymentType, options) {
  // 从localStorage取openId 加到换chargeData参数中
  const openId = getLocalStorageSync('openId');
  const params = {
    openId,
    ...options,
  };
  return api[paymentType](params).then(res => {
    if (res.code === 0) {
      const chargeData = JSON.parse(res.data);
      console.log('get chargeData from api', chargeData);
      return {
        code: 0,
        chargeData,
      };
    } else {
      return Promise.resolve(res);
    }
  });
}

function requestPayment(paymentType, options) {
  return getChargeData(paymentType, options).then(res => {
    console.log(res);
    if (res.code === 0) {
      return wxRequestPayment({
        appId: res.chargeData.appId,
        timeStamp: res.chargeData.timeStamp,
        nonceStr: res.chargeData.nonceStr,
        package: res.chargeData.package,
        signType: res.chargeData.signType,
        paySign: res.chargeData.paySign,
      }).then(res => {
        if (res.errMsg === 'requestPayment:ok') {
          console.log('支付成功');
          return { code: 0 };
        } else {
          return { code: -1, message: res.errMsg };
        }
      });
    } else {
      return Promise.resolve(res);
    }
  });
}

/** 支付
 *  paymentType 对应api中对应的支付接口
 *  1. payForAssociator：开通社员， options传level, trial
 *      requestPayment('payForAssociator', {
          level: 2,
        }
 *  2. payForOrder: 订单支付, options传groupIds, 
 *      requestPayment('payForOrder', {
          groupIds: ['xxxxxx', 'xxxxx'],
        }
 */

export { requestPayment };
