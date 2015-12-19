/**
 * EazyAjax Middleware
 * Created by demon on 15-12-17.
 */
import path from 'path';
import {debug as D, warn as W, error as E} from './utils/logger';
import container from './container';

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
    } catch (error) {
        return Promise.reject(error);
    }

    //返回一个express中间件
    return Promise.resolve(function (req, res, next) {
        res.send('hello eazyajax');
    });
}