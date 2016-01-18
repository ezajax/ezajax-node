/**
 * EazyAjax Middleware
 * Created by demon on 15-12-17.
 */
import path from 'path';
import express from 'express'
import bodyParser from 'body-parser';

import {D, W, E} from './utils/logger';
import {load} from './container';
import jsHandler from './client/js_handler';

import contextInit from './server/context_init';
import invokeCheck from './server/invoke_check';
import permissionCheck from './server/permission_check';
import validate from './server/validate';
import invoker from './server/invoker';

var router = express.Router();

/**
 * 根据路径和配置,初始化eazyajax环境
 * 并返回express的中间件
 *
 * @param ajaxModuleRoot            ajax模块的根路径
 * @param option                    选项
 * @returns {Promise.<Function>}    express中间件
 */
export default function (ajaxModuleRoot = path.join(process.cwd(), 'ajax'), {root} = {root: 'eazyajax'}) {
    //加载和扫描模块
    load(ajaxModuleRoot);
    D('模块加载完毕');

    //注册JS文件处理器
    router.use(`/${root}/*.js`, jsHandler);

    //注册ajax调用处理器
    router.use(
        `/${root}/:moduleName/:methodName.ac`,
        bodyParser.json(),
        bodyParser.urlencoded({extended: false}),
        contextInit,
        invokeCheck,
        permissionCheck,
        validate,
        invoker
    );

    //返回一个express中间件
    return router;
}