import {
  getLocalStorageSync,
  setLocalStorageSync,
  removeStorageSync,
} from './localStorage';
import { encryption } from './encrypt';
import Promise from '../libs/es6-promise.min';
import md5 from '../libs/md5';
import { Base64 } from '../libs/base64';
import timestamp from '../libs/timestamp';

function checkHttpStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

function parseJSON(response) {
  return response.json();
}

export const sendRequest = apiType => method => (
  url,
  data = '',
  storeIdScheme = 'front'
) => {
  const apiEncryption = encryption({ apiType, url, data });
  console.log(data);
  const md5 = apiEncryption('md5');
  const bodyString = apiEncryption('bodyString');
  // const userid = getLocalStorageSync('userid') || '';
  // const appid = 'web'
  console.log(bodyString);

  return new Promise((resolve, reject) => {
    const token = getLocalStorageSync('token') || '';
    const storeid = getLocalStorageSync('storeId') || '';
    console.log('storeid in localStorage : ', storeid);
    console.log('token in localStorage : ', token);
    // wx.showLoading();
    wx.request({
      url,
      data: method === 'GET' ? null : bodyString,
      method,
      header: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        md5,
        appid: 'wxMiniCoop',
        // storeid: wx.getStorageSync('storeId') || '',
        token,
        storeid: switchStoreId(storeIdScheme),
      },
      success: function(res) {
        wx.hideLoading();
        // res.data.code == '-2' ? handleError() : resolve(res.data);
        resolve(res.data)
      },
      fail: function(err) {
        wx.hideLoading();
        reject(err);
      },
      complete: function() {
        wx.hideLoading();
      },
    });
  });
};

const request = {
  apiJAVA: {
    get(url, storeIdScheme) {
      return sendRequest('java')('GET')(url, undefined, storeIdScheme);
    },
    post(url, data, storeIdScheme) {
      return sendRequest('java')('POST')(url, data, storeIdScheme);
    },
  },
  apiPHP: {
    get(url, storeIdScheme) {
      return sendRequest('php')('GET')(url, undefined, storeIdScheme);
    },
    post(url, data, storeIdScheme) {
      return sendRequest('php')('POST')(url, data, storeIdScheme);
    },
    put(url, data, storeIdScheme) {
      return sendRequest('php')('PUT')(url, data, storeIdScheme);
    },
    delete(url, storeIdScheme) {
      return sendRequest('php')('DELETE')(url, undefined, storeIdScheme);
    },
  },
};
function handleError() {
  removeStorageSync('token');
  wx.redirectTo({
    url: '/pages/login/wxLogin/wxLogin',
  });
}

function switchStoreId(scheme) {
  const storeId = getLocalStorageSync('storeId') || '';
  const storeIdByScheme = getLocalStorageSync('storeIdByScheme') || [];

  if (scheme === 'front' || undefined) {
    return storeId;
  } else {
    const result = composeStoreIdByScheme(storeIdByScheme)[scheme]();
    console.log('composeStoreIdByScheme:', scheme, result);
    return result;
  }
}

function composeStoreIdByScheme(storeIdArray, scheme) {
  console.log('storeIdByShemestoreIdByShemestoreIdBySheme', storeIdArray);
  const obj = storeIdArray.reduce(
    (obj, curr) => ({
      ...obj,
      [curr.scheme]: curr.id,
    }),
    {}
  );
  return {
    'front,normal': function() {
      if (!obj.front) {
        return '';
      } else {
        return `${obj.front},${obj.normal}`;
      }
    },
    front: function() {
      return storeId || '';
    },
  };
}

export default request;
