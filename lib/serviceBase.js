const Axios = require('axios').default;
const { serviceBase, runtimeEnv } = require('../config');
const logger = require('../lib/logger').getLogger('axios');

class ServiceBase {
  /**
   * 基础服务
   * @param {object} arg 参数，目前是主要是axios的构造参数
   * @param {string} arg.baseURL 访问的baseUrl
   * @param {string} arg.user 用户名
   * @param {string} arg.pwd 密码
   */
  constructor(arg) {
    const {
      baseURL,
      user,
      pwd,
    } = arg;
    this.axios = Axios.create({
      baseURL,
      timeout: 1000 * 5,
      headers: {
        username: user,
        password: pwd,
      },
    });
    this.env = process.env[runtimeEnv];
  }

  /**
   * axios get
   * @param {object} params 参数
   * @param {string} params.path 路径
   * @param {object} params.query 搜索参数
   */
  async _get(params) {
    const {
      path,
      query,
    } = params;
    try {
      const result = await this.axios.get(path, {
        params: query,
      });
      return result.data;
    } catch (error) {
      console.log('请求出错');
      logger.error(error);
      throw new Error(error.message);
    }
  }

  /**
   * 拉取配置
   * @param {object} params 参数
   * @param {string} params.env 环境，如 local, staging
   * @param {string} params.key 配置的key，支持嵌套例如 db.base_db.port
   */
  async getConfig(params) {
    const path = '/config';
    return this._get({
      path,
      query: params,
    });
  }
}

module.exports = {
  serviceBase: new ServiceBase({
    baseURL: `${serviceBase.host}:${serviceBase.port}/api`,
    user: serviceBase.user,
    pwd: serviceBase.pwd,
  }),
  ServiceBase,
};
