/**
 * EazyAjax Middleware
 * Created by demon on 15-12-17.
 */
import path from 'path';
import express from 'express'

import {debug as D, warn as W, error as E} from './utils/logger';
import container from './container';
import jsHandler from './client/js_handler';
import ajaxHandler from './server/ajax_handler';

var router = express.Router();

/**
 * 根据路径和配置,初始化eazyajax环境
 * 并返回express的中间件
 *
 * @param ajaxModuleRoot            ajax模块的根路径
 * @param option                    选项
 * @returns {Promise.<Function>}    express中间件
 */
export default async function (ajaxModuleRoot = path.join(process.cwd(), 'ajax'), option = {}) {
    try {
        //加载和扫描模块
        await container.load(ajaxModuleRoot);
        D('模块加载完毕');

        //注册JS文件处理器
        router.use('*.js', jsHandler);

        //注册ajax调用处理器
        router.use('*.ac', ajaxHandler);
    } catch (error) {
        return Promise.reject(error);
    }

    //返回一个express中间件
    return Promise.resolve(router);
}