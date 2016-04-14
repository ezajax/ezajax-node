/**
 * Ajax调用检查器
 * 包括:
 *      模块/方法存在检查
 *      权限检查等
 * Created by demon on 15/12/19.
 */
import util from 'util';

import {getModules} from '../container';

export default function (req, res, next) {
  var modules = getModules();
  var context = req.ezajax;

  //从请求中拿到需要调用的模块和方法名称
  var {moduleName, methodName}= req.params;

  //检查模块是否存在
  if (!modules.has(moduleName)) {
    res.sendError(-2, `模块 ${moduleName} 找不到`);
    return false;
  }

  //检查方法是否存在
  if (!util.isFunction(modules.get(moduleName)[methodName])) {
    res.sendError(-2, `方法 ${moduleName}.${methodName} 找不到`);
    return false;
  }

  //将模块和方法的实例注入到上下文当中
  context.moduleName = moduleName;
  context.methodName = methodName;
  context.module = modules.get(moduleName);
  context.method = context.module[methodName];

  return next();
}