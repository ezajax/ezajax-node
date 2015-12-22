/**
 * Ajax权限检查
 * Created by demon on 15/12/20.
 */
import util from 'util';
import {D,W,E} from '../utils/logger';

export default async function (req, res, next) {

    try {
        var module = req.eazyajax.module;
        var method = req.eazyajax.method;

        var permissions = [];

        //将模块和方法的权限全部存入一个数组
        if (util.isArray(module.permission)) {
            module.permission.forEach((permission)=> {
                if (permissions.indexOf(permission) === -1)
                    permissions.push(permission);
            });
        }
        if (util.isArray(method.permission)) {
            method.permission.forEach((permission)=> {
                if (permissions.indexOf(permission) === -1)
                    permissions.push(permission);
            });
        }

        //将所有的调用结果映射为承诺数组
        var checkPromises = permissions.map((permission)=> {
            try {
                //调用权限验证函数
                var returnValue = permission.apply(req.eazyajax, req.eazyajax.args);
            } catch (error) {
                //如果调用过程中发生异常,可以认为返回了false
                return Promise.resolve(false);
            }

            //判断返回值的类型
            if (returnValue.then) {
                //如果是承诺
                return new Promise((resolve)=> {
                    returnValue.then((value)=>resolve(value)).catch(()=> resolve(false));
                });
            } else {
                //如果是值,直接返回
                return Promise.resolve(returnValue);
            }
        });

        //统一检查
        if (checkPromises.length) {
            var checkValues = await Promise.all(checkPromises);
            for (let checkValue of checkValues) {
                if (checkValue) {
                    //检查通过
                    return next();
                }
            }
            //检查不通过,直接返回
            res.sendError(-4, `你不具备调用方法 ${req.eazyajax.moduleName}.${req.eazyajax.methodName} 的权限`);
            return false;
        }

        //检查通过
        return next();
    } catch (error) {
        res.sendError(-1, error.message);
    }
}