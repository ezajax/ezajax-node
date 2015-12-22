/**
 * Ajax调用检查器
 * 包括:
 *      模块/方法存在检查
 *      权限检查等
 * Created by demon on 15/12/19.
 */
import util from 'util';

import container from '../container';

export default function (req, res, next) {
    var modules = container.getModules();
    var context = req.eazyajax;

    //检查模块是否存在
    if (!modules.has(context.moduleName)) {
        res.sendError(-2, `模块 ${context.moduleName} 找不到`);
        return false;
    }

    //检查方法是否存在
    if (!util.isFunction(modules.get(context.moduleName)[context.methodName])) {
        res.sendError(-2, `方法 ${context.moduleName}.${context.methodName} 找不到`);
        return false;
    }

    context.module = modules.get(context.moduleName);
    context.method = context.module[context.methodName];

    return next();
}