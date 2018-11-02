import api from '../utils/api';
import {
  getLocalStorageSync,
  setLocalStorageSync,
  removeStorageSync,
} from '../utils/localStorage';
// 获取当前时间   requestTimestamp
export function getNowFormatDate() {
  var date = new Date();
  var seperator1 = '-';
  var seperator2 = ':';
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  var hours = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  if (month >= 1 && month <= 9) {
    month = '0' + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate;
  }
  if (hours >= 0 && hours <= 9) {
    hours = '0' + hours;
  }
  if (minute >= 0 && minute <= 9) {
    minute = '0' + minute;
  }
  if (second >= 0 && second <= 9) {
    second = '0' + second;
  }
  var currentdate =
    date.getFullYear() +
    seperator1 +
    month +
    seperator1 +
    strDate +
    ' ' +
    hours +
    seperator2 +
    minute +
    seperator2 +
    second;
  return currentdate;
}
// 发送地址信息 并 存storeId
export function sendAddress() {
  const { longitude, latitude, cityCode } = getLocalStorageSync('dAddress');

  return new Promise((resolve, reject) => {
    api
      .sendAddress(longitude, latitude, cityCode)

      .then(res => {
        if (res.code == 0) {
          // 请求首页信息-需要地址
          let storeId = '';
          res.data.map((item, i) => {
            if (item.scheme == 'front') {
              storeId = item.id;
            }
          });
          setLocalStorageSync('storeId', storeId);
          setLocalStorageSync('storeIdByScheme', res.data);
          resolve(res);
        } else {
          console.log(res);
          resolve(res);
        }
      })
      .catch(err => {
        console.log(err);
        reject(undefined);
      });
  });
}
// 获取小程序定位
export function wxGetLocation(type) {
  return new Promise((resolve, reject) => {
    // 获取小程序gps定位授权状态
    wx.getSetting({
      success(res) {
        // 已授权
        if (res.authSetting['scope.userLocation']) {
          console.log('已授权');
          wx.getLocation({
            type: 'wgs84',
            success(ress) {
              resolve(ress);
            },
            fail(err) {
              reject(err);
            },
          });
        } else {
          console.log('未授权');
          // 未授权
          if (!type) {
            wx.openSetting({
              success(ress) {
                resolve(ress);
              },
              fail(err) {
                reject(err);
              },
            });
          } else {
            resolve(res);
          }
        }
      },
      fail(err) {
        reject(err);
      },
    });
  });
}
