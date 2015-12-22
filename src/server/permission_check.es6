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

        var checkPromises = [];

        //列举module需要的权限
        if (module.permission) {
            let modulePermissions = module.permission;
            if (util.isArray(modulePermissions)) {
                let promises = modulePermissions.map((permission)=> {
                    let returnValue = permission.apply(req.eazyajax, req.eazyajax.args);
                    if (returnValue) {
                        return returnValue.then ? returnValue : Promise.resolve(returnValue);
                    } else {
                        return Promise.resolve(false);
                    }
                });
                checkPromises = checkPromises.concat(promises);
            }
        }

        //列举method需要的权限
        if (method.permission) {
            let methodPermissions = method.permission;
            if (util.isArray(methodPermissions)) {
                let promises = methodPermissions.map((permission)=> {
                    let returnValue = permission.apply(req.eazyajax, req.eazyajax.args);
                    if (returnValue) {
                        return returnValue.then ? returnValue : Promise.resolve(returnValue);
                    } else {
                        return Promise.resolve(false);
                    }
                });
                checkPromises = checkPromises.concat(promises);
            }
        }

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