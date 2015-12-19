/**
 * Ajax请求处理器
 * Created by demon on 15-12-19.
 */

import util from 'util';

import {D,W,E} from '../utils/logger';
import container from '../container';

export default async function (req, res, next) {
    try {
        var moduleName = req.params.moduleName;
        var methodName = req.params.methodName;

        //查找对应的模块
        if (container.getModules().has(moduleName)) {
            var module = container.getModules().get(moduleName);
            if (util.isFunction(module[methodName])) {
                //找到方法
                var method = module[methodName];

                //获取请求参数
                var httpParams = Object.assign({}, req.query, req.body);
                //ajax方法调用参数
                var args = httpParams.args ? JSON.parse(httpParams.args) : null;
                //构造调用上下文
                var context = {req, res, session: req.session};

                //判断方法的权限是否满足
                if (method.perms) {
                    var promises = method.perms.map((permission)=> {

                        let returnValue = permission.apply(context, args);

                        if (returnValue) {
                            return returnValue.then ? returnValue : Promise.resolve(returnValue);
                        } else {
                            return Promise.resolve(false);
                        }
                    });
                    var checkValues = await Promise.all(promises);
                    for (let checkValue of checkValues) {
                        if (!checkValue)
                            throw new Error(`你不具备调用 ${moduleName}.${methodName} 的权限`);
                    }
                }
                var i = 0;
                //权限检查通过,开始调用函数
                let returnValue = method.apply(context, args);

                if (returnValue == null || returnValue == undefined) {
                    res.send(JSON.stringify({}));
                } else {
                    if (returnValue.then) {
                        res.send(JSON.stringify({returnValue: await returnValue}));
                    } else {
                        res.send(JSON.stringify({returnValue}));
                    }
                }
            } else
                throw new Error(`找不到了方法: ${moduleName}.${methodName}`);
        } else
            throw new Error(`找不到模块: ${moduleName}`);
    } catch (error) {
        res.send(JSON.stringify({error: {message: error.message}}));
    }
}
