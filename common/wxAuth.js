import promisify from '../utils/promisify';
import api from '../utils/api';
import {
  getLocalStorageSync,
  setLocalStorageSync,
  removeStorageSync,
} from '../utils/localStorage';

import { encodeUrlParam } from '../utils/encrypt';

const wxLogin = promisify(wx.login);
const wxCheckSession = promisify(wx.checkSession);

/** 获取openId
 * 1. 检查localStorage 是否已有openId
 * 2. 没有openId, 调取wx.login获取code
 * 3. 调取api: code换openId接口
 * 4. 存储openId到localStorage
 */
function getOpenId() {
  const openId = getLocalStorageSync('openId');
  if (openId) {
    console.log('已有openId : ', openId);
    return openId;
  } else {
    return wxLogin()
      .then(res => {
        api.getOpenIdByCode(res.code).then(res => {
          if (res.openid) {
            console.log('openId : ', res.openid);
            setLocalStorageSync('openId', res.openid);
            return openId;
          }
        });
      })
      .catch(err => {
        console.log(err);
        return undefined;
      });
  }
}

/** button主动触发获取用户手机号
 * 1. button 属性 open-type="getPhoneNumber" bindgetphonenumber="getPhoneNumber"
 * 2. 弹窗提示
 * 3. 拒绝处理 略
 * 4. 同意后 拿到 encrptedData, iv
 * 5. 检查wx session是否有效, 无效则重新wx.login
 * 6. decryptUserInfo 调接口，解密数据返回
 */
function getDecryptedUserInfo(data) {
  console.log('getDecryptedUserInfo');
  console.log(data);

  if (data.errMsg === 'getPhoneNumber:fail user deny') {
    return Promise.resolve(data);
  }

  function decryptUserInfo() {
    const openId = getLocalStorageSync('openId');
    const encryptedData = encodeUrlParam(data.encryptedData);
    const iv = encodeUrlParam(data.iv);
    return api.getDecryptedUserInfo({ openId, encryptedData, iv }).then(res => {
      console.log('decryptUserInfo : ', res);
      return res;
    });
  }

  return wxCheckSession()
    .then(res => {
      console.log(res);
      console.log('wx session 有效');
      if (data.errMsg === 'getPhoneNumber:ok') {
        return decryptUserInfo();
      } else {
        console.log('wx session 无效');
        removeStorageSync('openId');
        return getOpenId().then(() => {
          return decryptUserInfo();
        });
      }
    })
    .catch(err => {
      console.log('wx session 无效');
      removeStorageSync('openId');
      return getOpenId().then(() => {
        return decryptUserInfo();
      });
      console.log(err);
    });
}

export { getOpenId, getDecryptedUserInfo };
