/**
 * Module initer and Modules exporter
 * Created by demon on 15-12-17.
 */

import ezajax from './src/ezajax';
import util from 'util';
import permission from './src/decorator/permission';
import params from './src/decorator/params';
var validate = require('./src/decorator/validate');

/**
 * 包装方法,将ezajax包装一下共外部使用
 * @param path      路径
 * @param option    选项
 * @param callback  回调
 */
module.exports = function (path, option) {

  if (util.isObject(path)) {
    option = path;
    path = undefined;
  }

  return ezajax(path, option);
};

//导出修饰器
module.exports.permission = permission;
module.exports.params = params;
module.exports.validate = validate;
module.exports.should = validate.should;
