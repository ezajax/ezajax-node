/**
 * Ajax模块容器
 * Created by demon on 15-12-18.
 */

import bluebird from 'bluebird';
import path from 'path';
import util from 'util';
import getParams from 'get-parameter-names';
var fs = bluebird.promisifyAll(require('fs'));

//ajax模块缓存
var moduleCache = new Map();

/**
 * 加载指定路径下的所有ajax模块到缓存
 * @param modulePath    模块路径
 */
export function load(modulePath) {
  try {
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
          console.log(`模块 ${moduleName} 已经被加载,无需再次加载`);
          return;
        }

        //加载模块
        var jsModule = require(modulePath);
        //获取到默认模块
        jsModule = jsModule.default || jsModule;

        //方法名
        var module = {};

        //拿到所有的静态方法(属性方法)
        for (let staticMethodName of Object.getOwnPropertyNames(jsModule)) {
          if (util.isFunction(jsModule[staticMethodName]))
            module[staticMethodName] = jsModule[staticMethodName];
        }

        //判断模块是不是一个类,如果是,则拿到所有的成员方法
        if (util.isFunction(jsModule)) {
          var instance = new jsModule();
          for (let memberMethodName of Object.getOwnPropertyNames(Object.getPrototypeOf(instance))) {
            if (util.isFunction(instance[memberMethodName]) && memberMethodName != 'constructor')
              module[memberMethodName] = instance[memberMethodName];
          }
        }

        //存入模块
        moduleCache.set(moduleName, module);

        //输出模块图谱
        console.log(`+--+-- ${moduleName} 模块`);
        //D(`   |`);
        for (let key in module) {
          if (util.isFunction(module[key])) {
            console.log(`   |-- ${key}(${module[key].paramNames || getParams(module[key])})`);
          }
        }
        console.log('   ^');
      }
    }
  } catch (err) {
    console.error('加载模块时发生错误: \n' + err);
  }
}

/**
 * 返回所有已经扫描到的模块
 * @returns {Map}   模块名称到模块的映射map
 */
export function getModules() {
  return moduleCache;
}
