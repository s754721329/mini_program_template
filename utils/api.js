// import wxRequest from './request.js';
import config from './config';
import request from './r';

const { commonUrl, amapKey } = config;

const api = {
  // 获取短验
  getSMSCode(phone) {
    return request.apiJAVA.post(
      `https://gasq-web-thirdparty.${commonUrl}/gasq-web-thirdparty/sms/sendSms`,
      {
        phone,
      }
    );
  },
  // 登录函数
  smsLogin(phone, verificode) {
    return request.apiJAVA.post(
      `https://gasq-web-customer.${commonUrl}/gasq-web-customer/customer/smslogin`,
      {
        deviceos: 'wechat',
        phone,
        verificode,
      }
    );
  },
  // 获取个人信息接口
  getCustomerInfo() {
    return request.apiJAVA.post(
      `https://gasq-web-customer.${commonUrl}/gasq-web-customer/customer/info`,
      {}
    );
  },
  // 向后台发送地址信息
  sendAddress(longitude, latitude, cityCode) {
    return request.apiJAVA.post(
      `https://gasq-web-support.${commonUrl}/gasq-web-support/address/store`,
      {
        longitude,
        latitude,
        cityCode,
      }
    );
  },
  // 获取城市信息
  getCityList() {
    return request.apiJAVA.post(
      `https://gasq-web-support.${commonUrl}/gasq-web-support/address/city`,
      {}
    );
  },
  getmyOrdercoupons(group_id) {
    return request.apiJAVA.post(
      `https://gasq-web-rule.${commonUrl}/gasq-web-rule/cardCoupon/listForShoppingCart`,
      { groupID: group_id }
    );
  },
  // 获取首页展示数据
  getExhibitionData(id) {
    return request.apiPHP.get(
      `https://wxapi.${commonUrl}/wechat/exhibition/${id}/wxmini`
    );
  },
  // 获取商品列表
  getProductsList(content, page, nums) {
    return request.apiPHP.get(
      `https://wxapi.${commonUrl}/wechat/tag/${content}/products/${page}/${nums}`
    );
  },
  // 获取商品详情
  getProductDetail(id) {
    return request.apiPHP.get(
      `https://wxapi.${commonUrl}/wechat/product/${id}`
    );
  },
  // 获取评价	全部，好评，中评，差评	all,good,normal,bad
  getEvaluate(id, type, page, nums) {
    return request.apiPHP.get(
      `https://wxapi.${commonUrl}/wechat/product/${id}/comments/${page}/${nums}/${type}`
    );
  },
  // 搜索商品接口
  searchProduct(obj) {
    console.log(obj);
    return request.apiJAVA.post(
      `https://gsearch.${commonUrl}/gsearch/product/search`,
      obj
    );
  },
  // 热门搜索
  searchTopWords(cityCode) {
    return request.apiJAVA.post(
      `https://gasq-web-support.${commonUrl}/gasq-web-support/config/searchTopWords`,
      {
        cityCode,
      }
    );
  },
  // 根据经纬度获取地址
  getSearchSearchArround(gps) {
    const { longitude, latitude } = gps;
    const amapKey = '713e307d66e2cfe739f618016e6bbecb';
    return new Promise(function(resolve, reject) {
      wx.request({
        url:
          'https://restapi.amap.com/v3/place/around?key=' +
          amapKey +
          '&location=' +
          longitude +
          ',' +
          latitude +
          '&output=json&radius=10000&types=%E5%B0%8F%E5%8C%BA&extensions=all&types=汽车服务|汽车销售|汽车维修|摩托车服务|餐饮服务|购物服务|生活服务|体育休闲服务|医疗保健服务|住宿服务|风景名胜|商务住宅|政府机构及社会团体|科教文化服务|交通设施服务|金融保险服务|公司企业|道路附属设施|地名地址信息|公共设施',
        success(res) {
          resolve(res);
        },
      });
    });
  },
  getSearchSearchTextData(keyword, city) {
    return new Promise(function(resolve, reject) {
      wx.request({
        url:
          'https://restapi.amap.com/v3/place/text?key=713e307d66e2cfe739f618016e6bbecb&keywords=' +
          keyword +
          '&city=' +
          city +
          '&children=1&offset=20&page=1&extensions=all&types=汽车服务|汽车销售|汽车维修|摩托车服务|餐饮服务|购物服务|生活服务|体育休闲服务|医疗保健服务|住宿服务|风景名胜|商务住宅|政府机构及社会团体|科教文化服务|交通设施服务|金融保险服务|公司企业|道路附属设施|地名地址信息|公共设施',
        success(res) {
          resolve(res);
        },
      });
    });
  },
  // 添加用户购物车
  addCart(pid) {
    return request.apiPHP.post(`https://wxapi.${commonUrl}/wechat/cartpro`, {
      pid,
    });
  },
  //获取用户购物车
  getCart() {
    return request.apiPHP.get(`https://wxapi.${commonUrl}/wechat/cartprods`);
  },
  //修改购物车
  updateCart(pid, uid, sele, num) {
    return request.apiPHP.put(`https://wxapi.${commonUrl}/wechat/cartpro`, {
      pid,
      uid,
      sele,
      num,
    });
  },
  //删除购物车
  deleteCart(shopid, proid) {
    return request.apiPHP.delete(
      `https://wxapi.${commonUrl}/wechat/cartpro/${shopid}/${proid}`
    );
  },
  //勾选购物车商品
  updateItemSelect(uid, pid, sele) {
    return request.apiPHP.put(`https://wxapi.${commonUrl}/wechat/cartpro`, {
      uid,
      pid,
      sele,
    });
  },
  //全选购物车商品
  updateShopSelect(sele) {
    return request.apiPHP.put(
      `https://wxapi.${commonUrl}/wechat/cartpro/sele`,
      {
        sele,
      }
    );
  },
  //删除失效商品
  deleteLostOrder(ids) {
    return request.apiPHP.post(
      `https://wxapi.${commonUrl}/wechat/cartpro/invalid`,
      {
        ids,
      }
    );
  },
  //获取我的地址列表
  getPersonalAddress() {
    return request.apiJAVA.post(
      `https://gasq-web-customer.${commonUrl}/gasq-web-customer/customerAddress/list`
    );
  },
  //删除个人收货地址
  deletePersonalAddress(obj) {
    return request.apiJAVA.post(
      `https://gasq-web-customer.${commonUrl}/gasq-web-customer/customerAddress/delete`,
      obj
    );
  },
  //修改（新建，编辑）收货地址
  savaPersonalAddress(obj) {
    return request.apiJAVA.post(
      `https://gasq-web-customer.${commonUrl}/gasq-web-customer/customerAddress/save`,
      obj
    );
  },
  //购物车结算生成订单id
  getCartGroup() {
    return request.apiPHP.get(`https://wxapi.${commonUrl}/wechat/cart/group`);
  },
  /* 小程序授权相关 */
  // code 换 openId
  getOpenIdByCode(code) {
    const url = `https://wxapi.${commonUrl}/weapp/wxMiniCooperative/code2openid/${code}`;
    return request.apiPHP.get(url);
  },
  getDecryptedUserInfo({ openId, encryptedData, iv }) {
    const url = `https://wxapi.${commonUrl}/weapp/decryptData/${openId}/${encryptedData}/${iv}`;
    return request.apiPHP.get(url);
  },
  loginFromThirdParty(phone, thirdPartyId) {
    const url = `https://gasq-web-customer.${commonUrl}/gasq-web-customer/customer/register`;
    return request.apiJAVA.post(url, {
      phone,
      thirdPartyId,
    });
  },
  payForAssociator({
    payPlatform = 'wx_lite',
    openId,
    level = 2,
    mode = undefined,
  }) {
    const url = `https://gasq-web-thirdparty.${commonUrl}/gasq-web-thirdparty/payment/charge/associator`;
    return request.apiJAVA.post(url, { payPlatform, openId, level, mode });
  },
  payForOrder({
    groupIds,
    openId,
    payPlatform = 'wx_lite',
    redirectUrl = undefined,
  }) {
    const url = `https://gasq-web-thirdparty.${commonUrl}/gasq-web-thirdparty/payment/charge`;
    return request.apiJAVA.post(url, {
      groupIds,
      payPlatform,
      openId,
      redirectUrl,
    });
  },
  //获取个人中心
  getpersonCenter() {
    return request.apiJAVA.post(
      `https://gasq-web-customer.${commonUrl}/gasq-web-customer/customer/info`,
      {}
    );
  },
  //我的全部订单
  getallsOrder(orderStatus, pagenum) {
    return request.apiJAVA.post(
      `https://gasq-web-order.${commonUrl}/gasq-web-order/order/getcustomerorders`,
      {
        orderStatus: orderStatus,
        pagenum: pagenum,
        pagesize: '10',
        userType: 'customer',
      }
    );
  },
  //我的消息
  getmyMessage() {
    return request.apiJAVA.post(
      `https://gasq-web-support.${commonUrl}/gasq-web-support/message/list`,
      {}
    );
  },
  //订单  填写订单接口
  gofilltheOrder(groupid) {
    return request.apiPHP.get(
      `https://wxapi.${commonUrl}/wechat/new/checkorder/${groupid}`
    );
  },
  //订单也优惠券接口
  getselectCoupons(ground, couponId, storeId) {
    return request.apiJAVA.post(
      `https://wxapi.${commonUrl}/wechat/getRebates`,
      { data: [{ group_id: ground, coupon_id: couponId, id: storeId }] }
    );
  },
  //订单详情
  goorderDetails(group_id) {
    return request.apiJAVA.post(
      `https://gasq-web-order.guoanshequ.wang/gasq-web-order/order/customerorderdetail_web`,
      { groupId: group_id, userType: 'customer' }
    );
  },
  //订单状态接口
  goordeStutus(orderid) {
    return request.apiJAVA.post(
      `https://gasq-web-order.${commonUrl}/gasq-web-order/order/customerorderflow`,
      { orderId: orderid }
    );
  },
  //提交订单
  getSubmitorders(ground_id) {
    // var group_id = wx.getStorageSync("ground_id");
    // console.log(group_id);
    return request.apiJAVA.post(
      `https://gasq-web-order.${commonUrl}/gasq-web-order/order/placeorders`,
      ground_id,
      'front,normal'
    );
  },
  //发票
  goInvoice() {
    return request.apiJAVA.get(
      `https://wxapi.${commonUrl}/getInvoiceInfo/1`,
      {}
    );
  },
  //意见反馈
  gofeedBack(content, typeCode) {
    return request.apiJAVA.post(
      `https://gasq-web-support.guoanshequ.wang/gasq-web-support/feedback/insert`,
      { content: content, typeCode: typeCode }
    );
  },
};
export default api;
