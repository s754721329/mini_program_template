// 打包时取webpack传进来的环境变量
const GLOBAL_ENV = 'dev'; //dev qa prod

// api url config
const apiUrl = {
  dev: 'guoanshequ.wang', //开发环境
  preprod: 'guoanshequ.top', //预生产环境
  prod: 'guoanshequ.com', //生产环境
};

const amapKey = 'b1e95aec58bdd44d305526fc7a82471a';

module.exports = {
  commonUrl: apiUrl[GLOBAL_ENV],
  amapKey,
};
