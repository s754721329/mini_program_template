import Promise from '../libs/es6-promise.min';
import md5 from '../libs/md5';
import { Base64 } from '../libs/base64';
import timestamp from '../libs/timestamp';

// key
const PHP_SECRET_KEY = '4994e425-01df-11e6-8c30-005056800d0e';
const JAVA_SECRET_KEY = '80b811ba-2dc9-46a9-9886-6ba819d7c05b';

function parseUrl(url) {
  const encodeUrl = encodeURI(url);
  return encodeUrl.replace(/(:[0-9]{1,4})/g, '');
}

function injectTimestamp(rawData) {
  const requestTimestamp = timestamp('YYYY-MM-DD HH:mm:ss');
  const data = Object.assign(rawData, { requestTimestamp: requestTimestamp });
  return data;
}

function handleReqeustBody(apiType, data) {
  if (apiType === 'java') {
    return injectTimestamp(data);
  }
  if (apiType === 'php') {
    return data;
  }
  return data;
}

function md5Encript(apiType, { url, data }) {
  if (apiType === 'php') {
    // php接口 对url encodeURI, 去掉Port, base64, md5
    const parsedUrl = parseUrl(url);
    const base64Url = Base64.encode(parsedUrl);
    return md5(`${base64Url}${PHP_SECRET_KEY}`);
  }
  if (apiType === 'java') {
    // java接口 request data中 加入requestTimestamp, base64,  md5
    const dataWithTimestamp = injectTimestamp(data);
    const base64Data = Base64.encode(JSON.stringify(dataWithTimestamp));
    return md5(`${base64Data}${JAVA_SECRET_KEY}`);
  }
}

export const request = (method = 'GET') => (url, data = '') => {
  // 判断是否是java接口relay的
  // const apiType = url.indexOf('relay?url') > -1 ? 'java' : 'php';
  const apiType = 'php';
  const dataString = Base64.encode(
    JSON.stringify(handleReqeustBody(apiType, data))
  );

  return new Promise((resolve, reject) => {
    wx.request({
      url,
      data: dataString,
      method,
      header: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        storeid: wx.getStorageSync('sotreId') || '',
        md5: md5Encript(apiType, { url, data }),
        // appid: 'web',
        token: wx.getStorageSync('token') || '',
      },
      success: function(res) {
        resolve(res.data);
      },
      fail: function(err) {
        reject(err);
      },
    });
  });
};

const wxRequest = {
  get(url) {
    return request('GET')(url);
  },
  post(url, data) {
    return request('POST')(url, data);
  },
};

module.exports = wxRequest;
