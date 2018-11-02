export function getLocalStorage(key) {
  return wx.getStorage({
    key: key,
    success: function(res) {
      return res.data;
    },
    fail: function(err) {
      return err;
    },
  });
}

export function setLocalStorage(key, value) {
  wx.setStorage({
    key: key,
    data: value,
  });
}

export function removeStorage(key) {
  wx.removeStorage({
    key: key,
    success: function(res) {
      return res.data;
    },
    fail: function(err) {
      return err;
    },
  });
}

export function clearStorage() {
  try {
    wx.clearStorage();
  } catch (e) {
    return e;
  }
}

export function getLocalStorageSync(key) {
  try {
    return wx.getStorageSync(key);
  } catch (e) {
    return e;
  }
}

export function setLocalStorageSync(key, value) {
  try {
    return wx.setStorageSync(key, value);
  } catch (e) {
    return e;
  }
}

export function removeStorageSync(key) {
  try {
    return wx.removeStorageSync(key);
  } catch (e) {
    return e;
  }
}

export function clearStorageSync() {
  try {
    return wx.clearStorageSync();
  } catch (e) {
    return e;
  }
}
