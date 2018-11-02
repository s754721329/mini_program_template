import encodeMD5 from '../libs/md5';
import { Base64 } from '../libs/base64';
import timestamp from '../libs/timestamp';

const PHP_SECRET_KEY = '4994e425-01df-11e6-8c30-005056800d0e';
const JAVA_SECRET_KEY = '66b811ba-3dc9-46a9-9886-5ba819d7c05b'; // 对应appid='wxMiniCoop'

const apiEncryptMethod = {
  php(url, data) {
    const parseUrl = encodeURI(url).replace(/(:[0-9]{1,4})/g, '');
    const base64Url = Base64.encode(parseUrl);
    const md5 = encodeMD5(`${base64Url}${PHP_SECRET_KEY}`);
    return {
      md5,
      bodyString: Base64.encode(JSON.stringify(data)),
    };
  },

  java(url, data) {
    function injectTimestamp(rawData) {
      const requestTimestamp = timestamp('YYYY-MM-DD HH:mm:ss');
      return Object.assign(rawData, { requestTimestamp });
    }
    const bodyString = Base64.encode(JSON.stringify(injectTimestamp(data)));
    const md5 = encodeMD5(`${bodyString}${JAVA_SECRET_KEY}`);
    return {
      md5,
      bodyString,
    };
  },
};

export function encryption({ apiType, url, data }) {
  if (!apiEncryptMethod[apiType]) {
    throw new Error(`apiType: ${apiType} invalid`);
  }
  return function(type) {
    return apiEncryptMethod[apiType](url, data)[type];
  };
}

export function encodeUrlParam(value) {
  if (!value) {
    return undefined;
  }
  let result = Base64.encode(value);
  result = result.replace(/\//g, '-');
  // console.log(value, result);
  return result;
}
