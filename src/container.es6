/**
 * Ajax模块容器
 * Created by demon on 15-12-18.
 */

import bluebird from 'bluebird';
import EventEmitter from 'events';
import path from 'path';
import logger from './utils/logger';
var fs = bluebird.promisifyAll(require('fs'));

//ajax模块缓存
var moduleCache = new Map();

/**
 * 加载指定路径下的所有ajax模块到缓存
 * @param modulePath    模块路径
 */
export function load(modulePath) {
    //读取文件信息
    var stats = fs.statSync(modulePath);

    //判断文件的类型
    if (stats.isDirectory()) {
        //获取到目录下所有的文件
        var files = fs.readdirSync(modulePath);
        //挨个遍历
        files.forEach(filename => load(path.join(modulePath, filename)));
    } else {
        //如果是个普通的文件,先判断是不是JS文件
        if (modulePath.endsWith('.js')) {
            //获取模块名
            var moduleName = path.basename(modulePath).replace('.js', '');

            //检查模块是否已经被加载,也有可能是重名的情况
            if (moduleCache.has(moduleName)) {
                logger.warn(`模块 ${moduleName} 已经被加载,请检查重名`);
                return;
            }

            //加载模块
            var jsModule = require(modulePath);
            //存入模块
            moduleCache.set(moduleName, jsModule);
        }
    }
}

/**
 * 返回所有已经扫描到的模块
 * @returns {Map}   模块名称到模块的映射map
 */
export function getModules() {
    return moduleCache;
}
