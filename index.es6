/**
 * Module initer and Modules exporter
 * Created by demon on 15-12-17.
 */

import eazyajax from './src/eazyajax';
import util from 'util';
import permission from './src/server/decorators/permission';
var validate = require('./src/server/decorators/validate');

/**
 * 包装方法,将eazyajax包装一下共外部使用
 * @param path      路径
 * @param option    选项
 * @param callback  回调
 */
module.exports = function (path, option) {

  if (util.isObject(path)) {
    option = path;
    path = undefined;
  }

  return eazyajax(path, option);
};

//导出修饰器
module.exports.permission = permission;
module.exports.validate = validate;