/**
 * Ajax模块容器
 * Created by demon on 15-12-18.
 */

import bluebird from 'bluebird';
import EventEmitter from 'events';
import path from 'path';
import logger from './utils/logger';
var fs = bluebird.promisifyAll(require('fs'));
var fse = bluebird.promisifyAll(require('fs-extra'));

//ajax模块缓存
var moduleCache = new Map();

/**
 * 容器类
 */
class Container extends EventEmitter {
    constructor() {
        super();
    }

    /**
     * 加载指定路径下的所有ajax模块到缓存
     * @param modulePath    模块路径
     * @returns {*}         null
     */
    async load(modulePath) {
        //读取文件信息
        var stats = await fs.statAsync(modulePath);

        //判断文件的类型
        if (stats.isDirectory()) {
            //获取到目录下所有的文件
            var files = await fs.readdirAsync(modulePath);
            logger.debug(`目录 ${modulePath} 下找到 ${files.length} 个文件`);
            //形成承诺数组
            var promises = files.map(filename => this.load(path.join(modulePath, filename)));
            await Promise.all(promises);
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
                logger.debug(`文件 ${modulePath} 中加载了 ${moduleName} 模块`);
                this.emit('module.loaded', modulePath);
            }
        }
    }

    /**
     * 返回所有已经扫描到的模块
     * @returns {Map}   模块名称到模块的映射map
     */
    getModules() {
        return moduleCache;
    }
}

//导出单例
module.exports = new Container();